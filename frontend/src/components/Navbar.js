import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi';

const Logo = () => (
  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20
    }}>🎂</div>
    <div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#3D1C02', lineHeight: 1 }}>
        Sweet<span style={{ color: '#E91E7A' }}>Oven</span>
      </div>
      <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: 1 }}>BAKED WITH LOVE</div>
    </div>
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <nav style={{
      background: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <Logo />

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
          {[['/', 'Home'], ['/cakes', 'Cakes'], ['/cakes?cat=Custom', 'Custom Cakes'], ['/cakes?cat=Birthday', 'Occasions']].map(([href, label]) => (
            <Link key={href} to={href} style={{ fontSize: 14, fontWeight: 500, color: '#374151', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#E91E7A'}
              onMouseLeave={e => e.target.style.color = '#374151'}>{label}</Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              {user.role !== 'admin' && (
                <Link to="/my-orders" style={{ padding: '8px 16px', borderRadius: 50, background: '#FFF0F7', color: '#E91E7A', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiPackage size={15} /> My Orders
                </Link>
              )}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropOpen(!dropOpen)} style={{
                  width: 38, height: 38, borderRadius: '50%', border: 'none',
                  background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FiUser size={16} />
                </button>
                {dropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 48, background: 'white',
                    borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    minWidth: 180, overflow: 'hidden', zIndex: 200
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{user.role === 'admin' ? '👑 Admin' : user.email}</div>
                    </div>
                    {user.role === 'admin' ? (
                      <Link to="/admin" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 14, color: '#374151', transition: 'background 0.2s' }}>
                        Dashboard
                      </Link>
                    ) : (
                      <Link to="/profile" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 14, color: '#374151' }}>
                        <FiUser size={14} /> My Profile
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px', fontSize: 14, color: '#EF4444', background: 'none', border: 'none', textAlign: 'left'
                    }}>
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '8px 20px', fontSize: 13 }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Register</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#374151' }} className="mobile-menu-btn">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'white', padding: '16px 20px', borderTop: '1px solid #F3F4F6' }}>
          {[['/', 'Home'], ['/cakes', 'Cakes'], ['/cakes?cat=Custom', 'Custom Cakes']].map(([href, label]) => (
            <Link key={href} to={href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 0', fontSize: 15, color: '#374151', borderBottom: '1px solid #F9FAFB' }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
