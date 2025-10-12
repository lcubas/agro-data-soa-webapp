"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendationsResponse } from "@/lib/types";
import { localeDate, toFixed } from "@/lib/format";

type Props = { recommendation: RecommendationsResponse };

export function RecommendationsCard({ recommendation }: Props) {
  const sow = recommendation.suggested_sowing_start
    ? localeDate(recommendation.suggested_sowing_start)
    : "No identificada (condiciones no óptimas)";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicio de Recomendación de Siembra/Cosecha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          🧠 Cultivo: <b>{recommendation.crop}</b>
        </p>
        <p>
          📍 Ubicación: <b>{recommendation.location.region || "N/A"}</b> (
          {toFixed(recommendation.location.lat, 3)},{" "}
          {toFixed(recommendation.location.lon, 3)})
        </p>
        <p>
          🗓️ <b>Inicio sugerido de siembra:</b> {sow}
        </p>
        <p>
          ⚠️ <b>Fechas con riesgo de heladas (10d):</b>{" "}
          {recommendation.risks_next_10d.frost_dates.length
            ? recommendation.risks_next_10d.frost_dates
                .map(localeDate)
                .join(", ")
            : "Ninguna"}
        </p>
        <p>
          🌧️ <b>Días con alta prob. de lluvia (≥60%):</b>{" "}
          {recommendation.risks_next_10d.high_rain_probability_dates.length
            ? recommendation.risks_next_10d.high_rain_probability_dates
                .map(localeDate)
                .join(", ")
            : "Ninguno"}
        </p>
        <div className="space-y-1">
          <p>
            🛒 <b>Mercados/Regiones más rentables (promedio 90d):</b>
          </p>
          <ul className="list-disc pl-6">
            {recommendation.price_ranking.length ? (
              recommendation.price_ranking.map((x, i) => (
                <li key={i}>
                  {i + 1}. <b>{x.market}</b>: {x.avg.toFixed(2)} {x.unit || ""}
                </li>
              ))
            ) : (
              <li>Sin ranking (no hay suficientes datos)</li>
            )}
          </ul>
          <p className="text-muted-foreground">
            👉 Consulta precios oficiales en SISAP (GMML, MM Nº2, etc.).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
