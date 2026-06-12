import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScrollScene3D from '../components/3d/ScrollScene3D';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Typewriter hook
const useTypewriter = (words, speed = 80, pause = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < currentWord.length) {
          setText(currentWord.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIndex > 0) {
          setText(currentWord.slice(0, charIndex - 1));
          setCharIndex(c => c - 1);
        } else {
          setDeleting(false);
          setWordIndex(i => (i + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return text;
};

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const role = useTypewriter(['Full Stack Developer', 'MERN Stack Engineer', 'Problem Solver', 'Open Source Contributor']);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springScale = useSpring(scale, springConfig);

  // Update scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '200vh', position: 'relative' }}>
      {/* Scroll Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ff6b6b)',
        zIndex: 1000,
        transition: 'width 0.1s ease',
      }} />

      {/* Three.js Background with Scroll Effects */}
      <ScrollScene3D />

      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 1,
          y,
          opacity,
          scale: springScale,
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ maxWidth: 700 }}
          >
            {isAuthenticated && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="tag tag-green"
                style={{ marginBottom: 20, display: 'inline-block' }}
              >
                ✅ Logged in as {user?.userName}
              </motion.span>
            )}

            <motion.p
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                color: 'var(--cyan)',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 16
              }}
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: 20,
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff6b6b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Shah Faisal
            </motion.h1>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ height: 60, display: 'flex', alignItems: 'center', marginBottom: 24 }}
            >
              <span style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: 'var(--slate)', fontFamily: "'Space Grotesk', sans-serif" }}>
                {role}
                <span className="cursor" />
              </span>
            </motion.div>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ color: 'var(--slate)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 560, marginBottom: 40 }}
            >
              Building scalable web applications with clean code and thoughtful architecture.
              Passionate about turning complex problems into elegant solutions.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Link to="/projects" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                View My Work
              </Link>
              <Link to="/contact" className="btn-ghost" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Get In Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--slate)',
            fontSize: '0.75rem',
            zIndex: 2,
          }}
        >
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.section>

      {/* Stats Section with Scroll Animation */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, rgba(10, 15, 26, 0.95) 0%, #0a0f1a 100%)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}
          >
            {[
              { value: '3+', label: 'Years Experience', icon: '💼' },
              { value: '15+', label: 'Projects Built', icon: '🚀' },
              { value: 'MERN', label: 'Primary Stack', icon: '⚛️' },
              { value: '24/7', label: 'Support', icon: '🔄' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="reveal"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>{stat.icon}</div>
                <p className="gradient-text" style={{ fontSize: '2.5rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>{stat.value}</p>
                <p style={{ color: 'var(--slate)', fontSize: '0.9rem', marginTop: 6 }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section style={{ padding: '100px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <p style={{ color: 'var(--cyan)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Expertise</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Technologies I <span className="gradient-text">Master</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}
          >
            {['React', 'Node.js', 'MongoDB', 'Express', 'Three.js', 'Tailwind', 'Docker', 'Redis'].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  padding: '12px 24px',
                  borderRadius: 40,
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  color: 'var(--slate)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;