"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lng: number };

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

// Дуга между точками (для красивого маршрута)
function arcPoints(from: LatLng, to: LatLng, steps = 60, bend = 0.18) {
  // простая "кривая" в координатах: интерполяция + подъём по широте
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = from.lat + (to.lat - from.lat) * t;
    const lng = from.lng + (to.lng - from.lng) * t;

    // "подъём" дуги: максимум в середине
    const lift = Math.sin(Math.PI * t) * bend;
    pts.push([lat + lift, lng]);
  }
  return pts;
}

// FIX для иконок Leaflet в Next (иначе маркер часто "невидимый")
const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MeetInBrnoMapClient() {
  // Координаты
  const angarsk: LatLng = { lat: 52.5448, lng: 103.8885 };
  const astana: LatLng = { lat: 51.1694, lng: 71.4491 };
  const brno: LatLng = { lat: 49.1951, lng: 16.6068 };

  const kmA = useMemo(() => Math.round(haversineKm(angarsk, brno)), []);
  const kmB = useMemo(() => Math.round(haversineKm(astana, brno)), []);
  const total = kmA + kmB;

  const pathAngarsk = useMemo(() => arcPoints(angarsk, brno, 70, 0.22), []);
  const pathAstana = useMemo(() => arcPoints(astana, brno, 70, 0.14), []);

  // Центр карты примерно между точками
  const center = useMemo<[number, number]>(() => [52, 45], []);

  // bounds чтобы сразу всё было видно
  const bounds = useMemo(() => {
    const b = L.latLngBounds([]);
    b.extend([angarsk.lat, angarsk.lng]);
    b.extend([astana.lat, astana.lng]);
    b.extend([brno.lat, brno.lng]);
    return b.pad(0.25);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/60">
            Путь к нашей встрече ✈️
          </div>
          <h3 className="mt-1 text-lg font-semibold">
            Ангарск + Астана → Брно
          </h3>
        </div>

        <div className="text-xs text-white/70">
          всего ≈{" "}
          <span className="font-semibold text-white">
            {total.toLocaleString("ru-RU")} км
          </span>
        </div>
      </div>

      {/* Карта */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <div className="h-[360px] w-full">
          <MapContainer
            center={center}
            zoom={3}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Маркеры */}
            <Marker position={[angarsk.lat, angarsk.lng]} icon={markerIcon}>
              <Popup>Ангарск 🧳</Popup>
            </Marker>

            <Marker position={[astana.lat, astana.lng]} icon={markerIcon}>
              <Popup>Астана 🌙</Popup>
            </Marker>

            <Marker position={[brno.lat, brno.lng]} icon={markerIcon}>
              <Popup>Брно ❤️</Popup>
            </Marker>

            {/* Линии маршрутов (дуги) */}
            <AnimatedPolyline points={pathAngarsk} weight={5} opacity={0.95} />
            <AnimatedPolyline points={pathAstana} weight={5} opacity={0.65} />

            {/* маленькие подписи на линиях */}
            <Tooltip permanent={false} direction="center" opacity={1}>
              {/* Tooltip в react-leaflet привязывается к layer; тут не обязательно */}
            </Tooltip>
          </MapContainer>
        </div>
      </div>

      {/* Статы */}
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <MiniStat
          label="Ангарск → Брно"
          value={`≈ ${kmA.toLocaleString("ru-RU")} км`}
          emoji="🧳"
        />
        <MiniStat
          label="Астана → Брно"
          value={`≈ ${kmB.toLocaleString("ru-RU")} км`}
          emoji="🌙"
        />
        <MiniStat
          label="Итого до встречи"
          value={`≈ ${total.toLocaleString("ru-RU")} км`}
          emoji="❤️"
        />
      </div>

      <div className="mt-3 text-xs text-white/60">
        Я думаю это не случайность.
      </div>
    </motion.section>
  );
}

function MiniStat({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string;
  emoji: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-lg font-extrabold text-white">{value}</div>
        <div className="text-lg">{emoji}</div>
      </div>
    </div>
  );
}

// Анимируем “прорисовку” линии через dasharray/dashoffset
function AnimatedPolyline({
  points,
  weight,
  opacity,
}: {
  points: [number, number][];
  weight: number;
  opacity: number;
}) {
  // Реальный Polyline рисует Leaflet (canvas/svg). Для контроля dashoffset
  // нам нужен path в DOM. Leaflet по умолчанию рисует SVG для Polyline,
  // и мы можем задать "dashArray" + className.
  return (
    <Polyline
      positions={points}
      pathOptions={{
        color: "white",
        weight,
        opacity,
        lineCap: "round",
        dashArray: "10 14",
        // className цепляем, чтобы в css анимировать dashoffset
        className: "route-dash-anim",
      }}
    />
  );
}
