import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import '../styles/App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        // Persist auth in context (and localStorage) atomically.
        // This guarantees ALL downstream components see fresh state.
        login(res.data);

        // Redirect to role-specific dashboard (as sent by backend).
        navigate(res.data.redirect || '/dashboard', { replace: true });
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <div className="auth-logo-badge">
            <LogIn size={28} />
          </div>
          <h1>Login</h1>
          <p>Sign in to manage your bus fleet</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
