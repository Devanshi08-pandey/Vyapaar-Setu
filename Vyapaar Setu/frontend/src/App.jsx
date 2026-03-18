import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Hero from './components/Hero';
import SocialProofBar from './components/SocialProofBar';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

import SplashScreen from './components/SplashScreen';

function App() {
  const containerRef = useRef();
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    if (showSplash) return;
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let ringX = 0, ringY = 0;
    
    const moveCursor = (e) => {
      if (!cursorDot || !cursorRing) return;
      
      // Dot follows immediately
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      
      // Ring follows with GSAP (lerp effect handled by GSAP ticker or simple requestAnimationFrame)
    };
    
    // We'll use GSAP for the ring follow
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      moveCursor(e);
    };

    window.addEventListener('mousemove', onMouseMove);

    gsap.ticker.add(() => {
      if (!cursorRing) return;
      ringX += (mouse.x - ringX) * 0.12;
      ringY += (mouse.y - ringY) * 0.12;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    });

    // Handle interactive elements (hover states)
    const interactives = document.querySelectorAll('a, button, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if(cursorRing) {
          gsap.to(cursorRing, { width: 60, height: 60, backgroundColor: 'rgba(16, 185, 129, 0.1)', mixBlendMode: 'exclusion', duration: 0.2 });
        }
      });
      el.addEventListener('mouseleave', () => {
        if(cursorRing) {
          gsap.to(cursorRing, { width: 32, height: 32, backgroundColor: 'transparent', mixBlendMode: 'normal', duration: 0.2 });
        }
      });
    });

    // Handle clicks
    const onClick = () => {
      if(cursorDot) {
        gsap.fromTo(cursorDot, { scale: 0.6 }, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    };
    window.addEventListener('click', onClick);

    // 3. Page Load Sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Initially body opacity is 0 in CSS? No, we'll just use a wipe overlay
      tl.to('.global-loader span', {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      })
      .to('.global-loader', {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.3
      }, '+=0.2');
    }, containerRef);

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Custom Cursor elements */}
      <div id="cursor-dot"></div>
      <div id="cursor-ring"></div>

      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <Hero />
      <SocialProofBar />
      <Features />
      <HowItWorks />
      <Stats />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
