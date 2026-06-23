import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Layout from '../components/Layout';

export default function Administracion() {
  const { user } = useAuth();
  const [exportType, setExportType] = useState('PDF');

  const handleExport = () => {
    alert(`Exportación en ${exportType} - Funcionalidad próxima a implementar con Google Apps Script.`);
  };

  return (
    <Layout title="Administración">
      <div className="page-header">
        <h1>Administración</h1>
        <p>Configuración y gestión del sistema</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Exportar Reportes</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Exporta los datos del sistema en diferentes formatos.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={exportType}
              onChange={e => setExportType(e.target.value)}
              className="filter-select"
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
              <option value="CSV">CSV</option>
            </select>
            <button className="btn btn-primary" onClick={handleExport}>
              Exportar
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Configuración de API</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Conecta con Google Apps Script para la sincronización con Google Sheets.
          </p>
          <div className="form-group">
            <label>URL de la API</label>
            <input
              value={import.meta.env.VITE_API_URL || 'No configurada'}
              disabled
              style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, width: '100%', background: 'var(--bg-primary)' }}
            />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Roles del Sistema</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="role-item">
              <span className="badge badge-admin">ADMIN</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Acceso total. Crea, edita y elimina proyectos y usuarios.</span>
            </div>
            <div className="role-item">
              <span className="badge badge-aess">LÍDER</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Edita proyectos de su capítulo (AESS, WIE o CS).</span>
            </div>
            <div className="role-item">
              <span className="badge badge-visitor">VISITANTE</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Solo lectura: proyectos, eventos y estadísticas.</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Información del Sistema</h3>
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><strong>Versión:</strong> 1.0.0</div>
            <div><strong>Frontend:</strong> React + Vite</div>
            <div><strong>Backend:</strong> Google Apps Script</div>
            <div><strong>Base de datos:</strong> Google Sheets</div>
            <div><strong>Hosting:</strong> Vercel</div>
            <div><strong>Usuario actual:</strong> {user?.nombre} ({user?.email})</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Funcionalidades Futuras</h3>
        <div className="future-features">
          <div className="feature-item">📜 Certificados - Generación automática para eventos</div>
          <div className="feature-item">📱 Registro de asistencia con QR</div>
          <div className="feature-item">🔬 Convocatorias de investigación y voluntariado</div>
          <div className="feature-item">📊 Reportes IEEE exportables (PDF, Excel, CSV)</div>
        </div>
      </div>

      <style>{`
        .role-item { display: flex; align-items: center; gap: 12px; }
        .future-features { display: flex; flex-direction: column; gap: 12px; }
        .feature-item {
          font-size: 13px;
          color: var(--text-secondary);
          padding: 10px 14px;
          background: var(--bg-primary);
          border-radius: var(--radius);
        }
      `}</style>
    </Layout>
  );
}
