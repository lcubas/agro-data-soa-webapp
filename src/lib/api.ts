import {
  WeatherResponse,
  PricesResponse,
  RecommendationsResponse,
} from "./types";
import { auth } from "./firebase/client";

const baseApiUrl =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://us-central1-agro-data-soa-app.cloudfunctions.net/api/v1";

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    return { "content-type": "application/json" };
  }

  try {
    const token = await user.getIdToken();
    return {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch (err) {
    console.error("Error obteniendo token:", err);
    return { "content-type": "application/json" };
  }
}

export async function fetchWeather(
  lat: number,
  lon: number,
  days = 10,
): Promise<WeatherResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${baseApiUrl}/weather?lat=${lat}&lon=${lon}&days=${days}`,
    { cache: "no-store", headers },
  );

  if (!response.ok) throw new Error("Error al obtener clima");

  const weather = await response.json();
  return weather.data;
}

export async function fetchPrices(
  product: string,
  region: string,
  days = 90,
): Promise<PricesResponse> {
  const headers = await getAuthHeaders();
  const url = new URL(`${baseApiUrl}/prices`);
  url.searchParams.set("product", product);
  url.searchParams.set("region", region);
  url.searchParams.set("days", String(days));

  const response = await fetch(url.toString(), { cache: "no-store", headers });

  if (!response.ok) throw new Error("Error al obtener precios");

  const prices = await response.json();
  return prices.data;
}

export async function fetchRecommendations(input: {
  crop: string;
  region: string;
  lat: number;
  lon: number;
}): Promise<RecommendationsResponse> {
  const headers = await getAuthHeaders();
  console.log(JSON.stringify(input));

  const response = await fetch(`${baseApiUrl}/recommendations`, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(input),
    headers,
  });

  if (!response.ok) throw new Error("Error al obtener recomendaciones");

  const recommendation = await response.json();
  return recommendation.data;
}
