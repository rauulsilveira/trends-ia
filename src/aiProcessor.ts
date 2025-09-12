import { OpenAI } from "openai";
import prisma from "./prismaClient.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTrendContent(trendId: number, title: string) {
    try {
        // 1️⃣ Gerar resumo
        const summaryResponse = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Você é um assistente que cria resumos curtos e objetivos de trends." },
                { role: "user", content: `Resuma a trend: "${title}" em 2 frases curtas.` }
            ],
            max_tokens: 150
        });
        const summary = summaryResponse.choices?.[0]?.message?.content?.trim() || "";

        // 2️⃣ Gerar tags
        const tagsResponse = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Você gera tags curtas (1-3 palavras) para trends." },
                { role: "user", content: `Crie tags para a trend: "${title}" separadas por vírgula.` }
            ],
            max_tokens: 50
        });
        const tagsArray = tagsResponse.choices?.[0]?.message?.content
            ?.split(",")
            .map(tag => tag.trim()) || [];

        // 3️⃣ Gerar thumbnail (imagem via DALL·E)
        let thumbnail = "";
        try {
            const imageResponse = await client.images.generate({
                model: "gpt-image-1",
                prompt: `Crie uma thumbnail representando a trend: "${title}"`,
                size: "1024x1024"
            });
            thumbnail = imageResponse.data?.[0]?.url || "";
        } catch (imgErr: unknown) {
            const message = imgErr instanceof Error ? imgErr.message : String(imgErr);
            console.warn(`⚠️ Não foi possível gerar imagem para "${title}". Continuando sem thumbnail.`, message);
        }

        // 4️⃣ Atualiza trend no banco
        await prisma.trend.update({
            where: { id: trendId },
            data: {
                summary,
                tags: JSON.stringify(tagsArray),
                thumbnail,
                contentGenerated: true,
                processedAt: new Date()
            }
        });

        console.log(`✅ Trend "${title}" processada com IA`);
    } catch (err) {
        console.error(`❌ Erro ao processar trend "${title}":`, err);
    }
}
