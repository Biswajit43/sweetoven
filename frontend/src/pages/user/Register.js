import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length < 10) return toast.error('Enter valid phone number');
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) { toast.success('Account created! Welcome 🎂'); navigate('/'); }
    else toast.error(result.message);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F7 0%, #FFF8F0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h1 style={{ fontSize: 32 }}>Create Account</h1>
          <p style={{ color: '#9CA3AF', marginTop: 8 }}>Join SweetOven today</p>
        </div>
        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            {[
              ['name', 'Full Name', 'text', 'John Doe'],
              ['email', 'Email Address', 'email', 'you@example.com'],
              ['phone', 'Phone Number', 'tel', '9876543210'],
              ['password', 'Password', 'password', '••••••••'],
            ].map(([key, label, type, placeholder]) => (
              <div key={key} style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8, color: '#374151' }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 10 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
            Already have an account? <Link to="/login" style={{ color: '#E91E7A', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
