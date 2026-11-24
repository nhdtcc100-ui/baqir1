import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck, LogIn, Sparkles, UserCheck, Pill, Lock,
  Mail, Eye, EyeOff, Database, FileSpreadsheet, UserPlus,
  ExternalLink, CheckCircle2, MapPin
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Sign in state
  const [identifier, setIdentifier] = useState('baqer');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('pharma_google_sheet_url') || '');

  // Registration state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regArea, setRegArea] = useState('الرصافة');
  const [regSheetUrl, setRegSheetUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const normalizeDigits = (str: string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[٠-٩]/g, (w) => arabicDigits.indexOf(w).toString());
  };

  const executeLogin = async (loginId: string, loginPass: string) => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (sheetUrl.trim()) {
        localStorage.setItem('pharma_google_sheet_url', sheetUrl.trim());
      }
      const cleanId = loginId.trim();
      const cleanPass = normalizeDigits(loginPass.trim());
      const res = await api.login(cleanId, cleanPass);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'الاسم أو رمز المرور غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(identifier, password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regFullName.trim()) {
      setError('يرجى إدخال الاسم الكامل للمندوب');
      return;
    }
    if (!regUsername.trim()) {
      setError('يرجى إدخال اسم المستخدم أو المعرف');
      return;
    }
    if (!regPin.trim() || regPin.trim().length < 6) {
      setError('الرمز السري (PIN) يجب أن يتكون من 6 أرقام أو أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const cleanPin = normalizeDigits(regPin.trim());
      const res = await api.register({
        fullName: regFullName.trim(),
        username: regUsername.trim(),
        pin: cleanPin,
        area: regArea,
        sheetUrl: regSheetUrl.trim()
      });
      setSuccessMsg('تم تسجيل الحساب بنجاح! جاري تحويلك للمنظومة...');
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الحساب، يرجى المحاولة مجدداً');
    } finally {
      setLoading(false);
    }
  };

  const quickAccounts = [
    {
      title: 'د. باقر (مدير عام)',
      role: 'admin',
      id: 'baqer',
      pass: '123456',
      icon: <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />,
      desc: 'صلاحيات كاملة + اعتماد الفواتير'
    },
    {
      title: 'مشرف المبيعات',
      role: 'supervisor',
      id: 'supervisor',
      pass: '123456',
      icon: <UserCheck size={14} style={{ color: '#059669' }} />,
      desc: 'متابعة شبكة التوزيع'
    },
    {
      title: 'علي حسن (الرصافة)',
      role: 'medical_rep',
      id: 'rusafa',
      pass: '123456',
      icon: <MapPin size={14} style={{ color: '#0284c7' }} />,
      desc: 'مندوب قاطع الرصافة'
    },
    {
      title: 'أحمد خليل (الكرخ)',
      role: 'medical_rep',
      id: 'karkh',
      pass: '123456',
      icon: <MapPin size={14} style={{ color: '#d97706' }} />,
      desc: 'مندوب قاطع الكرخ'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div className="card animate-in" style={{ padding: '2rem 1.75rem', borderRadius: 20 }}>

          {/* Brand Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
            }}>
              <Pill size={34} />
            </div>
            <h2 style={{ fontWeight: 900, color: 'var(--gray-900)', fontSize: '1.35rem', margin: '0 0 0.35rem' }}>
              منظومة مبيعات المندوبين وفواتير الصيدليات
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0 }}>
              استخراج ذكي لبيانات الفواتير (AI OCR) ومزامنة سحابية مع Google Sheets & Supabase
            </p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                <Database size={11} /> سوبا بيس & كيت هاب
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                <FileSpreadsheet size={11} /> ربط كوكل شيت المباشر
              </span>
            </div>
          </div>

          {/* Tab Selector: Login vs Register */}
          <div className="tab-pills mb-3" style={{ background: '#f1f5f9', padding: '4px', borderRadius: 12 }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`tab-pill ${activeTab === 'login' ? 'active' : ''}`}
              style={{ fontWeight: 800, fontSize: '0.85rem' }}
            >
              <LogIn size={15} /> تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`tab-pill ${activeTab === 'register' ? 'active' : ''}`}
              style={{ fontWeight: 800, fontSize: '0.85rem' }}
            >
              <UserPlus size={15} /> تسجيل حساب جديد
            </button>
          </div>

          {/* Error & Success Banners */}
          {error && (
            <div className="alert-danger mb-3" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }}>
              <span>⚠️ {error}</span>
            </div>
          )}
          {successMsg && (
            <div className="alert-success mb-3" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }}>
              <CheckCircle2 size={16} /> <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <>
              {/* 1-Click Quick Login Buttons for the 4 Accounts */}
              <div style={{
                background: 'var(--gray-50)',
                border: '1px solid var(--gray-200)',
                borderRadius: 14,
                padding: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  دخول سريع بنقرة واحدة (حسابات النظام الـ 4):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                  {quickAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setIdentifier(acc.id);
                        setPassword(acc.pass);
                        executeLogin(acc.id, acc.pass);
                      }}
                      className="btn-clay btn-secondary btn-sm"
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        padding: '0.45rem 0.6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        textAlign: 'right'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                        {acc.icon}
                        <span style={{ color: 'var(--gray-900)' }}>{acc.title}</span>
                      </div>
                      <span style={{ fontSize: '0.66rem', color: 'var(--gray-500)', fontWeight: 600 }}>{acc.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    الاسم أو اسم المستخدم (Username / Name)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="clay-input"
                      style={{ paddingRight: '2.5rem', fontSize: '0.9rem' }}
                      placeholder="مثال: baqer أو علي حسن أو supervisor"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                    <UserCheck size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', margin: 0 }}>
                      الرمز السري (PIN / Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
                    >
                      {showPassword ? 'إخفاء' : 'إظهار الرمز'}
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="clay-input"
                      style={{ paddingRight: '2.5rem', fontSize: '0.9rem' }}
                      placeholder="123456"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  </div>
                </div>

                {/* Google Sheet URL Optional Direct Link Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FileSpreadsheet size={14} style={{ color: '#059669' }} />
                      رابط جدول كوكل شيت (Google Sheet)
                    </label>
                    {sheetUrl && (
                      <a
                        href={sheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.72rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700 }}
                      >
                        فتح الشيت <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    className="clay-input"
                    style={{ fontSize: '0.78rem', padding: '0.45rem 0.65rem' }}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                  />
                  <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: 3 }}>
                    يتم حفظ ومزامنة الفواتير مباشرة مع هذا الشيت عند تسجيل الدخول
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-clay btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.98rem', fontWeight: 800, marginTop: '0.35rem' }}
                >
                  {loading ? 'جاري التحقق...' : (
                    <><LogIn size={18} /> تسجيل الدخول</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Registration Tab */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  الاسم الكامل للمندوب
                </label>
                <input
                  type="text"
                  className="clay-input"
                  placeholder="مثال: حسين كريم"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  اسم المستخدم أو المعرف (Username)
                </label>
                <input
                  type="text"
                  className="clay-input"
                  placeholder="مثال: hussien"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  الرمز السري (PIN / Password - 6 أرقام على الأقل)
                </label>
                <input
                  type="password"
                  className="clay-input"
                  placeholder="123456"
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  منطقة العمل / المحافظة
                </label>
                <select
                  className="clay-input"
                  value={regArea}
                  onChange={(e) => setRegArea(e.target.value)}
                >
                  <option value="الرصافة">بغداد / الرصافة</option>
                  <option value="الكرخ">بغداد / الكرخ</option>
                  <option value="المنصور">بغداد / المنصور</option>
                  <option value="الكرادة">بغداد / الكرادة</option>
                  <option value="البصرة">البصرة</option>
                  <option value="أربيل">أربيل</option>
                  <option value="النجف">النجف الأشرف</option>
                  <option value="كربلاء">كربلاء المقدسة</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  رابط جدول كوكل شيت المخصص للمبيعات (اختياري)
                </label>
                <input
                  type="url"
                  className="clay-input"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={regSheetUrl}
                  onChange={(e) => setRegSheetUrl(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-clay btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.98rem', fontWeight: 800, marginTop: '0.5rem', background: '#059669', borderColor: '#047857' }}
              >
                {loading ? 'جاري التسجيل...' : (
                  <><UserPlus size={18} /> تسجيل الحساب والدخول فوراً</>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
