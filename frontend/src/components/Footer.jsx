const Footer = () => {
  return (
    <footer style={{
      background: 'var(--navy-2)',
      borderTop: '1px solid var(--glass-border)',
      padding: '40px 0',
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: '1.2rem',
          background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>
          Shah.dev
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/shah65' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/johndoe' },
          ].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--slate)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--slate)'}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Shah Faisal. Built with React &amp; ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;