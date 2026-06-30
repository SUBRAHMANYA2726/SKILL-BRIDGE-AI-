import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Briefcase, GraduationCap } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-animated">
      {/* Abstract blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 text-blue-300 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Introducing SkillBridge AI 2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Unlock Your Career <br className="hidden md:block" />
            <span className="text-gradient">With AI</span>
          </h1>
          
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Discover internships, jobs, hackathons, and personalized career guidance powered by state-of-the-art Artificial Intelligence.
          </p>
          
          <div className="mt-10 flex justify-center gap-4 flex-col sm:flex-row">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-2">
              Explore Opportunities
            </button>
          </div>
        </motion.div>

        {/* Floating Cards */}
        <div className="mt-20 relative h-[300px] hidden md:block">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/4 top-0 glass p-4 rounded-2xl flex items-center gap-4 w-64"
          >
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
              <Bot className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Resume Analysed</p>
              <p className="text-sm text-gray-400">Score: 92/100</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-1/4 top-10 glass p-4 rounded-2xl flex items-center gap-4 w-64"
          >
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">New Match</p>
              <p className="text-sm text-gray-400">Google Internship</p>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute left-1/3 bottom-0 glass p-4 rounded-2xl flex items-center gap-4 w-64"
          >
            <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Skill Gap Fixed</p>
              <p className="text-sm text-gray-400">React + Node.js</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
