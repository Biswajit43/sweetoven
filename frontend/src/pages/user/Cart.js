import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: '#9CA3AF', marginBottom: 24 }}>Browse our cakes and place an order directly</p>
        <button onClick={() => navigate('/cakes')} className="btn-primary">Browse Cakes</button>
      </div>
    </div>
  );
}
