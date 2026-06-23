import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { user, loginMock } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('stefania@unad.edu.co');

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginMock(email);
    if (result) {
      navigate('/dashboard', { replace: true });
    } else {
      alert('Correo no autorizado. Debe ser @unad.edu.co');
    }
  };

  const quickUsers = [
    { email: 'stefania@unad.edu.co', label: 'Admin', color: 'var(--ieee-blue)' },
    { email: 'aess@unad.edu.co', label: 'Líder AESS', color: 'var(--aess)' },
    { email: 'wie@unad.edu.co', label: 'Líder WIE', color: 'var(--wie)' },
    { email: 'cs@unad.edu.co', label: 'Líder CS', color: 'var(--cs)' },
    { email: 'visitante@unad.edu.co', label: 'Visitante', color: '#6B7280' },
  ];

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">⚡</span>
          <h1>IEEE UNAD</h1>
          <p>Project Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Correo institucional</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@unad.edu.co"
            required
          />

          <button type="submit" className="btn btn-primary login-btn">
            Iniciar sesión
          </button>
        </form>

        <div className="login-divider">
          <span>Usuarios de prueba</span>
        </div>

        <div className="login-quick">
          {quickUsers.map(u => (
            <button
              key={u.email}
              className="quick-user-btn"
              style={{ '--user-color': u.color }}
              onClick={() => {
                loginMock(u.email);
                navigate('/dashboard', { replace: true });
              }}
            >
              <span className="quick-user-dot" />
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--ieee-blue-dark) 0%, var(--bg-sidebar) 100%);
        }
        .login-card {
          width: 400px;
          background: var(--bg-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 40px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-icon { font-size: 48px; }
        .login-header h1 {
          font-size: 24px;
          margin-top: 8px;
          color: var(--ieee-blue);
        }
        .login-header p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-top: 2px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .login-form label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .login-form input {
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .login-form input:focus { border-color: var(--ieee-blue); }
        .login-btn {
          justify-content: center;
          padding: 12px;
          margin-top: 8px;
        }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 16px;
          font-size: 12px;
          color: var(--text-light);
        }
        .login-divider::before, .login-divider::after {
          content: '';
          flex: 1;
          border-top: 1px solid var(--border);
        }
        .login-quick {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .quick-user-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg-primary);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.2s;
        }
        .quick-user-btn:hover {
          border-color: var(--user-color, var(--ieee-blue));
          background: white;
        }
        .quick-user-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--user-color, var(--ieee-blue));
        }
      `}</style>
    </div>
  );
}
