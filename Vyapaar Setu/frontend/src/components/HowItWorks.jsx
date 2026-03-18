import React, { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageContext } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw connecting line
      if (pathRef.current) {
        // Find total length
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
          animation: gsap.to(pathRef.current, { strokeDashoffset: 0, ease: "none" })
        });
      }

      // Stagger Steps
      gsap.fromTo('.step-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: t('how_step1_title'),
      desc: t('how_step1_desc')
    },
    {
      num: "02",
      title: t('how_step2_title'),
      desc: t('how_step2_desc')
    },
    {
      num: "03",
      title: t('how_step3_title'),
      desc: t('how_step3_desc')
    }
  ];

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 px-6 md:px-16 bg-brand-void max-w-7xl mx-auto relative">
      <div className="mb-20 text-center flex flex-col items-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-brand-text mb-4">
          <span className="font-drama italic text-brand-accent">{t('how_title')}</span>
        </h2>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-4 mt-12 w-full z-10">
        {/* Desktop Connecting Line */}
        <svg className="hidden md:block absolute top-12 left-[10%] w-[80%] h-4 -z-10" preserveAspectRatio="none">
          <path 
            ref={pathRef}
            d="M0,8 L1000,8" 
            stroke="#10B981" 
            strokeWidth="2" 
            strokeDasharray="6,6"
            fill="none"
            className="opacity-40"
          />
        </svg>

        {steps.map((step, index) => (
          <div key={index} className="step-card bg-brand-card/50 backdrop-blur-sm p-8 rounded-2xl border border-brand-accent/5 flex-1 relative flex flex-col z-20">
            <div className="font-mono text-5xl md:text-6xl text-brand-accent/20 font-bold mb-6 absolute -top-8 -left-2 tracking-tighter mix-blend-screen">{step.num}</div>
            <h3 className="font-display font-bold text-2xl text-brand-text mb-3 mt-4">{step.title}</h3>
            <p className="font-mono text-sm text-brand-text/60 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
