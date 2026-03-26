import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, Copy, CheckCircle, Layers, GitBranch, Cpu, Target } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const difficultyConfig = {
  Beginner:     { color: 'bg-green-500/25 text-green-300 border-green-400/40', bar: 'w-1/3 bg-green-400' },
  Intermediate: { color: 'bg-yellow-500/25 text-yellow-300 border-yellow-400/40', bar: 'w-2/3 bg-yellow-400' },
  Advanced:     { color: 'bg-red-500/25 text-red-300 border-red-400/40', bar: 'w-full bg-red-400' },
};

// Per-domain project flows and extended info
function getProjectDetails(title, domain, difficulty) {
  const flows = {
    default: [
      { step: 1, title: 'Project Setup', desc: 'Initialize the repository, set up the development environment, install dependencies, and configure version control.' },
      { step: 2, title: 'Design & Planning', desc: 'Define the system architecture, create wireframes or diagrams, plan the database schema, and break down tasks.' },
      { step: 3, title: 'Core Development', desc: 'Build the main features and business logic. Implement backend APIs and connect to the database.' },
      { step: 4, title: 'Frontend / Interface', desc: 'Build the user interface, connect it to the backend APIs, and ensure a smooth user experience.' },
      { step: 5, title: 'Testing & Debugging', desc: 'Write unit and integration tests, fix bugs, validate edge cases, and ensure the system is stable.' },
      { step: 6, title: 'Deployment & Demo', desc: 'Deploy the application, prepare a demo, write documentation, and present the final product.' },
    ],
  };

  const domainFeatures = {
    'Artificial Intelligence': [
      'Data collection and preprocessing pipeline',
      'Model training and evaluation',
      'Real-time inference API',
      'Performance metrics dashboard',
      'Model versioning and retraining',
    ],
    'Web Development': [
      'Responsive UI with modern design',
      'RESTful API with authentication',
      'Database CRUD operations',
      'Real-time updates with WebSockets',
      'Deployment with CI/CD pipeline',
    ],
    'IoT': [
      'Sensor data collection and transmission',
      'Real-time monitoring dashboard',
      'Alert and notification system',
      'Data logging and history',
      'Remote control interface',
    ],
    'Mobile Application Development': [
      'Cross-platform mobile UI',
      'Offline-first data storage',
      'Push notifications',
      'User authentication and profiles',
      'App store deployment',
    ],
    'Cybersecurity': [
      'Threat detection and analysis',
      'Secure data encryption',
      'Audit logging and reporting',
      'User access control',
      'Vulnerability assessment module',
    ],
  };

  const timeEstimates = {
    Beginner: '2–4 weeks',
    Intermediate: '4–8 weeks',
    Advanced: '8–16 weeks',
  };

  const teamSizes = {
    Beginner: '1–2 developers',
    Intermediate: '2–3 developers',
    Advanced: '3–5 developers',
  };

  return {
    flow: flows.default,
    features: domainFeatures[domain] || domainFeatures['Web Development'],
    timeEstimate: timeEstimates[difficulty] || '4–8 weeks',
    teamSize: teamSizes[difficulty] || '2–3 developers',
  };
}

export default function ProjectDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!state?.idea) {
    navigate('/');
    return null;
  }

  const { idea, domain } = state;
  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.Beginner;
  const details = getProjectDetails(idea.title, domain, idea.difficulty);

  const handleSave = async () => {
    try {
      await api.post('/ideas/save', { ...idea, domain });
      setSaved(true);
      toast.success('Idea saved!');
    } catch (err) {
      if (err.response?.data?.message === 'Already saved') {
        toast('Already saved', { icon: '📌' });
      } else {
        toast.error('Failed to save');
      }
    }
  };

  const handleCopy = () => {
    const text = `Project: ${idea.title}\nDomain: ${domain}\nDescription: ${idea.description}\nTech Stack: ${idea.techStack.join(', ')}\nDifficulty: ${idea.difficulty}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
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
              top: `${5 + i * 20}%`,
              background: ['#8B5CF6', '#F472B6', '#34D399', '#FBBF24'][i],
              filter: 'blur(100px)',
            }}
            animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/generate')}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 text-base group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Ideas
        </motion.button>

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-bright rounded-3xl p-8 mb-6 relative overflow-hidden"
        >
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, #8B5CF6, #F472B6, #34D399)' }} />

          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm bg-primary/20 text-violet-300 border border-primary/30 px-3 py-1 rounded-full font-medium">
                {domain}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${diff.color}`}>
                {idea.difficulty}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-colors ${
                  saved
                    ? 'bg-accent/20 text-accent border border-accent/30 cursor-default'
                    : 'bg-primary/20 text-violet-300 border border-primary/30 hover:bg-primary/30'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-accent' : ''}`} />
                {saved ? 'Saved' : 'Save Idea'}
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            {idea.title}
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed">{idea.description}</p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: <Target className="w-5 h-5" />, label: 'Difficulty', value: idea.difficulty },
              { icon: <Cpu className="w-5 h-5" />, label: 'Domain', value: domain.split(' ')[0] },
              { icon: <GitBranch className="w-5 h-5" />, label: 'Timeline', value: details.timeEstimate },
              { icon: <Layers className="w-5 h-5" />, label: 'Team Size', value: details.teamSize },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-white/8 rounded-2xl p-4 flex flex-col gap-1"
              >
                <div className="text-primary">{stat.icon}</div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white font-semibold text-base">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Flow + Features */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Project Flow */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Project Flow</h2>
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30" />

                <div className="space-y-6">
                  {details.flow.map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex gap-5 relative"
                    >
                      {/* Step circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.4 + i * 0.1 }}
                        className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center shrink-0 z-10"
                      >
                        <span className="text-primary font-bold text-sm">{item.step}</span>
                      </motion.div>

                      <div className="pb-2">
                        <h3 className="text-white font-semibold text-base mb-1">{item.title}</h3>
                        <p className="text-gray-300 text-base leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-white">Key Features</h2>
              </div>
              <div className="space-y-3">
                {details.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <p className="text-gray-200 text-base">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Tech Stack + Difficulty */}
          <div className="flex flex-col gap-6">
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-bold text-white">Tech Stack</h2>
              </div>
              <div className="flex flex-col gap-2">
                {idea.techStack.map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.07 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-violet-200 font-medium text-base">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Difficulty meter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="glass-card rounded-2xl p-7"
            >
              <h2 className="text-xl font-bold text-white mb-5">Difficulty Level</h2>
              <div className="flex flex-col gap-4">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <div key={level}>
                    <div className="flex justify-between mb-1.5">
                      <span className={`text-sm font-medium ${idea.difficulty === level ? 'text-white' : 'text-gray-500'}`}>
                        {level}
                      </span>
                      {idea.difficulty === level && (
                        <span className="text-xs text-primary font-semibold">← Your level</span>
                      )}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: level === 'Beginner' ? '33%' : level === 'Intermediate' ? '66%' : '100%',
                        }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          idea.difficulty === level
                            ? level === 'Beginner' ? 'bg-green-400' : level === 'Intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                            : 'bg-white/20'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
