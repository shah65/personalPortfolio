import { useState, useEffect, useRef } from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const [search, setSearch] = useState('');
  const [filterTech, setFilterTech] = useState('ALL');
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  // Scroll reveal with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            setVisibleCards(prev => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal-card');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [projects, filterTech, search]);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get unique technologies
  const technologies = ['ALL', ...new Set(projects.map(p => p.projectTechnology))];

  // Filter projects
  const filtered = projects.filter(p => {
    const matchSearch = p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectDetails?.toLowerCase().includes(search.toLowerCase());
    const matchTech = filterTech === 'ALL' || p.projectTechnology === filterTech;
    return matchSearch && matchTech;
  });

  // Animation variants for staggered cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 200,
      },
    },
  };

  if (loading) return (
    <div className="loader-container">
      <div className="loader-ring" />
      <div className="loader-text">Loading Projects...</div>
      <style>{`
        .loader-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          background: linear-gradient(135deg, #0a0f1a 0%, #0f1622 100%);
        }
        .loader-ring {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(0, 212, 255, 0.1);
          border-radius: 50%;
          border-top-color: var(--cyan);
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .loader-text {
          color: var(--slate);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          letter-spacing: 2px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ paddingTop: 80, overflowX: 'hidden' }}>
      {/* Hero Section with Parallax */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: '100px 0 80px',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1622 100%)',
          borderBottom: '1px solid var(--glass-border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Particles */}
        <div className="hero-particles" />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p style={{
              color: 'var(--cyan)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 12,
              display: 'inline-block',
              padding: '4px 12px',
              background: 'rgba(0, 212, 255, 0.1)',
              borderRadius: 20,
            }}>
              📁 Portfolio
            </p>
          </motion.div>

          <motion.h1
            className="section-title"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            Things I've <span className="gradient-text">Built</span>
          </motion.h1>

          <motion.div
            className="divider"
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ height: '3px', background: 'linear-gradient(90deg, var(--cyan), var(--purple))', margin: '20px 0' }}
          />

          <motion.p
            className="section-subtitle"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ fontSize: '1.1rem', color: 'var(--slate)' }}
          >
            Real-world projects spanning web apps, APIs, and more.
          </motion.p>
        </div>

        <style>{`
          .hero-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 50%);
            pointer-events: none;
            animation: particleFloat 20s ease-in-out infinite;
          }
          @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(0, -20px); }
          }
        `}</style>
      </motion.section>

      {/* Projects Section */}
      <section className="section" ref={sectionRef} style={{ padding: '60px 0', background: 'var(--navy-1)' }}>
        <div className="container">
          {/* Search + Filter with Animations */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ marginBottom: 50, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}
          >
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)' }}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </motion.svg>
              <input
                className="input-field"
                placeholder="Search projects by name or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  paddingLeft: 48,
                  paddingRight: 20,
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12,
                  padding: '14px 20px 14px 48px',
                  color: 'var(--text-primary)',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {/* Filter Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
            >
              {technologies.map((tech, index) => (
                <motion.button
                  key={tech}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterTech(tech)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 40,
                    border: '1px solid',
                    borderColor: filterTech === tech ? 'var(--cyan)' : 'var(--glass-border)',
                    background: filterTech === tech ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.15))' : 'rgba(255, 255, 255, 0.02)',
                    color: filterTech === tech ? 'var(--cyan)' : 'var(--slate)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {tech === 'ALL' ? '✨ All Projects' : tech}
                  {filterTech === tech && tech !== 'ALL' && (
                    <span style={{ marginLeft: 8, fontSize: '0.7rem' }}>✓</span>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '0.85rem', color: 'var(--slate)' }}
            >
              Found <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{filtered.length}</span> projects
              {search && ` matching "${search}"`}
              {filterTech !== 'ALL' && ` in ${filterTech}`}
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="alert alert-error"
                style={{
                  padding: '16px 24px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 12,
                  marginBottom: 30,
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects Grid with Stagger Animation */}
          {filtered.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass"
              style={{
                padding: 80,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 24,
              }}
            >
              <motion.p
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ fontSize: '3rem', marginBottom: 16 }}
              >
                🔍
              </motion.p>
              <p style={{ color: 'var(--slate)', fontSize: '1.1rem' }}>No projects found. Try a different search.</p>
              <button
                onClick={() => { setSearch(''); setFilterTech('ALL'); }}
                style={{
                  marginTop: 20,
                  padding: '8px 20px',
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid var(--cyan)',
                  borderRadius: 8,
                  color: 'var(--cyan)',
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="grid-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 30,
              }}
            >
              {filtered.map((project, index) => (
                <motion.div
                  key={project._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="reveal-card"
                  id={`project-${project._id}`}
                  custom={index}
                  style={{
                    opacity: 0,
                    transform: 'translateY(30px)',
                    transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Scroll to Top Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              width: 50,
              height: 50,
              borderRadius: 25,
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              border: 'none',
              cursor: 'pointer',
              zIndex: 100,
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
            }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </section>

      <style>{`
        .reveal-card.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }
        
        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        
        .input-field:focus {
          outline: none;
          border-color: var(--cyan);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Projects;