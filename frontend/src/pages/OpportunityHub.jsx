import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, ExternalLink, Filter, Briefcase, Code, Bookmark, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Recommended', 'Internships', 'Hackathons', 'Full-time Jobs', 'Virtual Internships', 'Scholarships'];

export default function OpportunityHub() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view opportunities');
      navigate('/login');
      return;
    }
    
    // Fetch user profile to get saved jobs
    fetch('${import.meta.env.VITE_API_URL || ''}/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.savedOpportunities) {
        setSavedJobs(data.savedOpportunities);
      }
    })
    .catch(err => console.error(err));

    if (activeTab === 'Recommended') {
      fetchRecommendations(token);
    } else {
      fetchOpportunities(token);
    }
  }, [activeTab, navigate]);

  const fetchOpportunities = async (token) => {
    setLoading(true);
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL || ''}/api/opportunities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      } else {
        toast.error('Failed to fetch live opportunities');
      }
    } catch (err) {
      toast.error('Network error fetching opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (token) => {
    setLoading(true);
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL || ''}/api/users/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      } else {
        toast.error('Failed to fetch recommendations');
      }
    } catch (err) {
      toast.error('Network error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (id) => {
    const token = localStorage.getItem('token');
    
    // Optimistic UI update
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(jobId => jobId !== id));
      toast.success('Removed from saved');
    } else {
      setSavedJobs([...savedJobs, id]);
      toast.success('Opportunity saved!');
    }

    try {
      await fetch('${import.meta.env.VITE_API_URL || ''}/api/users/bookmarks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ itemId: id, type: 'opportunity' })
      });
    } catch (err) {
      console.error('Failed to sync bookmark to server');
    }
  };

  const filteredOps = opportunities.filter(op => {
    const matchesTab = activeTab === 'All' || op.category === activeTab;
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          op.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Opportunity Hub</h1>
            <p className="text-gray-400">Discover internships, jobs, and hackathons tailored for you.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text"
                placeholder="Search 'AI Internship' or 'React'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="bg-slate-900 border border-white/10 p-2.5 rounded-xl hover:bg-slate-800 transition-colors">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === category 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-900 text-gray-400 border border-white/5 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-1 lg:col-span-2 text-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading live opportunities...</p>
            </div>
          ) : (
            <>
              {filteredOps.map((op, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={op.id}
              className="glass-dark border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-2 flex items-center justify-center border border-white/10">
                    <span className="text-xl font-bold text-blue-400">{op.company ? op.company.charAt(0) : 'C'}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{op.title}</h3>
                    <p className="text-gray-400 font-medium">
                      {op.company} 
                      {op.verified && (
                        <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded ml-2 border border-blue-500/20">Official Portal</span>
                      )}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSave(op.id || op._id)}
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {savedJobs.includes(op.id || op._id) ? <BookmarkCheck className="w-6 h-6 text-blue-500" /> : <Bookmark className="w-6 h-6" />}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Briefcase className="w-4 h-4 text-purple-400" /> {op.category || 'Job'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <DollarSign className="w-4 h-4 text-green-400" /> {op.stipend || 'Not disclosed'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-red-400" /> <span className="truncate">{op.location || 'Remote'}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {op.skills && op.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-1 border border-white/5">
                      <Code className="w-3 h-3" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-white/10 gap-4">
                <div className="text-xs text-gray-500">
                  Posted: {op.createdAt ? new Date(op.createdAt).toLocaleDateString() : 'Today'} • Expires: <span className="text-red-400">{op.expirationDate ? new Date(op.expirationDate).toLocaleDateString() : 'Rolling'}</span>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  <a 
                    href={op.applyLink || op.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    Apply on {op.source || 'Official Portal'} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredOps.length === 0 && !loading && (
            <div className="col-span-1 lg:col-span-2 text-center py-20">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No current opportunities found. Please check again later.</h3>
              <p className="text-gray-400">Try adjusting your search filters or keywords.</p>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
