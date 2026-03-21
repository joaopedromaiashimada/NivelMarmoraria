
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServiceCard = ({ icon: Icon, title, description, index }) => {
  const whatsappUrl = "https://wa.me/5519974214415?text=Gostaria%20de%20um%20or%C3%A7amento!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border/50 flex flex-col h-full group"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3 text-balance leading-snug">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
        {description}
      </p>
      <Button 
        onClick={() => window.open(whatsappUrl, '_blank')}
        variant="outline"
        className="w-full mt-auto border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Solicitar orçamento
      </Button>
    </motion.div>
  );
};

export default ServiceCard;
