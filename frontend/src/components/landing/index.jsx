import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Opportunities from './Opportunities';

const CTA = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-blue-600/20 mix-blend-screen filter blur-[100px]" />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center glass p-12 rounded-3xl border border-blue-500/30">
      <h2 className="text-4xl font-extrabold text-white mb-6">Start Your Career Journey Today</h2>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Join thousands of students and professionals who are fast-tracking their careers with SkillBridge AI.
      </p>
      <button className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl">
        Create Free Account
      </button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 pt-16 pb-8 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2">
          <span className="font-bold text-2xl tracking-tight text-white mb-4 block">SkillBridge <span className="text-blue-500">AI</span></span>
          <p className="text-gray-400 max-w-sm mb-6">The ultimate AI-powered career platform connecting talent with opportunity.</p>
          <div className="flex gap-4 text-gray-400">
            {/* Social Icons Placeholders */}
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-blue-400">Features</a></li>
            <li><a href="#" className="hover:text-blue-400">Opportunities</a></li>
            <li><a href="#" className="hover:text-blue-400">Resume Builder</a></li>
            <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-blue-400">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SkillBridge AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Opportunities />
      <CTA />
      <Footer />
    </div>
  );
}
