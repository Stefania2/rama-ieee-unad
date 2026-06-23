import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="layout-main" style={{ marginLeft: collapsed ? 64 : 'var(--sidebar-width)' }}>
        <Navbar title={title} />
        <main className="layout-content">
          {children}
        </main>
      </div>

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .layout-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }
        .layout-content {
          flex: 1;
          padding: 32px;
          max-width: 1400px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .layout-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
