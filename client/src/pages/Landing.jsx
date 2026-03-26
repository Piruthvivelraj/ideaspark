import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Layers, Brain, ShieldCheck, ArrowRight, Sparkles, Star, MessageSquare } from 'lucide-react';

const features = [
  { icon: <Brain className="w-6 h-6" />, title: 'AI-Powered Ideas', desc: 'Groq AI generates a unique project idea tailored exactly to your preferences in seconds.', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30' },
  { icon: <Layers className="w-6 h-6" />, title: '100+ Curated Projects', desc: 'Hand-picked ideas across 5 domains — AI, Web, IoT, Mobile, and Cybersecurity.', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
  { icon: <Zap className="w-6 h-6" />, title: 'Smart Matching', desc: 'Answer 8 quick questions and get ideas matched to your skill level, timeline, and goals.', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' },
  { icon: <ShieldCheck className="w-6 h-6" />, title: 'No Repeats Ever', desc: 'Already seen ideas are tracked per user so every session shows you something new.', color: 'from-green-500/20 to-teal-500/20 border-green-500/30' },
  { icon: <Sparkles className="w-6 h-6" />, title: 'Detailed Breakdown', desc: 'Every idea comes with tech stack, difficulty meter, project flow, and key features.', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
  { icon: <Star className="w-6 h-6" />, title: 'Save & Track', desc: 'Bookmark your favourite ideas and track your exploration on a personal dashboard.', color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30' },
];

const domains = [
  { icon: '🤖', label: 'Artificial Intelligence', count: 20 },
  { icon: '🌐', label: 'Web Development', count: 20 },
  { icon: '📡', label: 'IoT', count: 20 },
  { icon: '📱', label: 'Mobile Apps', count: 20 },
  { icon: '🔐', label: 'Cybersecurity', count: 20 },
];

const steps = [
  { num: '01', title: 'Create an Account', desc: 'Sign up in seconds — no credit card, no hassle.' },
  { num: '02', title: 'Answer 8 Questions', desc: 'Tell us your domain, skill level, goals, tech, and more.' },
  { num: '03', title: 'Get Matched Ideas', desc: 'AI + curated dataset finds your perfect project instantly.' },
  { num: '04', title: 'Build Something Great', desc: 'Save ideas, view full details, and start building.' },
];

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { color: '#8B5CF6', x: '10%', y: '15%', size: 500 },
            { color: '#F472B6', x: '70%', y: '10%', size: 400 },
            { color: '#34D399', x: '60%', y: '65%', size: 350 },
            { color: '#FBBF24', x: '5%',  y: '70%', size: 300 },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-[0.12]"
              style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: b.color, filter: 'blur(120px)' }}
              animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
              transition={{ duration: 14 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-violet-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" /> Powered by Groq AI + Curated Dataset
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Find Your Next{' '}
            <span className="gradient-text">Project Idea</span>
            <br />in Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            IdeaSpark helps students discover meaningful, achievable project ideas based on their
            domain, skill level, and goals — powered by AI and a curated library of 100+ ideas.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #F472B6)' }}
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl font-semibold text-gray-300 text-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: '100+', label: 'Project Ideas' },
              { value: '5', label: 'Domains' },
              { value: 'AI', label: 'Powered by Groq' },
              { value: '∞', label: 'Possibilities' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">From zero to idea in <span className="gradient-text">4 steps</span></h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.1}>
                <div className="relative glass-card rounded-2xl p-6 h-full group hover:border-primary/50 transition-colors">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-primary/40 to-transparent z-10" style={{ width: 'calc(100% - 2rem)', left: '90%' }} />
                  )}
                  <span className="text-4xl font-extrabold text-primary/20 group-hover:text-primary/40 transition-colors">{s.num}</span>
                  <h3 className="text-white font-bold text-lg mt-3 mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(80px)' }} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <p className="text-pink-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Everything you need to <span className="gradient-text">get started</span></h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`glass-card rounded-2xl p-6 h-full border bg-gradient-to-br ${f.color} cursor-default`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Domains</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">5 domains, <span className="gradient-text">100 ideas</span></h2>
            <p className="text-gray-400 mt-4 text-base">20 carefully curated project ideas in each domain, with more generated by AI every session.</p>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-4">
            {domains.map((d, i) => (
              <FadeIn key={d.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.06, y: -4 }}
                  className="glass-card rounded-2xl px-6 py-5 flex items-center gap-4 cursor-default min-w-[200px]"
                >
                  <span className="text-4xl">{d.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{d.label}</p>
                    <p className="text-gray-500 text-xs">{d.count} ideas</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEEDBACK TEASER ── */}
      <section className="py-16 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto glass-card rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Feedback</p>
              <h2 className="text-2xl font-extrabold text-white mb-2">Got a query or found a bug?</h2>
              <p className="text-gray-400 text-sm">We're always improving. Share your thoughts, report issues, or request features.</p>
            </div>
            <Link to="/feedback">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white border border-primary/40 bg-primary/15 hover:bg-primary/25 transition-colors">
                <MessageSquare className="w-5 h-5" /> Give Feedback
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center glass-card-bright rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(244,114,182,0.1))' }} />
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #8B5CF6, #F472B6, #34D399)' }} />
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6 inline-block"
            >
              💡
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to find your <span className="gradient-text">perfect project?</span>
            </h2>
            <p className="text-gray-300 text-base mb-8 max-w-xl mx-auto">
              Join students who use IdeaSpark to discover projects that match their skills and ambitions. It's free, fast, and fun.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(139,92,246,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #F472B6)' }}
              >
                Start for Free <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">© 2025 IdeaSpark — Built for students, by students.</p>
      </footer>

    </div>
  );
}
