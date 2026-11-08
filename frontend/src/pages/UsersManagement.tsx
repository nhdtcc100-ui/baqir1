import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import {
  Users, Plus, RefreshCw, Key, ExternalLink, ShieldCheck,
  AlertCircle, CheckCircle2, Copy, Check, Lock, Sparkles, FileSpreadsheet
} from 'lucide-react';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RI7QKGakHvDzPkL_ACaF152i44-wc3IGrTIYT_HeLAU/edit?usp=sharing';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // أدوات التشفير والإضافة
  const [pwdInput, setPwdInput] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');
  const [hashCopied, setHashCopied] = useState(false);
  const [generatingHash, setGeneratingHash] = useState(false);

  // نموذج إضافة مستخدم جديد
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'medical_rep' | 'supervisor' | 'admin'>('medical_rep');
  const [newGeminiKey, setNewGeminiKey] = useState('');
  const [newSheetId, setNewSheetId] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const [formattedRow, setFormattedRow] = useState<string[] | null>(null);
  const [rowCopied, setRowCopied] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e.message || 'تعذر جلب قائمة المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleGenerateHash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdInput.trim()) return;
    setGeneratingHash(true);
    setError(null);
    try {
      const res = await api.generatePasswordHash(pwdInput.trim());
      setGeneratedHash(res.hash);
      setSuccessMsg(`تم توليد الـ Hash بنجاح! انسخه وضعه في عمود password_hash (العمود D) في شيت الإدارة.`);
    } catch (e: any) {
      setError(e.message || 'فشل توليد التشفير');
    } finally {
      setGeneratingHash(false);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormatRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newPassword) {
      setError('يرجى ملء الاسم والبريد وكلمة المرور');
      return;
    }
    setError(null);
    try {
      const res = await api.formatUserRow({
        full_name: newFullName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        gemini_api_key: newGeminiKey,
        sheet_id: newSheetId,
        webhook_url: newWebhookUrl
      });
      setFormattedRow(res.rowValues);
      setSuccessMsg('تم تجهيز سطر المستخدم بنجاح! يمكنك نسخه ولصقه مباشرة في شيت الإدارة.');
    } catch (e: any) {
      setError(e.message || 'فشل تجهيز بيانات المستخدم');
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ترويسة الصفحة */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FileSpreadsheet size={13} /> Google Sheets كقاعدة بيانات المستخدمين
            </span>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} /> نظام متعدد المستخدمين والـ APIs
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={28} style={{ color: 'var(--primary)' }} />
            إدارة المستخدمين وقاعدة بيانات شيت الإدارة
          </h1>
          <p className="page-subtitle">
            قاعدة بيانات المستخدمين وتراخيص الدخول مسجلة في Google Sheet الإدارة. كل مستخدم له مفتاح Gemini منفصل وشيت فواتير مستقل.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a
            href={ADMIN_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-clay btn-secondary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <ExternalLink size={16} /> فتح شيت قاعدة بيانات المستخدمين
          </a>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="btn-clay btn-secondary"
            title="إعادة قراءة المستخدمين من الشيت"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> تحديث
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-clay btn-primary"
            style={{ fontWeight: 800 }}
          >
            <Plus size={18} /> إضافة مستخدم جديد للشيت
          </button>
        </div>
      </div>

      {/* التنبيهات والرسائل */}
      {error && (
        <div className="alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} style={{ color: '#059669' }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* بطاقة توضيح آلية العمل وأداة تشفير كلمات المرور */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>

        {/* بطاقة آلية الربط مع شيت الإدارة */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={18} style={{ color: '#10b981' }} />
            كيف يعمل تسجيل الدخول وقاعدة بيانات الشيت؟
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
            عند محاولة أي مستخدم تسجيل الدخول، يقرأ النظام مباشرة ورقة <strong>"المستخدمون"</strong> في شيت الإدارة للتأكد من وجود البريد، وكون الحساب نشطاً (TRUE)، وتطابق كلمة المرور المشفرة.
          </p>
          <div style={{ background: 'var(--gray-50)', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: '0.78rem', color: 'var(--gray-700)' }}>
            <strong>ترتيب أعمدة ورقة "المستخدمون" في الشيت:</strong><br />
            <code>A: id | B: full_name | C: email | D: password_hash | E: role | F: is_active | G: gemini_api_key | H: sheet_id | I: webhook_url</code>
          </div>
        </div>

        {/* بطاقة أداة توليد تشفير كلمة المرور (Bcrypt Hash Generator) */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} style={{ color: 'var(--primary)' }} />
            أداة تشفير كلمة المرور (Bcrypt Hash)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: '0 0 0.75rem 0' }}>
            اكتب كلمة مرور لتوليد التشفير الآمن لوضعها في عمود <code>password_hash</code> (العمود D) في الشيت:
          </p>

          <form onSubmit={handleGenerateHash} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              className="clay-input"
              placeholder="اكتب كلمة المرور..."
              style={{ flex: 1, fontSize: '0.85rem' }}
              value={pwdInput}
              onChange={e => setPwdInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={generatingHash || !pwdInput.trim()}
              className="btn-clay btn-primary btn-sm"
              style={{ padding: '0.5rem 1rem', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {generatingHash ? 'جارِ التشفير...' : 'توليد الـ Hash 🔐'}
            </button>
          </form>

          {generatedHash && (
            <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <code style={{ fontSize: '0.75rem', color: '#1e293b', wordBreak: 'break-all', direction: 'ltr' }}>
                {generatedHash}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedHash, setHashCopied)}
                className="btn-clay btn-secondary btn-sm"
                style={{ padding: '3px 8px', flexShrink: 0 }}
                title="نسخ التشفير"
              >
                {hashCopied ? <Check size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
                <span style={{ fontSize: '0.72rem', marginRight: 4 }}>{hashCopied ? 'تم!' : 'نسخ'}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* جدول عرض المستخدمين الحاليين من الشيت والنظام */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontWeight: 800, margin: '0 0 0.25rem 0' }}>قائمة المستخدمين والمندوبين المسجلين ({users.length})</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
              يتم قراءة بياناتهم من جدول Google Sheet الإدارة وقاعدة البيانات
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: 10 }} />
            <div style={{ fontWeight: 700, color: 'var(--gray-600)' }}>جارِ قراءة المستخدمين من شيت الإدارة...</div>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--gray-50)', borderRadius: 12 }}>
            <Users size={48} style={{ color: 'var(--gray-300)', marginBottom: 10 }} />
            <h5 style={{ fontWeight: 800, color: 'var(--gray-700)' }}>لم يتم العثور على مستخدمين مسجلين</h5>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
              افتح جدول الإدارة وتأكد من وجود ورقة "المستخدمون" أو استخدم نموذج الإضافة أدناه.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clay-table" style={{ width: '100%', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: 'center' }}>#</th>
                  <th>الاسم الكامل</th>
                  <th>البريد الإلكتروني</th>
                  <th style={{ textAlign: 'center' }}>الدور والصفة</th>
                  <th style={{ textAlign: 'center' }}>الحالة</th>
                  <th style={{ textAlign: 'center' }}>مفتاح Gemini الذاتي</th>
                  <th>Google Sheet المخصص</th>
                  <th>Webhook الخاص به</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id || idx}>
                    <td style={{ textAlign: 'center', color: 'var(--gray-400)', fontWeight: 700 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 800, color: 'var(--gray-800)' }}>{u.full_name}</td>
                    <td style={{ direction: 'ltr', textAlign: 'right', fontWeight: 600 }}>{u.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'supervisor' ? 'badge-purple' : 'badge-gray'}`}>
                        {u.role === 'admin' ? 'مدير النظام' : u.role === 'supervisor' ? 'مشرف مبيعات' : 'مندوب علمي'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${u.is_active !== false ? 'badge-success' : 'badge-danger'}`}>
                        {u.is_active !== false ? 'نشط ✓' : 'معطل ✕'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {u.gemini_api_key ? (
                        <span className="badge badge-success" title={u.gemini_api_key}>
                          مفتاح خاص مفعل ✓
                        </span>
                      ) : (
                        <span className="badge badge-gray" title="يستخدم مفتاح النظام العام الافتراضي">
                          عام (النظام)
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.75rem', direction: 'ltr', textAlign: 'left', color: 'var(--gray-600)' }}>
                      {u.sheet_id ? (
                        <span title={u.sheet_id}>{u.sheet_id.substring(0, 14)}...</span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>الشيت الافتراضي</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.75rem', direction: 'ltr', textAlign: 'left', color: 'var(--gray-600)' }}>
                      {u.webhook_url ? (
                        <span title={u.webhook_url}>Webhook خاص ✓</span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>الرابط العام</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نافذة / بطاقة إضافة مستخدم وتجهيز السطر لشيت الإدارة */}
      {showAddModal && (
        <div className="modal-backdrop-floating" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-card-floating"
            style={{ maxWidth: 640 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.75rem' }}>
              <h4 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} style={{ color: 'var(--primary)' }} />
                إضافة مستخدم جديد وتجهيزه لشيت الإدارة
              </h4>
              <button onClick={() => setShowAddModal(false)} className="btn-clay btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleFormatRow} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الاسم الكامل *</label>
                  <input
                    type="text"
                    className="clay-input"
                    placeholder="مثال: د. كرار حيدر"
                    value={newFullName}
                    onChange={e => setNewFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>البريد الإلكتروني *</label>
                  <input
                    type="email"
                    className="clay-input"
                    placeholder="karrar@pharma.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>كلمة المرور *</label>
                  <input
                    type="password"
                    className="clay-input"
                    placeholder="كلمة المرور للدخول..."
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الدور والصلاحية *</label>
                  <select
                    className="clay-input"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                  >
                    <option value="medical_rep">مندوب مبيعات علمي (medical_rep)</option>
                    <option value="supervisor">مشرف مبيعات (supervisor)</option>
                    <option value="admin">مدير نظام (admin)</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--gray-200)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>
                  ⚙️ إعدادات الذكاء الاصطناعي وكوكل شيت الخاصة بهذا المستخدم (اختياري):
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--gray-600)', display: 'block', marginBottom: 2 }}>
                      مفتاح Gemini API الخاص به (اختياري — لحساب استهلاكه بشكل مستقل):
                    </label>
                    <input
                      type="text"
                      className="clay-input"
                      placeholder="AIzaSy..."
                      value={newGeminiKey}
                      onChange={e => setNewGeminiKey(e.target.value)}
                      style={{ fontSize: '0.8rem', direction: 'ltr' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--gray-600)', display: 'block', marginBottom: 2 }}>
                      معرف Google Sheet الخاص به (Google Sheet ID):
                    </label>
                    <input
                      type="text"
                      className="clay-input"
                      placeholder="1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE"
                      value={newSheetId}
                      onChange={e => setNewSheetId(e.target.value)}
                      style={{ fontSize: '0.8rem', direction: 'ltr' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--gray-600)', display: 'block', marginBottom: 2 }}>
                      رابط Webhook الخاص به (Google Apps Script Webhook URL):
                    </label>
                    <input
                      type="url"
                      className="clay-input"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={newWebhookUrl}
                      onChange={e => setNewWebhookUrl(e.target.value)}
                      style={{ fontSize: '0.8rem', direction: 'ltr' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-clay btn-primary"
                style={{ fontWeight: 800, marginTop: '0.5rem' }}
              >
                تجهيز وتشفير سطر المستخدم للشيت 🚀
              </button>
            </form>

            {formattedRow && (
              <div style={{ marginTop: '1rem', background: '#f0fdf4', padding: '0.85rem', borderRadius: 10, border: '1.5px solid #86efac' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#166534' }}>
                    ✅ السطر المنسق الجاهز للّصق في جدول كوكل شيت:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formattedRow.join('\t'), setRowCopied)}
                    className="btn-clay btn-primary btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    {rowCopied ? <Check size={14} /> : <Copy size={14} />}
                    {rowCopied ? 'تم النسخ بنجاح!' : 'نسخ السطر بالكامل'}
                  </button>
                </div>
                <div style={{
                  background: '#0f172a', color: '#38bdf8', padding: '0.6rem', borderRadius: 6,
                  fontSize: '0.72rem', overflowX: 'auto', direction: 'ltr', fontFamily: 'monospace'
                }}>
                  {formattedRow.join('  |  ')}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0.5rem 0 0 0' }}>
                  📌 افتح ورقة "المستخدمون" في شيت الإدارة، واضغط على أول سطر فارغ في العمود A ثم الصق (Ctrl+V). سيتوزع تلقائياً على الأعمدة التسعة بشكل صحيح!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

