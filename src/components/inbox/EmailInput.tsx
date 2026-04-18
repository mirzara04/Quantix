import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface EmailInputProps {
  value: string;
  onChange: (v: string) => void;
  onScan: () => void;
  isScanning: boolean;
}

export default function EmailInput({ value, onChange, onScan, isScanning }: EmailInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isScanning && shimmerRef.current) {
      gsap.fromTo(
        shimmerRef.current,
        { y: -20, opacity: 0, height: 2, width: '100%' },
        {
          y: containerRef.current?.offsetHeight || 800,
          opacity: 1,
          duration: 1.8,
          repeat: -1,
          ease: "linear"
        }
      );
    } else if (shimmerRef.current) {
      gsap.killTweensOf(shimmerRef.current);
      gsap.set(shimmerRef.current, { opacity: 0 });
    }
  }, [isScanning]);

  return (
    <div className="flex flex-col h-full gap-4" ref={containerRef}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Ingestion Stream</h2>
        <button
          onClick={onScan}
          disabled={isScanning || !value.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
          {isScanning ? 'Scanning...' : 'Scan for Opportunities'}
        </button>
      </div>
      <div className="relative flex-1 bento-card overflow-hidden">
        {/* Horizontal Scanner Line that moves vertically */}
        <div 
          ref={shimmerRef} 
          className="absolute left-0 w-full h-[2px] bg-blue-600 opacity-0 pointer-events-none z-10" 
          style={{ boxShadow: '0 0 10px #2563eb, 0 0 20px #2563eb' }}
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste contents of 5-15 relevant emails here to begin analysis..."
          className="w-full h-full bg-transparent text-white/80 p-5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600/50 rounded-md text-sm md:text-base font-normal leading-relaxed tracking-tight"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
