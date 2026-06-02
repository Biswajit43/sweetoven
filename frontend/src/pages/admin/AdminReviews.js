import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiStar } from 'react-icons/fi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/reviews');
      setReviews(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id, approve) => {
    try {
      await axios.put(`/api/reviews/${id}`, { isApproved: approve });
      toast.success(approve ? 'Review approved!' : 'Review rejected');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await axios.delete(`/api/reviews/${id}`); toast.success('Deleted'); fetchReviews(); }
    catch { toast.error('Failed'); }
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  const StarRow = ({ rating }) => (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <FiStar key={s} size={13} color={s <= rating ? '#F59E0B' : '#E5E7EB'} fill={s <= rating ? '#F59E0B' : 'none'} />
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Customer Reviews</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2 }}>{reviews.filter(r => !r.isApproved).length} pending approval</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: '8px 16px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: filter === val ? '#E91E7A' : 'white',
              color: filter === val ? 'white' : '#374151',
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)'
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Reviews', value: reviews.length, color: '#E91E7A', icon: '⭐' },
          { label: 'Pending', value: reviews.filter(r => !r.isApproved).length, color: '#F59E0B', icon: '⏳' },
          { label: 'Approved', value: reviews.filter(r => r.isApproved).length, color: '#22C55E', icon: '✅' }
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: 'white', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <h3>No reviews found</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(r => (
            <div key={r._id} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${r.isApproved ? '#22C55E' : '#F59E0B'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                    {r.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.user?.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>{r.user?.email} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <StarRow rating={r.rating} />
                      <span style={{ fontSize: 12, background: '#FFF0F7', color: '#E91E7A', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>
                        {r.cake?.name}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: r.isApproved ? '#DCFCE7' : '#FEF3C7', color: r.isApproved ? '#166534' : '#92400E' }}>
                    {r.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  {!r.isApproved && (
                    <button onClick={() => handleApprove(r._id, true)} style={{ width: 32, height: 32, borderRadius: 8, background: '#DCFCE7', border: 'none', cursor: 'pointer', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Approve">
                      <FiCheck size={15} />
                    </button>
                  )}
                  {r.isApproved && (
                    <button onClick={() => handleApprove(r._id, false)} style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF3C7', border: 'none', cursor: 'pointer', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reject">
                      <FiX size={15} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(r._id)} style={{ width: 32, height: 32, borderRadius: 8, background: '#FEE2E2', border: 'none', cursor: 'pointer', color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
