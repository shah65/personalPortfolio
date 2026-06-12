const statusConfig = {
  COMPLETED: { label: 'Completed', cls: 'tag-green' },
  IN_PROGRESS: { label: 'In Progress', cls: 'tag-yellow' },
  PLANNING: { label: 'Planning', cls: 'tag-cyan' },
  ON_HOLD: { label: 'On Hold', cls: 'tag-slate' },
  ARCHIVED: { label: 'Archived', cls: 'tag-slate' },
};

const techColors = {
  'MERN STACK': 'tag-cyan',
  'AI AGENTIC': 'tag-violet',
  'JAVA SPRINGBOOT': 'tag-yellow',
  'PYTHON DJANGO': 'tag-green',
  'FLUTTER': 'tag-cyan',
  'REACT NATIVE': 'tag-violet',
};

const ProjectCard = ({ project, onEdit, onDelete, isAdmin = false }) => {
  const status = statusConfig[project.status] || { label: project.status, cls: 'tag-slate' };
  const techCls = techColors[project.projectTechnology] || 'tag-slate';

  return (
    <div className="glass" style={{
      padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
      transition: 'transform 0.25s, box-shadow 0.25s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Header bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--cyan), var(--violet))', borderRadius: 2, marginBottom: 4 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.05rem', color: 'var(--white)', flex: 1 }}>
          {project.projectName}
        </h3>
        <span className={`tag ${techCls}`}>{project.projectTechnology}</span>
      </div>

      <p style={{ color: 'var(--slate)', fontSize: '0.88rem', lineHeight: 1.7, flex: 1 }}>
        {project.projectDetails?.substring(0, 160)}…
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span className={`tag ${status.cls}`}>{status.label}</span>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="btn-ghost"
            style={{ padding: '6px 14px', fontSize: '0.8rem', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        )}
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
          <button className="btn-edit" style={{ flex: 1 }} onClick={() => onEdit(project)}>Edit</button>
          <button className="btn-danger" style={{ flex: 1 }} onClick={() => onDelete(project._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;