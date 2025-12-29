import { useMemo, useState, useEffect } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function diffParts(from: Date, to: Date) {
  let ms = Math.max(0, to.getTime() - from.getTime());

  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  return { days, hours, minutes, seconds };
}

export default function LiveTogetherTimer() {
  // 14 July 2025 07:44 in Europe/Prague (летом это CEST, UTC+2)
  // В JS Date проще зафиксировать как ISO с +02:00.
  const start = useMemo(() => new Date("2025-07-14T07:44:00+02:00"), []);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = diffParts(start, now);

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <TimeBox label="дней" value={String(days)} />
        <TimeBox label="часов" value={pad2(hours)} />
        <TimeBox label="минут" value={pad2(minutes)} />
        <TimeBox label="секунд" value={pad2(seconds)} />
      </div>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-white/60">
        {label}
      </div>
    </div>
  );
}
