import { WeatherResponse, PricesResponse, RecommendationsResponse } from "./types";

const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

export async function fetchWeather(lat: number, lon: number, days = 10): Promise<WeatherResponse> {
  const response = await fetch(`${baseApiUrl}/weather?lat=${lat}&lon=${lon}&days=${days}`, { cache: "no-store" });

  if (!response.ok) throw new Error("Error al obtener clima");
  
  return response.json();
}

export async function fetchPrices(product: string, region: string, days = 90): Promise<PricesResponse> {
  const url = new URL(`${baseApiUrl}/prices`);
  url.searchParams.set("product", product);
  url.searchParams.set("region", region);
  url.searchParams.set("days", String(days));

  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) throw new Error("Error al obtener precios");

  return response.json();
}

export async function fetchRecommendations(input: {
  crop: string;
  region: string;
  lat: number;
  lon: number;
}): Promise<RecommendationsResponse> {
  console.log(JSON.stringify(input))
  const response = await fetch(`${baseApiUrl}/recommendations`, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(input),
    headers: { 'content-type': 'application/json' },
  });

  if (!response.ok) throw new Error("Error al obtener recomendaciones");

  return response.json();
}
