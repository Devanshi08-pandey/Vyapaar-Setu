import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, User, Store, ArrowRight } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';

export default function AuthPage() {
  const [tab, setTab] = useState('customer'); // 'customer' or 'vendor'
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Page load fade-in
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  const handleTabSwitch = (newTab) => {
    if (tab === newTab) return;
    
    // Quick flash animation on card content switch
    gsap.fromTo('.auth-form', 
      { opacity: 0, x: newTab === 'vendor' ? 20 : -20 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    );
    setTab(newTab);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (tab === 'customer') {
      navigate('/explore');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-vs-dark flex items-center justify-center p-6 relative overflow-hidden">
      <CustomCursor />
      
      {/* Background ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: tab === 'customer' ? 'radial-gradient(circle, #3BEA7A 0%, transparent 70%)' : 'radial-gradient(circle, #FF8A3D 0%, transparent 70%)' }}
      />

      <div ref={containerRef} className="w-full max-w-[440px] z-10">
        
        {/* Header & Back Link */}
        <div className="mb-10 text-center relative">
          <Link to="/" className="absolute left-0 top-1/2 -translate-y-1/2 text-vs-text/50 hover:text-vs-green transition-colors p-2 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="font-heading font-bold text-3xl text-vs-text tracking-wide">
            Vyapaar<span className="text-vs-green">Setu</span>
          </div>
        </div>

        {/* The Card */}
        <div className="bg-vs-card/80 backdrop-blur-xl border border-vs-green/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Tabs */}
          <div className="flex p-1 bg-vs-dark/50 rounded-xl mb-8 relative border border-vs-text/5">
            {/* Animated Tab Background Indicator */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-vs-card rounded-lg border border-vs-text/10 shadow-sm transition-all duration-300 ease-out"
              style={{ left: tab === 'customer' ? '4px' : 'calc(50%)' }}
            />
            
            <button 
              onClick={() => handleTabSwitch('customer')}
              className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-heading font-medium relative z-10 transition-colors ${tab === 'customer' ? 'text-vs-green' : 'text-vs-text/50 hover:text-vs-text/80'}`}
            >
              <User className="w-4 h-4" /> Customer
            </button>
            <button 
              onClick={() => handleTabSwitch('vendor')}
              className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-heading font-medium relative z-10 transition-colors ${tab === 'vendor' ? 'text-vs-orange' : 'text-vs-text/50 hover:text-vs-text/80'}`}
            >
              <Store className="w-4 h-4" /> Local Vendor
            </button>
          </div>

          {/* Form */}
          <form className="auth-form flex flex-col gap-5" onSubmit={handleLogin}>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-body text-vs-text/70">Phone Number or Email</label>
              <input 
                type="text" 
                placeholder={tab === 'customer' ? "Enter your 10-digit number" : "business@email.com"}
                className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3.5 text-vs-text font-body focus:outline-none focus:border-vs-green focus:ring-1 focus:ring-vs-green/50 transition-all placeholder:text-vs-text/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-body text-vs-text/70">Password / OTP</label>
                <a href="#" className="text-xs text-vs-text/40 hover:text-vs-green">Forgot?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3.5 text-vs-text font-body focus:outline-none focus:border-vs-green focus:ring-1 focus:ring-vs-green/50 transition-all placeholder:text-vs-text/30"
              />
            </div>
            
            <button 
              type="submit"
              className={`mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-heading font-semibold text-vs-dark transition-all hover:opacity-90 ${tab === 'customer' ? 'bg-growth-gradient' : 'bg-vs-orange'}`}
            >
              {tab === 'customer' ? 'Sign In to Explore' : 'Access Dashboard'}
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

          {/* Footer inside card */}
          <p className="mt-8 text-center text-sm text-vs-text/50 font-body">
            New to the neighborhood? <a href="#" className="text-vs-green hover:underline">Create an account</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
