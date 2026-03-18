import React, { useEffect, useState, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageContext } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const DiagnosticShuffler = () => {
  const [items, setItems] = useState([
    { label: 'LOC: SECTOR 45', status: 'MATCHED', desc: '4 Grocery Vendors' },
    { label: 'USR_PREF: ORGANIC', status: 'SEARCHING', desc: 'Scanning Inventory' },
    { label: 'PROXIMITY: 1.2KM', status: 'CONNECTED', desc: 'Vendor Assigned' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const first = newItems.shift();
        newItems.push(first);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 overflow-hidden h-[180px] perspective-800">
      {items.map((item, i) => (
        <div 
          key={item.label + i}
          className="flex flex-col p-3 rounded-lg border border-brand-accent/20 bg-brand-void/50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: i === 0 ? 'rotateX(0deg) scale(1)' : 'rotateX(20deg) scale(0.95)', opacity: i === 0 ? 1 : 0.6 }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs text-brand-text/80">{item.label}</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-brand-accent/10 text-brand-accent">
              {item.status}
            </span>
          </div>
          <span className="font-display text-sm text-brand-text">{item.desc}</span>
        </div>
      ))}
    </div>
  );
};

const TelemetryTypewriter = () => {
  const messages = [
    "INITIATING UPI GATEWAY...",
    "PAYMENT [₹450.00] SECURED.",
    "SYNCING WHATSAPP API...",
    "MESSAGE: 'Your order is out for delivery!'"
  ];
  
  const [displayText, setDisplayText] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let timeout;
    
    const runSequence = async () => {
      // Scramble phase
      setIsTyping(true);
      const targetMsg = messages[msgIndex];
      let scrambleTime = 400; // ms
      let scrambleInterval = setInterval(() => {
        let fakeText = '';
        for(let i=0; i<Math.min(targetMsg.length, 15); i++) {
          fakeText += chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplayText(fakeText);
      }, 50);

      await new Promise(r => setTimeout(r, scrambleTime));
      clearInterval(scrambleInterval);
      
      // Typewriter phase
      let currentLength = 0;
      setDisplayText('');
      const typeInterval = setInterval(() => {
        setDisplayText(targetMsg.substring(0, currentLength + 1));
        currentLength++;
        if (currentLength >= targetMsg.length) {
          clearInterval(typeInterval);
          setIsTyping(false);
          timeout = setTimeout(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
          }, 2000);
        }
      }, 50);
    };

    runSequence();
    
    return () => clearTimeout(timeout);
  }, [msgIndex]);

  return (
    <div className="h-[180px] bg-brand-void p-5 rounded-lg border border-brand-accent/20 flex flex-col font-mono text-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-text/10">
        <span className="text-brand-text/60 text-xs">LOG TERMINAL</span>
        <div className="flex items-center gap-2 text-brand-accent text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span> LIVE
        </div>
      </div>
      <div className="text-brand-text flex-1">
        {displayText}
        <span className="animate-pulse bg-brand-accent w-1.5 h-4 inline-block ml-1 align-middle"></span>
      </div>
    </div>
  );
};

const SignalGraph = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    // Reveal line graph drawing
    ScrollTrigger.create({
      trigger: pathRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(pathRef.current, 
          { strokeDashoffset: 1000 }, 
          { strokeDashoffset: 0, duration: 2, ease: "power2.out" }
        );
      }
    });
  }, []);

  return (
    <div className="h-[180px] w-full flex flex-col justify-between">
      <div className="flex justify-between font-mono text-xs text-brand-text/60 mb-2">
        <span>STORE_TRAFFIC</span>
        <span className="text-brand-accent">+324% GROWTH</span>
      </div>
      <div className="flex-1 relative w-full h-[120px] bg-brand-void/30 border-l border-b border-brand-text/10 pt-4">
        <svg viewBox="0 0 400 100" className="w-full h-full preserve-aspect-none" style={{overflow:'visible'}}>
          {/* Grid lines */}
          <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(240, 238, 248, 0.05)" strokeWidth="1"/>
          <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(240, 238, 248, 0.05)" strokeWidth="1"/>
          <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(240, 238, 248, 0.05)" strokeWidth="1"/>
          
          <path 
            ref={pathRef}
            d="M0,90 C40,85 80,60 120,70 C160,80 200,40 240,30 C280,20 320,50 360,10 C380,0 395,5 400,10" 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1000"
            style={{ strokeDashoffset: 1000 }}
            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          />
          {/* Data points */}
          <circle cx="240" cy="30" r="4" fill="#0F0F1A" stroke="#10B981" strokeWidth="2" className="animate-pulse" />
          <circle cx="360" cy="10" r="4" fill="#0F0F1A" stroke="#10B981" strokeWidth="2" className="animate-pulse delay-150" />
        </svg>
      </div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="features" className="py-24 px-6 md:px-16 bg-brand-void max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-brand-text mb-4">
          <span className="font-drama italic text-brand-accent font-normal">{t('features_title')}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="feature-card bg-brand-card rounded-2xl p-6 border border-brand-accent/10 shadow-xl flex flex-col gap-6">
          <DiagnosticShuffler />
          <div>
            <h3 className="font-display font-bold text-xl text-brand-text mb-2 tracking-tight">{t('features_ai')}</h3>
            <p className="font-mono text-[13px] text-brand-text/60">
              {t('features_ai_desc')}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="feature-card bg-brand-card rounded-2xl p-6 border border-brand-accent/10 shadow-xl flex flex-col gap-6">
          <TelemetryTypewriter />
          <div>
            <h3 className="font-display font-bold text-xl text-brand-text mb-2 tracking-tight">{t('features_sync')}</h3>
            <p className="font-mono text-[13px] text-brand-text/60">
              {t('features_sync_desc')}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="feature-card bg-brand-card rounded-2xl p-6 border border-brand-accent/10 shadow-xl flex flex-col gap-6">
          <SignalGraph />
          <div>
            <h3 className="font-display font-bold text-xl text-brand-text mb-2 tracking-tight">{t('features_analytics')}</h3>
            <p className="font-mono text-[13px] text-brand-text/60">
              {t('features_analytics_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
