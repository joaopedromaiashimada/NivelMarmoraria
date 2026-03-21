
import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/5519974214415?text=Gostaria%20de%20um%20or%C3%A7amento!";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-primary/90 active:scale-95 flex items-center justify-center group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-4 bg-white text-primary px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Fale com um especialista
      </span>
    </a>
  );
};

export default FloatingWhatsAppButton;
