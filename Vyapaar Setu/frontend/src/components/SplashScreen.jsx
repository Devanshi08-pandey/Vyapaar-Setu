import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      // Background animation - subtle tech lines
      gsap.to('.bg-line', {
        x: 'random(-20, 20)',
        y: 'random(-20, 20)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.1
      });

      // Initial state
      gsap.set('.logo-part', { y: 20, opacity: 0 });
      gsap.set('.tagline-part', { scale: 0.8, opacity: 0 });

      tl.to('.logo-part', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })
      .to('.tagline-part', {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.4')
      .to(containerRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: 'power4.inOut',
        delay: 1.5
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100000] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-line absolute border border-black/20 rounded-full"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Static Noise to match image feel if needed, but keeping it clean white as per image */}
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex items-baseline mb-4">
          <span className="logo-part font-display font-bold text-6xl md:text-8xl text-[#FF8A50] tracking-tighter">Vyapaar</span>
          <span className="logo-part font-display font-black text-6xl md:text-8xl text-[#111111] italic tracking-tighter">Setu</span>
        </div>

        {/* Tagline Section */}
        <div className="flex items-center gap-1 font-display font-black text-2xl md:text-3xl tracking-tighter">
          <span className="tagline-part text-[#FF8A50]">#Vocal</span>
          <span className="tagline-part text-[#B5E61D]">For</span>
          <span className="tagline-part text-[#B5E61D]">Local</span>
        </div>
      </div>

      {/* Loading bar at bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-black/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#FF8A50] animate-progress shadow-[0_0_10px_#FF8A50]" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
