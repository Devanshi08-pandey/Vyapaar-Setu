import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HowItWorks() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  const steps = [
    {
      num: "01",
      title: "Discover Local Vendors",
      desc: "Our AI engine highlights trusted shops and services in your neighborhood matching your precise needs."
    },
    {
      num: "02",
      title: "Place Custom Orders",
      desc: "Order directly on the platform with instant WhatsApp notifications keeping you updated on the status."
    },
    {
      num: "03",
      title: "Seamless UPI Payments",
      desc: "Complete the transaction securely using any UPI app with zero hidden fees for local merchants."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line drawing animation
      const line = lineRef.current;
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1
          }
        });
      }

      // Card fade up
      gsap.fromTo('.step-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.3,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 65%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 px-6 md:px-16 bg-vs-dark relative w-full overflow-hidden max-w-6xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-vs-text">
          Local commerce, <span className="text-vs-orange italic font-serif">simplified.</span>
        </h2>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-stretch gap-12 md:gap-4">
        
        {/* Desktop connection line */}
        <div className="absolute top-12 left-[10%] w-[80%] h-1 hidden md:block z-0">
          <svg className="w-full h-full overflow-visible">
            <path 
              ref={lineRef}
              d="M 0 0 C 300 50, 600 -50, 900 0" 
              fill="none" 
              stroke="#3BEA7A" 
              strokeWidth="2"
              strokeDasharray="8 8" 
              vectorEffect="non-scaling-stroke"
              className="opacity-40"
            />
          </svg>
        </div>

        {/* Steps */}
        {steps.map((step, i) => (
          <div key={i} className="step-card relative z-10 flex flex-col w-full md:w-1/3 px-4">
            <div className="font-mono text-6xl md:text-8xl font-black text-vs-green/10 mb-4 tracking-tighter self-start md:self-center">
              {step.num}
            </div>
            <div className="bg-vs-card/50 backdrop-blur-sm p-6 rounded-2xl border border-vs-text/5 flex-grow">
              <h3 className="text-lg font-heading font-semibold text-vs-text mb-3">{step.title}</h3>
              <p className="text-vs-text/60 font-body text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
