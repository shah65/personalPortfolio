const categoryIcons = {
  PROGRAMMING_LANGUAGE: '💻',
  FRAMEWORK: '⚛️',
  DATABASE: '🗄️',
  TOOL: '🔧',
  DEVOPS: '🚀',
  CLOUD: '☁️',
  SOFT_SKILL: '🤝',
  LANGUAGE: '📖',
};

const SkillCard = ({ skill, onEdit, onDelete, isAdmin = false }) => {
  const icon = categoryIcons[skill.category] || '📌';
  const label = skill.category?.replace(/_/g, ' ') || '';

  return (
    <div className="glass" style={{
      padding: 20,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>{icon}</span>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize', color: 'var(--white)' }}>
              {skill.name}
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.75rem', marginTop: 2 }}>{label}</p>
          </div>
        </div>
        {skill.isCoreSkill && <span className="tag tag-yellow">Core</span>}
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Proficiency</span>
          <span style={{ color: 'var(--cyan)', fontSize: '0.78rem', fontWeight: 600 }}>{skill.proficiency}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${skill.proficiency}%` }} />
        </div>
      </div>

      {skill.yearsOfExperience > 0 && (
        <p style={{ color: 'var(--slate)', fontSize: '0.78rem', marginTop: 10 }}>
          📅 {skill.yearsOfExperience}+ yr{skill.yearsOfExperience !== 1 ? 's' : ''}
        </p>
      )}

      {isAdmin && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, borderTop: '1px solid var(--glass-border)', paddingTop: 14 }}>
          <button className="btn-edit" style={{ flex: 1, fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => onEdit(skill)}>Edit</button>
          <button className="btn-danger" style={{ flex: 1, fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => onDelete(skill._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default SkillCard;