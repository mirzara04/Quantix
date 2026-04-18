import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide the component visually before telling parent to unmount
        gsap.to(containerRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete
        });
      }
    });

    // Fade in text
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 5 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    // Animate loader bar width
    tl.fromTo(barRef.current,
      { width: "0%" },
      { width: "100%", duration: 1.5, ease: "power1.inOut" }
    );

  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-slate-200"
    >
      <div className="w-64 max-w-full flex flex-col items-center">
        <div 
          ref={textRef} 
          className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4 opacity-0"
        >
          System Initializing...
        </div>
        <div className="w-full h-[2px] bg-white/5 overflow-hidden">
          <div 
            ref={barRef}
            className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]" 
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
