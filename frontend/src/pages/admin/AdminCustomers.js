import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiUser, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orderCounts, setOrderCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cusRes, ordRes] = await Promise.all([
          axios.get('/api/admin/customers'),
          axios.get('/api/orders')
        ]);
        setCustomers(cusRes.data);
        const counts = {};
        ordRes.data.forEach(o => {
          const uid = o.user?._id || o.user;
          counts[uid] = (counts[uid] || 0) + 1;
        });
        setOrderCounts(counts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Customers</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2 }}>{customers.length} registered customers</p>
        </div>
        <div style={{ position: 'relative', width: 280 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..."
            style={{ paddingLeft: 38, borderRadius: 50 }} />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Customers', value: customers.length, icon: '👥', color: '#E91E7A' },
          { label: 'Active This Month', value: customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: '📈', color: '#22C55E' },
          { label: 'With Orders', value: Object.keys(orderCounts).length, icon: '🎂', color: '#3B82F6' }
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Loading customers...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Customer', 'Email', 'Phone', 'Orders', 'Joined', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>No customers found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                          {c.name[0].toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280' }}>{c.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280' }}>{c.phone}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#FFF0F7', color: '#E91E7A', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {orderCounts[c._id] || 0} orders
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#9CA3AF' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
