import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { number: '01', title: 'Create Profile', desc: 'Sign up and build your comprehensive career profile in minutes.' },
  { number: '02', title: 'Upload Resume', desc: 'Let our AI instantly analyze and optimize your resume for ATS.' },
  { number: '03', title: 'Get AI Recommendations', desc: 'Receive tailored matches for jobs, internships, and hackathons.' },
  { number: '04', title: 'Apply & Grow', desc: 'Apply with one click and track your progress to success.' },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-900 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            How It <span className="text-gradient">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto glass rounded-full flex items-center justify-center mb-6 relative z-10 border-blue-500/30 text-blue-400 font-bold text-xl">
                {step.number}
              </div>
              {/* Connecting line for desktop */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent -z-10" />
              )}
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
