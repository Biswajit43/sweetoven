import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiShoppingBag, FiUsers, FiTag, FiStar, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const NAV = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { to: '/admin/cakes', icon: '🎂', label: 'Cakes' },
  { to: '/admin/customers', icon: <FiUsers />, label: 'Customers' },
  { to: '/admin/coupons', icon: <FiTag />, label: 'Coupons' },
  { to: '/admin/reviews', icon: <FiStar />, label: 'Reviews' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile }) => (
    <div style={{
      width: mobile ? '100%' : 240,
      background: '#1A0A00',
      minHeight: mobile ? 'auto' : '100vh',
      display: 'flex', flexDirection: 'column',
      position: mobile ? 'relative' : 'fixed',
      top: 0, left: 0, zIndex: 50
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 24 }}>🎂</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'white' }}>
              Sweet<span style={{ color: '#FF6BAE' }}>Oven</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>ADMIN PANEL</div>
          </div>
        </Link>
      </div>

      {/* Admin Info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E91E7A, #FF6BAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 700 }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Administrator</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV.map(({ to, icon, label }) => {
          const active = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 10, marginBottom: 4,
              background: active ? 'linear-gradient(135deg, #E91E7A22, #FF6BAE11)' : 'transparent',
              color: active ? '#FF6BAE' : 'rgba(255,255,255,0.6)',
              fontWeight: active ? 600 : 400, fontSize: 14,
              borderLeft: active ? '3px solid #E91E7A' : '3px solid transparent',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
          background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer',
          transition: 'all 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#FF6BAE'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Desktop Sidebar */}
      <div style={{ width: 240, flexShrink: 0 }} className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 260 }}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Bar */}
        <div style={{ background: 'white', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}>
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>
              {NAV.find(n => n.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div style={{ fontSize: 14, color: '#6B7280' }}>Welcome, {user?.name} 👋</div>
        </div>

        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
