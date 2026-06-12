import { useState, useEffect } from 'react';
import { useSkills } from '../hooks/useSkill';
import SkillCard from '../components/SkillCard';

const Skills = () => {
  const { skills, groupedSkills, loading, error } = useSkills();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [skills]);

  const categories = ['ALL', ...Object.keys(groupedSkills)];

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'ALL' || s.category === selectedCat;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="loader-container"><div className="loader-ring" /></div>;

  const avg = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
    : 0;

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '80px 0 60px', background: 'var(--navy-2)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <p style={{ color: 'var(--cyan)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Expertise</p>
          <h1 className="section-title">My <span className="gradient-text">Skill Set</span></h1>
          <div className="divider" />
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
            {[
              { label: 'Total Skills', value: skills.length },
              { label: 'Categories', value: Object.keys(groupedSkills).length },
              { label: 'Avg. Proficiency', value: `${avg}%` },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'left' }}>
                <span className="gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem' }}>{stat.value}</span>
                <p style={{ color: 'var(--slate)', fontSize: '0.8rem' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search + Category */}
          <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="input-field"
                placeholder="Search skills…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  style={{
                    padding: '7px 16px', borderRadius: 999, border: '1px solid',
                    borderColor: selectedCat === cat ? 'var(--violet)' : 'var(--glass-border)',
                    background: selectedCat === cat ? 'var(--violet-dim)' : 'transparent',
                    color: selectedCat === cat ? '#A78BFA' : 'var(--slate)',
                    cursor: 'pointer', fontSize: '0.82rem',
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, transition: 'all 0.2s',
                  }}>
                  {cat === 'ALL' ? 'All' : cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {/* Grouped view */}
          {selectedCat === 'ALL' && search === '' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {Object.entries(groupedSkills).map(([cat, catSkills]) => (
                <div key={cat} className="reveal">
                  <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.1rem',
                    color: 'var(--white)', marginBottom: 20,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{ width: 32, height: 2, background: 'linear-gradient(90deg, var(--cyan), var(--violet))', display: 'inline-block', borderRadius: 2 }} />
                    {cat.replace(/_/g, ' ')}
                    <span className="tag tag-slate" style={{ fontSize: '0.7rem' }}>{catSkills.length}</span>
                  </h2>
                  <div className="grid-3">
                    {catSkills.map(skill => <SkillCard key={skill._id} skill={skill} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(skill => <SkillCard key={skill._id} skill={skill} />)}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
              <p style={{ color: 'var(--slate)' }}>No skills found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Skills;