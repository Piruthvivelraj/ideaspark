import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SavedIdeas from './pages/SavedIdeas';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Feedback from './pages/Feedback';

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuth } = useAuth();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuth ? <Navigate to="/generate" /> : <Login />} />
        <Route path="/register" element={isAuth ? <Navigate to="/generate" /> : <Register />} />
        {/* Protected routes */}
        <Route path="/generate" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedIdeas /></ProtectedRoute>} />
        <Route path="/project" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(108,99,255,0.3)' },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
