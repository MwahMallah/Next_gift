"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type TripRow = {
  name: string;
  value: number;
  rank: 1 | 2 | 3;
  note: string;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function TripsBar() {
  // Поставь любые числа — они задают высоту (важен порядок: Kazakhstan > Spain > Austria)
  const data: TripRow[] = useMemo(
    () => [
      { name: "Испания", value: 78, rank: 2, note: "солнечно и красиво ☀️" },
      { name: "Казахстан", value: 100, rank: 1, note: "наш №1 трип 🥇" },
      { name: "Австрия", value: 62, rank: 3, note: "уют и горы 🏔️" },
    ],
    []
  );

  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/60">
            Путешествия 🧳
          </div>
          <div className="mt-1 text-lg font-semibold">
            Топ-3 поездки года
          </div>
        </div>

        <div className="text-xs text-white/60">
          (мой личный топ ❤️)
        </div>
      </div>

      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            barCategoryGap={22}
            onMouseMove={(st: any) => {
              const p = st?.activePayload?.[0]?.payload as TripRow | undefined;
              setActive(p?.name ?? null);
            }}
            onMouseLeave={() => setActive(null)}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
            />
            <YAxis hide domain={[0, 110]} />
            <Tooltip content={<TripsTooltip />} cursor={{ fill: "rgba(255,255,255,0.06)" }} />

            <Bar
              dataKey="value"
              radius={[14, 14, 6, 6]}
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-in-out"
            >
              {data.map((row) => {
                const isTop = row.rank === 1;
                const isActive = active ? active === row.name : row.rank === 1;

                // Ничего не задаём по цветам “жёстко”? ты просил красивые анимации —
                // тут цвет мы задаём, иначе всё будет одинаковое.
                // Если хочешь — сделаю монохромный как Spotify (всё белое) + подсветка #1.
                const fill = isTop
                  ? "rgba(255,255,255,0.92)"
                  : "rgba(255,255,255,0.55)";

                const dim = isActive ? 1 : 0.55;

                return (
                  <Cell
                    key={row.name}
                    fill={fill}
                    fillOpacity={dim}
                    className={cn(
                      "transition-[fill-opacity] duration-200",
                      isTop ? "drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]" : ""
                    )}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Маленькая легенда / “победитель” */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
          🥇 Казахстан — на первом месте
        </span>
        <span className="text-white/60">
          (Ты знаешь что в следующем году 😜)
        </span>
      </div>
    </motion.div>
  );
}

function TripsTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as {
    name: string;
    rank: number;
    note: string;
  };

  return (
    <div className="rounded-xl border border-white/15 bg-[rgba(15,18,32,0.96)] px-3 py-2 text-xs shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="font-semibold text-white">
        {row.rank === 1 ? "🥇 " : row.rank === 2 ? "🥈 " : "🥉 "}
        {row.name}
      </div>
      <div className="mt-1 text-white/70">{row.note}</div>
    </div>
  );
}
