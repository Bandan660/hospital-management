import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Hospital, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm]               = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', form);
      setAuth(data.data.token, data.data.user);
      toast.success(`Welcome back, ${data.data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'bandan@hospital.com', password: 'Admin@123' });
    setError('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div style={{
        width: '50%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="hidden lg:flex"
      >
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto' }}>
          <div style={{
            width: '42px', height: '42px',
            background: '#0d9488',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(13,148,136,0.4)',
          }}>
            <Hospital size={22} color="white" />
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '18px', lineHeight: 1 }}>MediCare</p>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Hospital Management</p>
          </div>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>

          {/* Heading */}
          <div>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
              Modern Healthcare<br />
              <span style={{ color: '#2dd4bf' }}>Management System</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px' }}>
              Streamline patient care, appointments, and hospital operations with our comprehensive platform.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { value: '10K+', label: 'Patients' },
              { value: '500+', label: 'Doctors' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <p style={{ color: '#2dd4bf', fontWeight: 700, fontSize: '22px' }}>{stat.value}</p>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Patient registration & management',
              'Smart appointment scheduling',
              'Real-time dashboard analytics',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#0d9488" />
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: '#475569', fontSize: '12px' }}>© 2026 MediCare. All rights reserved.</p>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div style={{
        flex: 1,
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
          }}>

            {/* Heading */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Welcome back 👋
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sign in to your admin account</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '10px', padding: '12px 14px',
                marginBottom: '20px',
              }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ color: '#dc2626', fontSize: '13px' }}>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@hospital.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '11px 42px 11px 42px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#9ca3af',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: loading ? '#5eead4' : '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
                  transition: 'background 0.2s',
                  boxSizing: 'border-box',
                }}
              >
                {loading ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8v8z" fill="white" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>Demo Credentials</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            {/* Demo card */}
            <div
              onClick={fillDemo}
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0d9488')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{
                width: '36px', height: '36px',
                background: '#ccfbf1',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Lock size={15} color="#0d9488" />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Admin Account</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  bandan@hospital.com • Admin@123
                </p>
              </div>
              <p style={{ marginLeft: 'auto', fontSize: '12px', color: '#0d9488', fontWeight: 500 }}>
                Click to fill →
              </p>
            </div>
          </div>

          {/* Bottom */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '20px' }}>
            🔒 Protected by enterprise-grade security
          </p>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;