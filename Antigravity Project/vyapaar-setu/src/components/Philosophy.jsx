import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Philosophy() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.to('.parallax-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Word-by-word reveal
      const words = gsap.utils.toArray('.reveal-word');
      gsap.fromTo(words,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const prepText = "Most platforms focus on distance and global logistics. We focus on your ";
  const highlightWord = "neighborhood.";

  return (
    <section ref={containerRef} id="philosophy" className="relative py-48 px-6 md:px-16 bg-vs-dark overflow-hidden min-h-[80vh] flex items-center">
      {/* Texture Background */}
      <div 
        className="parallax-bg absolute inset-0 w-full h-[120%] opacity-10 bg-cover bg-center -top-[10%] pointer-events-none grayscale mix-blend-overlay"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2940&auto=format&fit=crop")' }}
      />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto" ref={textRef}>
        <p className="font-body text-xl md:text-2xl text-vs-text/60 mb-8 max-w-2xl leading-relaxed">
          {prepText.split(" ").map((word, i) => (
            <span key={i} className="reveal-word inline-block mr-2">{word}</span>
          ))}
        </p>
        <h2 className="font-heading font-extrabold text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-tighter text-vs-text">
          <span className="reveal-word inline-block text-vs-text text-opacity-30">Our</span>{" "}
          <span className="reveal-word inline-block italic text-vs-green bg-growth-gradient bg-clip-text text-transparent transform scale-y-[1.05] italic">{highlightWord}</span>
        </h2>
      </div>
    </section>
  );
}
