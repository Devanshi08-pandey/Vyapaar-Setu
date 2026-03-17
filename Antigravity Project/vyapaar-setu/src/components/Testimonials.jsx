import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  const testimonials = [
    {
      quote: "Before VyapaarSetu, my bakery relied only on walk-ins. Now, my entire neighborhood orders fresh bread directly via WhatsApp, and the UPI payments are perfectly integrated. My sales doubled.",
      author: "Priti Sharma",
      role: "Owner",
      company: "The Crusty Loaf Bakery"
    },
    {
      quote: "The AI recommendation engine found customers for my electrical repair services that I never knew existed within a 2km radius. It's incredibly simple to manage requests from the dashboard.",
      author: "Rajesh Kumar",
      role: "Master Electrician",
      company: "QuickFix Electricals"
    },
    {
      quote: "As a customer, I love finding hidden gems in my locality. The interface is clean, payments are smooth, and I know I'm supporting the people in my community directly.",
      author: "Ananya Desai",
      role: "Local Resident",
      company: "Active Shopper"
    }
  ];

  const changeSlide = (direction) => {
    const nextIndex = (currentIndex + direction + testimonials.length) % testimonials.length;
    
    gsap.to(slideRef.current, {
      x: direction > 0 ? -60 : 60,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(nextIndex);
        gsap.fromTo(slideRef.current,
          { x: direction > 0 ? 60 : -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out'}
        );
      }
    });
  };

  return (
    <section className="py-32 px-6 md:px-16 bg-vs-dark relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Large Decorative Quote */}
        <div className="text-vs-green/[0.15] font-serif text-8xl md:text-[12rem] leading-none absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none font-bold">
          "
        </div>

        <div ref={slideRef} className="relative z-10 flex flex-col items-center text-center mt-12 min-h-[250px] justify-center">
          <p className="font-body text-xl md:text-3xl text-vs-text/90 leading-relaxed mb-10 max-w-3xl">
            {testimonials[currentIndex].quote}
          </p>
          <div className="flex flex-col items-center gap-1">
            <h4 className="font-heading font-semibold text-vs-green text-lg">{testimonials[currentIndex].author}</h4>
            <span className="font-mono text-sm text-vs-text/50">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 mt-16 z-10">
          <button 
            onClick={() => changeSlide(-1)} 
            className="w-12 h-12 rounded-full border border-vs-text/10 flex items-center justify-center text-vs-text/50 hover:text-vs-orange hover:border-vs-orange/30 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-vs-green' : 'w-2 bg-vs-text/20'}`} 
              />
            ))}
          </div>

          <button 
            onClick={() => changeSlide(1)} 
            className="w-12 h-12 rounded-full border border-vs-text/10 flex items-center justify-center text-vs-text/50 hover:text-vs-green hover:border-vs-green/30 transition-colors group"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
