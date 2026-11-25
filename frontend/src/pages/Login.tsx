import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { normalizeDigits } from '../utils/adminUsersSheet';
import {
  ShieldCheck, LogIn, UserCheck, Pill, Lock,
  Eye, EyeOff, Database, FileSpreadsheet, UserPlus,
  CheckCircle2, KeyRound
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Sign in state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration state (medical_rep only)
  const [regFullName, setRegFullName] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regArea, setRegArea] = useState('الرصافة');
  const [regSheetUrl, setRegSheetUrl] = useState('');
  const [regWebhookUrl, setRegWebhookUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanId = identifier.trim();
    const cleanPass = normalizeDigits(password.trim());
    if (!cleanId || !cleanPass) {
      setError('يرجى إدخال الاسم والرمز السري المطابقين للشيت الرئيسي');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(cleanId, cleanPass);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'الاسم أو الرمز السري غير متطابق مع قاعدة البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regFullName.trim()) {
      setError('يرجى إدخال الاسم الكامل للمندوب');
      return;
    }
    const cleanPin = normalizeDigits(regPin.trim());
    if (!cleanPin || cleanPin.length < 4) {
      setError('الرمز السري (PIN) يجب أن يتكون من 4 أرقام أو أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        fullName: regFullName.trim(),
        username: regFullName.trim(),
        pin: cleanPin,
        area: regArea,
        sheetUrl: regSheetUrl.trim(),
        webhookUrl: regWebhookUrl.trim()
      });
      setSuccessMsg('تم تسجيل حساب المندوب في الشيت الرئيسي بنجاح! جاري الدخول...');
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الحساب، يرجى المحاولة مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'
    }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
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
            <h2 style={{ fontWeight: 900, color: 'var(--gray-900)', fontSize: '1.32rem', margin: '0 0 0.35rem' }}>
              منظومة مبيعات المندوبين وفواتير الصيدليات
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0 }}>
              تحقق مباشر من قاعدة بيانات Google Sheets الرئيسية — لكل مستخدم صفحته الخاصة
            </p>
            <div style={{ marginTop: '0.55rem', display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                <Database size={11} /> تطابق تام مع الشيت الرئيسي
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                <FileSpreadsheet size={11} /> عزل صفحة كل مندوب
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
              <UserPlus size={15} /> تسجيل مندوب جديد
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
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '0.75rem 0.9rem',
                marginBottom: '1.1rem',
                fontSize: '0.76rem',
                color: '#334155',
                lineHeight: 1.6
              }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                  آلية الدخول وصلاحيات قاعدة البيانات:
                </div>
                <div>• يجب تطابق <strong>الاسم</strong> و<strong>الرمز السري</strong> مع السجل المسجل في الشيت الرئيسي.</div>
                <div>• يفتح حساب <strong>باقر</strong> كأدمن مع صلاحية إدارة الشيت الرئيسي، ويدخل البقية كمندوبين بصفحاتهم الخاصة.</div>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    الاسم المسجل في الشيت
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="clay-input"
                      style={{ paddingRight: '2.5rem', fontSize: '0.92rem' }}
                      placeholder="مثال: باقر علي أو keko1"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      autoComplete="username"
                      required
                    />
                    <UserCheck size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', margin: 0 }}>
                      الرمز السري
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {showPassword ? <><EyeOff size={13} /> إخفاء</> : <><Eye size={13} /> إظهار الرمز</>}
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="clay-input"
                      style={{ paddingRight: '2.5rem', fontSize: '0.92rem' }}
                      placeholder="أدخل الرمز السري..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <Lock size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-clay btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.98rem', fontWeight: 800, marginTop: '0.35rem' }}
                >
                  {loading ? 'جاري التحقق من قاعدة البيانات...' : (
                    <><LogIn size={18} /> تسجيل الدخول</>
                  )}
                </button>
              </form>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.74rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <KeyRound size={12} /> يمكن للمندوبين تغيير الاسم والرمز لاحقاً من قائمة «حسابي» داخل التطبيق
              </div>
            </>
          ) : (
            /* Registration Tab (medical_rep only) */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  الاسم (للدخول وظهور المندوب) *
                </label>
                <input
                  type="text"
                  className="clay-input"
                  placeholder="مثال: keko3 أو حسين كريم"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  الرمز السري (PIN / Password) *
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
                  رابط صفحة كوكل شيت الخاصة بالمندوب
                </label>
                <input
                  type="url"
                  className="clay-input"
                  style={{ direction: 'ltr', fontSize: '0.8rem' }}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={regSheetUrl}
                  onChange={(e) => setRegSheetUrl(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                  رابط Apps Script الخاص بالمندوب (اختياري)
                </label>
                <input
                  type="url"
                  className="clay-input"
                  style={{ direction: 'ltr', fontSize: '0.8rem' }}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={regWebhookUrl}
                  onChange={(e) => setRegWebhookUrl(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-clay btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.98rem', fontWeight: 800, marginTop: '0.4rem', background: '#059669', borderColor: '#047857' }}
              >
                {loading ? 'جاري التسجيل في الشيت الرئيسي...' : (
                  <><UserPlus size={18} /> تسجيل كمندوب والدخول</>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
