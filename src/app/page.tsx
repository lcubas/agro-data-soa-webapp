"use client";

import { useState } from "react";
import Topbar from "@/components/topbar";
import ParamsForm from "@/components/params-form";
import { WeatherChart } from "@/components/weather-chart";
import { PricesChart } from "@/components/prices-chart";
import type {
  PricesResponse,
  RecommendationsResponse,
  WeatherResponse,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationsCard } from "@/components/recommendations-card";

export default function DashboardPage() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [prices, setPrices] = useState<PricesResponse | null>(null);
  const [recs, setRecs] = useState<RecommendationsResponse | null>(null);
  const [region, setRegion] = useState("");
  const [crop, setCrop] = useState("");

  return (
    <>
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <ParamsForm
          onData={({ weather, prices, recs, region, crop }) => {
            setWeather(weather);
            setPrices(prices);
            setRecs(recs);
            setRegion(region);
            setCrop(crop);
          }}
        />

        {weather ? (
          <WeatherChart data={weather} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pronóstico (10 días)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Genera recomendaciones para ver el pronóstico.
            </CardContent>
          </Card>
        )}

        {prices ? (
          <PricesChart data={prices} crop={crop} region={region} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Precios mayoristas (últimos 60–90 días)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Genera recomendaciones para ver precios.
            </CardContent>
          </Card>
        )}

        {recs ? (
          <RecommendationsCard recommendation={recs} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Servicio de Recomendación de Siembra/Cosecha
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Genera recomendaciones para ver resultados.
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
