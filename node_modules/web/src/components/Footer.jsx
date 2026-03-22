import React from 'react';
import { MapPin, Instagram } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon.jsx';

const Footer = () => {
  const whatsappUrl = 'https://wa.me/5519974214415?text=Gostaria%20de%20um%20or%C3%A7amento!';

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo-nivel.png" alt="Logo Marmoraria Nível" className="h-10 w-auto object-contain shrink-0" />
              <span className="heading-font text-[2rem] leading-none font-bold text-white">Marmoraria Nível</span>
            </div>
            <p className="mt-5 text-white leading-relaxed max-w-md">
              Sofisticação em mármore e granito para seu projeto. Acabamento premium e qualidade garantida.
            </p>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Contato</span>
            <div className="space-y-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white transition-colors duration-200 hover:text-white/80">
                <WhatsAppIcon className="w-5 h-5" />
                <span>(19) 99742-1441</span>
              </a>
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>Av. Independência, 3160 - Alemães, Piracicaba - SP, 13416-240</span>
              </div>
              <a href="https://www.instagram.com/marmoraria_nivel/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white transition-colors duration-200 hover:text-white/80">
                <Instagram className="w-5 h-5" />
                <span>@marmoraria_nivel</span>
              </a>
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Horário de Atendimento</span>
            <div className="space-y-2 text-white">
              <p>Segunda a Sexta: 8:30 às 17:30</p>
              <p>Sábado: 8:30 às 12:00</p>
              <p>Domingo: Fechado</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Marmoraria Nível. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
