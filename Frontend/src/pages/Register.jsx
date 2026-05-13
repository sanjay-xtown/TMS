import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { superAdminService } from '../services/api';
import { UserPlus, Mail, Lock, Loader2, User } from 'lucide-react';
import '../styles/App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side guard — trim so whitespace-only inputs are caught
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await superAdminService.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      if (res.data.success) {
        navigate('/login');
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      // Surface real backend message (e.g. "Email already registered")
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <UserPlus size={28} />
          </div>
          <h1>Create Admin</h1>
          <p>Get started with your bus tracking platform</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label>Username</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input 
                type="email" 
                placeholder="admin@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
