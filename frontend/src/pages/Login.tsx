import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { ShieldCheck, LogIn, Sparkles, UserCheck, Stethoscope, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@pharma.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to standard numerals (0123456789)
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

            {/* Quick 1-Click Login Buttons */}
            <div className="p-3 mb-4 rounded-4" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-bold text-secondary d-flex align-items-center gap-1">
                  <Sparkles size={16} className="text-primary" /> دخول تجريبي فوري بنقرة واحدة:
                </span>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('admin')}
                  className="clay-btn clay-btn-primary flex-grow-1 py-2 text-sm"
                  style={{ fontSize: '0.85rem' }}
                >
                  <ShieldCheck size={16} /> دخول كمدير عام
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('rep')}
                  className="clay-btn clay-btn-secondary flex-grow-1 py-2 text-sm"
                  style={{ fontSize: '0.85rem' }}
                >
                  <UserCheck size={16} /> دخول كمندوب
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
                  placeholder="admin@pharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary d-flex align-items-center gap-2 mb-0">
                    <Lock size={16} /> كلمة المرور (الرمز السري)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-sm btn-link p-0 text-decoration-none text-muted small d-flex align-items-center gap-1"
                  >
                    {showPassword ? <><EyeOff size={14} /> إخفاء</> : <><Eye size={14} /> إظهار الرمز</>}
                  </button>
                </div>

                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="clay-input"
                    placeholder="admin123456"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="text-muted mt-1 small" style={{ fontSize: '0.75rem' }}>
                  💡 الرمز السري الافتراضي للمدير: <code className="text-primary fw-bold">admin123456</code> وللمندوب: <code className="text-primary fw-bold">rep123456</code>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="clay-btn clay-btn-primary w-100 py-3 fs-6"
              >
                {loading ? (
                  <span>جاري التحقق والمصادقة... ⏳</span>
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
                نظام مشفر 256-bit مع دعم تخزين البيانات السحابية والمحلية
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
