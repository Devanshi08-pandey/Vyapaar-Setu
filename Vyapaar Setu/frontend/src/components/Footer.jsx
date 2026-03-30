import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useContext(LanguageContext);

  return (
    <footer className="w-full bg-[FFC570] text-brand-text pt-20 pb-8 px-6 md:px-16 rounded-t-[3.5rem] mt-[-2rem] relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        
        {/* Brand & Tagline */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="font-display font-bold text-3xl tracking-tight text-brand-text">VyapaarSetu</div>
          <p className="font-mono text-sm text-brand-text/50 max-w-sm">
            {t('footer_tagline')}
          </p>
          <div className="flex items-center gap-3 font-mono text-xs text-brand-text/40 bg-brand-void inline-flex px-3 py-1.5 rounded w-max border border-brand-text/5 mt-4">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-[pulse_2s_infinite]"></span>
            {t('footer_system')}
          </div>
        </div>

        {/* Navigation */}
        <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4 font-mono text-sm">
          <span className="text-brand-text/30 mb-2 text-xs">{t('footer_network')}</span>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_vendor_login')}</a>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_agent_access')}</a>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_documentation')}</a>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_status')}</a>
        </div>

        {/* Legal & Social */}
        <div className="md:col-span-3 flex flex-col gap-4 font-mono text-sm">
          <span className="text-brand-text/30 mb-2 text-xs">{t('footer_legal')}</span>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_terms')}</a>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_privacy')}</a>
          <a href="#" className="text-brand-text/70 hover:text-brand-accent transition-colors">{t('footer_data')}</a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-text/10 font-mono text-xs text-brand-text/30">
        <p>&copy; {year} {t('footer_copyright')}</p>
        <p className="mt-2 md:mt-0">v2.4.0-stable</p>
      </div>
    </footer>
  );
};

export default Footer;
