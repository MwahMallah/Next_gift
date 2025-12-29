"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { UseFormRegister } from "react-hook-form";

// Важно: типы Leaflet можно импортировать как type, это безопасно
import type { LatLngExpression } from "leaflet";

type FormValues = {
  q1: "a" | "b" | "c" | "";
  q2: string;
  q3: string;
  q4: string;
  q5: string; // "lat,lng"
};

type LatLng = { lat: number; lng: number };

type Props = {
  register: UseFormRegister<FormValues>;
  fieldName: "q5";
  cityLabel: string;
  target: LatLng;
  radiusKm?: number;
  startCenter?: LatLng;
  startZoom?: number;
};

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);
const useMapEvents = () => {
  // хук нельзя динамически импортнуть напрямую как компонент,
  // поэтому оборачиваем в динамический компонент ниже
  throw new Error("useMapEvents placeholder");
};

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const ClickCatcher = dynamic(
  async () => {
    const { useMapEvents } = await import("react-leaflet");
    return function ClickCatcherInner({
      onPick,
    }: {
      onPick: (p: LatLng) => void;
    }) {
      useMapEvents({
        click(e) {
          onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
      });
      return null;
    };
  },
  { ssr: false }
);

export default function CityOnMapQuestion({
  register,
  fieldName,
  cityLabel,
  target,
  radiusKm = 300,
  startCenter = { lat: 50, lng: 15 },
  startZoom = 4,
}: Props) {
  const [picked, setPicked] = useState<LatLng | null>(null);

  const reg = register(fieldName, {
    validate: (v) => {
      if (!v) return "Выбери точку на карте 🙂";
      const [latStr, lngStr] = v.split(",");
      const lat = Number(latStr);
      const lng = Number(lngStr);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "Координаты не считались 😅";

      const dist = haversineKm({ lat, lng }, target);
      if (dist > radiusKm) return `Почти! Попробуй чуть ближе 💋`;
    },
  });

  const distanceText = useMemo(() => {
    if (!picked) return null;
    const d = haversineKm(picked, target);
    return d < radiusKm ? "Ооо, очень точно 👀" : `Примерно ${Math.round(d)} км от цели`;
  }, [picked, target]); 

  const onPick = (p: LatLng) => {
    setPicked(p);
    reg.onChange({
      target: { name: reg.name, value: `${p.lat},${p.lng}` },
      type: "change",
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const center: LatLngExpression = [startCenter.lat, startCenter.lng];

  return (
    <div>
      <p className="mb-3 opacity-85 leading-relaxed">
        Найди на карте город откуда я родом (достаточно ошибки 300км от города) ❤️
      </p>

      <input type="hidden" name={reg.name} ref={reg.ref} onBlur={reg.onBlur} />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-white/70">
          <span>Кликни по карте, чтобы поставить маркер.</span>
          {distanceText ? <span>{distanceText}</span> : null}
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <MapContainer center={center} zoom={startZoom} style={{ height: 360, width: "100%" }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ClickCatcher onPick={onPick} />

            {picked ? (
              <CircleMarker
                center={[picked.lat, picked.lng]}
                radius={10}
                pathOptions={{
                  color: "white",
                  fillColor: "white",
                  fillOpacity: 0.9,
                  weight: 2,
                  opacity: 0.9,
                }}
              />
            ) : null}
            
          </MapContainer>
        </div>

        <div className="mt-3 text-[12px] text-white/60">
          Подсказка: можно приблизить карту и кликнуть точнее.
        </div>
      </div>
    </div>
  );
}
