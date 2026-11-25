import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { ADMIN_SHEET_URL } from '../utils/adminUsersSheet';
import {
  UserCheck, Lock, Save, CheckCircle2, AlertCircle, Eye, EyeOff,
  FileSpreadsheet, ExternalLink, ShieldCheck, KeyRound, RefreshCw
} from 'lucide-react';

interface ProfileSettingsProps {
  user: User;
  onUserUpdated: (updated: User) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUserUpdated }) => {
  const [newName, setNewName] = useState(user.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isAdmin = user.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = newName.trim();
    const trimmedCurPwd = currentPassword.trim();
    const trimmedNewPwd = newPassword.trim();
    const trimmedConf = confirmPassword.trim();

    if (!trimmedCurPwd) {
      setError('يرجى إدخال الرمز السري الحالي للتحقق من الهوية قبل الحفظ');
      return;
    }

    const nameChanged = trimmedName && trimmedName !== user.full_name.trim();
    const pwdChanged = Boolean(trimmedNewPwd);

    if (!nameChanged && !pwdChanged) {
      setError('لم تقم بتغيير الاسم أو إدخال رمز سري جديد');
      return;
    }

    if (trimmedName.length < 2) {
      setError('الاسم يجب أن يتكون من حرفين على الأقل');
      return;
    }

    if (pwdChanged) {
      if (trimmedNewPwd.length < 4) {
        setError('الرمز السري الجديد يجب أن يتكون من 4 أحرف أو أرقام على الأقل');
        return;
      }
      if (trimmedNewPwd !== trimmedConf) {
        setError('الرمز السري الجديد وتأكيده غير متطابقين');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await api.updateUserProfile({
        currentPassword: trimmedCurPwd,
        newName: nameChanged ? trimmedName : undefined,
        newPassword: pwdChanged ? trimmedNewPwd : undefined,
        confirmPassword: pwdChanged ? trimmedConf : undefined
      });
      onUserUpdated(res.user);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg(
        res.verifiedInSheet
          ? '✅ تم تعديل البيانات وحفظها وتوثيقها مباشرة في جدول كوكل شيت الرئيسي!'
          : '✅ تم إرسال التعديل لجدول كوكل شيت وتحديث جلستك الحالية! (ملاحظة: تأكد من نشر Apps Script الإصدار 5 على الشيت الرئيسي لتطبيق التعديل مباشرة إن لم يظهر فوراً).'
      );
    } catch (err: any) {
      setError(err?.message || 'تعذر حفظ التعديلات، يرجى المحاولة مجدداً');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-success'}`}>
              <ShieldCheck size={13} /> {isAdmin ? 'حساب مدير النظام (الأدمن)' : 'حساب مندوب علمي'}
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={26} style={{ color: 'var(--primary)' }} />
            حسابي وإعدادات الدخول
          </h1>
          <p className="page-subtitle">
            يمكنك تعديل اسم الدخول والرمز السري وسيتم تحديثهما تلقائياً في قاعدة بيانات كوكل شيت الخاصة بك.
          </p>
        </div>
      </div>

      {/* بطاقة معلومات الحساب والشيت المرتبط */}
      <div className="card" style={{ padding: '1.15rem', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--gray-500)', fontWeight: 700 }}>المستخدم الحالي</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--gray-900)' }}>{user.full_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 2 }}>
              <FileSpreadsheet size={13} style={{ display: 'inline', marginLeft: 4 }} />
              {user.sheet_id ? `الشيت الشخصي: ${user.sheet_id.slice(0, 18)}...` : 'الشيت الافتراضي'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {user.sheet_url && (
              <a
                href={user.sheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-clay btn-secondary btn-sm"
                style={{ textDecoration: 'none', fontWeight: 700 }}
              >
                <ExternalLink size={14} /> فتح شيت فواتيري
              </a>
            )}
            {isAdmin && (
              <a
                href={ADMIN_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-clay btn-primary btn-sm"
                style={{ textDecoration: 'none', fontWeight: 700 }}
              >
                <ExternalLink size={14} /> فتح الشيت الرئيسي
              </a>
            )}
          </div>
        </div>
      </div>

      {/* نموذج تعديل الاسم والرمز السري */}
      <div className="card" style={{ padding: '1.35rem' }}>
        <h3 style={{ fontWeight: 900, margin: '0 0 1rem', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={19} style={{ color: 'var(--primary)' }} />
          تعديل الاسم والرمز السري في Google Sheets
        </h3>

        {error && (
          <div className="alert-danger mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-success mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
              الاسم الجديد (لتسجيل الدخول في الشيت الرئيسي)
            </label>
            <input
              type="text"
              className="clay-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="أدخل الاسم الجديد..."
              required
            />
            {isAdmin && (
              <div style={{ fontSize: '0.72rem', color: '#0369a1', marginTop: 4 }}>
                تنبيه: يرتبط دخولك كأدمن باسم باقر في الشيت الرئيسي.
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', margin: 0 }}>
                الرمز السري الحالي (مطلوب للتأكيد) *
              </label>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {showPasswords ? <><EyeOff size={13} /> إخفاء</> : <><Eye size={13} /> إظهار الرموز</>}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                className="clay-input"
                style={{ paddingRight: '2.4rem' }}
                placeholder="أدخل الرمز السري الحالي..."
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
              <Lock size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                الرمز السري الجديد (اتركه فارغاً للإبقاء على الحالي)
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                className="clay-input"
                placeholder="مثال: 654321"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                تأكيد الرمز السري الجديد
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                className="clay-input"
                placeholder="أعد إدخال الرمز الجديد..."
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-clay btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.96rem', fontWeight: 800, marginTop: '0.25rem' }}
          >
            {saving ? (
              <><RefreshCw size={18} className="animate-spin" /> جاري الحفظ والمزامنة مع الشيت الرئيسي...</>
            ) : (
              <><Save size={18} /> حفظ التعديلات في كوكل شيت</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
