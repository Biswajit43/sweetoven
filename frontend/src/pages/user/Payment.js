import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => navigate('/my-orders'));
  }, [orderId]);

  const handleSubmit = async () => {
    if (!method) return toast.error('Please select payment method');
    if (method === 'UPI' && !screenshot) return toast.error('Please upload payment screenshot');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('paymentMethod', method);
      if (screenshot) formData.append('screenshot', screenshot);
      await axios.put(`/api/orders/${orderId}/payment`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Payment submitted! Your order is being processed.');
      navigate('/my-orders');
    } catch (err) {
      toast.error('Failed to submit payment');
    } finally { setLoading(false); }
  };

  if (!order) return <div style={{ textAlign: 'center', padding: 80 }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        {order.status === 'Pending' ? (
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Order Pending Confirmation</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>Your order has been placed. The admin will confirm it shortly and you'll be able to make payment.</p>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>Order ID: <strong>{order.orderId}</strong></p>
            <button onClick={() => navigate('/my-orders')} className="btn-primary">View My Orders</button>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 28, marginBottom: 8 }}>Order Confirmed! 🎉</h2>
              <p style={{ color: '#9CA3AF' }}>Your order has been approved by SweetOven</p>
            </div>

            <h3 style={{ fontSize: 20, marginBottom: 20, textAlign: 'center' }}>Choose Payment Method</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* UPI */}
              <div className="card" onClick={() => setMethod('UPI')} style={{
                padding: 24, cursor: 'pointer', border: `2px solid ${method === 'UPI' ? '#E91E7A' : '#F3F4F6'}`,
                borderRadius: 16, transition: 'all 0.2s', transform: method === 'UPI' ? 'scale(1.02)' : ''
              }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#E91E7A', marginBottom: 12 }}>UPI Payment</div>
                  <div style={{ width: 100, height: 100, background: '#F3F4F6', borderRadius: 12, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                    📱
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>SweetOven UPI ID</div>
                  <div style={{ fontWeight: 700, color: '#374151' }}>sweetoven@upi</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  {['GPay', 'PhonePe', 'Paytm'].map(p => (
                    <span key={p} style={{ fontSize: 10, background: '#F3F4F6', padding: '3px 8px', borderRadius: 8, color: '#6B7280' }}>{p}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>After payment, upload payment screenshot</div>
              </div>

              {/* COD */}
              <div className="card" onClick={() => setMethod('COD')} style={{
                padding: 24, cursor: 'pointer', border: `2px solid ${method === 'COD' ? '#E91E7A' : '#F3F4F6'}`,
                borderRadius: 16, transition: 'all 0.2s', textAlign: 'center', transform: method === 'COD' ? 'scale(1.02)' : ''
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Cash on Delivery</div>
                <div style={{ fontSize: 60, marginBottom: 12 }}>🚚</div>
                <div style={{ fontWeight: 600, color: '#374151', marginBottom: 8 }}>Pay when your order is delivered to you.</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Cash / UPI accepted at the time of delivery.</div>
              </div>
            </div>

            {/* Amount */}
            <div className="card" style={{ padding: 20, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Total Amount to Pay</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#E91E7A' }}>₹{order.totalAmount}</span>
            </div>

            {/* Screenshot upload for UPI */}
            {method === 'UPI' && (
              <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 12 }}>Upload Payment Screenshot *</label>
                <div style={{ border: '2px dashed #E91E7A', borderRadius: 12, padding: 24, textAlign: 'center', background: '#FFF0F7', cursor: 'pointer' }}
                  onClick={() => document.getElementById('ss-upload').click()}>
                  {screenshot ? (
                    <div>
                      <div style={{ color: '#22C55E', fontWeight: 600 }}>✅ {screenshot.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Click to change</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                      <div style={{ color: '#E91E7A', fontWeight: 600 }}>Upload Screenshot</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>PNG, JPG up to 5MB</div>
                    </div>
                  )}
                </div>
                <input id="ss-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setScreenshot(e.target.files[0])} />
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading || !method} className="btn-primary" style={{ width: '100%', padding: 16, fontSize: 16 }}>
              {loading ? 'Submitting...' : method === 'UPI' ? '📤 Upload Screenshot & Confirm' : '✅ Confirm Cash on Delivery'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
