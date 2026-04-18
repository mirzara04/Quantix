'use client';

interface ThinkingAnimationProps {
  label?: string;
}

export default function ThinkingAnimation({ label = 'AI is thinking...' }: ThinkingAnimationProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 glass-panel rounded-xl border border-cyan-500/20">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
      <span className="text-sm text-cyan-300/80 font-medium">{label}</span>
      <div className="ml-auto">
        <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    </div>
  );
}
