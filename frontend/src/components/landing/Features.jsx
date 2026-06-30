import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Search, Target, Users, Zap } from 'lucide-react';

const features = [
  {
    name: 'AI Career Assistant',
    description: 'Get 24/7 personalized career advice and roadmap planning from our advanced AI.',
    icon: Brain,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    name: 'Resume Analyzer',
    description: 'Instantly score and improve your resume to pass ATS systems with ease.',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  {
    name: 'Internship Finder',
    description: 'Discover high-quality internships tailored to your specific skill set.',
    icon: Search,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    name: 'Skill Gap Analysis',
    description: 'Identify what skills you are missing for your dream job and how to learn them.',
    icon: Target,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10'
  },
  {
    name: 'Interview Preparation',
    description: 'Practice with AI-driven mock interviews and get real-time feedback.',
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    name: 'Personalized Recommendations',
    description: 'A smart feed that curates jobs, hackathons, and certifications just for you.',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-950 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Supercharge your career with <span className="text-gradient">AI Tools</span>
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Everything you need to land your dream role, packed into one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-2xl hover:border-blue-500/30 transition-colors group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.name}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
