import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Layout from '../components/Layout';

const tiposEvidencia = [
  { value: 'PDF', label: 'PDF', icon: '📄' },
  { value: 'IMAGEN', label: 'Imagen', icon: '🖼️' },
  { value: 'VIDEO', label: 'Video', icon: '🎬' },
  { value: 'POSTER', label: 'Póster', icon: '📋' },
  { value: 'ARTICULO', label: 'Artículo', icon: '📝' },
  { value: 'PRESENTACION', label: 'Presentación', icon: '📑' },
];

const capitulos = ['AESS', 'WIE', 'CS'];

export default function Evidencias() {
  const { hasRole } = useAuth();
  const [evidencias, setEvidencias] = useState(() => {
    const stored = localStorage.getItem('ieee_evidencias');
    return stored ? JSON.parse(stored) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [filterCapitulo, setFilterCapitulo] = useState('TODOS');
  const [form, setForm] = useState({ capitulo: 'AESS', proyecto: '', tipo: 'PDF', nombre: '', link: '', descripcion: '' });

  const canUpload = hasRole(['ADMIN', 'LIDER']);

  const filtered = filterCapitulo === 'TODOS' ? evidencias : evidencias.filter(e => e.capitulo === filterCapitulo);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nueva = { ...form, id: Date.now(), fecha: new Date().toISOString().split('T')[0] };
    const updated = [...evidencias, nueva];
    setEvidencias(updated);
    localStorage.setItem('ieee_evidencias', JSON.stringify(updated));
    setShowForm(false);
    setForm({ capitulo: 'AESS', proyecto: '', tipo: 'PDF', nombre: '', link: '', descripcion: '' });
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta evidencia?')) return;
    const updated = evidencias.filter(e => e.id !== id);
    setEvidencias(updated);
    localStorage.setItem('ieee_evidencias', JSON.stringify(updated));
  };

  return (
    <Layout title="Evidencias">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Evidencias</h1>
          <p>Documentos, imágenes y presentaciones de proyectos</p>
        </div>
        {canUpload && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Subir Evidencia</button>
        )}
      </div>

      <div className="filters" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={filterCapitulo} onChange={e => setFilterCapitulo(e.target.value)} className="filter-select">
          <option value="TODOS">Todos los capítulos</option>
          {capitulos.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Subir Evidencia</h2>
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Capítulo</label>
                  <select value={form.capitulo} onChange={e => setForm({...form, capitulo: e.target.value})}>
                    {capitulos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {tiposEvidencia.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Nombre del proyecto</label>
                <input value={form.proyecto} onChange={e => setForm({...form, proyecto: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Nombre del archivo</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Link (Google Drive)</label>
                <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://drive.google.com/..." required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea rows={2} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Subir</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="evidencias-grid">
        {filtered.map(ev => (
          <div key={ev.id} className="evidencia-card card">
            <div className="evidencia-icon">
              {tiposEvidencia.find(t => t.value === ev.tipo)?.icon || '📄'}
            </div>
            <div className="evidencia-body">
              <h3>{ev.nombre}</h3>
              <span className={`badge badge-${ev.capitulo.toLowerCase()}`}>{ev.capitulo}</span>
              <p>{ev.proyecto}</p>
              {ev.descripcion && <small>{ev.descripcion}</small>}
              <div className="evidencia-actions">
                <a href={ev.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Ver archivo</a>
                {hasRole(['ADMIN']) && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.id)}>Eliminar</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state" style={{ gridColumn: '1/-1' }}><p>No hay evidencias registradas.</p></div>}
      </div>

      <style>{`
        .evidencias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .evidencia-card { display: flex; gap: 16px; align-items: flex-start; }
        .evidencia-icon { font-size: 36px; flex-shrink: 0; }
        .evidencia-body { flex: 1; }
        .evidencia-body h3 { font-size: 15px; margin-bottom: 4px; }
        .evidencia-body p { font-size: 13px; color: var(--text-secondary); margin: 4px 0; }
        .evidencia-body small { font-size: 12px; color: var(--text-light); display: block; margin-bottom: 8px; }
        .evidencia-actions { display: flex; gap: 8px; margin-top: 8px; }
      `}</style>
    </Layout>
  );
}
