import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WhatsAppIcon from '@/components/WhatsAppIcon.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleSecretAccess = () => {
    const nextClicks = secretClicks + 1;

    if (nextClicks >= 5) {
      setSecretClicks(0);
      navigate('/admin-obras'); // 🔥 agora vai pro admin
      return;
    }

    setSecretClicks(nextClicks);

    setTimeout(() => {
      setSecretClicks(0);
    }, 1800);
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Serviços', id: 'services' },
    { label: 'Obras', id: 'portfolio' },
    { label: 'Catálogo', id: 'catalog' },
    { label: 'Diferenciais', id: 'differentials' },
    { label: 'Depoimentos', id: 'testimonials' }
  ];

  const whatsappUrl = 'https://wa.me/5519974214415?text=Gostaria%20de%20um%20or%C3%A7amento!';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          <button
            onClick={() => {
              scrollToSection('hero');
              handleSecretAccess();
            }}
            className="flex items-center gap-2 text-left transition-opacity duration-200 hover:opacity-90 shrink-0"
          >
            <img 
              src="/logob.png" 
              alt="Logo Marmoraria Nível" 
              className="h-9 sm:h-10 w-auto object-contain" 
            />

            <span className="text-xl sm:text-[2rem] font-extrabold text-primary tracking-tight leading-none">
              Marmoraria Nível
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 font-medium transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </button>
            ))}

            <Button
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="bg-primary text-white hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg rounded-lg px-6"
            >
              <WhatsAppIcon className="w-4 h-4 mr-2" />
              Solicitar orçamento
            </Button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground transition-colors duration-200 hover:text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white absolute w-full shadow-xl">
          <nav className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-foreground font-medium py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-muted hover:text-primary"
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 px-4">
              <Button
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-md py-6 text-lg"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Solicitar orçamento
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;