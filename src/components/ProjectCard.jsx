import { useAuth } from '../auth/AuthContext';

const capituloStyles = {
  AESS: { bg: 'var(--aess)', light: 'var(--aess-light)' },
  WIE: { bg: 'var(--wie)', light: 'var(--wie-light)' },
  CS: { bg: 'var(--cs)', light: 'var(--cs-light)' },
};

export default function ProjectCard({ project, onEdit, onDelete, onView }) {
  const { canEditCapitulo } = useAuth();
  const canEdit = canEditCapitulo(project.capitulo);
  const style = capituloStyles[project.capitulo] || capituloStyles.AESS;

  return (
    <div className="project-card" style={{ borderTop: `4px solid ${style.bg}` }}>
      <div className="project-card-header">
        <h3>{project.nombre}</h3>
        <span className={`badge badge-${project.capitulo.toLowerCase()}`}>
          {project.capitulo}
        </span>
      </div>

      <p className="project-desc">{project.descripcion}</p>

      <div className="project-meta">
        <span>Líder: {project.lider}</span>
        <span className={`estado estado-${project.estado?.toLowerCase()}`}>
          {project.estado}
        </span>
      </div>

      <div className="project-progress">
        <div className="progress-header">
          <span>Avance</span>
          <span className="progress-pct">{project.avance}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${project.avance}%`, background: style.bg }}
          />
        </div>
      </div>

      <div className="project-actions">
        <button className="btn btn-primary btn-sm" onClick={() => onView?.(project)}>
          Ver Proyecto
        </button>
        {canEdit && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => onEdit?.(project)}>
              Editar
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(project)}>
              Eliminar
            </button>
          </>
        )}
      </div>

      <style>{`
        .project-card {
          background: var(--bg-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          padding: 20px;
          transition: box-shadow 0.2s;
        }
        .project-card:hover { box-shadow: var(--shadow-md); }
        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }
        .project-card-header h3 {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.3;
        }
        .project-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .estado {
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .estado-activo { background: #DCFCE7; color: #166534; }
        .estado-finalizado { background: #DBEAFE; color: #1E40AF; }
        .estado-planeado { background: #FEF3C7; color: #92400E; }
        .project-progress { margin-bottom: 16px; }
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .progress-pct { font-weight: 700; }
        .progress-bar {
          height: 8px;
          background: #E5E7EB;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .project-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn-sm { padding: 6px 14px; font-size: 12px; }
      `}</style>
    </div>
  );
}
