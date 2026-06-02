import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function CakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cake, setCake] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cakeRes, reviewsRes] = await Promise.all([
          axios.get(`/api/cakes/${id}`),
          axios.get(`/api/reviews/cake/${id}`)
        ]);
        setCake(cakeRes.data);
        setReviews(reviewsRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}>Loading...</div>;
  if (!cake) return <div style={{ textAlign: 'center', padding: 100 }}>Cake not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', padding: '32px 0' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#6B7280', fontSize: 14, marginBottom: 24, cursor: 'pointer' }}>
          <FiArrowLeft /> Back to Cakes
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ height: 450, overflow: 'hidden' }}>
            <img src={cake.image} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 12, color: '#E91E7A', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{cake.category}</div>
            <h1 style={{ fontSize: 36, marginBottom: 8 }}>{cake.name}</h1>
            <p style={{ color: '#9CA3AF', marginBottom: 16 }}>{cake.weight}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
              {[1,2,3,4,5].map(s => <FiStar key={s} size={16} color={s <= 4 ? '#F59E0B' : '#E5E7EB'} fill={s <= 4 ? '#F59E0B' : 'none'} />)}
              <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>{reviews.length} reviews</span>
            </div>
            <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>{cake.description}</p>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#E91E7A', marginBottom: 32 }}>₹{cake.price}</div>
            <button onClick={() => user ? navigate(`/order/${cake._id}`) : navigate('/login')} className="btn-primary" style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content' }}>
              <FiShoppingCart /> {user ? 'Order Now' : 'Login to Order'}
            </button>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 24, marginBottom: 24 }}>Customer Reviews</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {reviews.map(r => (
                <div key={r._id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                      {r.user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.user.name}</div>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        {[1,2,3,4,5].map(s => <FiStar key={s} size={12} color={s <= r.rating ? '#F59E0B' : '#E5E7EB'} fill={s <= r.rating ? '#F59E0B' : 'none'} />)}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
