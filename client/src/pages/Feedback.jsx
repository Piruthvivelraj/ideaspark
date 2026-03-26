import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { MessageSquare, Bug, Lightbulb, HelpCircle, Send, CheckCircle } from 'lucide-react';

const types = [
  { label: 'General',         icon: <MessageSquare className="w-5 h-5" />, color: 'border-violet-500/40 bg-violet-500/10 text-violet-300' },
  { label: 'Bug Report',      icon: <Bug className="w-5 h-5" />,           color: 'border-red-500/40 bg-red-500/10 text-red-300' },
  { label: 'Feature Request', icon: <Lightbulb className="w-5 h-5" />,     color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300' },
  { label: 'Query',           icon: <HelpCircle className="w-5 h-5" />,    color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
];

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', type: 'General', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/feedback', form);
      setSubmitted(true);
      toast.success('Feedback submitted!');
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[['#8B5CF6','10%','15%'],['#F472B6','70%','20%'],['#34D399','50%','70%']].map(([color,x,y],i) => (
          <motion.div key={i} className="absolute rounded-full opacity-10"
            style={{ width: 400, height: 400, left: x, top
: y, background: color, filter: 'blur(100px)' }}
            animate={{ x: [0,20,-10,0], y: [0,-20,10,0] }}
            transition={{ duration: 12+i*3, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">We'd love your <span className="gradient-text">feedback</span></h1>
          <p className="text-gray-400 text-base">Got a query, found a bug, or have a suggestion? Let us know.</p>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-12 text-center">
            <motion.div animate={{ scale: [1,1.2,1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block text-6xl mb-6">🎉</motion.div>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thank you!</h2>
            <p className="text-gray-400">Your feedback has been received. We'll look into it shortly.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name:'', email:'', type:'General', message:'' }); }}
              className="mt-6 text-primary hover:underline text-sm">Submit another response</button>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 flex flex-col gap-6">

            {/* Feedback type */}
            <div>
              <label className="text-sm text-gray-400 mb-3 block">Type of feedback</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {types.map((t) => (
                  <button type="button" key={t.label}
                    onClick={() => setForm(f => ({ ...f, type: t.label }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      form.type === t.label ? t.color : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}>
                    {t.icon}
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Your Name</label>
                <input type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/60" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/60" />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Your Message</label>
              <textarea rows={5} placeholder="Describe your query, issue, or suggestion in detail..."
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary/60 resize-none" />
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #F472B6)' }}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><Send className="w-5 h-5" /> Submit Feedback</>
              )}
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
