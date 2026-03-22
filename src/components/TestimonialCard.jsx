
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TestimonialCard = ({ name, initials, quote, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-foreground/80 text-lg leading-relaxed mb-8 flex-grow font-medium">
        "{quote}"
      </p>
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
        <Avatar className="w-12 h-12 rounded-full border-2 border-primary/10">
          <AvatarFallback className="bg-primary text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <span className="font-bold text-foreground block">{name}</span>
          <span className="text-sm text-muted-foreground">Cliente Verificado</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
