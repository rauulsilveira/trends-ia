const API_URL = "http://localhost:4000";

export interface TrendDto {
  id: number;
  title: string;
  summary: string;
  url?: string | null;
  thumbnail?: string | null;
  tags: string; // armazenado como JSON string no backend
  source: string;
  trendDate: string;
  searchVolume?: number | null;
  growthPercent?: number | null;
}

export async function fetchGoogleTopClicks(limit = 20): Promise<TrendDto[]> {
  const res = await fetch(`${API_URL}/public/google/top-clicks?limit=${limit}`);
  if (!res.ok) throw new Error("Falha ao carregar Google top-clicks");
  const data = await res.json();
  return data.items as TrendDto[];
}

export async function fetchGoogleTopTrends(limit = 20): Promise<TrendDto[]> {
  const res = await fetch(`${API_URL}/public/google/top-trends?limit=${limit}`);
  if (!res.ok) throw new Error("Falha ao carregar Google top-trends");
  const data = await res.json();
  return data.items as TrendDto[];
}


