import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const emptyForm = { code: '', discountType: 'percentage', discountValue: '', minOrderAmount: 0, maxDiscount: '', usageLimit: '', expiryDate: '', isActive: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/coupons');
      setCoupons(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ ...c, expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : '' }); setEditing(c._id); setShowModal(true); };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) return toast.error('Fill required fields');
    try {
      setSaving(true);
      const payload = { ...form, code: form.code.toUpperCase() };
      if (!payload.maxDiscount) delete payload.maxDiscount;
      if (!payload.usageLimit) delete payload.usageLimit;
      if (!payload.expiryDate) delete payload.expiryDate;
      if (editing) {
        await axios.put(`/api/coupons/${editing}`, payload);
        toast.success('Coupon updated!');
      } else {
        await axios.post('/api/coupons', payload);
        toast.success('Coupon created!');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try { await axios.delete(`/api/coupons/${id}`); toast.success('Deleted'); fetchCoupons(); }
    catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (c) => {
    try {
      await axios.put(`/api/coupons/${c._id}`, { isActive: !c.isActive });
      fetchCoupons();
      toast.success(`Coupon ${!c.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Coupons & Discounts</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2 }}>{coupons.filter(c => c.isActive).length} active coupons</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Loading...</div>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: 'white', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏷️</div>
          <h3 style={{ marginBottom: 8 }}>No coupons yet</h3>
          <p style={{ color: '#9CA3AF', marginBottom: 20 }}>Create your first discount coupon</p>
          <button onClick={openAdd} className="btn-primary">Create Coupon</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {coupons.map(c => (
            <div key={c._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', opacity: c.isActive ? 1 : 0.6 }}>
              {/* Coupon top strip */}
              <div style={{ background: c.isActive ? 'linear-gradient(135deg, #E91E7A, #FF6BAE)' : '#9CA3AF', padding: '20px 24px', position: 'relative' }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: 'white', fontFamily: 'monospace' }}>{c.code}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 }}>
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  {c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(c)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiEdit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Dashed divider */}
              <div style={{ borderTop: '2px dashed #F3F4F6', margin: '0 16px' }} />

              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, marginBottom: 14 }}>
                  <div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 2 }}>Min Order</div>
                    <div style={{ fontWeight: 600 }}>₹{c.minOrderAmount || 0}</div>
                  </div>
                  <div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 2 }}>Used / Limit</div>
                    <div style={{ fontWeight: 600 }}>{c.usedCount} / {c.usageLimit || '∞'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 2 }}>Expiry</div>
                    <div style={{ fontWeight: 600 }}>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN') : 'No expiry'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 2 }}>Status</div>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.isActive ? '#DCFCE7' : '#FEE2E2', color: c.isActive ? '#166534' : '#991B1B' }}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <button onClick={() => toggleActive(c)} style={{ width: '100%', padding: '8px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: c.isActive ? '#EF4444' : '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {c.isActive ? <><FiToggleRight size={16} /> Deactivate</> : <><FiToggleLeft size={16} /> Activate</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>{editing ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><FiX size={20} /></button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Coupon Code *</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SWEET10" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, letterSpacing: 2 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Discount Type *</label>
                  <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Discount Value *</label>
                  <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} placeholder={form.discountType === 'percentage' ? '10' : '100'} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Min Order Amount (₹)</label>
                  <input type="number" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="0" />
                </div>
                {form.discountType === 'percentage' && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Max Discount (₹)</label>
                    <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Optional" />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, marginBottom: 24 }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 16, height: 16 }} />
                Active (users can apply this coupon)
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 2 }}>
                  {saving ? 'Saving...' : editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
