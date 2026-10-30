import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { ShieldCheck, LogIn, Sparkles, UserCheck, Stethoscope, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@pharma.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول، تأكد من صحة البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'rep') => {
    if (role === 'admin') {
      setEmail('admin@pharma.com');
      setPassword('admin123456');
    } else {
      setEmail('rep@pharma.com');
      setPassword('rep123456');
    }
    setError(null);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-5">
          {/* Main Claymorphism Login Card */}
          <div className="clay-card p-4 p-md-5 animate-fade-in" style={{ background: '#ffffff' }}>
            
            {/* Header / Brand Logo */}
            <div className="text-center mb-4">
              <div 
                className="clay-stat-icon mx-auto mb-3"
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  width: '68px',
                  height: '68px',
                  borderRadius: '22px'
                }}
              >
                <Stethoscope size={36} />
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>
                نظام مبيعات المندوبين وفواتير الصيدليات
              </h3>
              <p className="text-muted small mb-0">
                منظومة المعالجة الذكية للفواتير (AI OCR) وإدارة شبكة التوزيع
              </p>
            </div>

            {/* Quick Demo Switchers */}
            <div className="p-3 mb-4 rounded-4" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-bold text-secondary d-flex align-items-center gap-1">
                  <Sparkles size={16} className="text-primary" /> تجربة سريعة بنقرة واحدة:
                </span>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className={`clay-btn flex-grow-1 py-2 text-sm ${email.includes('admin') ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  <ShieldCheck size={16} /> مدير النظام
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('rep')}
                  className={`clay-btn flex-grow-1 py-2 text-sm ${email.includes('rep') ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  <UserCheck size={16} /> المندوب الميداني
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert clay-card py-2 px-3 mb-3 border-danger-subtle text-danger small d-flex align-items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary d-flex align-items-center gap-2">
                  <Mail size={16} /> البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="clay-input"
                  placeholder="name@pharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary d-flex align-items-center gap-2">
                  <Lock size={16} /> كلمة المرور
                </label>
                <input
                  type="password"
                  className="clay-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="clay-btn clay-btn-primary w-100 py-3 fs-6"
              >
                {loading ? (
                  <span>جاري التحقق والمصادقة...</span>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>دخول المنظومة</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">
                محمي بتشفير 256-bit وقواعد الصلاحيات المتقدمة (RBAC)
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
