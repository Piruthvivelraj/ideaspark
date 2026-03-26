import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import IdeaCard from '../components/IdeaCard';
import toast from 'react-hot-toast';
import { RefreshCw, RotateCcw, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    id: 'domain',
    question: 'Which domain are you interested in?',
    emoji: '🎯',
    options: [
      { label: 'Artificial Intelligence', icon: '🤖' },
      { label: 'Web Development', icon: '🌐' },
      { label: 'IoT', icon: '📡' },
      { label: 'Mobile Application Development', icon: '📱' },
      { label: 'Cybersecurity', icon: '🔐' },
      { label: 'Other', icon: '✏️', isOther: true },
    ],
  },
  {
    id: 'difficulty',
    question: "What's your experience level?",
    emoji: '📊',
    options: [
      { label: 'Beginner', icon: '🌱', desc: 'Just starting out' },
      { label: 'Intermediate', icon: '🔥', desc: 'Some experience' },
      { label: 'Advanced', icon: '🚀', desc: 'Confident coder' },
      { label: 'Any', icon: '✨', desc: 'Show me everything' },
    ],
  },
  {
    id: 'goal',
    question: "What's your main goal with this project?",
    emoji: '🏆',
    options: [
      { label: 'Learn New Skills', icon: '📚', desc: 'Grow my knowledge' },
      { label: 'Build a Portfolio', icon: '💼', desc: 'Impress recruiters' },
      { label: 'Win a Competition', icon: '🥇', desc: 'Hackathon / contest' },
      { label: 'Solve a Real Problem', icon: '💡', desc: 'Make an impact' },
      { label: 'Other', icon: '✏️', isOther: true },
    ],
  },
  {
    id: 'team',
    question: 'Are you working solo or in a team?',
    emoji: '👥',
    options: [
      { label: 'Solo', icon: '🧑‍💻', desc: 'Just me' },
      { label: 'Small Team (2–3)', icon: '👫', desc: '2 to 3 people' },
      { label: 'Large Team (4+)', icon: '👨‍👩‍👧‍👦', desc: '4 or more people' },
    ],
  },
  {
    id: 'timeline',
    question: "What's your project timeline?",
    emoji: '⏱️',
    options: [
      { label: '1–3 Days', icon: '⚡', desc: 'Hackathon sprint' },
      { label: '1–2 Weeks', icon: '📅', desc: 'Short project' },
      { label: '1 Month', icon: '🗓️', desc: 'Semester project' },
      { label: '3+ Months', icon: '🏗️', desc: 'Long-term build' },
      { label: 'Other', icon: '✏️', isOther: true },
    ],
  },
  {
    id: 'tech',
    question: 'Which technology are you most comfortable with?',
    emoji: '💻',
    options: [
      { label: 'Python', icon: '🐍', desc: 'ML, scripting, backend' },
      { label: 'JavaScript', icon: '🟨', desc: 'Web, Node, React' },
      { label: 'Java / Kotlin', icon: '☕', desc: 'Android, backend' },
      { label: 'C / C++', icon: '⚙️', desc: 'Systems, embedded' },
      { label: 'No Preference', icon: '🌈', desc: 'Open to anything' },
      { label: 'Other', icon: '✏️', isOther: true },
    ],
  },
  {
    id: 'output',
    question: 'What type of project output do you prefer?',
    emoji: '🖥️',
    options: [
      { label: 'Web Application', icon: '🌐', desc: 'Runs in a browser' },
      { label: 'Mobile App', icon: '📱', desc: 'iOS or Android' },
      { label: 'Hardware / IoT', icon: '🔌', desc: 'Physical device' },
      { label: 'ML / Data Model', icon: '🧠', desc: 'AI / analytics' },
      { label: 'Tool / Script', icon: '🛠️', desc: 'CLI or utility' },
      { label: 'Other', icon: '✏️', isOther: true },
    ],
  },
  {
    id: 'custom',
    question: 'Anything specific you have in mind?',
    emoji: '💬',
    isTextStep: true,
    placeholder: 'e.g. "A system that helps farmers track crop health using sensors and shows alerts on a mobile app"',
  },
];

export default function Home() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);
  const [otherInput, setOtherInput] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customText, setCustomText] = useState('');

  const submitAnswers = async (newAnswers) => {
    setDone(true);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        domain: newAnswers.domain || 'General',
        difficulty: newAnswers.difficulty || 'Any',
        goal: newAnswers.goal || '',
        team: newAnswers.team || '',
        timeline: newAnswers.timeline || '',
        tech: newAnswers.tech || '',
        output: newAnswers.output || '',
        custom: newAnswers.custom || '',
      });
      const { data } = await api.get(`/ideas/generate?${params}`);
      setIdeas(data.ideas);
    } catch {
      toast.error('Failed to generate ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (stepId, value) => {
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);
    setDirection(1);
    setShowOtherInput(false);
    setOtherInput('');

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAnswers(newAnswers);
    }
  };

  const handleOtherSubmit = () => {
    if (!otherInput.trim()) return;
    handleAnswer(step.id, otherInput.trim());
  };

  const handleTextStepSubmit = () => {
    const newAnswers = { ...answers, custom: customText.trim() };
    setAnswers(newAnswers);
    submitAnswers(newAnswers);
  };

  const handleSkipCustom = () => {
    const newAnswers = { ...answers, custom: '' };
    setAnswers(newAnswers);
    submitAnswers(newAnswers);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      setShowOtherInput(false);
      setOtherInput('');
      const prev = { ...answers };
      delete prev[steps[currentStep].id];
      setAnswers(prev);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const params = new URLSearchParams({
        domain: answers.domain || 'General',
        difficulty: answers.difficulty || 'Any',
        goal: answers.goal || '',
        team: answers.team || '',
        timeline: answers.timeline || '',
        tech: answers.tech || '',
        output: answers.output || '',
        custom: answers.custom || '',
      });
      const { data } = await api.get(`/ideas/generate?${params}`);
      setIdeas(data.ideas);
    } catch {
      toast.error('Failed to regenerate');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIdeas([]);
    setDone(false);
    setDirection(1);
    setShowOtherInput(false);
    setOtherInput('');
    setCustomText('');
  };

  const step = steps[currentStep];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${10 + i * 18}%`,
              top: `${5 + i * 16}%`,
              background: ['#6C63FF', '#FF6584', '#43E97B', '#FFD700', '#00BFFF'][i],
              filter: 'blur(80px)',
            }}
            animate={{ x: [0, 25, -15, 0], y: [0, -35, 20, 0] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">IdeaSpark</h1>
          <p className="text-gray-400 text-sm">
            Hey {user?.name?.split(' ')[0]} 👋 — answer a few questions and we'll find your perfect project
          </p>
        </motion.div>

        {/* Wizard */}
        {!done && (
          <>
            {/* Progress */}
            <div className="flex items-center gap-1.5 mb-8 justify-center">
              {steps.map((s, i) => (
                <motion.div
                  key={s.id}
                  animate={{ width: i === currentStep ? 32 : 8 }}
                  className={`h-2 rounded-full transition-colors duration-300 ${
                    i < currentStep ? 'bg-primary' :
                    i === currentStep ? 'bg-primary' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Answer tags */}
            {Object.keys(answers).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-5 justify-center"
              >
                {Object.entries(answers).filter(([, v]) => v).map(([key, val]) => (
                  <span key={key} className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                    {val}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Question card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="glass-card rounded-3xl p-8"
              >
                <div className="text-center mb-7">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="text-5xl mb-3 inline-block"
                  >
                    {step.emoji}
                  </motion.div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">{step.question}</h2>
                  <p className="text-gray-500 text-xs mt-1">
                    Question {currentStep + 1} of {steps.length}
                  </p>
                </div>

                {/* Free-text step (last step) */}
                {step.isTextStep ? (
                  <div className="flex flex-col gap-4">
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder={step.placeholder}
                      rows={4}
                      className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/60 resize-none"
                    />
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleTextStepSubmit}
                        disabled={!customText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary/20 border border-primary/40 text-white font-semibold hover:bg-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Generate My Ideas <ArrowRight className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSkipCustom}
                        className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                      >
                        Skip
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Option buttons */}
                    <div className={`grid gap-3 ${
                      step.options.length <= 3 ? 'grid-cols-3' :
                      step.options.length <= 4 ? 'grid-cols-2' :
                      'grid-cols-2 md:grid-cols-3'
                    }`}>
                      {step.options.map((opt, i) => (
                        <motion.button
                          key={opt.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          whileHover={{ scale: 1.04, y: -3 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (opt.isOther) {
                              setShowOtherInput(true);
                            } else {
                              handleAnswer(step.id, opt.label);
                            }
                          }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                            opt.isOther
                              ? 'border-dashed border-white/20 bg-white/3 hover:border-primary/50 hover:bg-primary/8'
                              : 'border-white/10 bg-white/5 hover:border-primary/60 hover:bg-primary/10'
                          }`}
                        >
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                            {opt.icon}
                          </span>
                          <span className="font-semibold text-sm text-white text-center leading-tight">
                            {opt.label}
                          </span>
                          {opt.desc && (
                            <span className="text-xs text-gray-500 text-center">{opt.desc}</span>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Other input — appears inline when "Other" is clicked */}
                    <AnimatePresence>
                      {showOtherInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={otherInput}
                              onChange={(e) => setOtherInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleOtherSubmit()}
                              placeholder={`Type your own ${step.id}...`}
                              className="flex-1 bg-white/5 border border-primary/40 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary"
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={handleOtherSubmit}
                              disabled={!otherInput.trim()}
                              className="px-4 py-2.5 rounded-xl bg-primary/20 border border-primary/40 text-white text-sm font-semibold hover:bg-primary/30 transition-colors disabled:opacity-40"
                            >
                              OK
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {currentStep > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleBack}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      ← Go back
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* Results */}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Summary + controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).filter(([, v]) => v).map(([key, val]) => (
                  <span
                    key={key}
                    className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full font-medium"
                  >
                    {val}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  More Ideas
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </motion.button>
              </div>
            </div>

            {/* Loading animation */}
            {loading && (
              <div className="flex flex-col items-center gap-6 py-20">
                <div className="relative w-16 h-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-2 border-secondary border-b-transparent"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Finding your perfect projects...</p>
                  <p className="text-gray-500 text-sm mt-1">Matching based on your answers</p>
                </div>
              </div>
            )}

            {/* Ideas grid */}
            {!loading && ideas.length > 0 && (
              <>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-500 text-sm mb-6 text-center"
                >
                  Found{' '}
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-primary font-bold text-lg inline-block"
                  >
                    {ideas.length}
                  </motion.span>{' '}
                  project ideas matched for you
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ideas.map((idea, i) => (
                    <IdeaCard key={idea.title} idea={idea} index={i} domain={answers.domain} />
                  ))}
                </div>
              </>
            )}

            {!loading && ideas.length === 0 && (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🤔
                </motion.div>
                <p className="text-gray-400">No ideas found for this combination.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-primary hover:underline text-sm flex items-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" /> Try different answers
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
