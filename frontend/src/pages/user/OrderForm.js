import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function OrderForm() {
  const { cakeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cake, setCake] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    deliveryDate: '', deliveryTime: '', deliveryAddress: user?.address || '', orderNote: ''
  });

  useEffect(() => {
    if (cakeId !== 'custom') {
      axios.get(`/api/cakes/${cakeId}`).then(r => setCake(r.data)).catch(() => navigate('/cakes'));
    }
  }, [cakeId]);

  const handleCoupon = async () => {
    if (!couponCode) return;
    try {
      const total = (cake?.price || 0) * quantity;
      const { data } = await axios.post('/api/coupons/validate', { code: couponCode, orderAmount: total });
      setCouponDiscount(data.discount);
      setCouponMsg(`✅ Coupon applied! You saved ₹${data.discount}`);
    } catch (err) {
      setCouponMsg(`❌ ${err.response?.data?.message || 'Invalid coupon'}`);
      setCouponDiscount(0);
    }
  };

  const handleSubmit = async () => {
    if (!form.deliveryDate || !form.deliveryTime || !form.deliveryAddress) {
      return toast.error('Please fill all required fields');
    }
    try {
      setLoading(true);
      const payload = {
        cakeId: cake?._id, cakeName: cake?.name,
        weight: cake?.weight || '1 Kg',
        quantity, price: cake?.price || 0,
        ...form, couponCode
      };
      const { data } = await axios.post('/api/orders', payload);
      toast.success('Order placed successfully!');
      navigate(`/payment/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const total = (cake?.price || 0) * quantity - couponDiscount;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Review Your Order</h1>
        <p style={{ color: '#9CA3AF', marginBottom: 32 }}>We will confirm your order and share payment options</p>

        <div style={{ display: 'grid', gap: 24 }}>
          {/* Cake Summary */}
          {cake && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: 18 }}>Selected Cake</h3>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <img src={cake.image} alt={cake.name} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{cake.name}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 14 }}>{cake.weight}</div>
                  <div style={{ color: '#E91E7A', fontWeight: 700, fontSize: 18, marginTop: 4 }}>₹{cake.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '8px 16px' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: '#F3F4F6', border: 'none', width: 28, height: 28, borderRadius: '50%', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ background: '#E91E7A', color: 'white', border: 'none', width: 28, height: 28, borderRadius: '50%', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Details */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 20, fontSize: 18 }}>Delivery Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Delivery Date *</label>
                <input type="date" value={form.deliveryDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({ ...form, deliveryDate: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Delivery Time *</label>
                <select value={form.deliveryTime} onChange={e => setForm({ ...form, deliveryTime: e.target.value })}>
                  <option value="">Select time slot</option>
                  {['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM', '5:00 PM - 7:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Delivery Address *</label>
              <textarea value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })}
                placeholder="Enter full delivery address..." rows={3} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Order Note (Optional)</label>
              <textarea value={form.orderNote} onChange={e => setForm({ ...form, orderNote: e.target.value })}
                placeholder="Any special instructions? (message on cake, flavor preference...)" rows={2} />
            </div>
          </div>

          {/* Coupon */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 18 }}>Coupon Code</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <input value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponMsg(''); }}
                placeholder="Enter coupon code" style={{ flex: 1 }} />
              <button onClick={handleCoupon} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>Apply</button>
            </div>
            {couponMsg && <p style={{ marginTop: 8, fontSize: 13, color: couponDiscount > 0 ? '#22C55E' : '#EF4444' }}>{couponMsg}</p>}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 18 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6B7280' }}>
                <span>Cake ({quantity} × ₹{cake?.price || 0})</span>
                <span>₹{(cake?.price || 0) * quantity}</span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#22C55E' }}>
                  <span>Coupon Discount</span><span>-₹{couponDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6B7280' }}>
                <span>Delivery</span><span style={{ color: '#22C55E' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 700, color: '#E91E7A', borderTop: '1px solid #F3F4F6', paddingTop: 12, marginTop: 4 }}>
                <span>Total Amount</span><span>₹{total}</span>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '14px', fontSize: 16 }}>
              {loading ? 'Placing Order...' : 'Request Order'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>
              We will confirm your order and share payment options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
