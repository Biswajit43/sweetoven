import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight, FiHeart } from 'react-icons/fi';

const CATEGORIES = ['All', 'Birthday', 'Anniversary', 'Chocolate', 'Photo Cake', 'Custom'];

/* ─── Responsive styles injected once ─── */
const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  .so-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── Hero ── */
  .hero-section {
    background: linear-gradient(135deg, #FFF0F7 0%, #FFF8F0 50%, #FFF0F7 100%);
    padding: 80px 0 60px;
    overflow: hidden;
    position: relative;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  .hero-title {
    font-size: 52px;
    line-height: 1.1;
    margin-bottom: 20px;
    color: #3D1C02;
  }
  .hero-subtitle {
    font-size: 16px;
    color: #6B7280;
    margin-bottom: 36px;
    line-height: 1.7;
  }
  .hero-cta-row {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
  .trust-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 48px;
  }
  .trust-card {
    text-align: center;
    padding: 12px 8px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .hero-image-wrap {
    position: relative;
    display: flex;
    justify-content: center;
  }
  .hero-circle {
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFD6EC, #FFB3D1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(233,30,122,0.25);
    flex-shrink: 0;
  }
  .hero-circle img {
    width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 50%;
  }
  .hero-badge-top {
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 16px;
    padding: 10px 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    font-size: 13px;
    font-weight: 600;
  }
  .hero-badge-bottom {
    position: absolute;
    bottom: 30px;
    left: 10px;
    background: #E91E7A;
    color: white;
    border-radius: 16px;
    padding: 10px 16px;
    box-shadow: 0 8px 24px rgba(233,30,122,0.3);
    font-size: 12px;
    font-weight: 600;
  }

  /* ── Cards ── */
  .cakes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }
  .cake-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .cake-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(233,30,122,0.18);
  }
  .cake-img-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  .cake-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .cake-card:hover .cake-img-wrap img {
    transform: scale(1.08);
  }

  /* ── How it Works ── */
  .steps-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 0;
  }
  .step-item {
    text-align: center;
    padding: 0 16px;
    flex: 1;
    min-width: 100px;
  }
  .step-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFF0F7, #FFD6EC);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 28px;
    box-shadow: 0 4px 16px rgba(233,30,122,0.15);
  }
  .step-arrow {
    color: #E91E7A;
    font-size: 20px;
    opacity: 0.5;
    flex-shrink: 0;
  }

  /* ── Custom Banner ── */
  .custom-banner {
    background: linear-gradient(135deg, #3D1C02, #7B4A2D);
    border-radius: 24px;
    padding: 48px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 40px;
    overflow: hidden;
    position: relative;
  }

  /* ── Footer ── */
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 32px;
  }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, #E91E7A, #FF6BAE);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    background: transparent;
    color: #E91E7A;
    border: 2px solid #E91E7A;
    border-radius: 50px;
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .btn-outline:hover { background: #E91E7A; color: white; }

  /* ════════════════════════════════
     RESPONSIVE BREAKPOINTS
  ════════════════════════════════ */

  /* Tablet: ≤ 1024px */
  @media (max-width: 1024px) {
    .hero-grid { gap: 40px; }
    .hero-title { font-size: 44px; }
    .hero-circle { width: 320px; height: 320px; }
    .hero-circle img { width: 268px; height: 268px; }
    .step-item { padding: 0 8px; }
  }

  /* Mobile-L: ≤ 768px */
  @media (max-width: 768px) {
    .so-container { padding: 0 16px; }

    /* Hero */
    .hero-section { padding: 48px 0 40px; }
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 36px;
    }
    .hero-image-wrap { order: -1; }  /* image first on mobile */
    .hero-title { font-size: 34px; }
    .hero-subtitle { font-size: 14px; }
    .trust-grid { grid-template-columns: repeat(2, 1fr); }
    .hero-circle { width: 260px; height: 260px; }
    .hero-circle img { width: 218px; height: 218px; }
    .hero-badge-top { top: 8px; right: 8px; font-size: 11px; padding: 8px 12px; }
    .hero-badge-bottom { bottom: 16px; left: 4px; font-size: 11px; padding: 8px 12px; }

    /* Steps */
    .steps-row { flex-wrap: wrap; gap: 4px; }
    .step-item { flex: 0 1 calc(50% - 16px); padding: 16px 8px; }
    .step-arrow { display: none; }

    /* Custom Banner */
    .custom-banner {
      grid-template-columns: 1fr;
      padding: 32px;
      gap: 16px;
      text-align: center;
    }
    .custom-banner h2 { font-size: 24px; }
    .custom-banner .banner-emoji { font-size: 56px !important; }

    /* Footer */
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    /* Cakes grid */
    .cakes-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  }

  /* Mobile-S: ≤ 480px */
  @media (max-width: 480px) {
    .hero-title { font-size: 28px; }
    .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .hero-circle { width: 220px; height: 220px; }
    .hero-circle img { width: 184px; height: 184px; }

    /* Steps: full width */
    .step-item { flex: 0 1 100%; padding: 10px 0; }
    .step-icon { width: 48px; height: 48px; font-size: 20px; }

    /* Custom Banner */
    .custom-banner { padding: 24px; }
    .custom-banner h2 { font-size: 20px; }
    .custom-banner p { font-size: 13px; }

    /* Cakes grid: 2 columns on small phones */
    .cakes-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cake-img-wrap { height: 150px; }

    /* Category filter pills scroll horizontally */
    .cat-filter {
      flex-wrap: nowrap !important;
      overflow-x: auto;
      padding-bottom: 8px;
      justify-content: flex-start !important;
      scrollbar-width: none;
    }
    .cat-filter::-webkit-scrollbar { display: none; }
    .cat-filter button { flex-shrink: 0; }

    footer { padding: 32px 0 16px; }
  }

  /* Very small phones: ≤ 360px */
  @media (max-width: 360px) {
    .hero-title { font-size: 24px; }
    .cakes-grid { grid-template-columns: 1fr; }
    .hero-circle { width: 190px; height: 190px; }
    .hero-circle img { width: 158px; height: 158px; }
  }
`;

const CakeCard = ({ cake }) => {
  const navigate = useNavigate();
  return (
    <div className="cake-card">
      <div className="cake-img-wrap">
        <img src={cake.image} alt={cake.name} loading="lazy" />
        {cake.isBestSeller && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#E91E7A', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            BEST SELLER
          </div>
        )}
        <button style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E7A', cursor: 'pointer' }}>
          <FiHeart size={14} />
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: '#1F2937' }}>{cake.name}</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>{cake.weight}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#E91E7A' }}>₹{cake.price}</span>
          <button onClick={() => navigate(`/order/${cake._id}`)} className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [cakes, setCakes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const { data } = await axios.get('/api/cakes');
        setCakes(data);
      } catch (err) { console.error(err); }
    };
    fetchCakes();
  }, []);

  const filtered = activeCategory === 'All'
    ? cakes
    : cakes.filter(c => {
      const category = typeof c.category === 'string' ? c.category.toLowerCase() : '';
      return category.includes(activeCategory.toLowerCase());
    });

  return (
    <div>

      {/* ── Hero ── */}
      <section className="hero-section">
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(233,30,122,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,107,174,0.06)', pointerEvents: 'none' }} />

        <div className="so-container">
          <div className="hero-grid">

            {/* Text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF0F7', padding: '6px 14px', borderRadius: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 16 }}>🎂</span>
                <span style={{ fontSize: 13, color: '#E91E7A', fontWeight: 600 }}>Fast Delivery Available</span>
              </div>

              <h1 className="hero-title">
                Happiness<br />Delivered<br />
                with <span style={{ color: '#E91E7A' }}>Love ♡</span>
              </h1>
              <p className="hero-subtitle">Delicious cakes made fresh for every special moment.</p>

              <div className="hero-cta-row">
                <button onClick={() => navigate('/cakes')} className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                  Order Now
                </button>
                <button
                  onClick={() => document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: 'none', border: 'none', color: '#E91E7A', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  ▶ How it works
                </button>
              </div>

              <div className="trust-grid">
                {[['🧁', 'Freshly Baked Everyday'], ['⭐', 'Premium Ingredients'], ['🚚', 'On Time Delivery'], ['❤️', 'Made with Love']].map(([icon, text]) => (
                  <div key={text} className="trust-card">
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, lineHeight: 1.3 }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="hero-image-wrap">
              <div className="hero-circle">
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" alt="Birthday Cake" />
              </div>
              <div className="hero-badge-top">🎉 Happy Birthday!</div>
              <div className="hero-badge-bottom">⚡ Fast Delivery</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Popular Cakes ── */}
      <section id="popular" style={{ padding: '60px 0' }}>
        <div className="so-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, marginBottom: 12, color: '#1F2937' }}>Our Popular Cakes</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15 }}>Handcrafted with love, delivered with care</p>
          </div>

          {/* Category Filter */}
          <div className="cat-filter" style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px', borderRadius: 50, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  background: activeCategory === cat ? '#E91E7A' : 'white',
                  color: activeCategory === cat ? 'white' : '#374151',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(233,30,122,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s', whiteSpace: 'nowrap',
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="cakes-grid">
            {filtered.length > 0
              ? filtered.map(cake => <CakeCard key={cake._id} cake={cake} />)
              : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>
                  No cakes found for "{activeCategory}".
                </div>
              )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/cakes" className="btn-outline">
              View All Cakes <FiArrowRight style={{ marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div className="so-container">
          <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 48, color: '#1F2937' }}>How It Works</h2>
          <div className="steps-row">
            {[
              ['🎂', '1. Choose Cake', 'Browse our delicious collection'],
              ['📝', '2. Request Order', 'Fill in delivery details'],
              ['✅', '3. We Confirm', 'Admin confirms your order'],
              ['💳', '4. You Pay', 'UPI or Cash on Delivery'],
              ['🚚', '5. We Deliver', 'Fresh cake at your doorstep'],
            ].map(([icon, title, desc], i) => (
              <React.Fragment key={title}>
                <div className="step-item">
                  <div className="step-icon">{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#1F2937' }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{desc}</div>
                </div>
                {i < 4 && <div className="step-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Cake Banner ── */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="so-container">
          <div className="custom-banner">
            <div style={{ position: 'absolute', top: -40, right: 200, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ color: 'white', fontSize: 32, marginBottom: 12 }}>Want a Custom Cake?</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 28, fontSize: 15 }}>Tell us your idea, we will make it perfect!</p>
              <Link to="/order/custom" className="btn-primary" style={{ display: 'inline-flex' }}>Order Custom Cake</Link>
            </div>
            <div className="banner-emoji" style={{ fontSize: 80, opacity: 0.3, lineHeight: 1 }}>🎂</div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#3D1C02', color: 'white', padding: '40px 0 20px' }}>
        <div className="so-container">
          <div className="footer-grid">
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                Sweet<span style={{ color: '#FF6BAE' }}>Oven</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
                Handcrafted cakes made with premium ingredients and baked fresh every day for your special moments.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: 16, fontSize: 15 }}>Quick Links</h4>
              {['Home', 'Cakes', 'Custom Cakes', 'About Us', 'Contact'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>{l}</a>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ marginBottom: 16, fontSize: 15 }}>Contact</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 2 }}>
                📍 123, Pansila<br />Kolkata - 700001<br />
                📞 +91 98765 43210<br />
                ✉️ hello@sweetoven.com
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Made by Biswajit
          </div>
        </div>
      </footer>

    </div>
  );
}