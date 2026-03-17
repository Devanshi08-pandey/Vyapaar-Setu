import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Check if device supports hover
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Move dot immediately
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // RAF for lerping the ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(render);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'button' || target.closest('button') || target.tagName.toLowerCase() === 'a') {
        gsap.to(ring, { width: 60, height: 60, marginLeft: -30, marginTop: -30, mixBlendMode: 'exclusion', duration: 0.3 });
      } else if (['h1', 'h2', 'h3', 'p', 'span'].includes(target.tagName.toLowerCase())) {
        gsap.to(ring, { width: 40, height: 4, marginLeft: -20, marginTop: 10, borderRadius: 2, duration: 0.3 });
      } else {
        gsap.to(ring, { width: 32, height: 32, marginLeft: -16, marginTop: -16, mixBlendMode: 'normal', borderRadius: '50%', duration: 0.3 });
      }
    };

    const handleMouseDown = () => {
      gsap.to(dot, { scale: 0.6, duration: 0.1 });
    };
    
    const handleMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.1 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <>
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-vs-green/30 pointer-events-none z-[99999] hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-vs-green rounded-full pointer-events-none z-[100000] hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>
    </>
  );
}
