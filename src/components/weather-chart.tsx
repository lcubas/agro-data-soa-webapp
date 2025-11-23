"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localeDate } from "@/lib/format";
import type { WeatherResponse } from "@/lib/types";
import { useMemo } from "react";

const Line = dynamic(
  async () => {
    const reactChartJs2 = await import("react-chartjs-2");
    await import("chart.js/auto");
    return reactChartJs2.Line;
  },
  { ssr: false },
);

export function WeatherChart({ data }: { data: WeatherResponse }) {
  const labels = useMemo(
    () => data.daily.map((d) => localeDate(d.date)),
    [data],
  );
  const weatherChartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Tmin (°C)",
          data: data.daily.map((d) => d.tmin),
          yAxisID: "y",
        },
        {
          label: "Tmax (°C)",
          data: data.daily.map((d) => d.tmax),
          yAxisID: "y",
        },
        {
          label: "Precipitación (mm)",
          data: data.daily.map((d) => d.precip_mm ?? 0),
          yAxisID: "y1",
        },
        {
          label: "Prob. lluvia (%)",
          data: data.daily.map((d) => d.precip_prob ?? 0),
          yAxisID: "y2",
        },
      ],
    }),
    [data, labels],
  );

  const frostDays = data.daily
    .filter((d) => d.frost_risk && d.frost_risk !== "bajo")
    .map((d) => localeDate(d.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pronóstico (10 días)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Line
            data={weatherChartData}
            options={{
              responsive: true,
              interaction: { mode: "index", intersect: false },
              plugins: { legend: { position: "bottom" } },
              scales: {
                y: { position: "left", title: { display: true, text: "°C" } },
                y1: {
                  position: "right",
                  title: { display: true, text: "mm" },
                  grid: { drawOnChartArea: false },
                },
                y2: { position: "right", display: false },
              },
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {frostDays.length ? (
            <>
              ⚠️ <b>Riesgo de heladas</b> en: {frostDays.join(", ")}
            </>
          ) : (
            <>✅ Sin riesgo de heladas según Tmin proyectada.</>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
