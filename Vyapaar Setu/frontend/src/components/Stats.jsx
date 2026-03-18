import React, { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageContext } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
  const containerRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = document.querySelectorAll('.counter-val');
      
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2; // match duration with scroll entrance
        
        gsap.to(counter, {
          innerHTML: target,
          duration: duration,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          onUpdate() {
            // Re-inject commas if needed or formatting suffix like K or %
            const format = counter.getAttribute('data-format');
            if (format === 'percent') {
              counter.innerHTML = counter.innerHTML + '%';
            } else if (format === 'k') {
              counter.innerHTML = counter.innerHTML + 'K+';
            }
          }
        });
      });

      gsap.fromTo('.stat-item',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const statsData = [
    { target: 94, format: 'percent', label: t('stats_latency') },
    { target: 12, format: 'k', label: t('stats_nodes') },
    { target: 200, format: 'k', label: t('stats_transactions') },
  ];

  return (
    <section ref={containerRef} id="stats" className="py-24 px-6 md:px-16 bg-brand-void max-w-7xl mx-auto border-t border-brand-text/5">
      <div className="bg-brand-card/30 backdrop-blur-md rounded-[2rem] border border-brand-accent/10 p-12 md:p-20 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 w-full">
          {statsData.map((stat, i) => (
            <div key={i} className="stat-item flex flex-col items-center text-center">
              <div 
                className="counter-val font-display font-medium text-5xl md:text-7xl lg:text-8xl text-brand-text mb-4"
                data-target={stat.target}
                data-format={stat.format}
              >
                0
              </div>
              <p className="font-mono text-sm text-brand-text/60 max-w-[240px] leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
