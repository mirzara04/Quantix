'use client';

interface ThinkingAnimationProps {
  label?: string;
}

export default function ThinkingAnimation({ label = 'AI is thinking...' }: ThinkingAnimationProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-orange-300/15 bg-[linear-gradient(135deg,rgba(255,138,61,0.08),rgba(45,212,191,0.06))] px-4 py-3">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-orange-100/90">{label}</span>
      <div className="ml-auto">
        <div className="w-4 h-4 rounded-full border-2 border-orange-300/25 border-t-orange-200 animate-spin" />
      </div>
    </div>
  );
}
