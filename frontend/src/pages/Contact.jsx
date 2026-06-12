import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    // Fallback: open default mail client with pre-filled content
    // (Replace with EmailJS / Formspree for real sending)
    const mailto = `mailto:shah@example.com?subject=${encodeURIComponent(subject || `Portfolio contact from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

    try {
      window.location.href = mailto;
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 800);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please email me directly.');
    }
  };

  const contactItems = [
    { icon: '📧', label: 'Email', value: 'shah@example.com', href: 'mailto:ctech8868@gmail.com' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/johndoe', href: 'https://www.linkedin.com/in/shah-faisal-20b21a253/?trk=contact-info' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/shah65', href: 'https://github.com/shah65' },
    { icon: '📱', label: 'Phone', value: '+92 300 1234567', href: 'tel:+923001234567' },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', background: 'var(--navy-2)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <p style={{ color: 'var(--cyan)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Let's Talk</p>
          <h1 className="section-title">Get In <span className="gradient-text">Touch</span></h1>
          <div className="divider" />
          <p className="section-subtitle">Have a project in mind? I'd love to hear about it.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contactItems.map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="glass"
                  style={{
                    padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14,
                    textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <span style={{ fontSize: '1.4rem', width: 36, textAlign: 'center' }}>{item.icon}</span>
                  <div>
                    <p style={{ color: 'var(--slate)', fontSize: '0.75rem', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ color: 'var(--white)', fontSize: '0.9rem', fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</p>
                  </div>
                </a>
              ))}

              <div className="glass" style={{ padding: 20, marginTop: 8 }}>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                  Currently <span style={{ color: 'var(--green)', fontWeight: 500 }}>available</span> for new opportunities.
                  Response time is usually within 24 hours.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {['Full-time', 'Freelance', 'Remote'].map(t => (
                    <span key={t} className="tag tag-green">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.3rem', marginBottom: 24 }}>Send a Message</h2>

              {status === 'success' && (
                <div className="alert alert-success">
                  ✅ Your mail client opened — just hit send!
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-error">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>Name *</label>
                    <input className="input-field" value={formData.name} onChange={set('name')} placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>Email *</label>
                    <input className="input-field" type="email" value={formData.email} onChange={set('email')} placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>Subject</label>
                  <input className="input-field" value={formData.subject} onChange={set('subject')} placeholder="What's this about?" />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>Message *</label>
                  <textarea
                    className="input-field"
                    value={formData.message}
                    onChange={set('message')}
                    placeholder="Tell me about your project or idea…"
                    rows={5}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                  style={{ fontSize: '1rem', padding: '13px' }}
                >
                  {status === 'loading' ? 'Opening…' : 'Send Message →'}
                </button>

                <p style={{ color: 'var(--slate)', fontSize: '0.78rem', textAlign: 'center' }}>
                  This will open your default mail client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default Contact;