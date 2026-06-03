import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight, FiStar, FiTruck, FiHeart } from 'react-icons/fi';

const CATEGORIES = ['All', 'Birthday', 'Anniversary', 'Chocolate', 'Photo Cake', 'Custom'];

const CakeCard = ({ cake }) => {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(233,30,122,0.18)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={cake.image} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = ''} />
        {cake.isBestSeller && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#E91E7A', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            BEST SELLER
          </div>
        )}
        <button style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E7A' }}>
          <FiHeart size={14} />
        </button>
      </div>
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{cake.name}</h3>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 12 }}>{cake.weight}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#E91E7A' }}>₹{cake.price}</span>
          <button onClick={() => navigate(`/order/${cake._id}`)} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
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
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #FFF0F7 0%, #FFF8F0 50%, #FFF0F7 100%)',
        padding: '80px 0 60px', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(233,30,122,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,107,174,0.06)' }} />
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div className="fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF0F7', padding: '6px 14px', borderRadius: 20, marginBottom: 24 }}>
              <span style={{ fontSize: 16 }}>🎂</span>
              <span style={{ fontSize: 13, color: '#E91E7A', fontWeight: 600 }}>Fast Delivery Available</span>
            </div>
            <h1 style={{ fontSize: 56, lineHeight: 1.1, marginBottom: 20, color: '#3D1C02' }}>
              Happiness<br />
              Delivered<br />
              with <span style={{ color: '#E91E7A' }}>Love ♡</span>
            </h1>
            <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 36, lineHeight: 1.7 }}>
              Delicious cakes made fresh for every special moment.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <button onClick={() => navigate('/cakes')} className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                Order Now
              </button>
              <button onClick={() => document.getElementById('popular').scrollIntoView({ behavior: 'smooth' })}
                style={{ background: 'none', border: 'none', color: '#E91E7A', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                ▶ How it works
              </button>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 48 }}>
              {[['🧁', 'Freshly Baked Everyday'], ['⭐', 'Premium Ingredients'], ['🚚', 'On Time Delivery'], ['❤️', 'Made with Love']].map(([icon, text]) => (
                <div key={text} style={{ textAlign: 'center', padding: '12px 8px', background: 'white', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, lineHeight: 1.3 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 380, height: 380, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD6EC, #FFB3D1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(233,30,122,0.25)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
                alt="Birthday Cake"
                style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div style={{ position: 'absolute', top: 20, right: 20, background: 'white', borderRadius: 16, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 600 }}>
              🎉 Happy Birthday!
            </div>
            <div style={{ position: 'absolute', bottom: 30, left: 10, background: '#E91E7A', color: 'white', borderRadius: 16, padding: '10px 16px', boxShadow: '0 8px 24px rgba(233,30,122,0.3)', fontSize: 12, fontWeight: 600 }}>
              ⚡ Fast Delivery
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cakes */}
      <section id="popular" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, marginBottom: 12 }}>Our Popular Cakes</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15 }}>Handcrafted with love, delivered with care</p>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px', borderRadius: 50, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  background: activeCategory === cat ? '#E91E7A' : 'white',
                  color: activeCategory === cat ? 'white' : '#374151',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(233,30,122,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s'
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {filtered.length > 0 ? (
              filtered.map(cake => <CakeCard key={cake._id} cake={cake} />)
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>
                No cakes found for "{activeCategory}".
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/cakes" className="btn-outline">View All Cakes <FiArrowRight style={{ marginLeft: 6 }} /></Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 48 }}>How It Works</h2>
          <div style={{ display: 'flex', gap: 0, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              ['🎂', '1. Choose Cake', 'Browse our delicious collection'],
              ['📝', '2. Request Order', 'Fill in delivery details'],
              ['✅', '3. We Confirm', 'Admin confirms your order'],
              ['💳', '4. You Pay', 'UPI or Cash on Delivery'],
              ['🚚', '5. We Deliver', 'Fresh cake at your doorstep'],
            ].map(([icon, title, desc], i) => (
              <React.Fragment key={title}>
                <div style={{ textAlign: 'center', padding: '0 16px', flex: '1', minWidth: 120 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFF0F7, #FFD6EC)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px', fontSize: 28,
                    boxShadow: '0 4px 16px rgba(233,30,122,0.15)'
                  }}>{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{desc}</div>
                </div>
                {i < 4 && <div style={{ color: '#E91E7A', fontSize: 20, padding: '0 4px', opacity: 0.5 }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Cake Banner */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #3D1C02, #7B4A2D)',
            borderRadius: 24, padding: '48px', display: 'grid',
            gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 40, overflow: 'hidden', position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: -40, right: 200, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
            <div>
              <h2 style={{ color: 'white', fontSize: 32, marginBottom: 12 }}>Want a Custom Cake?</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 28, fontSize: 15 }}>Tell us your idea, we will make it perfect!</p>
              <Link to="/order/custom" className="btn-primary" style={{ display: 'inline-block' }}>Order Custom Cake</Link>
            </div>
            <div style={{ fontSize: 80, opacity: 0.3 }}>🎂</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#3D1C02', color: 'white', padding: '40px 0 20px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                Sweet<span style={{ color: '#FF6BAE' }}>Oven</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>
                Handcrafted cakes made with premium ingredients and baked fresh every day for your special moments.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: 16, fontSize: 15 }}>Quick Links</h4>
              {['Home', 'Cakes', 'Custom Cakes', 'About Us', 'Contact'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, transition: 'color 0.2s' }}>{l}</a>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ marginBottom: 16, fontSize: 15 }}>Contact</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 2 }}>
                📍 123 , Pansila<br />Kolkata - 700001<br />
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
