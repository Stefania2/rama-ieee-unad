import { useState, useEffect } from 'react';
import { getMiembros, createMiembro, updateMiembro, deleteMiembro } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import Layout from '../components/Layout';

const capituloColors = { AESS: 'var(--aess)', WIE: 'var(--wie)', CS: 'var(--cs)', GLOBAL: 'var(--ieee-blue)' };

export default function Miembros() {
  const { hasRole } = useAuth();
  const [miembros, setMiembros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ email: '', nombre: '', rol: 'MIEMBRO', capitulo: 'AESS' });
  const [error, setError] = useState('');

  const canManage = hasRole(['ADMIN']);

  useEffect(() => { getMiembros().then(setMiembros); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await updateMiembro(editing.email, form);
      } else {
        await createMiembro(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ email: '', nombre: '', rol: 'MIEMBRO', capitulo: 'AESS' });
      getMiembros().then(setMiembros);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (m) => {
    setForm({ email: m.email, nombre: m.nombre, rol: m.rol, capitulo: m.capitulo });
    setEditing(m);
    setShowForm(true);
  };

  const handleDelete = async (m) => {
    if (!confirm(`¿Eliminar a ${m.nombre}?`)) return;
    await deleteMiembro(m.email);
    getMiembros().then(setMiembros);
  };

  const rolBadge = (rol, cap) => {
    if (rol === 'ADMIN') return 'badge-admin';
    if (rol === 'LIDER') return `badge-${cap?.toLowerCase()}`;
    return 'badge-visitor';
  };

  return (
    <Layout title="Miembros">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Miembros</h1>
          <p>Gestión de miembros del IEEE UNAD</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ email: '', nombre: '', rol: 'MIEMBRO', capitulo: 'AESS' }); setShowForm(true); }}>
            + Añadir Miembro
          </button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Editar Miembro' : 'Nuevo Miembro'}</h2>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label>Correo</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required={!editing} disabled={!!editing} />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rol</label>
                  <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
                    <option value="ADMIN">Administrador</option>
                    <option value="LIDER">Líder de Capítulo</option>
                    <option value="MIEMBRO">Miembro</option>
                    <option value="VISITANTE">Visitante</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capítulo</label>
                  <select value={form.capitulo} onChange={e => setForm({...form, capitulo: e.target.value})}>
                    <option value="AESS">AESS</option>
                    <option value="WIE">WIE</option>
                    <option value="CS">Computer Society</option>
                    <option value="GLOBAL">Global</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editing ? 'Guardar' : 'Crear miembro'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Capítulo</th>
              {canManage && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {miembros.map(m => (
              <tr key={m.email}>
                <td><strong>{m.nombre}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{m.email}</td>
                <td><span className={`badge ${rolBadge(m.rol, m.capitulo)}`}>{m.rol}</span></td>
                <td>{m.capitulo}</td>
                {canManage && (
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(m)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>Eliminar</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .form-error {
          background: #FEE2E2;
          color: #DC2626;
          padding: 10px 14px;
          border-radius: var(--radius);
          font-size: 13px;
          margin-bottom: 16px;
        }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .table th {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 2px solid var(--border);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 12px;
          text-transform: uppercase;
        }
        .table td { padding: 12px; border-bottom: 1px solid var(--border); }
        .table tbody tr:hover { background: var(--bg-primary); }
      `}</style>
    </Layout>
  );
}
