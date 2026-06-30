import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MonitorPlay, FileText, Navigation, ExternalLink, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DOMAINS = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Web Development', 
  'Android Development', 'Cybersecurity', 'Cloud Computing', 'DevOps', 
  'UI/UX', 'Blockchain', 'Game Development', 'IoT', 'AR/VR'
];

export default function LearningResources() {
  const [activeDomain, setActiveDomain] = useState('Web Development');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view resources');
      navigate('/login');
      return;
    }
    
    fetchResources(token, activeDomain);
  }, [activeDomain, navigate]);

  const fetchResources = async (token, domain) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/resources?domain=${encodeURIComponent(domain)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      } else {
        toast.error('Failed to fetch resources');
      }
    } catch (err) {
      toast.error('Network error fetching resources');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Domain Resources Hub</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Curated platforms, official documentation, GitHub repositories, and roadmaps to master your desired field.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Domain Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="glass-dark border border-white/10 rounded-2xl p-4 sticky top-24 max-h-[80vh] overflow-y-auto hide-scrollbar">
              <h3 className="text-lg font-bold text-white mb-4 px-2">Domains</h3>
              <div className="space-y-1">
                {DOMAINS.map(domain => (
                  <button
                    key={domain}
                    onClick={() => setActiveDomain(domain)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeDomain === domain 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className="w-full lg:w-3/4">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {activeDomain} Resources
            </h2>

            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading resources...</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={resource.id}
                    className="glass-dark border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-gray-300 flex items-center gap-1 border border-white/5">
                          {resource.category === 'Useful Platforms' && <MonitorPlay className="w-4 h-4 text-blue-400" />}
                          {resource.category === 'Official Documentation' && <FileText className="w-4 h-4 text-green-400" />}
                          {resource.category === 'Learning Roadmaps' && <Navigation className="w-4 h-4 text-purple-400" />}
                          {(!['Useful Platforms', 'Official Documentation', 'Learning Roadmaps'].includes(resource.category)) && <BookOpen className="w-4 h-4 text-gray-400" />}
                          {resource.category}
                        </span>
                        <button className="text-gray-500 hover:text-blue-400 transition-colors">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{resource.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                    </div>
                    
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mt-auto"
                    >
                      Visit Resource <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-dark border border-white/10 rounded-2xl">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No resources added yet</h3>
                <p className="text-gray-400 text-sm">We are currently curating the best resources for {activeDomain}. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
