import React, { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageContext } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const FinalCTA = () => {
  const containerRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content',
        { scale: 0.95, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%"
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-brand-accent text-brand-void py-32 px-6 flex items-center justify-center overflow-hidden relative">
      <div className="cta-content max-w-4xl text-center flex flex-col items-center z-10">
        <h2 className="font-drama italic text-[clamp(2.5rem,8vw,5rem)] leading-none mb-6">
          <span className="font-display not-italic font-bold tracking-tighter">{t('cta_title')}</span>
        </h2>
        <p className="font-mono text-brand-void/80 max-w-md mx-auto mb-10">
          {t('cta_subtitle')}
        </p>
        <button className="magnetic-btn bg-brand-void text-brand-text px-10 py-5 rounded-full font-display font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3 group">
          <span>{t('cta_button')}</span>
          <div className="w-2 h-2 rounded-full bg-brand-accent group-hover:animate-pulse"></div>
        </button>
      </div>

      {/* Background Graphic elements */}
      <svg className="absolute w-[800px] h-[800px] -right-48 -bottom-48 opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <circle cx="50" cy="50" r="40" stroke="#05050F" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="#05050F" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="20" stroke="#05050F" strokeWidth="0.5" fill="none" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#05050F" strokeWidth="0.5" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="#05050F" strokeWidth="0.5" />
      </svg>
    </section>
  );
};

export default FinalCTA;
