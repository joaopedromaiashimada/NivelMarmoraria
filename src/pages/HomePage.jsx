import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Droplet,
  StepBack as Stairs,
  Layers,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  ChevronLeft,
  Gem,
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import PortfolioCard from '@/components/PortfolioCard.jsx';
import TestimonialCard from '@/components/TestimonialCard.jsx';
import DifferentialCard from '@/components/DifferentialCard.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';
import WhatsAppIcon from '@/components/WhatsAppIcon.jsx';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const HomePage = () => {
  const whatsappUrl = 'https://wa.me/5519974214415?text=Gostaria%20de%20um%20or%C3%A7amento!';

  const services = [
    {
      icon: ChefHat,
      title: 'Bancadas de cozinha sob medida com acabamento premium',
      description:
        'Transforme sua cozinha com bancadas resistentes, fáceis de limpar e com design exclusivo que valoriza seu ambiente.',
    },
    {
      icon: Droplet,
      title: 'Bancadas de banheiro elegantes e duráveis',
      description:
        'Sofisticação e resistência à umidade para seu banheiro, com cortes precisos e acabamento impecável.',
    },
    {
      icon: Droplet,
      title: 'Pias e lavatórios personalizados',
      description:
        'Projetos únicos esculpidos em mármore ou granito, unindo funcionalidade e alto valor estético.',
    },
    {
      icon: Stairs,
      title: 'Escadas em mármore com acabamento sofisticado',
      description:
        'Degraus e patamares revestidos com pedras nobres, garantindo segurança e imponência para sua casa.',
    },
    {
      icon: Layers,
      title: 'Revestimentos de alto padrão',
      description:
        'Revestimentos para paredes, pisos e fachadas que trazem a beleza natural da pedra para seu projeto.',
    },
    {
      icon: Sparkles,
      title: 'Projetos personalizados',
      description:
        'Desenvolvemos soluções sob medida para áreas gourmet, lareiras, mesas e detalhes arquitetônicos.',
    },
  ];

  const differentials = [
    '✓ Acabamento de alto padrão',
    '✓ Atendimento personalizado',
    '✓ Materiais selecionados',
    '✓ Equipe especializada',
    '✓ Pontualidade na entrega',
  ];

  const testimonials = [
    {
      name: 'Flávia Vicentini',
      initials: 'FV',
      quote:
        'Fiz todas as pedras da minha casa com a Nível, sempre me atenderam muito bem, trabalho bem feito, acabamento perfeito, cumprem prazo e preço justo, super recomendo!',
    },
    {
      name: 'Luis Felipe',
      initials: 'LF',
      quote:
        'Entre todos os pontos positivos, podemos indicar a pontualidade, os preços, o compromisso, e em especial atendimento diferenciado !!',
    },
    {
      name: 'Deborah Araujo',
      initials: 'DA',
      quote:
        'Empresa com materiais de excelente qualidade, preço justo e segurança na hora da execução do projeto.',
    },
    {
      name: 'Julia Piaggio',
      initials: 'JP',
      quote:
        'A melhor marmoraria de Piracicaba e região, preço imbatível, qualidade sem igual e atendimento impecável.',
    },
  ];

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [catalogIndex, setCatalogIndex] = useState(0);

  useEffect(() => {
    const fetchObras = async () => {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar obras:', error);
        setPortfolioImages([]);
        return;
      }

      const formatted = (data || [])
        .filter((item) => item.image_url)
        .map((item) => ({
          id: item.id,
          url: item.image_url,
          title: item.title || 'Obra realizada',
          description: item.description || 'Projeto adicionado pelo cliente.',
        }));

      setPortfolioImages(formatted);
    };

    fetchObras();
  }, []);

  useEffect(() => {
    const fetchCatalogo = async () => {
      const { data, error } = await supabase
        .from('catalogo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar catálogo:', error);
        setCatalogItems([]);
        return;
      }

      const formatted = (data || [])
        .filter((item) => item.image_url)
        .map((item) => ({
          id: item.id,
          image: item.image_url,
          title: item.title || 'Material do catálogo',
          description: item.description || 'Item adicionado no catálogo pelo cliente.',
        }));

      setCatalogItems(formatted);
    };

    fetchCatalogo();
  }, []);

  useEffect(() => {
    if (portfolioIndex > Math.max(portfolioImages.length - 1, 0)) {
      setPortfolioIndex(0);
    }
  }, [portfolioIndex, portfolioImages.length]);

  useEffect(() => {
    if (catalogIndex > Math.max(catalogItems.length - 1, 0)) {
      setCatalogIndex(0);
    }
  }, [catalogIndex, catalogItems.length]);

  const visiblePortfolioItems = useMemo(() => {
    if (portfolioImages.length === 0) return [];
    const itemsToShow = Math.min(3, portfolioImages.length);

    return Array.from(
      { length: itemsToShow },
      (_, offset) => portfolioImages[(portfolioIndex + offset) % portfolioImages.length]
    );
  }, [portfolioIndex, portfolioImages]);

  const visibleCatalogItems = useMemo(() => {
    if (catalogItems.length === 0) return [];
    const itemsToShow = Math.min(3, catalogItems.length);

    return Array.from(
      { length: itemsToShow },
      (_, offset) => catalogItems[(catalogIndex + offset) % catalogItems.length]
    );
  }, [catalogIndex, catalogItems]);

  const handlePortfolioPrev = () => {
    if (portfolioImages.length === 0) return;
    setPortfolioIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length);
  };

  const handlePortfolioNext = () => {
    if (portfolioImages.length === 0) return;
    setPortfolioIndex((prev) => (prev + 1) % portfolioImages.length);
  };

  const handleCatalogPrev = () => {
    if (catalogItems.length === 0) return;
    setCatalogIndex((prev) => (prev - 1 + catalogItems.length) % catalogItems.length);
  };

  const handleCatalogNext = () => {
    if (catalogItems.length === 0) return;
    setCatalogIndex((prev) => (prev + 1) % catalogItems.length);
  };

  return (
    <>
      <Helmet>
        <title>Marmoraria Nível - Projetos em Mármore e Granito</title>
        <meta
          name="description"
          content="Transforme sua cozinha ou banheiro com mármore de alto padrão. Projetos sob medida com acabamento impecável e instalação profissional."
        />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <main className="pt-20">
        <section
          id="hero"
          className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <img
              src="https://horizons-cdn.hostinger.com/24fa50a3-01a6-4b9d-8eb6-d15fec7e8c1d/1-NJNGT.jpg"
              alt="Cozinha moderna de luxo com bancada de mármore branco"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-sm font-medium">✓ Resposta rápida pelo WhatsApp</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
              >
                Projetos em Mármore e Granito que elevam o padrão do seu ambiente
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl"
              >
                Bancadas, escadas, lavatórios, revestimentos e soluções sob medida com acabamento
                refinado, instalação profissional e atendimento personalizado.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => window.open(whatsappUrl, '_blank')}
                  className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300"
                >
                  <WhatsAppIcon className="w-5 h-5 mr-2" />
                  Solicitar orçamento
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const section = document.getElementById('portfolio');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-lg px-8 py-6 rounded-xl border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary"
                >
                  Ver obras realizadas
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/15">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">Acabamento premium</span>
                  </div>
                  <p className="text-white/75 text-sm">Projetos sob medida com alto padrão visual.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/15">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">Atendimento próximo</span>
                  </div>
                  <p className="text-white/75 text-sm">Orientação personalizada em cada etapa.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/15">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                    <span className="text-white font-semibold">Clientes satisfeitos</span>
                  </div>
                  <p className="text-white/75 text-sm">Qualidade reconhecida em Piracicaba e região.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold uppercase tracking-[0.2em] mb-3">
                Soluções sob medida
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Serviços especializados em mármore e granito
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Do projeto à instalação, entregamos peças sob medida com sofisticação, resistência e
                acabamento impecável para transformar qualquer ambiente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold uppercase tracking-[0.2em] mb-3">
                Obras realizadas
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Veja alguns projetos executados
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Imagens reais adicionadas direto pelo cliente, mostrando a qualidade do acabamento e
                a variedade de soluções que entregamos.
              </p>
            </div>

            {visiblePortfolioItems.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {visiblePortfolioItems.map((item, index) => (
                    <PortfolioCard
                      key={`${item.id || item.title}-${portfolioIndex}-${index}`}
                      image={item.url}
                      title={item.title}
                      description={item.description}
                      index={index}
                    />
                  ))}
                </div>

                {portfolioImages.length > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePortfolioPrev}
                      className="rounded-full w-12 h-12 p-0 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                      {portfolioImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setPortfolioIndex(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === portfolioIndex ? 'w-8 bg-primary' : 'w-2.5 bg-primary/25'
                          }`}
                          aria-label={`Ir para obra ${index + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePortfolioNext}
                      className="rounded-full w-12 h-12 p-0 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-muted/60 p-8 text-center text-muted-foreground">
                Nenhuma obra cadastrada ainda.
              </div>
            )}
          </div>
        </section>

        <section id="catalog" className="py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Catálogo</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Veja materiais, cores e pedras que podem ser adicionados pelo cliente conforme o
                catálogo crescer.
              </p>
            </div>

            {visibleCatalogItems.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {visibleCatalogItems.map((item, index) => (
                    <motion.div
                      key={`${item.id || item.title}-${catalogIndex}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                          <Gem className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed flex-grow">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {catalogItems.length > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCatalogPrev}
                      className="rounded-full w-12 h-12 p-0 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                      {catalogItems.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCatalogIndex(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === catalogIndex ? 'w-8 bg-primary' : 'w-2.5 bg-primary/25'
                          }`}
                          aria-label={`Ir para item ${index + 1} do catálogo`}
                        />
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCatalogNext}
                      className="rounded-full w-12 h-12 p-0 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center text-muted-foreground border border-border">
                Nenhum item de catálogo cadastrado ainda.
              </div>
            )}

            <div className="mt-12 bg-primary rounded-3xl p-8 md:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
                  Atendimento personalizado
                </p>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Solicite o catálogo completo no WhatsApp
                </h3>
                <p className="text-white/80 max-w-2xl">
                  Envie seu projeto, tire dúvidas sobre materiais e receba orientação para escolher
                  o melhor acabamento.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg w-full sm:w-auto"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Ver catálogo
              </Button>
            </div>
          </div>
        </section>

        <section id="differentials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Por que escolher a Marmoraria Nível?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  Nosso compromisso é entregar não apenas pedras, mas a realização do seu sonho com
                  a máxima qualidade e segurança que só décadas de experiência podem oferecer.
                </p>
                <div className="space-y-4">
                  {differentials.map((diff, index) => (
                    <DifferentialCard key={index} title={diff} index={index} />
                  ))}
                </div>
                <div className="mt-10">
                  <Button
                    size="lg"
                    onClick={() => window.open(whatsappUrl, '_blank')}
                    className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    Solicitar orçamento
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1582913130063-8318329a94a3"
                    alt="Detalhe de acabamento em mármore"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-border/50 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-accent fill-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Qualidade Garantida</p>
                      <p className="text-sm text-muted-foreground">Em todos os projetos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full font-bold mb-6">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ⭐ 4.9 de média de satisfação
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                O que nossos clientes dizem
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A satisfação de quem já confiou no nosso trabalho é a nossa maior garantia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  initials={testimonial.initials}
                  quote={testimonial.quote}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button
                size="lg"
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Fale no WhatsApp
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1608635661512-52c656e0d4e5')] bg-cover bg-center mix-blend-overlay"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Fale com um especialista agora pelo WhatsApp
            </h2>
            <p className="text-xl text-blue-100 mb-10 font-medium">
              Orçamento sem compromisso • Resposta imediata
            </p>
            <Button
              size="lg"
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="bg-white text-primary hover:bg-gray-100 text-xl px-10 py-8 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 active:scale-[0.98] w-full sm:w-auto font-bold"
            >
              <WhatsAppIcon className="w-7 h-7 mr-3" />
              Atendimento rápido no WhatsApp
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;