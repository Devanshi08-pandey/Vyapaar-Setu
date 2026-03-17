import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import CustomCursor from '../components/CustomCursor';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Philosophy from '../components/Philosophy';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Page Load Sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setLoaded(true);
          document.body.style.overflow = 'auto'; // allow scroll after load
          ScrollTrigger.refresh(); // Refresh triggers just in case
        }
      });
      
      document.body.style.overflow = 'hidden';
      gsap.set('body', { opacity: 1 });
      
      tl.to('.loader-text span', {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      })
      .to('.loader-text', { opacity: 0, duration: 0.3, delay: 0.3 })
      .to('.loader-overlay', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
      });
    }, containerRef);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-vs-dark">
      <CustomCursor />
      
      {/* Wipe Loader Overlay */}
      <div className="loader-overlay fixed inset-0 z-[100] bg-vs-dark flex items-center justify-center pointer-events-none">
        <h1 className="loader-text text-vs-green font-heading text-4xl md:text-6xl font-bold flex overflow-hidden">
          {'VyapaarSetu'.split('').map((char, i) => (
            <span key={i} className="inline-block translate-y-8 opacity-0">
              {char}
            </span>
          ))}
        </h1>
      </div>

      <main className="opacity-0 w-full overflow-hidden" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Philosophy />
        <Stats />
        <Testimonials />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}
