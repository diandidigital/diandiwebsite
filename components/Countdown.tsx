"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(
    null
  );

  useEffect(() => {
    const target = new Date(targetDate);
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Jours", value: timeLeft?.days },
    { label: "Heures", value: timeLeft?.hours },
    { label: "Minutes", value: timeLeft?.minutes },
    { label: "Secondes", value: timeLeft?.seconds },
  ];

  return (
    <div className="flex gap-4 sm:gap-6 justify-center">
      {units.map((u) => (
        <div key={u.label} className="text-center w-16 sm:w-24">
          <div className="text-3xl sm:text-5xl font-bold text-gradient tabular-nums">
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </div>
          <div className="text-xs sm:text-sm text-ink/50 mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
