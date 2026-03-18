import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const SocialProofBar = () => {
  const { t } = useContext(LanguageContext);
  const logos = ['ONDC Network', 'UPI Ready', 'WhatsApp Verified', 'HDFC Bank', 'Razorpay', 'Local SEO Powered'];
  const metrics = [t('social_vendors'), t('social_uptime'), t('social_processed'), t('social_discovery'), t('social_rating')];

  return (
    <section className="relative w-full overflow-hidden bg-brand-void py-12 border-y border-brand-text/5">
      {/* Edge Gradients for fading effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{ maskImage: 'linear-gradient(to right, #05050F, transparent 10%, transparent 90%, #05050F)' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-brand-void via-transparent to-brand-void"></div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Top Row: Logos/Partners */}
        <div className="flex w-max animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex items-center justify-center min-w-[200px] px-8 text-brand-text/40 font-display font-medium text-lg uppercase tracking-widest">
              {logo}
            </div>
          ))}
        </div>

        {/* Bottom Row: Key Stats */}
        <div className="flex w-max animate-[scrollReverse_35s_linear_infinite] whitespace-nowrap">
          {[...metrics, ...metrics, ...metrics].map((metric, index) => (
            <div key={index} className="flex items-center justify-center min-w-[250px] px-8 text-brand-accent/70 font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-brand-accent/50 mr-3 animate-pulse"></span>
              {metric}
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes scrollReverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}} />
    </section>
  );
};

export default SocialProofBar;
