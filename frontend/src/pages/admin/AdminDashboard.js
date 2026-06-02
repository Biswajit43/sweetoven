import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#1F2937' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
    </div>
  </div>
);

const STATUS_COLORS = {
  'Pending': '#F59E0B', 'Confirmed': '#22C55E', 'Preparing': '#3B82F6',
  'Out for Delivery': '#8B5CF6', 'Delivered': '#06B6D4', 'Cancelled': '#EF4444'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading dashboard...</div>;

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders} color="#E91E7A" />
        <StatCard icon="⏳" label="Pending" value={stats?.pendingOrders} color="#F59E0B" />
        <StatCard icon="✅" label="Confirmed" value={stats?.confirmedOrders} color="#22C55E" />
        <StatCard icon="👨‍🍳" label="Preparing" value={stats?.preparingOrders} color="#3B82F6" />
        <StatCard icon="🚚" label="Out for Delivery" value={stats?.outForDeliveryOrders} color="#8B5CF6" />
        <StatCard icon="🎉" label="Delivered" value={stats?.deliveredOrders} color="#06B6D4" />
        <StatCard icon="👥" label="Customers" value={stats?.totalUsers} color="#10B981" />
        <StatCard icon="🎂" label="Total Cakes" value={stats?.totalCakes} color="#F97316" />
        <StatCard icon="💰" label="Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} color="#E91E7A" sub="From delivered orders" />
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>Recent Orders</h3>
          <button onClick={() => navigate('/admin/orders')} style={{ fontSize: 13, color: '#E91E7A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Order ID', 'Customer', 'Cake', 'Amount', 'Payment', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFF0F7'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate('/admin/orders')}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 13, color: '#374151' }}>{order.orderId}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{order.user?.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{order.cakeName}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#E91E7A' }}>₹{order.totalAmount}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12 }}>
                    <span style={{ background: '#F3F4F6', padding: '3px 8px', borderRadius: 8, color: '#6B7280' }}>{order.paymentMethod || 'Pending'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: `${STATUS_COLORS[order.status]}22`,
                      color: STATUS_COLORS[order.status],
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600
                    }}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
