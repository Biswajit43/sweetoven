import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back! 🎂');
      navigate(result.role === 'admin' ? '/admin' : '/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F7 0%, #FFF8F0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎂</div>
          <h1 style={{ fontSize: 32 }}>Welcome Back!</h1>
          <p style={{ color: '#9CA3AF', marginTop: 8 }}>Sign in to your SweetOven account</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8, color: '#374151' }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8, color: '#374151' }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            </div>
 
            {/* Quick fill for demo */}
            {/* <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button type="button" onClick={() => setForm({ email: 'admin@sweetoven.com', password: 'admin123' })} style={{ flex: 1, padding: '6px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#FFF8F0', fontSize: 12, color: '#6B7280', cursor: 'pointer' }}>
                👑 Try Admin
              </button>
            </div> */}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
            Don't have an account? <Link to="/register" style={{ color: '#E91E7A', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
