"use client";

import { useCallback, useState } from "react";
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

// --- REGIONES ---
const REGIONES_PERU = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
];

// --- COORDENADAS ---
const COORDENADAS_REGIONES: Record<string, { lat: number; lon: number }> = {
  Amazonas: { lat: -6.2317, lon: -77.869 },
  Áncash: { lat: -9.5278, lon: -77.5278 },
  Apurímac: { lat: -13.6339, lon: -72.8814 },
  Arequipa: { lat: -16.409, lon: -71.5375 },
  Ayacucho: { lat: -13.1631, lon: -74.2237 },
  Cajamarca: { lat: -7.1638, lon: -78.5003 },
  Callao: { lat: -12.0566, lon: -77.1181 },
  Cusco: { lat: -13.5319, lon: -71.9675 },
  Huancavelica: { lat: -12.7861, lon: -74.9769 },
  Huánuco: { lat: -9.9306, lon: -76.2422 },
  Ica: { lat: -14.0678, lon: -75.7286 },
  Junín: { lat: -11.1581, lon: -75.9972 },
  "La Libertad": { lat: -8.116, lon: -79.03 },
  Lambayeque: { lat: -6.7714, lon: -79.8409 },
  Lima: { lat: -12.0464, lon: -77.0428 },
  Loreto: { lat: -3.7437, lon: -73.2516 },
  "Madre de Dios": { lat: -12.5909, lon: -69.1875 },
  Moquegua: { lat: -17.1941, lon: -70.9337 },
  Pasco: { lat: -10.6675, lon: -76.2561 },
  Piura: { lat: -5.1945, lon: -80.6328 },
  Puno: { lat: -15.8402, lon: -70.0219 },
  "San Martín": { lat: -6.4856, lon: -76.3653 },
  Tacna: { lat: -18.0146, lon: -70.2536 },
  Tumbes: { lat: -3.5669, lon: -80.4515 },
  Ucayali: { lat: -8.3791, lon: -74.5539 },
};

// --- CULTIVOS (Coinciden con tu Google Sheet) ---
const CULTIVOS_PERU = [
  "Papa Amarilla",
  "Papa Blanca",
  "Cebolla Cabeza Roja",
  "Limón",
  "Tomate",
  "Camote Amarillo",
  "Maíz Choclo",
  "Yuca",
  "Zanahoria",
  "Zapallo",
  "Arveja Grano Verde",
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

export default function ParamsForm({ onData, initialCultivo }: Props) {
  const [region, setRegion] = useState("Lima");
  const [crop, setCrop] = useState(
    initialCultivo && CULTIVOS_PERU.includes(initialCultivo)
      ? initialCultivo
      : "Papa Amarilla",
  );
  const [lat, setLat] = useState<number | "">(-12.0464);
  const [lon, setLon] = useState<number | "">(-77.0428);
  const [loading, setLoading] = useState(false);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const coords = COORDENADAS_REGIONES[newRegion];
    if (coords) {
      setLat(coords.lat);
      setLon(coords.lon);
    }
  };

  const onCurrentLocationButtonClick = useCallback(() => {
    if (!navigator.geolocation)
      return toast.error("Geolocalización no soportada");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLon(Number(pos.coords.longitude.toFixed(4)));
        toast.success("Ubicación obtenida");
      },
      () => toast.error("No se pudo obtener ubicación"),
    );
  }, []);

  const onGetAgroDatabuttonClick = useCallback(async () => {
    if (!crop || lat === "" || lon === "") {
      toast.warning("Completa cultivo, latitud y longitud");
      return;
    }

    setLoading(true);

    try {
      const [wx, px, rc] = await Promise.all([
        fetchWeather(Number(lat), Number(lon), 16),
        // CAMBIO CLAVE: 730 días (2 años) para que salga Enero, Febrero, etc.
        fetchPrices(crop, region, 730),
        fetchRecommendations({
          crop,
          region,
          lat: Number(lat),
          lon: Number(lon),
        }),
      ]);

      onData({ weather: wx, prices: px, recs: rc, region, crop });
      toast.success("Reporte generado correctamente");
    } catch (e) {
      console.error(e);
      toast.error("Error al obtener datos del servidor");
    } finally {
      setLoading(false);
    }
  }, [crop, lat, lon, region, onData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros de Análisis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <select
              id="region"
              value={region}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {REGIONES_PERU.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop">Cultivo</Label>
            <select
              id="crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {CULTIVOS_PERU.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCurrentLocationButtonClick}
          >
            📍 Usar mi ubicación
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={onGetAgroDatabuttonClick}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            {loading ? "Procesando..." : "Generar recomendaciones"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
