import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/opportunities/public')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOpportunities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch public opportunities', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="opportunities" className="py-24 bg-slate-950 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Latest <span className="text-gradient">Opportunities</span>
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl">
              Real, verified roles from official company portals fetched in real-time.
            </p>
          </div>
          <button onClick={() => navigate('/login')} className="hidden sm:block text-blue-400 hover:text-blue-300 font-medium">
            View All 10,000+ &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
             <div className="col-span-1 md:col-span-2 text-center py-10">
               <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : opportunities.length === 0 ? (
             <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-400">
               No current opportunities found. Please check again later.
             </div>
          ) : (
            opportunities.map((opp, i) => (
              <motion.div
                key={opp._id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
                onClick={() => opp.applyLink ? window.open(opp.applyLink, '_blank') : navigate('/login')}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{opp.category || 'Job'}</span>
                      <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{opp.title}</h3>
                      <p className="text-gray-400">{opp.company}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50">
                      <Code className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-400 gap-2">
                      <MapPin className="w-4 h-4" /> <span className="truncate">{opp.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 gap-2">
                      <DollarSign className="w-4 h-4" /> <span className="truncate">{opp.stipend || 'Competitive'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-wrap gap-2">
                    {opp.skills && opp.skills.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-full border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Opportunities;
