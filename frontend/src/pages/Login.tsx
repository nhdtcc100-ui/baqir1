import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { ShieldCheck, LogIn, Sparkles, UserCheck, Pill, Lock, Mail, Eye, EyeOff, Database } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@pharma.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeDigits = (str: string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[٠-٩]/g, (w) => arabicDigits.indexOf(w).toString());
  };

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setLoading(true);

    try {
      const cleanEmail = loginEmail.trim().toLowerCase();
      const cleanPass = normalizeDigits(loginPass.trim());
      const res = await api.login(cleanEmail, cleanPass);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickLogin = (role: 'admin' | 'rep') => {
    if (role === 'admin') {
      setEmail('admin@pharma.com');
      setPassword('admin123456');
      executeLogin('admin@pharma.com', 'admin123456');
    } else {
      setEmail('rep@pharma.com');
      setPassword('rep123456');
      executeLogin('rep@pharma.com', 'rep123456');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'
    }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        <div className="card animate-in" style={{ padding: '2.5rem 2rem' }}>
          
          {/* Brand Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
            }}>
              <Pill size={36} />
            </div>
            <h2 style={{ fontWeight: 900, color: 'var(--gray-900)', fontSize: '1.4rem', margin: '0 0 0.4rem' }}>
              منظومة مبيعات المندوبين الدوائية
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', margin: 0 }}>
              نظام معالجة فواتير الصيدليات (AI OCR) وإدارة شبكة التوزيع
            </p>
            <div style={{ marginTop: '0.6rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                <Database size={11} /> متصل بـ Supabase Docker
              </span>
            </div>
          </div>

          {/* 1-Click Quick Login Buttons */}
          <div style={{
            background: 'var(--gray-50)',
            border: '1px solid var(--gray-200)',
            borderRadius: 14,
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              تسجيل دخول سريع للتجربة:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('admin')}
                className="btn-clay btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', fontWeight: 700 }}
              >
                <ShieldCheck size={14} style={{ color: 'var(--primary)' }} /> مدير عام
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('rep')}
                className="btn-clay btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', fontWeight: 700 }}
              >
                <UserCheck size={14} style={{ color: 'var(--success)' }} /> مندوب مبيعات
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="alert-danger mb-4">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                البريد الإلكتروني
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="clay-input"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="admin@pharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', margin: 0 }}>
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  {showPassword ? 'إخفاء' : 'إظهار الرمز'}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="clay-input"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="admin123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-clay btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem' }}
            >
              {loading ? 'جاري التحقق...' : (
                <><LogIn size={18} /> تسجيل الدخول</>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
