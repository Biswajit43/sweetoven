import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiCreditCard } from 'react-icons/fi';

const STATUS_COLORS = {
  'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
  'Preparing': 'badge-preparing', 'Out for Delivery': 'badge-delivery',
  'Delivered': 'badge-delivered', 'Cancelled': 'badge-cancelled'
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/orders/my').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: '#9CA3AF', marginBottom: 32 }}>Track all your SweetOven orders</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 40 }}>🎂</div><p style={{ color: '#9CA3AF', marginTop: 12 }}>Loading orders...</p></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
            <h2 style={{ marginBottom: 8 }}>No orders yet</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>You haven't placed any orders yet</p>
            <button onClick={() => navigate('/cakes')} className="btn-primary">Browse Cakes</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div key={order._id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{order.orderId}</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.status] || 'badge-pending'}`}>{order.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                  {order.cake && <img src={order.cake.image} alt={order.cakeName} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{order.cakeName}</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF' }}>{order.weight} × {order.quantity}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                      🗓️ {new Date(order.deliveryDate).toLocaleDateString('en-IN')} · {order.deliveryTime}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
                  <div>
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>Payment: </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: order.paymentStatus === 'Payment Received' ? '#22C55E' : '#F59E0B' }}>{order.paymentStatus}</span>
                    {order.paymentMethod && order.paymentMethod !== 'Pending' && (
                      <span style={{ fontSize: 12, background: '#F3F4F6', padding: '2px 8px', borderRadius: 8, marginLeft: 8, color: '#6B7280' }}>{order.paymentMethod}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#E91E7A' }}>₹{order.totalAmount}</span>
                    {order.status === 'Confirmed' && order.paymentMethod === 'Pending' && (
                      <button onClick={() => navigate(`/payment/${order._id}`)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiCreditCard size={14} /> Pay Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <div style={{ marginTop: 16, display: 'flex', gap: 0 }}>
                  {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, i, arr) => {
                    const statuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
                    const currentIdx = statuses.indexOf(order.status);
                    const stepIdx = statuses.indexOf(step);
                    const done = stepIdx <= currentIdx;
                    return (
                      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {i > 0 && <div style={{ height: 2, flex: 1, background: done ? '#E91E7A' : '#E5E7EB' }} />}
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? '#E91E7A' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 700, flexShrink: 0 }}>
                            {done ? '✓' : i + 1}
                          </div>
                          {i < arr.length - 1 && <div style={{ height: 2, flex: 1, background: stepIdx < currentIdx ? '#E91E7A' : '#E5E7EB' }} />}
                        </div>
                        <div style={{ fontSize: 10, color: done ? '#E91E7A' : '#9CA3AF', marginTop: 4, textAlign: 'center', fontWeight: done ? 600 : 400 }}>{step}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
