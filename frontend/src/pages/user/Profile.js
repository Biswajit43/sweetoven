import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/api/auth/profile', form);
      toast.success('Profile updated!');
    } catch (err) { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 32, marginBottom: 32 }}>My Profile</h1>
        <div className="card" style={{ padding: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px', background: '#FFF0F7', borderRadius: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
              <div style={{ color: '#9CA3AF', fontSize: 14 }}>{user?.email}</div>
            </div>
          </div>

          {[['name', 'Full Name', 'text'], ['phone', 'Phone Number', 'tel'], ['address', 'Default Address', 'text']].map(([key, label, type]) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8, color: '#374151' }}>{label}</label>
              {key === 'address' ? (
                <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} rows={3} placeholder="Enter your address" />
              ) : (
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              )}
            </div>
          ))}

          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
