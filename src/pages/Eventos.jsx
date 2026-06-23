import { useState, useEffect } from 'react';
import { getEventos, createEvento, deleteEvento } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import Layout from '../components/Layout';

const capituloColors = { AESS: 'var(--aess)', WIE: 'var(--wie)', CS: 'var(--cs)' };

export default function Eventos() {
  const { user, hasRole } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterCapitulo, setFilterCapitulo] = useState('TODOS');
  const [form, setForm] = useState({ capitulo: 'AESS', nombre: '', fecha: '', lugar: '', descripcion: '' });

  const canCreate = hasRole(['ADMIN', 'LIDER']);

  useEffect(() => { getEventos().then(setEventos); }, []);

  const filtered = filterCapitulo === 'TODOS' ? eventos : eventos.filter(e => e.capitulo === filterCapitulo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvento(form);
    setShowForm(false);
    setForm({ capitulo: 'AESS', nombre: '', fecha: '', lugar: '', descripcion: '' });
    getEventos().then(setEventos);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este evento?')) return;
    await deleteEvento(id);
    getEventos().then(setEventos);
  };

  const formatDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Layout title="Eventos">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Eventos</h1>
          <p>Calendario de eventos IEEE UNAD</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nuevo Evento</button>
        )}
      </div>

      <div className="filters" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={filterCapitulo} onChange={e => setFilterCapitulo(e.target.value)} className="filter-select">
          <option value="TODOS">Todos los capítulos</option>
          <option value="AESS">AESS</option>
          <option value="WIE">WIE</option>
          <option value="CS">Computer Society</option>
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo Evento</h2>
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label>Capítulo</label>
                <select value={form.capitulo} onChange={e => setForm({...form, capitulo: e.target.value})}>
                  <option value="AESS">AESS</option>
                  <option value="WIE">WIE</option>
                  <option value="CS">Computer Society</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nombre del evento</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha</label>
                  <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Lugar</label>
                  <input value={form.lugar} onChange={e => setForm({...form, lugar: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Crear evento</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="eventos-list">
        {filtered.map(e => (
          <div key={e.id} className="evento-card card" style={{ borderLeft: `4px solid ${capituloColors[e.capitulo]}` }}>
            <div className="evento-date">
              <span className="evento-day">{new Date(e.fecha + 'T12:00:00').getDate()}</span>
              <span className="evento-month">{new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-CO', { month: 'short' })}</span>
            </div>
            <div className="evento-body">
              <div className="evento-header">
                <h3>{e.nombre}</h3>
                <span className={`badge badge-${e.capitulo.toLowerCase()}`}>{e.capitulo}</span>
              </div>
              <p>{e.descripcion}</p>
              <div className="evento-meta">
                <span>📅 {formatDate(e.fecha)}</span>
                <span>📍 {e.lugar}</span>
              </div>
            </div>
            {hasRole(['ADMIN']) && (
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Eliminar</button>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state"><p>No hay eventos registrados.</p></div>}
      </div>

      <style>{`
        .eventos-list { display: flex; flex-direction: column; gap: 16px; }
        .evento-card { display: flex; gap: 20px; align-items: flex-start; }
        .evento-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
          padding: 8px;
          background: var(--bg-primary);
          border-radius: var(--radius);
        }
        .evento-day { font-size: 24px; font-weight: 800; color: var(--ieee-blue); line-height: 1; }
        .evento-month { font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-top: 2px; }
        .evento-body { flex: 1; }
        .evento-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .evento-header h3 { font-size: 16px; }
        .evento-body p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
        .evento-meta {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 12px;
          color: var(--text-light);
        }
      `}</style>
    </Layout>
  );
}
