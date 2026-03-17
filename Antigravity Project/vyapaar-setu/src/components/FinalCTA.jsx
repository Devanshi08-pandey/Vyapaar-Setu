import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-anim',
        { scale: 0.95, opacity: 0, y: 30 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%'
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-16 w-full">
      <div className="cta-anim bg-growth-gradient rounded-[3rem] p-12 md:p-24 w-full flex flex-col items-center text-center shadow-[0_0_80px_rgba(59,234,122,0.15)] relative overflow-hidden">
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(#121815 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="bg-vs-dark/10 backdrop-blur-md border border-vs-dark/10 rounded-full px-4 py-2 mb-8 flex items-center gap-2 text-vs-dark font-mono text-sm tracking-wide">
          <Sparkles className="w-4 h-4" />
          <span>Vendor Registration Open</span>
        </div>

        <h2 className="cta-anim font-heading font-extrabold text-4xl md:text-7xl text-vs-dark tracking-tighter mb-6 max-w-4xl text-balance">
          Join VyapaarSetu and take your local business online in minutes.
        </h2>

        <p className="cta-anim font-body text-vs-dark/80 text-lg md:text-xl max-w-2xl mb-12">
          Stop losing customers to massive e-commerce apps. Be discovered by the people right in your neighborhood.
        </p>

        <Link to="/login" className="cta-anim bg-vs-dark text-vs-text font-heading font-semibold text-lg px-8 lg:px-12 py-5 rounded-full hover:scale-105 hover:bg-[#1A221E] transition-all flex items-center gap-3 group shadow-2xl">
          Start your digital storefront
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}
