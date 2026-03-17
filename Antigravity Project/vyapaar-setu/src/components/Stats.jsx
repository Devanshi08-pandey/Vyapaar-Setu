import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Stats() {
  const containerRef = useRef(null);

  const stats = [
    { value: 500, suffix: "+", label: "Local Vendors" },
    { value: 10000, suffix: "+", label: "Orders Processed" },
    { value: 98, suffix: "%", label: "Happy Customers" },
    { value: 10, suffix: "x", label: "Vendor Revenue Growth" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = gsap.utils.toArray('.stat-value');
      
      counters.forEach((counter, i) => {
        const targetValue = stats[i].value;
        gsap.to(counter, {
          innerHTML: targetValue,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%"
          },
          onUpdate() {
            counter.innerHTML = Math.round(counter.innerHTML).toLocaleString();
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 px-6 md:px-16 bg-[#171D1A] border-y border-vs-green/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-vs-text/10">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center md:items-start w-full md:w-1/4 pt-8 md:pt-0 md:pl-8 first:pt-0 first:pl-0">
            <div className="font-heading font-black text-5xl md:text-7xl text-vs-text flex items-baseline tracking-tighter text-shadow-glow">
              <span className="stat-value text-vs-orange">0</span>
              <span className="text-3xl md:text-4xl text-vs-green italic font-serif">{stat.suffix}</span>
            </div>
            <div className="font-mono text-sm tracking-widest text-vs-text/50 uppercase mt-4">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
