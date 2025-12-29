"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IntroPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const start = () => {
    setLeaving(true);
    setTimeout(() => {
      router.push("/quiz");
    }, 350); // длительность анимации
  };

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-gradient-to-b from-[#0b0b10] to-[#0f1220] text-white">
      <div
        className={[
          "w-full max-w-[560px] text-center",
          "transition-all duration-300 ease-in-out",
          leaving
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100",
        ].join(" ")}
      >        <div className="text-[11px] tracking-[0.35em] uppercase opacity-70">
          Для жан
        </div>

        <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          Это был лучший год,
          <br />
          который подарила
          <br />
          мне именно
          <br />
          <span className="font-extrabold">ты</span> ❤️

        </h1>

        <p className="mt-6 text-base sm:text-lg leading-relaxed opacity-85">
          За все то что было за эти полгода
          <br />
          я решил сделать для тебя
          <br />
          этот маленький подарок.
          <br />
          <br />
          Но прежде чем ты его увидишь,
          <br />
          я хочу задать тебе
          <br />
          всего пару маленьких вопросов.
          <br />
          <span className="font-semibold">Ты готова?</span>
        </p>

        <button
          onClick={start}
          disabled={leaving}
          className="mt-8 w-full sm:w-auto px-6 py-3 rounded-xl border border-white/15 bg-white/85 text-black/90 font-extrabold uppercase tracking-wide hover:bg-white/90 active:bg-white/80 transition disabled:opacity-60"
        >
          Искать подарок 🤩
        </button>

        <div className="mt-4 text-xs opacity-60">
          Обещаю — это будет быстро и мило 😅
        </div>
      </div>
    </main>
  );
}
