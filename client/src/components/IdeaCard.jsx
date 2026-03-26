import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Bookmark, Copy, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const difficultyConfig = {
  Beginner:     { color: 'bg-green-500/25 text-green-300 border-green-400/40',  glow: 'rgba(74,222,128,0.2)' },
  Intermediate: { color: 'bg-yellow-500/25 text-yellow-300 border-yellow-400/40', glow: 'rgba(250,204,21,0.2)' },
  Advanced:     { color: 'bg-red-500/25 text-red-300 border-red-400/40',        glow: 'rgba(248,113,113,0.2)' },
};

function useTypewriter(text, speed = 14, start = false) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!start) return;
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, start, speed]);
  return displayed;
}

export default function IdeaCard({ idea, index, domain }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const description = useTypewriter(idea.description, 14, inView);
  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.Beginner;
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await api.post('/ideas/save', { ...idea, domain });
      setSaved(true);
      toast.success('Idea saved!');
    } catch (err) {
      if (err.response?.data?.message === 'Already saved') {
        toast('Already in your saved list', { icon: '📌' });
      } else {
        toast.error('Failed to save');
      }
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = `Project: ${idea.title}\nDomain: ${domain}\nDescription: ${idea.description}\nTech Stack: ${idea.techStack.join(', ')}\nDifficulty: ${idea.difficulty}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    navigate('/project', { state: { idea, domain } });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleCardClick}
      className="relative glass-card rounded-2xl p-6 flex flex-col gap-4 overflow-hidden cursor-pointer"
      style={{
        boxShadow: hovered
          ? `0 8px 40px ${diff.glow}, 0 0 0 1px rgba(139,92,246,0.4)`
          : '0 2px 20px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Animated top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, #8B5CF6, #F472B6, #34D399)' }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-3 right-3 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-primary/70" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {idea.aiGenerated && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.08 + 0.15 }}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/30 to-pink-500/30 border border-violet-400/40 text-violet-300 font-semibold w-fit"
            >
              ✨ AI Generated
            </motion.span>
          )}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.08 + 0.2 }}
            className="font-bold text-lg text-white leading-snug"
          >
            {idea.title}
          </motion.h3>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, delay: index * 0.08 + 0.3 }}
          className={`text-xs px-3 py-1 rounded-full border font-semibold shrink-0 ${diff.color}`}
        >
          {idea.difficulty}
        </motion.span>
      </div>

      {/* Typewriter description */}
      <p className="text-gray-300 text-base leading-relaxed min-h-[3.5rem]">
        {description}
        {inView && description.length < idea.description.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
          />
        )}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2">
        {idea.techStack.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.08 + 0.4 + i * 0.05 }}
            className="text-sm bg-primary/15 text-violet-300 border border-primary/30 px-3 py-1 rounded-lg font-medium"
          >
            {tech}
          </motion.span>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.08 + 0.5 }}
        className="flex items-center justify-between mt-auto pt-3 border-t border-white/10"
      >
        <div className="flex gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors ${
              saved ? 'text-accent cursor-default' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-accent text-accent' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
