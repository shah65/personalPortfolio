import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import SkillCard from '../components/SkillCard';
import * as projectApi from '../Api/project_Api/project.api';
import * as skillApi from '../Api/skill_Api/akill.api';

const TECH_OPTIONS = ['MERN STACK', 'AI AGENTIC', 'JAVA SPRINGBOOT', 'PYTHON DJANGO', 'FLUTTER', 'REACT NATIVE'];
const STATUS_OPTIONS = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'ARCHIVED'];
const SKILL_CATS = ['PROGRAMMING_LANGUAGE', 'FRAMEWORK', 'DATABASE', 'TOOL', 'DEVOPS', 'CLOUD', 'SOFT_SKILL', 'LANGUAGE'];

const defaultProject = { projectName: '', projectDetails: '', projectTechnology: 'MERN STACK', status: 'PLANNING', githubUrl: '' };
const defaultSkill = { name: '', category: 'PROGRAMMING_LANGUAGE', proficiency: 50, yearsOfExperience: 0 };

const FormField = ({ label, children, required }) => (
  <div>
    <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>
      {label} {required && <span style={{ color: 'var(--cyan)' }}>*</span>}
    </label>
    {children}
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    className="input-field"
    style={{ cursor: 'pointer', appearance: 'none' }}
  >
    {options.map(o => (
      <option key={o.value || o} value={o.value || o} style={{ background: 'var(--navy-2)' }}>
        {o.label || o}
      </option>
    ))}
  </select>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editSkill, setEditSkill] = useState(null);
  const [projForm, setProjForm] = useState(defaultProject);
  const [skillForm, setSkillForm] = useState(defaultSkill);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, sk] = await Promise.allSettled([projectApi.getAllProjects(), skillApi.getAllSkills()]);
      if (pr.status === 'fulfilled' && pr.value?.success) setProjects(pr.value.data || []);
      else setProjects([]);
      if (sk.status === 'fulfilled' && sk.value?.success) setSkills(sk.value.data || []);
      else setSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Projects
  const openProjectForm = (project = null) => {
    setEditProject(project);
    setProjForm(project ? {
      projectName: project.projectName,
      projectDetails: project.projectDetails,
      projectTechnology: project.projectTechnology,
      status: project.status,
      githubUrl: project.githubUrl || '',
    } : defaultProject);
    setFormError('');
    setShowProjectForm(true);
  };

  const handleProjectSubmit = async () => {
    const { projectName, projectDetails, projectTechnology } = projForm;
    if (!projectName.trim() || !projectDetails.trim() || !projectTechnology) {
      setFormError('Project name, details, and technology are required.');
      return;
    }
    setSaving(true); setFormError('');
    try {
      const payload = { ...projForm, projectUserName: user?._id };
      if (editProject) {
        await projectApi.updateProject(editProject._id, payload);
        showToast('Project updated!');
      } else {
        await projectApi.storeProject(payload);
        showToast('Project created!');
      }
      setShowProjectForm(false);
      await fetchAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectApi.deleteProject(id);
      showToast('Project deleted.', 'error');
      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
  };

  // Skills
  const openSkillForm = (skill = null) => {
    setEditSkill(skill);
    setSkillForm(skill ? {
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience,
    } : defaultSkill);
    setFormError('');
    setShowSkillForm(true);
  };

  const handleSkillSubmit = async () => {
    if (!skillForm.name.trim() || !skillForm.category) {
      setFormError('Skill name and category are required.');
      return;
    }
    setSaving(true); setFormError('');
    try {
      if (editSkill) {
        await skillApi.updateSkill(editSkill._id, skillForm);
        showToast('Skill updated!');
      } else {
        await skillApi.addSkill(skillForm);
        showToast('Skill added!');
      }
      setShowSkillForm(false);
      await fetchAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await skillApi.deleteSkill(id);
      showToast('Skill deleted.', 'error');
      await fetchAll();
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
  };

  const closeProjectForm = () => { setShowProjectForm(false); setEditProject(null); setFormError(''); };
  const closeSkillForm = () => { setShowSkillForm(false); setEditSkill(null); setFormError(''); };

  if (loading) return <div className="loader-container"><div className="loader-ring" /></div>;

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--navy)' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 90, right: 24, zIndex: 200,
          padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          color: toast.type === 'error' ? '#FCA5A5' : '#6EE7B7',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem',
          animation: 'slideIn 0.25s ease',
          backdropFilter: 'blur(12px)',
        }}>
          {toast.type === 'error' ? '🗑️' : '✅'} {toast.msg}
        </div>
      )}

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Welcome banner */}
        <div style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,212,255,0.08))',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius)',
          marginBottom: 36,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem' }}>
              Hey, {user?.userName} 👋
            </h1>
            <p style={{ color: 'var(--slate)', fontSize: '0.9rem', marginTop: 4 }}>
              Manage your portfolio content · {projects.length} projects · {skills.length} skills
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="tag tag-cyan">{user?.role}</span>
            <span className="tag tag-green">Active</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--glass-border)', paddingBottom: 0 }}>
          {[
            { id: 'projects', label: `📁 Projects (${projects.length})` },
            { id: 'skills', label: `🎯 Skills (${skills.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.92rem', fontWeight: 500,
                color: tab === t.id ? 'var(--cyan)' : 'var(--slate)',
                borderBottom: tab === t.id ? '2px solid var(--cyan)' : '2px solid transparent',
                marginBottom: -1, transition: 'color 0.2s',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {tab === 'projects' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem' }}>My Projects</h2>
              <button className="btn-primary" onClick={() => openProjectForm()}>+ Add Project</button>
            </div>
            {projects.length === 0 ? (
              <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>📁</p>
                <p style={{ color: 'var(--slate)', marginBottom: 20 }}>No projects yet.</p>
                <button className="btn-primary" onClick={() => openProjectForm()}>Add Your First Project</button>
              </div>
            ) : (
              <div className="grid-2">
                {projects.map(p => (
                  <ProjectCard key={p._id} project={p} onEdit={openProjectForm} onDelete={handleDeleteProject} isAdmin />
                ))}
              </div>
            )}
          </>
        )}

        {/* Skills tab */}
        {tab === 'skills' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem' }}>My Skills</h2>
              <button className="btn-primary" onClick={() => openSkillForm()}>+ Add Skill</button>
            </div>
            {skills.length === 0 ? (
              <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🎯</p>
                <p style={{ color: 'var(--slate)', marginBottom: 20 }}>No skills yet.</p>
                <button className="btn-primary" onClick={() => openSkillForm()}>Add Your First Skill</button>
              </div>
            ) : (
              <div className="grid-3">
                {skills.map(s => (
                  <SkillCard key={s._id} skill={s} onEdit={openSkillForm} onDelete={handleDeleteSkill} isAdmin />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeProjectForm()}>
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem' }}>
                {editProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={closeProjectForm} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FormField label="Project Name" required>
                <input className="input-field" value={projForm.projectName} onChange={e => setProjForm(p => ({ ...p, projectName: e.target.value }))} placeholder="My Awesome Project" />
              </FormField>
              <FormField label="Details" required>
                <textarea className="input-field" rows={4} value={projForm.projectDetails} onChange={e => setProjForm(p => ({ ...p, projectDetails: e.target.value }))} placeholder="Describe your project in at least 20 words…" style={{ resize: 'vertical' }} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Technology" required>
                  <Select value={projForm.projectTechnology} onChange={e => setProjForm(p => ({ ...p, projectTechnology: e.target.value }))} options={TECH_OPTIONS} />
                </FormField>
                <FormField label="Status">
                  <Select value={projForm.status} onChange={e => setProjForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS.map(s => ({ value: s, label: s.replace('_', ' ') }))} />
                </FormField>
              </div>
              <FormField label="GitHub URL">
                <input className="input-field" type="url" value={projForm.githubUrl} onChange={e => setProjForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/user/repo" />
              </FormField>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn-primary" onClick={handleProjectSubmit} disabled={saving} style={{ flex: 1, padding: '12px' }}>
                  {saving ? 'Saving…' : editProject ? 'Update' : 'Create Project'}
                </button>
                <button className="btn-ghost" onClick={closeProjectForm} style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Form Modal */}
      {showSkillForm && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeSkillForm()}>
          <div className="modal-box" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem' }}>
                {editSkill ? 'Edit Skill' : 'New Skill'}
              </h2>
              <button onClick={closeSkillForm} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FormField label="Skill Name" required>
                <input className="input-field" value={skillForm.name} onChange={e => setSkillForm(s => ({ ...s, name: e.target.value }))} placeholder="e.g. React, Docker" />
              </FormField>
              <FormField label="Category" required>
                <Select value={skillForm.category} onChange={e => setSkillForm(s => ({ ...s, category: e.target.value }))} options={SKILL_CATS.map(c => ({ value: c, label: c.replace(/_/g, ' ') }))} />
              </FormField>
              <FormField label={`Proficiency — ${skillForm.proficiency}%`}>
                <input type="range" min={0} max={100} value={skillForm.proficiency}
                  onChange={e => setSkillForm(s => ({ ...s, proficiency: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--cyan)' }}
                />
                <div className="progress-bar" style={{ marginTop: 6 }}>
                  <div className="progress-fill" style={{ width: `${skillForm.proficiency}%` }} />
                </div>
              </FormField>
              <FormField label="Years of Experience">
                <input className="input-field" type="number" min={0} max={50} value={skillForm.yearsOfExperience}
                  onChange={e => setSkillForm(s => ({ ...s, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                />
              </FormField>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn-primary" onClick={handleSkillSubmit} disabled={saving} style={{ flex: 1, padding: '12px' }}>
                  {saving ? 'Saving…' : editSkill ? 'Update' : 'Add Skill'}
                </button>
                <button className="btn-ghost" onClick={closeSkillForm} style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;