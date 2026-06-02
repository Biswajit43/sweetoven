import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  'Pending': '#F59E0B', 'Confirmed': '#22C55E', 'Preparing': '#3B82F6',
  'Out for Delivery': '#8B5CF6', 'Delivered': '#06B6D4', 'Cancelled': '#EF4444'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [selected, setSelected] = useState(null);
  const [counts, setCounts] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders');
      setOrders(data);
      const c = {};
      data.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
      setCounts(c);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status, paymentStatus) => {
    try {
      const payload = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.paymentStatus = paymentStatus;
      await axios.put(`/api/orders/${orderId}/status`, payload);
      toast.success('Order updated!');
      fetchOrders();
      if (selected?._id === orderId) {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        setSelected(data);
      }
    } catch (err) { toast.error('Update failed'); }
  };

  const filtered = activeStatus === 'All' ? orders : orders.filter(o => o.status === activeStatus);

  const statusCount = (s) => orders.filter(o => o.status === s).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 24, alignItems: 'start' }}>
      {/* Orders List */}
      <div>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {STATUSES.map(s => {
            const count = s === 'All' ? orders.length : statusCount(s);
            return (
              <button key={s} onClick={() => setActiveStatus(s)} style={{
                padding: '6px 14px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                background: activeStatus === s ? (STATUS_COLORS[s] || '#E91E7A') : 'white',
                color: activeStatus === s ? 'white' : '#374151',
                boxShadow: '0 2px 6px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 6
              }}>
                {s}
                {count > 0 && <span style={{ background: activeStatus === s ? 'rgba(255,255,255,0.3)' : '#F3F4F6', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>{count}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Order ID', 'Customer', 'Cake', 'Amount', 'Payment', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading orders...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>No orders found</td></tr>
                ) : filtered.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', background: selected?._id === order._id ? '#FFF0F7' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (selected?._id !== order._id) e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { if (selected?._id !== order._id) e.currentTarget.style.background = 'transparent'; }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{order.orderId}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>
                      <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.cakeName}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#E91E7A', whiteSpace: 'nowrap' }}>₹{order.totalAmount}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#F3F4F6', padding: '3px 8px', borderRadius: 8, fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 2 }}>{order.paymentMethod || 'Pending'}</span>
                      <span style={{ fontSize: 10, color: order.paymentStatus === 'Payment Received' ? '#22C55E' : '#F59E0B' }}>{order.paymentStatus}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={{
                        border: `1.5px solid ${STATUS_COLORS[order.status]}`, borderRadius: 8, padding: '4px 8px',
                        fontSize: 12, color: STATUS_COLORS[order.status], fontWeight: 600,
                        background: `${STATUS_COLORS[order.status]}11`, cursor: 'pointer'
                      }}>
                        {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => setSelected(selected?._id === order._id ? null : order)} style={{
                        background: '#FFF0F7', border: 'none', width: 32, height: 32, borderRadius: 8,
                        cursor: 'pointer', color: '#E91E7A', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Panel */}
      {selected && (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'sticky', top: 80 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF0F7' }}>
            <div>
              <div style={{ fontSize: 11, color: '#E91E7A', fontWeight: 700, textTransform: 'uppercase' }}>Order Request Received</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>🔔 New Order Request from Website</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><FiX size={18} /></button>
          </div>
          <div style={{ padding: 24 }}>
            {[
              ['Customer Name', selected.customerName],
              ['Phone', selected.phone],
              ['Cake', `${selected.cakeName} (${selected.weight})`],
              ['Delivery Date', `${new Date(selected.deliveryDate).toLocaleDateString('en-IN')}, ${selected.deliveryTime}`],
              ['Address', selected.deliveryAddress],
              ['Total Amount', `₹${selected.totalAmount}`],
              ['Payment', `${selected.paymentMethod || 'Pending'} · ${selected.paymentStatus}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: '#9CA3AF', minWidth: 120 }}>{label}</span>
                <span style={{ fontWeight: 500, textAlign: 'right', flex: 1, marginLeft: 12 }}>{val}</span>
              </div>
            ))}

            {selected.orderNote && (
              <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>
                Note: {selected.orderNote}
              </div>
            )}

            {selected.paymentScreenshot && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Payment Screenshot:</div>
                <img src={selected.paymentScreenshot} alt="Payment" style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'contain', background: '#F9FAFB' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => updateStatus(selected._id, 'Confirmed', 'Payment Pending')} className="btn-primary" style={{ flex: 1, padding: 10, fontSize: 13 }}>
                ✅ Approve & Send Payment Options
              </button>
            </div>
            {selected.paymentStatus !== 'Payment Received' && (
              <button onClick={() => updateStatus(selected._id, undefined, 'Payment Received')} className="btn-outline" style={{ width: '100%', marginTop: 8, padding: 10, fontSize: 13 }}>
                💰 Mark Payment Received
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
