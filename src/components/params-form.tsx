"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchWeather, fetchPrices, fetchRecommendations } from "@/lib/api";
import type {
  PricesResponse,
  RecommendationsResponse,
  WeatherResponse,
} from "@/lib/types";
import { toast } from "sonner";

const CULTIVO_OPTIONS = [
  "Actual",
  "Cebolla Roja",
  "Maíz Amarillo Duro",
  "Papa Amarilla",
  "Arroz",
];

type Props = {
  onData: (d: {
    weather: WeatherResponse | null;
    prices: PricesResponse | null;
    recs: RecommendationsResponse | null;
    region: string;
    crop: string;
  }) => void;
  initialCultivo?: string;
};

export default function ParamsForm({
  onData,
  initialCultivo = "Actual",
}: Props) {
  const [region, setRegion] = useState("Lima");
  const [crop, setCrop] = useState(initialCultivo);
  const [lat, setLat] = useState<number | "">(-12.0464);
  const [lon, setLon] = useState<number | "">(-77.0428);
  const [loading, setLoading] = useState(false);

  const onCurrentLocationButtonClick = useCallback(() => {
    if (!navigator.geolocation) return alert("Geolocalización no soportada");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLon(Number(pos.coords.longitude.toFixed(4)));
      },
      () => alert("No se pudo obtener ubicación"),
    );
  }, []);

  const onGetAgroDatabuttonClick = useCallback(async () => {
    if (!crop || lat === "" || lon === "") {
      alert("Completa cultivo, latitud y longitud");
      return;
    }

    setLoading(true);

    try {
      const [wx, px, rc] = await Promise.all([
        fetchWeather(Number(lat), Number(lon), 10),
        fetchPrices(crop, region, 90),
        fetchRecommendations({
          crop,
          region,
          lat: Number(lat),
          lon: Number(lon),
        }),
      ]);
      onData({ weather: wx, prices: px, recs: rc, region, crop });
      toast.success("Parámetros guardados correctamente");
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar parámetros");
    } finally {
      setLoading(false);
    }
  }, [crop, lat, lon, region, onData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Input
              id="region"
              list="regiones"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Lima, Junín, Cusco…"
            />
            <datalist id="regiones">
              {["Lima", "Junín", "Cusco", "Huancayo"].map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="crop">Cultivo</Label>
            <Input
              id="crop"
              list="cultivos"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="Papa Amarilla, Cebolla Roja…"
            />
            <datalist id="cultivos">
              {CULTIVO_OPTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lat">Latitud</Label>
            <Input
              id="lat"
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) =>
                setLat(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="-12.0464"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lon">Longitud</Label>
            <Input
              id="lon"
              type="number"
              step="0.0001"
              value={lon}
              onChange={(e) =>
                setLon(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="-77.0428"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCurrentLocationButtonClick}
          >
            Usar mi ubicación
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={onGetAgroDatabuttonClick}
          >
            {loading ? "Generando..." : "Generar recomendaciones"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
