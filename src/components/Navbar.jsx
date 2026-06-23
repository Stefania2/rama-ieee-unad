import { useAuth } from '../auth/AuthContext';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <h2 className="navbar-title">{title || 'IEEE UNAD Project Hub'}</h2>
      <div className="navbar-actions">
        {user && (
          <div className="navbar-user">
            <span className="user-name">{user.nombre}</span>
            <button className="btn btn-outline logout-btn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      <style>{`
        .navbar {
          height: var(--navbar-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: var(--bg-white);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .navbar-actions { display: flex; align-items: center; gap: 16px; }
        .navbar-user { display: flex; align-items: center; gap: 12px; }
        .user-name { font-size: 14px; color: var(--text-secondary); }
        .logout-btn { padding: 6px 14px; font-size: 13px; }
      `}</style>
    </header>
  );
}
