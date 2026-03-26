import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Bookmark, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function SavedIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ideas/saved')
      .then(({ data }) => setIdeas(data))
      .catch(() => toast.error('Failed to load saved ideas'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ideas/saved/${id}`);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
      toast.success('Removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </Link>
          <div className="flex items-center gap-3">
            <Bookmark className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Saved Ideas</h1>
          </div>
          <p className="text-gray-400 text-sm mt-2">{ideas.length} idea{ideas.length !== 1 ? 's' : ''} saved</p>
        </motion.div>

        {loading && (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        )}

        {!loading && ideas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400">No saved ideas yet. Go generate some!</p>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline text-sm">
              Go to Generator →
            </Link>
          </motion.div>
        )}

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea, i) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card glow-hover rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white leading-tight">{idea.title}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium shrink-0 ${difficultyColors[idea.difficulty]}`}>
                    {idea.difficulty}
                  </span>
                </div>

                <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg w-fit">
                  {idea.domain}
                </span>

                <p className="text-gray-400 text-sm leading-relaxed">{idea.description}</p>

                <div className="flex flex-wrap gap-2">
                  {idea.techStack.map((tech) => (
                    <span key={tech} className="text-xs bg-white/5 text-gray-300 border border-white/10 px-2 py-1 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleDelete(idea._id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-secondary transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
