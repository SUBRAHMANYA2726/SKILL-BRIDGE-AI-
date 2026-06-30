import React from 'react';
import { motion } from 'framer-motion';
import { Code, MapPin, DollarSign, Clock } from 'lucide-react';

const opportunities = [
  { type: 'Internship', role: 'Frontend Engineer Intern', company: 'TechNova', location: 'Remote', stipend: '$3k - $4k/mo', duration: '3 Months', tags: ['React', 'Tailwind'] },
  { type: 'Job', role: 'Full Stack Developer', company: 'CloudSync', location: 'San Francisco, CA', stipend: '$120k - $150k', duration: 'Full-time', tags: ['Node.js', 'MongoDB'] },
  { type: 'Hackathon', role: 'AI Innovation Challenge', company: 'Global AI Org', location: 'Online', stipend: '$50k Prize Pool', duration: '48 Hours', tags: ['AI/ML', 'OpenAI'] },
  { type: 'Scholarship', role: 'Women in Tech Grant', company: 'TechFoundation', location: 'Global', stipend: '$5,000', duration: '1 Year', tags: ['Diversity', 'Education'] },
];

const Opportunities = () => {
  return (
    <section id="opportunities" className="py-24 bg-slate-950 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Latest <span className="text-gradient">Opportunities</span>
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl">
              Hand-picked roles, hackathons, and programs matched to your profile.
            </p>
          </div>
          <button className="hidden sm:block text-blue-400 hover:text-blue-300 font-medium">
            View All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{opp.type}</span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{opp.role}</h3>
                  <p className="text-gray-400">{opp.company}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50">
                  <Code className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  <MapPin className="w-4 h-4" /> {opp.location}
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  <DollarSign className="w-4 h-4" /> {opp.stipend}
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  <Clock className="w-4 h-4" /> {opp.duration}
                </div>
              </div>

              <div className="flex gap-2">
                {opp.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-full border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Opportunities;
