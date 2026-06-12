import { useEffect } from 'react';

const useReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const About = () => {
  useReveal();

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero banner */}
      <section style={{ padding: '80px 0 60px', background: 'linear-gradient(180deg, var(--navy-2) 0%, var(--navy) 100%)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <p style={{ color: 'var(--cyan)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>About Me</p>
          <h1 className="section-title">Passionate about building things<br />
            <span className="gradient-text">that actually work</span>
          </h1>
          <div className="divider" />
          <p className="section-subtitle">
            I'm a Full Stack Developer from Pakistan, specializing in the MERN stack and modern backend architecture.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* Left col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="glass reveal" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.6rem' }}>👨‍💻</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem', color: 'var(--cyan)' }}>Who Am I?</h2>
                </div>
                <p style={{ color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  I'm a passionate Full Stack Developer with 1.5+ years of experience building web applications.
                  I love solving complex problems and creating elegant solutions. My journey started with curiosity and grew into a career building real-world systems.
                </p>
              </div>

              <div className="glass reveal" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.6rem' }}>🎯</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem', color: 'var(--cyan)' }}>Career Goals</h2>
                </div>
                <p style={{ color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  My goal is to become a lead architect at a tech company — building scalable applications that impact millions of users.
                  I'm particularly drawn to AI integration, cloud architecture, and distributed systems.
                </p>
              </div>

              <div className="glass reveal" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.6rem' }}>⚡</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem', color: 'var(--cyan)' }}>Tech Interests</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['AI / ML', 'Cloud Computing', 'DevOps', 'Web3', 'Mobile Dev', 'Cybersecurity', 'Blockchain', 'System Design'].map(interest => (
                    <span key={interest} className="tag tag-violet">{interest}</span>
                  ))}
                </div>
              </div>

              <div className="glass reveal" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.6rem' }}>💼</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem', color: 'var(--cyan)' }}>Available For</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Full-time', 'Freelance', 'Remote Work', 'Open Source'].map(t => (
                    <span key={t} className="tag tag-green">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col - Education timeline */}
            <div>
              <div className="glass reveal" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                  <span style={{ fontSize: '1.6rem' }}>🎓</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem', color: 'var(--cyan)' }}>Education</h2>
                </div>

                {[
                  {
                    degree: "Bachelor's in Computer Science",
                    school: "Abdul Wali Khan University",
                    year: '2020 – 2024',
                    note: 'GPA: 3.8 / 4.0',
                    icon: '🏛️',
                  },
                  {
                    degree: 'Full Stack Development Certification',
                    school: 'Meta Backend Professional Certificate',
                    year: '2023',
                    note: 'Coursera — Verified',
                    icon: '📜',
                  },
                  {
                    degree: 'MERN Stack Bootcamp',
                    school: 'Self-directed + Online Platforms',
                    year: '2022 – 2023',
                    note: '6 months intensive',
                    icon: '💡',
                  },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < arr.length - 1 ? 28 : 0, position: 'relative' }}>
                    {/* Timeline line */}
                    {i < arr.length - 1 && (
                      <div style={{
                        position: 'absolute', left: 19, top: 38, bottom: 0, width: 1,
                        background: 'linear-gradient(180deg, var(--cyan-dim), transparent)',
                      }} />
                    )}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--navy-3)', border: '1px solid var(--glass-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', zIndex: 1,
                    }}>{item.icon}</div>
                    <div>
                      <p style={{ color: 'var(--slate)', fontSize: '0.75rem', marginBottom: 4 }}>{item.year}</p>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: 'var(--white)', marginBottom: 4 }}>{item.degree}</h3>
                      <p style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>{item.school}</p>
                      <span className="tag tag-cyan" style={{ marginTop: 8, display: 'inline-block' }}>{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default About;