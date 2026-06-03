import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiSearch } from 'react-icons/fi';

const CATEGORIES = ['All', 'Birthday', 'Anniversary', 'Chocolate', 'Photo Cake', 'Custom'];

export default function Cakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/cakes');
        setCakes(data);
      } catch (err) { 
        console.error('Error fetching cakes:', err.response?.data || err.message);
      }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = cakes.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #FFF0F7, #FFF8F0)', padding: '48px 0 32px' }}>
        <div className="container">
          <h1 style={{ fontSize: 40, marginBottom: 8 }}>Our Cakes</h1>
          <p style={{ color: '#9CA3AF', fontSize: 15 }}>Choose from our wide variety of handcrafted cakes</p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 400, marginTop: 24 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cakes..."
              style={{ paddingLeft: 40, borderRadius: 50, border: '1.5px solid #E5E7EB', background: 'white' }} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 20px' }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 20px', borderRadius: 50, border: 'none', fontSize: 14, fontWeight: 500,
              background: activeCategory === cat ? '#E91E7A' : 'white',
              color: activeCategory === cat ? 'white' : '#374151',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(233,30,122,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s', cursor: 'pointer'
            }}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎂</div>
            <p style={{ color: '#9CA3AF' }}>Loading cakes...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
            {filtered.map(cake => (
              <div key={cake._id} className="card" style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(233,30,122,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                onClick={() => navigate(`/cakes/${cake._id}`)}>
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img src={cake.image} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {cake.isBestSeller && (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#E91E7A', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>BEST SELLER</div>
                  )}
                  <button onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E7A' }}>
                    <FiHeart size={14} />
                  </button>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#E91E7A', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>{cake.category}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{cake.name}</h3>
                  <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 4 }}>{cake.weight}</p>
                  <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cake.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#E91E7A' }}>₹{cake.price}</span>
                    <button onClick={e => { e.stopPropagation(); navigate(`/order/${cake._id}`); }} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h3 style={{ marginBottom: 8 }}>No cakes found</h3>
            <p style={{ color: '#9CA3AF' }}>Try a different category or search term</p>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(auto-fill, minmax(250px"] {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="background: linear-gradient(135deg, #FFF0F7"] h1 {
            font-size: 28px;
          }
          div[style*="grid-template-columns: repeat(auto-fill, minmax(250px"] {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
            gap: 16px !important;
          }
          .card div[style*="height: 210px"] {
            height: 160px !important;
          }
          .card div[style*="padding: 16px"] h3 {
            font-size: 14px;
          }
          button[style*="padding: '8px 20px'"] {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="padding: '32px 20px'"] {
            padding: 16px 12px !important;
          }
          div[style*="background: linear-gradient(135deg, #FFF0F7"] {
            padding: 32px 0 24px !important;
          }
          div[style*="background: linear-gradient(135deg, #FFF0F7"] h1 {
            font-size: 22px;
          }
          div[style*="background: linear-gradient(135deg, #FFF0F7"] > div > p {
            font-size: 13px;
          }
          div[style*="grid-template-columns: repeat(auto-fill, minmax(250px"] {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            gap: 12px !important;
          }
          .card {
            border-radius: 12px;
          }
          .card div[style*="height: 160px"] {
            height: 140px !important;
          }
          .card div[style*="padding: 16px"] {
            padding: 12px !important;
          }
          .card div[style*="padding: 16px"] > div:nth-child(2) {
            font-size: 12px !important;
          }
          .card div[style*="padding: 16px"] h3 {
            font-size: 13px;
            margin-bottom: 2px;
          }
          .card div[style*="padding: 16px"] p {
            font-size: 11px !important;
            margin-bottom: 8px;
          }
          .card div[style*="display: 'flex'"] {
            gap: 6px !important;
          }
          .card div[style*="display: 'flex'"] span {
            font-size: 16px !important;
          }
          .card button {
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
