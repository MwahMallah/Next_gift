import React, { useMemo, useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";

type Song = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

type FormValues = {
  q1: "a" | "b" | "c" | "";
  q2: string;
  q3: string;
  q4: string; 
  q5: string;
};

const SONGS: Song[] = [
  { id: "s1", title: "Qazir bolmasa", artist: "Orynkhan", src: "/audio/bolmasa.mp3" },
  { id: "s2", title: "Daiynbyz ba", artist: "Alem", src: "/audio/daiynbyz.mp3" },
  { id: "s3", title: "Tой жыры", artist: "Дос-Мұқасан", src: "/audio/mukasan.mp3" },
];

interface TopSongsQuestionProps {
  register: UseFormRegister<FormValues>;
}

export default function TopSongsQuestion({ register }: TopSongsQuestionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string>("");

  const currentSong = useMemo(
    () => SONGS.find((s) => s.id === currentId) ?? null,
    [currentId]
  );

  // register q4 once, and we will call its onChange manually
  const q4 = register("q4", {
    validate: (v) => {
      if (!v) return "Выбери песню 🙂";
      if (v !== "s1") return "Это песня была супер, но чаще я слушал другую 💋 Попробуй ещё раз";
      return true;
    },
  });

  const playSong = async (song: Song) => {
    setError("");
    setCurrentId(song.id);

    requestAnimationFrame(async () => {
      try {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.src.endsWith(song.src)) {
          audio.currentTime = 0;
          await audio.play();
          setIsPlaying(true);
          return;
        }

        audio.src = song.src;
        audio.currentTime = 0;
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        setError("Браузер мог заблокировать автозапуск. Нажми Play или нажми на песню ещё раз.");
      }
    });
  };

  const onSelect = (songId: string) => {
    // update local selection
    setCurrentId(songId);

    // update RHF value for q4
    // RHF expects an event-like object: { target: { name, value } }
    q4.onChange({
      target: { name: q4.name, value: songId },
      type: "change",
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    setError("");
    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setError("Не удалось воспроизвести аудио.");
    }
  };

  return (
    <div>
      <p className="mb-4 opacity-85 leading-relaxed">
        Какая песня от тебя звучала у меня чаще всего в этом году? (можешь послушать песни нажав на них) ❤️
      </p>

      {/* ВАЖНО: скрытое поле для react-hook-form */}
      <input type="hidden" name={q4.name} ref={q4.ref} onBlur={q4.onBlur} />

      <div className="mx-auto w-full max-w-xl p-4">
        <div className="grid gap-2">
          {SONGS.map((s) => {
            const selected = s.id === currentId;

            return (
              <button
                type="button"
                key={s.id}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(s.id);
                  void playSong(s);
                }}
                className={[
                  "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left",
                  "bg-white/5 backdrop-blur transition-colors transition-opacity",
                  "hover:bg-white/10 active:opacity-90",
                  selected
                    ? "border-white/50 shadow-lg shadow-black/10"
                    : "border-white/15",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{s.title}</div>
                  <div className="truncate text-xs text-white/70">{s.artist}</div>
                </div>

                <div className="ml-3 text-[11px] text-white/60">
                  {selected ? "selected" : "pick"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
          <div className="min-w-0">
            <div className="text-xs text-white/70">Играет</div>
            <div className="truncate text-sm font-semibold">
              {currentSong ? currentSong.title : "—"}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              void togglePlayPause();
            }}
            disabled={!currentSong}
            className={[
              "rounded-lg border px-4 py-2 text-sm font-semibold transition",
              currentSong
                ? "border-white/20 bg-white/10 hover:bg-white/15 active:opacity-90"
                : "cursor-not-allowed border-white/10 bg-white/5 text-white/40",
            ].join(" ")}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {error ? (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-100">
            {error}
          </div>
        ) : null}

        <audio
          ref={audioRef}
          className="hidden"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
