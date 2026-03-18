import React, { useState, useContext } from 'react';
import { Plus } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-brand-text/10 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <h3 className="font-display font-semibold text-xl text-brand-text group-hover:text-brand-accent transition-colors">{q}</h3>
        <Plus className={`w-6 h-6 text-brand-accent transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
      >
        <p className="font-mono text-brand-text/60 leading-relaxed text-sm max-w-3xl pr-8">
          {a}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { t } = useContext(LanguageContext);

  const faqData = [
    {
      q: t('faq_q1', "Do I need technical skills to join?"),
      a: t('faq_a1', "None. If you can use WhatsApp, you can use VyapaarSetu. Our onboarding requires only your business name, location, and a quick inventory scan to get started.")
    },
    {
      q: t('faq_q2', "How are UPI payments handled?"),
      a: t('faq_a2', "We integrate directly with native UPI apps (GPay, PhonePe, Paytm). Payments go directly from the customer's account to your linked business bank account with zero middleman holding periods.")
    },
    {
      q: t('faq_q3', "What if my store is hard to find?"),
      a: t('faq_a3', "Our AI strictly maps hyperlocal proximity. We connect you exactly with customers within 5km radius who are actively searching for what you sell, effectively bypassing physical location visibility issues.")
    },
    {
      q: t('faq_q4', "Are there hidden subscription fees?"),
      a: t('faq_a4', "No. You pay a micro-transaction fee only when a successful order is processed. Platform infrastructure and WhatsApp updates are entirely free for verified vendors.")
    }
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-brand-void max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-brand-text mb-4">
          <span className="font-drama italic text-brand-accent font-normal">{t('faq_title')}</span>
        </h2>
      </div>

      <div className="flex flex-col">
        {faqData.map((item, index) => (
          <FAQItem key={index} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
