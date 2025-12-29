"use client"

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/daiynbyz.mp3";

export default function AutoAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    // на всякий: iOS любит, когда muted=false и play в gesture,
    // но пробуем честно сначала
    audio.volume = 0.6;

    const tryPlay = async () => {
      try {
        await audio.play();
        setBlocked(false);
      } catch {
        setBlocked(true);
      }
    };

    tryPlay();
  }, []);

  return (
    <>
      {/* прозрачное/невидимое аудио */}
      <audio
        ref={ref}
        src={AUDIO_SRC}
        preload="auto"
        loop
        playsInline
        className="opacity-0 pointer-events-none absolute -z-10 h-0 w-0"
      />

      {/* если autoplay заблокирован — показываем мини-кнопку */}
      {blocked ? (
        <button
          type="button"
          onClick={async () => {
            const audio = ref.current;
            if (!audio) return;
            try {
              await audio.play();
              setBlocked(false);
            } catch {
              // оставляем blocked=true
            }
          }}
          className="fixed bottom-4 right-4 z-50 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md hover:bg-black/55 active:scale-[0.98]"
        >
          🔊 Включить музыку
        </button>
      ) : null}
    </>
  );
}
