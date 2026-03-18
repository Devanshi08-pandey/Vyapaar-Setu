import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ phone, message, className = "" }) => {
  const handleClick = () => {
    // Basic phone number cleaning
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform font-display font-bold text-sm ${className}`}
    >
      <MessageCircle size={18} />
      <span>CHAT ON WHATSAPP</span>
    </button>
  );
};

export default WhatsAppButton;
