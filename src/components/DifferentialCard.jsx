
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const DifferentialCard = ({ title, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 flex items-center gap-4 group"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
        <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
        {title.replace('✓ ', '')}
      </h3>
    </motion.div>
  );
};

export default DifferentialCard;
