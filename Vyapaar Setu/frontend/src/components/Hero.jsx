import React, { useEffect, useRef, useContext } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { LanguageContext } from '../context/LanguageContext';

const ParticleField = () => {
  // ... (unchanged particle logic)
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const particlesCount = window.innerWidth < 768 ? 400 : 1200;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: '#10B981',
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2.5;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const documentMouseMove = (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    };

    document.addEventListener('mousemove', documentMouseMove);

    const clock = new THREE.Clock();

    const render = () => {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.z += 0.002;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', documentMouseMove);
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const Hero = () => {
  const containerRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.8 });

      tl.fromTo('.hero-anim', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-3d',
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: 2.1, ease: 'power2.inOut' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] flex items-end pb-20 pl-6 md:pl-16 overflow-hidden bg-brand-void">
      {/* 3D Background */}
      <div className="hero-3d absolute inset-0 z-0 opacity-0">
        <ParticleField />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-void via-brand-void/80 to-transparent pointer-events-none"></div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl flex flex-col gap-4">
        <h2 className="hero-anim opacity-0 translate-y-12 font-display font-bold text-[clamp(2rem,6vw,4rem)] leading-none text-brand-text/90 tracking-tighter">
          {t('hero_title_1')}
        </h2>
        
        <h1 className="hero-anim opacity-0 translate-y-12 font-drama italic text-[clamp(4.5rem,10vw,8rem)] leading-[0.9] text-brand-text mb-2">
          {t('hero_title_2').split(' ').map((word, i, arr) => (
            i === arr.length - 2 
              ? <React.Fragment key={i}><span className="text-brand-accent underline decoration-brand-accent/30 decoration-4 underline-offset-8">{word}</span> </React.Fragment>
              : <React.Fragment key={i}>{word} </React.Fragment>
          ))}
        </h1>
        
        <p className="hero-anim opacity-0 translate-y-12 font-mono text-[clamp(0.9rem,2vw,1.1rem)] text-brand-text/60 max-w-[480px] leading-relaxed mb-6">
          {t('hero_subtitle')}
        </p>
      </div>
    </section>
  );
};

export default Hero;
