import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Zap, Globe, BarChart2, ArrowRight, Clock } from 'lucide-react';

const domainIcons = {
  'Artificial Intelligence': '🤖',
  'Web Development': '🌐',
  'IoT': '📡',
  'Mobile Application Development': '📱',
  'Cybersecurity': '🔐',
};

const difficultyColors = {
  Beginner: 'text-green-400 bg-green-500/10 border-green-500/20',
  Intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-2xl p-6 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-2xl font-bold text-white"
        >
          <CountUp to={value} />
        </motion.p>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}

function CountUp({ to }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let start = 0;
    const step = Math.ceil(to / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{count}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ideas/saved')
      .then(({ data }) => setSavedIdeas(data))
      .finally(() => setLoading(false));
  }, []);

  // Compute stats
  const totalSaved = savedIdeas.length;
  const domainsExplored = [...new Set(savedIdeas.map(i => i.domain))];
  const difficultyBreakdown = savedIdeas.reduce((acc, i) => {
    acc[i.difficulty] = (acc[i.difficulty] || 0) + 1;
    return acc;
  }, {});
  const recentIdeas = savedIdeas.slice(0, 5);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: `${5 + i * 25}%`,
              top: `${10 + i * 20}%`,
              background: ['#6C63FF', '#FF6584', '#43E97B', '#FFD700'][i],
              filter: 'blur(100px)',
            }}
            animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm">Here's your project idea activity at a glance.</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon="💡" label="Ideas Saved" value={totalSaved} color="bg-primary/20" delay={0.1} />
          <StatCard icon="🌐" label="Domains Explored" value={domainsExplored.length} color="bg-secondary/20" delay={0.2} />
          <StatCard icon="🌱" label="Beginner Ideas" value={difficultyBreakdown.Beginner || 0} color="bg-green-500/20" delay={0.3} />
          <StatCard icon="🚀" label="Advanced Ideas" value={difficultyBreakdown.Advanced || 0} color="bg-red-500/20" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent saved ideas */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-white">Recent Saved Ideas</h2>
              </div>
              <Link to="/saved" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="h-14 bg-white/5 rounded-xl"
                  />
                ))}
              </div>
            )}

            {!loading && recentIdeas.length === 0 && (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500 text-sm">No saved ideas yet.</p>
                <Link to="/" className="mt-3 inline-flex items-center gap-1 text-primary text-sm hover:underline">
                  <Zap className="w-3.5 h-3.5" /> Generate some ideas
                </Link>
              </div>
            )}

            <div className="space-y-3">
              {recentIdeas.map((idea, i) => (
                <motion.div
                  key={idea._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{domainIcons[idea.domain] || '💡'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{idea.title}</p>
                      <p className="text-xs text-gray-500">{idea.domain}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${difficultyColors[idea.difficulty]}`}>
                    {idea.difficulty}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Domains breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-white">Domains</h2>
              </div>
              {domainsExplored.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No domains yet</p>
              ) : (
                <div className="space-y-2">
                  {domainsExplored.map((domain, i) => {
                    const count = savedIdeas.filter(s => s.domain === domain).length;
                    const pct = Math.round((count / totalSaved) * 100);
                    return (
                      <motion.div
                        key={domain}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                      >
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300 flex items-center gap-1">
                            {domainIcons[domain]} {domain.split(' ')[0]}
                          </span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + i * 0.08 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-white">Quick Actions</h2>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm text-white font-medium">Generate Ideas</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </motion.div>
                </Link>
                <Link to="/saved">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white font-medium">Saved Ideas</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
