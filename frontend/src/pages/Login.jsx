import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials. Access restricted to admin only.');
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--navy)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem',
            background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>Shah.dev</p>
          <p style={{ color: 'var(--slate)', fontSize: '0.88rem' }}>Admin access only</p>
        </div>

        <div className="glass" style={{ padding: 36 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.4rem', marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: 'var(--slate)', fontSize: '0.88rem', marginBottom: 28 }}>Sign in to manage your portfolio</p>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>🔒 {error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>Email</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKey}
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--slate)', fontSize: '0.82rem', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', padding: 4,
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: 8, padding: '13px', fontSize: '1rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'var(--navy)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </div>

          <div style={{ marginTop: 24, padding: '14px 16px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 8 }}>
            <p style={{ color: 'var(--slate)', fontSize: '0.78rem', textAlign: 'center' }}>
              🔐 This portal is restricted to the portfolio owner only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;