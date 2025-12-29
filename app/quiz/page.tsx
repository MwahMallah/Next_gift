"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import HappinessBar from "@/components/charts/HappinessBar";
import TopSongsQuestion from "@/components/questions/TopSongsQuestion";
import CityOnMapQuestion from "@/components/questions/CityOnMapQuestion";

type FormValues = {
  q1: "a" | "b" | "c" | "";
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

function normalize(str: string) {
  return str.toLowerCase();
}

export default function Quiz() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
    },
  });

  const steps = useMemo(
    () => [
      { key: "q1", title: "Вопрос 1", type: "choice" as const },
      { key: "q2", title: "Вопрос 2", type: "text" as const },
      { key: "q3", title: "Вопрос 3", type: "custom" as const },
      { key: "q4", title: "Вопрос 4", type: "custom" as const },
      { key: "q5", title: "Вопрос 5", type: "custom" as const },
    ],
    []
  );

  const CORRECT = {
    q1: "b" as const, 
    q2: 25, 
  };

  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState<"idle" | "out-left" | "out-right" | "in">(
    "idle"
  );

  const total = steps.length;
  const progressPct = Math.round(((step + 1) / total) * 100);

  const currentKey = steps[step].key as keyof FormValues;

  const goNext = async () => {
    const ok = await trigger(currentKey);
    if (!ok) return;

    setAnim("out-left");
    window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, total - 1));
      setAnim("in");
      window.setTimeout(() => setAnim("idle"), 220);
    }, 220);
  };

  const goPrev = () => {
    setAnim("out-right");
    window.setTimeout(() => {
      setStep((s) => Math.max(s - 1, 0));
      setAnim("in");
      window.setTimeout(() => setAnim("idle"), 220);
    }, 220);
  };

  const onSubmit = async (data: FormValues) => {
    const ok = await trigger(["q1", "q2", "q3", "q4"]);
    if (!ok) return;

    // unlock cookie на 30 дней (если хочешь)
    document.cookie = "gift_unlocked=1; Path=/; Max-Age=2592000; SameSite=Lax";
    window.location.href = "/gift";
    console.log("SUBMIT", data);
  };

  const panelStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      transition: "transform 220ms ease, opacity 220ms ease",
      willChange: "transform, opacity",
    };

    if (anim === "out-left")
      return { ...base, transform: "translateX(-24px)", opacity: 0 };
    if (anim === "out-right")
      return { ...base, transform: "translateX(24px)", opacity: 0 };
    if (anim === "in")
      return { ...base, transform: "translateX(0px)", opacity: 1 };
    return { ...base, transform: "translateX(0px)", opacity: 1 };
  }, [anim]);

  watch(["q1", "q2", "q3", "q4"]);

  return (
    <main className="min-h-screen grid place-items-center p-4 bg-gradient-to-b from-[#0b0b10] to-[#0f1220] text-white">
      <div className="w-full max-w-[560px] rounded-2xl p-5 bg-white/5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
        {/* Top progress bar */}
        <div className="flex items-center gap-3">
          <div className="text-[13px] opacity-85">
            {step + 1}/{total}
          </div>

          <div
            aria-label="progress"
            className="relative h-2.5 flex-1 rounded-full bg-white/10 overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-white/85 transition-[width] duration-200 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="text-[13px] opacity-85">{progressPct}%</div>
        </div>

        <div className="h-4" />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Animated panel */}
          <div style={panelStyle}>
            {/* Step title */}
            <div className="flex items-baseline gap-2.5">
              <h1 className="m-0 text-xl tracking-[0.2px] font-semibold">
                {steps[step].title}
              </h1>
            </div>

            {/* Step content */}
            {step === 0 && (
              <div>
                <p className="mt-2 mb-4 opacity-85 leading-relaxed">
                  Где было наше первое свидание? ❤️
                </p>

                <div className="grid gap-2.5">
                  {[
                    { value: "a" as const, label: "Cà Phê Cổ ☕️✨" },
                    { value: "b" as const, label: "Việt Tám Restaurant 🍜🥢" },
                    { value: "c" as const, label: "Cha-Cha 🥟❤️" },
                  ].map((opt) => {
                    const selected = getValues("q1") === opt.value;

                    return (
                      <label
                        key={opt.value}
                        className={[
                          "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none",
                          "border-white/15",
                          selected ? "bg-white/10" : "bg-black/10",
                        ].join(" ")}
                        onClick={() =>
                          setValue("q1", opt.value)
                        }
                      >
                        <span className="w-[18px] h-[18px] rounded-full border-2 border-white/75 grid place-items-center">
                          <span
                            className={[
                              "w-2.5 h-2.5 rounded-full transition-colors duration-150",
                              selected ? "bg-white/90" : "bg-transparent",
                            ].join(" ")}
                          />
                        </span>

                        <span className="text-[15px]">{opt.label}</span>

                        {/* Hidden radio, RHF still tracks it */}
                        <input
                          type="radio"
                          value={opt.value}
                          className="hidden"
                          {...register("q1", {
                            validate: (v) => {
                              const n = normalize(v ?? "");
                              if (!n) return "Жан, напиши ответ 💋";
                              if (n !== CORRECT.q1)
                                return "Кажется, не совсем 💋 Попробуй ещё раз";
                              return true;
                              }
                            })
                          }
                        />
                      </label>
                    );
                  })}
                </div>

                {errors.q1 && (
                  <div className="mt-2.5 text-[13px] text-[rgba(255,180,180,0.95)]">
                    {errors.q1.message}
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="mt-2 mb-4 opacity-85 leading-relaxed">
                  Сколько мне лет? ✨
                </p>

                <input
                  placeholder='Например: 43 😄'
                  className="w-full rounded-xl border border-white/15 bg-black/15 px-3 py-3 text-[15px] outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
                  {...register("q2", {
                    required: "Напиши хоть что-нибудь 🙂",
                    validate: (v) => {
                      const num = parseInt(v, 10);
                      if (isNaN(num)) {
                        return "Напиши в цифрах 💋";
                      }

                      if (v.length < 2)
                        return "мне не настолько мало 🙃";
                      if (Number(v) < 21) {
                        return "спасибо, но я тебя старше 👴";
                      } if (Number(v) > 26) {
                        return "Мужчина с годами как вино - только слаще 😎";
                      }

                      if (num !== CORRECT.q2)
                        return "Кажется, не совсем 💋 Попробуй ещё раз";
                    }
                  })}
                />

                {errors.q2 && (
                  <div className="mt-2.5 text-[13px] text-[rgba(255,180,180,0.95)]">
                    {errors.q2.message}
                  </div>
                )}

                <div className="h-2" />
                {
                  getValues("q2") === "" &&
                  <div className="text-xs opacity-65">
                    Подсказка: меньше 45 ❤️
                  </div>
                }
                
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="mt-0 opacity-85 leading-relaxed">
                  Во сколько раз я стал 
                  счастливее с тобой? ❤️
                </p>

                <HappinessBar />

                {/* Answer input */}
                <div className="mt-4">
                  <input
                    placeholder="во сколько раз?"
                    className="w-full rounded-xl border border-white/15 bg-black/15 px-3 py-3 text-[15px] outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
                    {...register("q3", {
                      validate: (v) => {
                        const n = normalize(v ?? "");
                        if (!n) return "Напиши, что ты думаешь 🙂";
                        if (!n.includes("999"))
                          return "Подсказка: посмотри внимательно на график 😌";
                        return true;
                      },
                    })}
                  />
                </div>

                {errors.q3 && (
                  <div className="mt-2.5 text-[13px] text-[rgba(255,180,180,0.95)]">
                    {errors.q3.message}
                  </div>
                )}

                <div className="h-2" /> 
              </div>
            )}

            {step === 3 && (
              <div>
                <TopSongsQuestion register={register}/>
                {errors.q4 && (
                  <div className="mt-2.5 text-[13px] text-[rgba(255,180,180,0.95)]">
                    {errors.q4.message}
                  </div>
                )}
              </div>              
            )}

            {step === 4 && (
              <>
                <CityOnMapQuestion
                  register={register}
                  fieldName="q5"
                  cityLabel="Brno"
                  target={{ lat: 52.5447, lng: 103.8883 }}
                  startCenter={{ lat: 49.1142, lng: 16.3624 }} 
                  startZoom={5}
                />

                {errors.q5 && (
                  <div className="mt-2.5 text-[13px] text-[rgba(255,180,180,0.95)]">
                    {errors.q5.message}
                  </div>
                )}
              </>
            )}

          </div>

          <div className="h-5" />

          {/* Controls */}
          <div className="flex gap-2.5 justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 0}
              className={[
                "min-w-[110px] px-3 py-2.5 rounded-xl border border-white/15",
                "text-white transition-opacity",
                step === 0
                  ? "bg-white/5 opacity-60 cursor-not-allowed"
                  : "bg-black/20 hover:bg-black/30",
              ].join(" ")}
            >
              Назад
            </button>

            {step < total - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="min-w-[160px] px-3 py-2.5 rounded-xl border border-white/15 bg-white/85 text-black/90 font-semibold hover:bg-white/90 active:bg-white/80"
              >
                Далее →
              </button>
            ) : (
              <button
                type="submit"
                className="min-w-[160px] px-3 py-2.5 rounded-xl border border-white/15 bg-white/85 text-black/90 font-bold hover:bg-white/90 active:bg-white/80"
              >
                Открыть подарок ✨
              </button>
            )}
          </div>

          <div className="h-2" />
          <div className="text-xs opacity-60 text-center">
            Все неправильные ответы соханяются 👀  
            <br />
            (шутка… наверное 😄)
          </div>
        </form>
      </div>
    </main>
  );
}
