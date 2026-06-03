import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const STYLES = `
  .cd-wrapper {
    min-height: 100vh;
    background: #FFF8F0;
    padding: 32px 0;
  }
  .cd-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .cd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #6B7280;
    font-size: 14px;
    margin-bottom: 24px;
    cursor: pointer;
    padding: 0;
  }
  .cd-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .cd-img-wrap {
    height: 450px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .cd-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cd-info {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .cd-title {
    font-size: 36px;
    margin-bottom: 8px;
    color: #1F2937;
    line-height: 1.2;
  }
  .cd-price {
    font-size: 36px;
    font-weight: 700;
    color: #E91E7A;
    margin-bottom: 32px;
  }
  .cd-order-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #E91E7A, #FF6BAE);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: fit-content;
    transition: opacity 0.2s, transform 0.2s;
  }
  .cd-order-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .cd-reviews { margin-top: 40px; }
  .cd-review-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 16px;
  }

  /* ── Tablet ── */
  @media (max-width: 900px) {
    .cd-img-wrap { height: 360px; }
    .cd-info { padding: 28px; }
    .cd-title { font-size: 28px; }
    .cd-price { font-size: 28px; margin-bottom: 24px; }
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .cd-wrapper { padding: 20px 0 40px; }
    .cd-container { padding: 0 16px; }

    .cd-card {
      grid-template-columns: 1fr;   /* stack vertically */
      border-radius: 20px;
    }

    /* Image fills full width, fixed height so it's clearly visible */
    .cd-img-wrap {
      height: 300px;
      width: 100%;
    }

    .cd-info {
      padding: 24px;
      justify-content: flex-start;
    }
    .cd-title { font-size: 24px; }
    .cd-price { font-size: 26px; margin-bottom: 20px; }
    .cd-order-btn { width: 100%; justify-content: center; }
  }

  /* ── Small phones ── */
  @media (max-width: 480px) {
    .cd-img-wrap { height: 240px; }
    .cd-info { padding: 18px; }
    .cd-title { font-size: 20px; }
    .cd-price { font-size: 22px; }
    .cd-order-btn { padding: 12px 24px; font-size: 15px; }
    .cd-reviews h2 { font-size: 20px; }
  }
`;

export default function CakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cake, setCake] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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

  if (loading) return <div style={{ textAlign: 'center', padding: 100, color: '#6B7280' }}>Loading...</div>;
  if (!cake) return <div style={{ textAlign: 'center', padding: 100, color: '#6B7280' }}>Cake not found</div>;

  return (
    <div className="cd-wrapper">
      <div className="cd-container">

        <button onClick={() => navigate(-1)} className="cd-back-btn">
          <FiArrowLeft /> Back to Cakes
        </button>

        <div className="cd-card">
          {/* Image — always full-width on mobile, proper height */}
          <div className="cd-img-wrap">
            <img src={cake.image} alt={cake.name} />
          </div>

          {/* Info */}
          <div className="cd-info">
            <div style={{ fontSize: 12, color: '#E91E7A', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>
              {cake.category}
            </div>
            <h1 className="cd-title">{cake.name}</h1>
            <p style={{ color: '#9CA3AF', marginBottom: 16, fontSize: 14 }}>{cake.weight}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={16} color={s <= 4 ? '#F59E0B' : '#E5E7EB'} fill={s <= 4 ? '#F59E0B' : 'none'} />
              ))}
              <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>{reviews.length} reviews</span>
            </div>

            <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
              {cake.description}
            </p>

            <div className="cd-price">₹{cake.price}</div>

            <button
              onClick={() => user ? navigate(`/order/${cake._id}`) : navigate('/login')}
              className="cd-order-btn"
            >
              <FiShoppingCart />
              {user ? 'Order Now' : 'Login to Order'}
            </button>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="cd-reviews">
            <h2 style={{ fontSize: 24, marginBottom: 24, color: '#1F2937' }}>Customer Reviews</h2>
            <div>
              {reviews.map(r => (
                <div key={r._id} className="cd-review-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 16
                    }}>
                      {r.user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1F2937' }}>{r.user.name}</div>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        {[1,2,3,4,5].map(s => (
                          <FiStar key={s} size={12} color={s <= r.rating ? '#F59E0B' : '#E5E7EB'} fill={s <= r.rating ? '#F59E0B' : 'none'} />
                        ))}
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