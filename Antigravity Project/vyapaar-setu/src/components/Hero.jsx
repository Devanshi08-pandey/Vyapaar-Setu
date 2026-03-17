import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Media Query for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#0B0F0D', 0.002); // Deep Commerce Dark fog
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Hyperlocal Nodes Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const green = new THREE.Color('#3BEA7A'); // Marketplace Green
    const orange = new THREE.Color('#FF8A3D'); // Local Commerce Orange

    for (let i = 0; i < count * 3; i += 3) {
      // Spread them around
      positions[i] = (Math.random() - 0.5) * 40;     // x
      positions[i + 1] = (Math.random() - 0.5) * 40; // y
      positions[i + 2] = (Math.random() - 0.5) * 20; // z

      // Color variation
      const mixRatio = Math.random();
      const mixedColor = green.clone().lerp(orange, mixRatio > 0.8 ? 1 : 0); // Mostly green, some orange
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Camera pos
    camera.position.z = 10;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onDocumentMouseMove = (event) => {
      // Normalize mouse coords (-1 to 1)
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    if (!prefersReducedMotion && !isMobile) {
      document.addEventListener('mousemove', onDocumentMouseMove);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    
    renderer.setAnimationLoop(() => {
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Slow rotation
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = elapsedTime * 0.02;

        // Mouse reactive tilting
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    });

    // Resize Handling
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      const newIsMobile = window.innerWidth < 768;
      renderer.setPixelRatio(newIsMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Initial fade in for canvas
    gsap.to(canvasRef.current, { opacity: 1, duration: 1.5, delay: 0.3 });

    // Text animations
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-anim',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 1.2 }
      );
    }, containerRef);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (!prefersReducedMotion && !isMobile) {
        document.removeEventListener('mousemove', onDocumentMouseMove);
      }
      renderer.dispose();
      scene.clear();
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden flex items-end pb-20 px-6 md:pl-16 md:pr-6"
    >
      {/* 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 opacity-0 pointer-events-auto"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-vs-dark via-vs-dark/70 to-transparent pointer-events-none" />

      {/* Floating Island Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[50] flex items-center justify-between px-6 py-3 rounded-full backdrop-blur-xl bg-vs-card/70 border border-vs-text/10 shadow-xl transition-all duration-400 ease-out w-[90%] max-w-4xl hero-anim opacity-0">
        <div className="font-heading font-bold text-xl text-vs-text tracking-wide whitespace-nowrap">
          Vyapaar<span className="text-vs-green">Setu</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm text-vs-text/80 font-body">
          <a href="#features" className="hover:text-vs-green transition-colors">Smart Discovery</a>
          <a href="#how-it-works" className="hover:text-vs-green transition-colors">How It Works</a>
          <a href="#philosophy" className="hover:text-vs-green transition-colors">Manifesto</a>
        </div>
        <Link to="/login" className="bg-growth-gradient text-vs-dark font-semibold px-5 py-2 rounded-full text-sm hover:scale-105 transition-transform">
          Join Vendor
        </Link>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <h1 className="hero-anim opacity-0 font-heading font-extrabold text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] text-vs-text tracking-tight mb-2">
          Connecting <span className="text-vs-orange">Local</span> Businesses
          <br className="hidden md:block"/> to the <span className="bg-growth-gradient bg-clip-text text-transparent italic font-serif">Digital Economy.</span>
        </h1>
        <p className="hero-anim opacity-0 font-body text-vs-text/70 text-base md:text-lg max-w-[480px] mb-8 leading-relaxed mt-4">
          A smart, AI-powered hyperlocal marketplace. Discover nearby vendors, place orders instantly via WhatsApp, and support your neighborhood with seamless UPI payments.
        </p>
        <div className="hero-anim opacity-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link to="/explore" className="bg-growth-gradient text-vs-dark font-heading font-semibold px-8 py-4 rounded-full text-lg shadow-[0_0_20px_rgba(59,234,122,0.3)] hover:shadow-[0_0_30px_rgba(59,234,122,0.5)] transition-shadow inline-block">
            Explore Local Products
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-full text-lg border border-vs-green/30 text-vs-green font-heading font-medium hover:bg-vs-green/10 transition-colors inline-block">
            Join as Vendor
          </Link>
        </div>
      </div>
    </section>
  );
}
