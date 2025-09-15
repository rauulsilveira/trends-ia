import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Função para obter início e fim do dia
function getDayRange(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}
// Função para normalizar volume (2M+ -> 2000000)
function normalizeVolume(volumeStr) {
    if (!volumeStr)
        return 0;
    let num = volumeStr.replace(/\D/g, "");
    return parseInt(num) || 0;
}
// Função para normalizar crescimento percentual (1.000% -> 10.0)
function normalizeGrowth(percentStr) {
    if (!percentStr)
        return 0;
    return parseFloat(percentStr.replace(/[^0-9.-]/g, "")) || 0;
}
async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://trends.google.com.br/trending?geo=BR", { waitUntil: "networkidle" });
    // ⚠️ Seletores podem quebrar se o Google mudar classes
    const trends = await page.$$eval("td.enOdEe-wZVHld-aOtOmf", (cards) => cards.map((card) => {
        const titleEl = card.querySelector("div.mZ3RIc");
        const title = titleEl?.textContent?.trim() || "";
        const volumeEl = card.querySelector("div.qNpYPd");
        const volume = volumeEl?.textContent?.trim() || "";
        const statusEl = card.querySelector("div.QxIiwc div");
        const status = statusEl?.textContent?.trim() || "";
        return { title, volume, status };
    }));
    const today = new Date();
    const { start, end } = getDayRange(today);
    let savedCount = 0;
    for (const t of trends) {
        if (!t.title)
            continue;
        const exists = await prisma.trend.findFirst({
            where: {
                title: t.title,
                trendDate: {
                    gte: start,
                    lte: end,
                },
                source: "google",
            },
        });
        if (!exists) {
            await prisma.trend.create({
                data: {
                    title: t.title,
                    summary: "", // IA gera depois
                    url: "", // não existe no Google Trends
                    thumbnail: "", // IA gera depois
                    tags: JSON.stringify([]), // IA gera depois
                    source: "google",
                    trendDate: today,
                    processedAt: null,
                    contentGenerated: false,
                    thumbnailGenerated: false,
                    visibleToAdmin: true,
                    publishedAt: null,
                    searchVolume: normalizeVolume(t.volume),
                    growthPercent: normalizeGrowth(t.status),
                },
            });
            savedCount++;
        }
    }
    console.log(`✅ ${savedCount} trends processadas e salvas.`);
    await browser.close();
    await prisma.$disconnect();
}
main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
});
