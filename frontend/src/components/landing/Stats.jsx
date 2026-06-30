import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, name: 'Students', value: '50,000+' },
  { id: 2, name: 'Opportunities', value: '10,000+' },
  { id: 3, name: 'Companies', value: '500+' },
  { id: 4, name: 'Success Rate', value: '95%' },
];

const Stats = () => {
  return (
    <section className="py-12 bg-slate-900 border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-extrabold text-white tracking-tight">
                <span className="text-gradient">{stat.value}</span>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-400">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
