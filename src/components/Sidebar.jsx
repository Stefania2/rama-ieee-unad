import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/proyectos', label: 'Proyectos', icon: '🚀' },
  { path: '/eventos', label: 'Eventos', icon: '📅' },
  { path: '/evidencias', label: 'Evidencias', icon: '📁' },
  { path: '/estadisticas', label: 'Estadísticas', icon: '📈' },
  { path: '/miembros', label: 'Miembros', icon: '👥' },
  { path: '/administracion', label: 'Administración', icon: '⚙️' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <span className="brand-icon">⚡</span>
            <div>
              <strong>IEEE UNAD</strong>
              <small>Project Hub</small>
            </div>
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.picture ? (
                <img src={user.picture} alt="" />
              ) : (
                user.nombre.charAt(0).toUpperCase()
              )}
            </div>
            <div className="user-info">
              <strong>{user.nombre}</strong>
              <span className={`badge badge-${user.rol === 'ADMIN' ? 'admin' : user.rol === 'LIDER' ? (user.capitulo?.toLowerCase() || 'visitor') : 'visitor'}`}>
                {user.rol}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-sidebar);
          color: var(--text-white);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          transition: width 0.3s ease;
          z-index: 100;
          overflow: hidden;
        }
        .sidebar.collapsed { width: 64px; }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          min-height: var(--navbar-height);
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-brand .brand-icon { font-size: 28px; }
        .sidebar-brand small {
          display: block;
          font-size: 11px;
          opacity: 0.7;
        }
        .sidebar-toggle {
          background: none;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          padding: 4px 8px;
          border-radius: var(--radius);
        }
        .sidebar-toggle:hover { color: white; background: rgba(255,255,255,0.1); }
        .sidebar-nav {
          flex: 1;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: var(--ieee-blue); color: white; }
        .nav-icon { font-size: 18px; flex-shrink: 0; }
        .nav-label { overflow: hidden; }
        .sidebar-footer {
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--ieee-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-info { overflow: hidden; }
        .user-info strong { display: block; font-size: 13px; overflow: hidden; text-overflow: ellipsis; }
        .user-info .badge { margin-top: 2px; }
      `}</style>
    </aside>
  );
}
