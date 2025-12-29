"use client";

import React, { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TripsBar from "@/components/charts/TripsBar";
import MeetInBrnoMap from "@/components/sections/MeetInBrnoMap";
import LiveTogetherTimer from "@/components/sections/LiveTogetherTimer";

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl mt-10 border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="text-s uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-white">{value}</div>
      {sub ? <div className="mt-2 text-sm text-white/70">{sub}</div> : null}
    </div>
  );
}

export default function GiftWrapped() {
  const photos = useMemo(
    () => [
      "/wrapped/diyara_1.jpg",
      "/wrapped/diyara_2.jpg",
      "/wrapped/diyara_3.jpg",
      "/wrapped/diyara_4.jpg",
      "/wrapped/diyara_5.jpg",
      "/wrapped/diyara_7.jpg",
      "/wrapped/diyara_8.jpg",
      "/wrapped/diyara_6.jpg",
    ],
    []
  );

  // 0..1 по всей странице
  const { scrollYProgress } = useScroll();

  // общая затемнялка (как было)
  const dim = useTransform(scrollYProgress, [0, 1], [0.45, 0.55]);

  // Для 6 фото делим скролл на сегменты.
  // segment = 1/(N-1), т.к. переходов N-1
  const segment = 1 / (photos.length - 1);

  const last = photos.length - 1;
  // Для каждого фото делаем opacity и scale как motion value
  const bgOpacities = photos.map((_, i) => {
    const t0 = Math.max(0, (i - 1) * segment);
    const t1 = i * segment;
    const t2 = Math.min(1, (i + 1) * segment);

    // 1) первое фото держим видимым на самом старте
    if (i === 0) {
      return useTransform(scrollYProgress, [0, t1, t2], [1, 1, 0]);
    }

    // 2) последнее фото держим видимым до самого конца
    if (i === last) {
      return useTransform(scrollYProgress, [t0, t1, 1], [0, 1, 1]);
    }

    // 3) остальные: обычный crossfade
    return useTransform(scrollYProgress, [t0, t1, t2], [0, 1, 0]);
  });

  const bgScales = photos.map((_, i) => {
    const t0 = Math.max(0, (i - 1) * segment);
    const t2 = Math.min(1, (i + 1) * segment);

    // лёгкий zoom while visible
    return useTransform(scrollYProgress, [t0, t2], [1.03, 1.12]);
  });

  const stats = useMemo(
    () => [
      {
        label: "Слово «люблю» в Telegram 💬❤️",
        value: "933",
        sub: "и каждое — от самого сердца",
      },
      {
        label: "Дней без встречи ⏳🥺",
        value: "7",
        sub: "в следующем году будет меньше, обещаю",
      },
      {
        label: "Миллиметров оставшейся бороды ✂️🧔‍♂️",
        value: "0",
        sub: "всё ради тебя",
      },
      {
        label: "Купленных нарядов благодаря тебе 👗✨",
        value: "11",
        sub: "и это только начало",
      },
      {
        label: "Съеденных баурсаков 🥯😋",
        value: "8",
        sub: "Казахстан был очень вкусным",
      },
      {
        label: "Игр в баскетбол 🏀🔥",
        value: "1",
        sub: "и это был классный день",
      },
      {
        label: "Подстриженных чёлок ✂️💇‍♀️",
        value: "3",
        sub: "каждая — идеальна",
      },
      {
        label: "Походов в бассейн 🏊‍♀️💦",
        value: "4",
        sub: "и каждый раз ты сияла",
      },
      {
        label: "Посещённых соревнований 🎟️✨",
        value: "1",
        sub: "ради твоих эмоций",
      },
      {
        label: "Походов в зал 💪🔥",
        value: "4",
        sub: "ты — моя главная мотивация",
      },
      {
        label: "Собранных LEGO 🧱✨",
        value: "1",
        sub: "и море радости внутри",
      },
      {
        label: "Любви от меня 💖♾️",
        value: "неизмеримо",
        sub: "и её становится больше каждый день",
      },
    ],
    []
  );



  return (
    <main className="relative min-h-screen bg-[#0b0b10] text-white">
      {/* ===== Sticky background ===== */}
      <div className="pointer-events-none fixed inset-0">
        {photos.map((src, i) => (
          <motion.div
            key={src}
            style={{ opacity: bgOpacities[i], scale: bgScales[i] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${src})` }}
            />
          </motion.div>
        ))}

        {/* dim overlay */}
        <motion.div
          style={{ opacity: dim }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80"
        />

        {/* subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E)",
          }}
        />
      </div>


      {/* ===== Foreground content ===== */}
        <div className="relative z-10 mx-auto w-full max-w-[820px] px-4">
        {/* Hero section */}
        <section className="top-0 min-h-screen flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: -200 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Наш первый год вместе ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: -200 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mt-4 max-w-[52ch] text-white/80 leading-relaxed"
          >
            Жан, ты сделала для меня этот год и вот немного о тебе, обо мне и о нас ❤️ 
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 text-sm text-white/60"
          >
            ↓ листай
          </motion.div>
        </section>

        {/* Stats section */}
        <section>
          <Reveal>
            <h2 className="text-xl font-semibold">мы в статистике</h2>
          </Reveal>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {stats.map((s) => (
              <Reveal key={s.label}>
                <StatCard label={s.label} value={s.value} sub={s.sub} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Trips Bar */}
        <section className="py-16">
          <TripsBar />
        </section>

        {/* Meet In Brno map */}
        <section className="py-16">
          <MeetInBrnoMap />
        </section>

        {/* Floating text moments */}
        <section className="pt-16 space-y-10">
          <Reveal>
            <div className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Иногда мы можем спорить и не соглашаться,но среди всего мира я всегда знаю одно:              
              <span className="block mt-2 text-white/85">«я люблю тебя и всегда буду выбирать только тебя»</span>
            </div>
          </Reveal>
        </section>

        {/* Big finale placeholder */}
        <section className="pt-24">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="text-xs uppercase tracking-wide text-white/60">
                финал
              </div>

              <div className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">
                Этот год был самым счастливым из тех, что я помню — яркий, насыщенный,
                полный событий. И всё благодаря тебе.
              </div>

              <div className="mt-4 text-white/85 leading-relaxed">
                Я всегда от чистого сердца говорил тебе и буду говорить всегда:
                <span className="block mt-3 text-white font-extrabold text-xl sm:text-2xl tracking-tight">
                  Я ТЕБЯ ЛЮБЛЮ ❤️
                </span>
              </div>

              <div className="mt-8 text-white/85 leading-relaxed">
                Давай вместе писать маленькую историю о девочке, которая случайно поехала
                подавать документы, и о мальчике, который опаздывал на свой трамвай —
                историю, которая идёт уже:
              </div>

              <LiveTogetherTimer />
            </div>
          </Reveal>
        </section>
        <div className="h-20" />
      </div>
    </main>
  );
}
