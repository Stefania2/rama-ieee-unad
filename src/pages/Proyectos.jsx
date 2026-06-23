import { useState, useEffect } from 'react';
import { getProyectos, createProyecto, updateProyecto, deleteProyecto } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';

const INITIAL_FORM = { capitulo: 'AESS', nombre: '', descripcion: '', lider: '', estado: 'ACTIVO', avance: 0, fecha_inicio: '', fecha_fin: '', presupuesto: 0, link_drive: '' };

export default function Proyectos() {
  const { user, hasRole, canEditCapitulo } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [filterCapitulo, setFilterCapitulo] = useState('TODOS');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [viewing, setViewing] = useState(null);

  const canCreate = hasRole(['ADMIN']);

  useEffect(() => { loadProyectos(); }, []);

  const loadProyectos = async () => {
    const data = await getProyectos();
    setProyectos(data);
  };

  const filtered = proyectos.filter(p => {
    if (filterCapitulo !== 'TODOS' && p.capitulo !== filterCapitulo) return false;
    if (filterEstado !== 'TODOS' && p.estado !== filterEstado) return false;
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateProyecto(editing.id, form);
    } else {
      await createProyecto(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm(INITIAL_FORM);
    loadProyectos();
  };

  const handleEdit = (proyecto) => {
    setForm({
      capitulo: proyecto.capitulo,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      lider: proyecto.lider,
      estado: proyecto.estado,
      avance: proyecto.avance,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      presupuesto: proyecto.presupuesto,
      link_drive: proyecto.link_drive || '',
    });
    setEditing(proyecto);
    setShowForm(true);
  };

  const handleDelete = async (proyecto) => {
    if (!confirm(`¿Eliminar "${proyecto.nombre}"?`)) return;
    await deleteProyecto(proyecto.id);
    loadProyectos();
  };

  const openCreate = () => {
    setForm(INITIAL_FORM);
    setEditing(null);
    setShowForm(true);
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  return (
    <Layout title="Proyectos">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Proyectos</h1>
          <p>Gestión de proyectos por capítulo IEEE</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={openCreate}>
            + Nuevo Proyecto
          </button>
        )}
      </div>

      <div className="filters" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={filterCapitulo} onChange={e => setFilterCapitulo(e.target.value)} className="filter-select">
          <option value="TODOS">Todos los capítulos</option>
          <option value="AESS">AESS</option>
          <option value="WIE">WIE</option>
          <option value="CS">Computer Society</option>
        </select>
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="filter-select">
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="PLANEADO">Planeado</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', alignSelf: 'center' }}>
          {filtered.length} proyectos
        </span>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Capítulo</label>
                  <select value={form.capitulo} onChange={e => setForm({...form, capitulo: e.target.value})}>
                    <option value="AESS">AESS</option>
                    <option value="WIE">WIE</option>
                    <option value="CS">Computer Society</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}>
                    <option value="ACTIVO">Activo</option>
                    <option value="FINALIZADO">Finalizado</option>
                    <option value="PLANEADO">Planeado</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Nombre del proyecto</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Líder</label>
                  <input value={form.lider} onChange={e => setForm({...form, lider: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Avance (%)</label>
                  <input type="number" min={0} max={100} value={form.avance} onChange={e => setForm({...form, avance: Number(e.target.value)})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha inicio</label>
                  <input type="date" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Fecha fin</label>
                  <input type="date" value={form.fecha_fin} onChange={e => setForm({...form, fecha_fin: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Presupuesto (COP)</label>
                  <input type="number" value={form.presupuesto} onChange={e => setForm({...form, presupuesto: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Link Drive</label>
                  <input value={form.link_drive} onChange={e => setForm({...form, link_drive: e.target.value})} placeholder="https://drive.google.com/..." />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar cambios' : 'Crear proyecto'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditing(null); }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <h2>{viewing.nombre}</h2>
            <div className="project-detail">
              <div className="detail-grid">
                <div><strong>Capítulo:</strong> <span className={`badge badge-${viewing.capitulo.toLowerCase()}`}>{viewing.capitulo}</span></div>
                <div><strong>Estado:</strong> <span className={`estado estado-${viewing.estado?.toLowerCase()}`}>{viewing.estado}</span></div>
                <div><strong>Líder:</strong> {viewing.lider}</div>
                <div><strong>Avance:</strong> {viewing.avance}%</div>
                <div><strong>Inicio:</strong> {viewing.fecha_inicio}</div>
                <div><strong>Fin:</strong> {viewing.fecha_fin}</div>
                <div><strong>Presupuesto:</strong> {formatCurrency(viewing.presupuesto)}</div>
                {viewing.link_drive && (
                  <div><strong>Drive:</strong> <a href={viewing.link_drive} target="_blank" rel="noopener noreferrer">Ver archivos</a></div>
                )}
              </div>
              <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>{viewing.descripcion}</p>
              <div className="progress-bar" style={{ marginTop: 16 }}>
                <div className="progress-fill" style={{ width: `${viewing.avance}%` }} />
              </div>
            </div>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => setViewing(null)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="grid grid-3">
        {filtered.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            onView={setViewing}
            onEdit={canEditCapitulo(p.capitulo) ? handleEdit : undefined}
            onDelete={canEditCapitulo(p.capitulo) ? handleDelete : undefined}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No hay proyectos con los filtros seleccionados.</p>
        </div>
      )}

      <style>{`
        .filter-select {
          padding: 8px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 13px;
          background: white;
          color: var(--text-primary);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }
        .modal {
          background: white;
          border-radius: var(--radius-lg);
          padding: 32px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
        }
        .modal-lg { max-width: 700px; }
        .modal h2 { font-size: 20px; margin-bottom: 24px; }
        .project-form { display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 13px;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--ieee-blue);
        }
        .form-actions { display: flex; gap: 12px; margin-top: 8px; }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 14px;
        }
        .detail-grid a { color: var(--ieee-blue); text-decoration: underline; }
        .progress-bar {
          height: 10px;
          background: #E5E7EB;
          border-radius: 5px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--ieee-blue);
          border-radius: 5px;
          transition: width 0.5s;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-light);
        }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
}
