import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Card 1: Diagnostic Shuffler
const DiagnosticShuffler = () => {
  const [items, setItems] = useState([
    { label: "Local Groceries", status: "72 Vendors Near You" },
    { label: "Home Repair Services", status: "15 Experts Available" },
    { label: "Custom Tailoring", status: "Match Found in 2km" }
  ]);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const cycle = setInterval(() => {
      gsap.to(containerRef.current.children, {
        rotateX: 20,
        opacity: 0,
        y: -10,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          setItems(prev => {
            const next = [...prev];
            next.push(next.shift());
            return next;
          });
          gsap.fromTo(containerRef.current.children, 
            { rotateX: -20, opacity: 0, y: 10 },
            { rotateX: 0, opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }
          );
        }
      });
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-heading font-bold text-vs-text mb-2">One Platform for Local Commerce</h3>
      <p className="text-sm text-vs-text/60 font-body mb-8">Discover nearby vendors, products, and services in one unified digital marketplace.</p>
      
      <div 
        ref={containerRef} 
        className="mt-auto space-y-3 p-4 bg-vs-dark rounded-xl border border-vs-green/10"
        style={{ perspective: 800 }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-vs-text/5 last:border-0">
            <span className="font-mono text-xs text-vs-text/80">{item.label}</span>
            <span className="font-mono text-xs text-vs-green bg-vs-green/10 px-2 py-1 rounded">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Card 2: Telemetry Typewriter
const TelemetryTypewriter = () => {
  const [text, setText] = useState("");
  const messages = [
    "Analyzing purchase history...",
    "Finding top-rated local electricians...",
    "Recommending weekly fresh produce delivery...",
    "Matching preferences with neighborhood deals..."
  ];
  let msgIdx = 0;

  useEffect(() => {
    let charIdx = 0;
    let isTyping = true;
    let timeoutId;

    const typeMsg = () => {
      if (!isTyping) return;
      const currentMsg = messages[msgIdx];
      
      if (charIdx <= currentMsg.length) {
        setText(currentMsg.substring(0, charIdx));
        charIdx++;
        timeoutId = setTimeout(typeMsg, 50);
      } else {
        timeoutId = setTimeout(() => scrambleToNext(), 2000);
      }
    };

    const scrambleToNext = () => {
      let scrambleCount = 0;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      const scrambleInterval = setInterval(() => {
        setText(Array(20).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(""));
        scrambleCount++;
        if (scrambleCount > 10) {
          clearInterval(scrambleInterval);
          msgIdx = (msgIdx + 1) % messages.length;
          charIdx = 0;
          typeMsg();
        }
      }, 40);
    };

    timeoutId = setTimeout(typeMsg, 500);

    return () => {
      isTyping = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-heading font-bold text-vs-text mb-2">AI-Powered Smart Discovery</h3>
      <p className="text-sm text-vs-text/60 font-body mb-8">Machine learning recommends relevant vendors based on location and behavior.</p>
      
      <div className="mt-auto bg-vs-dark rounded-xl border border-vs-green/10 p-5 font-mono text-xs min-h-[120px] flex flex-col">
        <div className="flex items-center gap-2 mb-3 border-b border-vs-text/10 pb-2">
          <div className="w-2 h-2 rounded-full bg-vs-green animate-pulse" />
          <span className="text-vs-text/40 tracking-widest uppercase">Live Engine</span>
        </div>
        <div className="text-vs-green leading-relaxed">
          {`>`} {text}<span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
};

// Card 3: Signal Graph
const SignalGraph = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    
    ScrollTrigger.create({
      trigger: path,
      start: "top 85%",
      onEnter: () => {
        gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" });
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-heading font-bold text-vs-text mb-2">Vendor Growth & Insights</h3>
      <p className="text-sm text-vs-text/60 font-body mb-8">Dashboards with sales analytics and order tracking for local sellers.</p>
      
      <div className="mt-auto bg-vs-dark rounded-xl border border-vs-orange/10 p-4 relative h-[140px] flex items-end">
        <span className="absolute top-4 left-4 font-mono text-xs text-vs-orange">monthly_revenue</span>
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d">
          {/* Grid lines */}
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(244, 255, 246, 0.05)" strokeWidth="0.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(244, 255, 246, 0.05)" strokeWidth="0.5" />
          
          <path 
            ref={pathRef}
            d="M 0 35 Q 10 35, 20 25 T 40 15 T 60 20 T 80 5 T 100 0" 
            fill="none" 
            stroke="#FF8A3D" 
            strokeWidth="1.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_4px_8px_rgba(255,138,61,0.4)]"
          />
          {/* Points */}
          {[
            {x: 20, y: 25}, {x: 40, y: 15}, {x: 60, y: 20}, {x: 80, y: 5}, {x: 100, y: 0}
          ].map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="1.5" fill="#121815" stroke="#FF8A3D" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: `${i*0.2}s` }}/>
          ))}
        </svg>
      </div>
    </div>
  );
};


export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card', 
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 px-6 md:px-16 bg-vs-dark max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-vs-text mb-4">
          Built for <span className="text-vs-green italic">hyperlocal</span> scale.
        </h2>
        <p className="text-vs-text/60 font-body max-w-xl text-lg">
          We don't just list products. We provide the intelligence and infrastructure needed for local economies to thrive digitally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card bg-vs-card rounded-[2rem] p-8 border border-vs-green/5 shadow-xl hover:border-vs-green/20 transition-colors">
          <DiagnosticShuffler />
        </div>
        <div className="feature-card bg-vs-card rounded-[2rem] p-8 border border-vs-green/5 shadow-xl hover:border-vs-green/20 transition-colors">
          <TelemetryTypewriter />
        </div>
        <div className="feature-card bg-vs-card rounded-[2rem] p-8 border border-vs-green/5 shadow-xl hover:border-vs-orange/20 transition-colors">
          <SignalGraph />
        </div>
      </div>
    </section>
  );
}
