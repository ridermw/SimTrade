"use client";

const LOW_TIME_THRESHOLD = 10;

interface SessionTimerProps {
  secondsRemaining: number;
}

export default function SessionTimer({ secondsRemaining }: SessionTimerProps) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isLowTime = secondsRemaining <= LOW_TIME_THRESHOLD;

  return (
    <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gray-800 border-b border-gray-700">
      <span className="text-gray-400 text-sm font-medium">Session Timer:</span>
      <span
        className={`font-mono text-2xl font-bold ${
          isLowTime ? "text-red-400 animate-pulse" : "text-white"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      {secondsRemaining === 0 && (
        <span className="text-red-400 text-sm font-medium">
          Market Closed
        </span>
      )}
    </div>
  );
}
