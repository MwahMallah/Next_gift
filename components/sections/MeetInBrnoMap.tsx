"use client";

import dynamic from "next/dynamic";

const MeetInBrnoMapClient = dynamic(() => import("./MeetInBrnoMapClient"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="h-[360px] animate-pulse rounded-2xl bg-white/5" />
      <div className="mt-3 text-xs text-white/60">Загружаю карту…</div>
    </div>
  ),
});

export default function MeetInBrnoMap() {
  return <MeetInBrnoMapClient />;
}
