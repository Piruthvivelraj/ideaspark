import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Bookmark, Zap, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card px-6 py-4 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <motion.div whileHover={{ rotate: 20 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Zap className="text-primary w-6 h-6" />
        </motion.div>
        <span className="font-bold text-xl gradient-text">IdeaSpark</span>
      </Link>

      {isAuth ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-base hidden sm:block">Hi, {user?.name} 👋</span>
          <Link
            to="/generate"
            className="flex items-center gap-1.5 text-base text-gray-300 hover:text-primary transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:block">Generate</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-base text-gray-300 hover:text-primary transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:block">Dashboard</span>
          </Link>
          <Link to="/saved"
            className="flex items-center gap-1.5 text-base text-gray-300 hover:text-primary transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:block">Saved</span>
          </Link>
          <Link to="/feedback"
            className="flex items-center gap-1.5 text-base text-gray-300 hover:text-primary transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:block">Feedback</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-base text-gray-300 hover:text-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10">
            Sign In
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #F472B6)' }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
