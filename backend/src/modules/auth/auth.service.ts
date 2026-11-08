import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool, isUsingPostgres, inMemoryStore, UserEntity } from '../../database/db';
import { ENV } from '../../config/env';
import { LoginInput, RegisterUserInput, UpdateProfileInput } from './auth.validation';
import { AuthTokens, UserResponse, UserRole } from './auth.types';

export interface SheetUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  gemini_api_key?: string;
  sheet_id?: string;
  webhook_url?: string;
}

/**
 * جلب قائمة المستخدمين من جدول جوجل شيت الإدارة المخصص كقاعدة بيانات
 */
export async function fetchUsersFromAdminSheet(): Promise<SheetUser[]> {
  const sheetId = ENV.ADMIN_SHEET_ID;
  if (!sheetId) return [];

  const candidateUrls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('المستخدمون')}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;

      const text = await res.text();
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
      if (!jsonMatch || !jsonMatch[1]) continue;

      const data = JSON.parse(jsonMatch[1]);
      const rows: any[] = data.table?.rows || [];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const parsedUsers: SheetUser[] = [];
      for (const r of rows) {
        const c = r.c || [];
        // فحص هل هذا سطر عناوين أو سطر فارغ
        const col0 = String(c[0]?.v ?? '').trim();
        const col2 = String(c[2]?.v ?? '').trim();
        if (!col0 && !col2) continue;
        const col0Lower = col0.toLowerCase();
        const col2Lower = col2.toLowerCase();
        if (col0Lower === 'id' || col0Lower === 'a' || col2Lower === 'email' || col2Lower === 'c' || col0.includes('معرف')) continue;

        const email = (String(c[2]?.v ?? '') || String(c[1]?.v ?? '')).trim().toLowerCase();
        const hash  = String(c[3]?.v ?? '').trim();
        if (!email || !hash || !email.includes('@')) continue;

        const roleRaw = String(c[4]?.v ?? 'medical_rep').trim().toLowerCase();
        const role: UserRole = (roleRaw === 'admin' || roleRaw === 'supervisor') ? roleRaw : 'medical_rep';
        const activeStr = String(c[5]?.v ?? 'TRUE').trim().toUpperCase();
        const isActive = activeStr !== 'FALSE' && activeStr !== '0' && activeStr !== 'معطل';

        parsedUsers.push({
          id: col0 || `usr-${crypto.randomUUID().slice(0, 8)}`,
          full_name: String(c[1]?.v ?? '').trim() || email.split('@')[0],
          email,
          password_hash: hash,
          role,
          is_active: isActive,
          gemini_api_key: String(c[6]?.v ?? '').trim() || undefined,
          sheet_id: String(c[7]?.v ?? '').trim() || undefined,
          webhook_url: String(c[8]?.v ?? '').trim() || undefined,
        });
      }

      if (parsedUsers.length > 0) {
        console.log(`✅ Loaded ${parsedUsers.length} users successfully from Admin Google Sheet (${url})`);
        return parsedUsers;
      }
    } catch (e: any) {
      // تجربة الرابط الثاني
    }
  }

  return [];
}

export class AuthService {
  // 1. تسجيل الدخول والتحقق من كلمة المرور مع ربط قاعدة بيانات كوكل شيت
  static async login(input: LoginInput): Promise<AuthTokens> {
    const rawTarget = input.email.trim();
    const emailLower = rawTarget.toLowerCase();

    // دالة مساعدة للمطابقة المرنة والدقيقة: تفصل تماماً بين حساب الأدمن وحساب المندوب
    const matchesUser = (uEmail: string, uName?: string, uRole?: string) => {
      const e = (uEmail || '').toLowerCase().trim();
      const n = (uName || '').toLowerCase().trim();
      const target = rawTarget.toLowerCase();

      // 1. التطابق التام بالبريد أو اسم المستخدم
      if (e === target || e === `${target}@pharma.com` || e.split('@')[0] === target) return true;

      // 2. التطابق التام بالاسم الكامل
      if (n === target) return true;

      // 3. إذا كان الإدخال موجهاً للإدارة (admin / مدير)
      const isAdminInput = target.includes('admin') || target.includes('مدير');
      if (isAdminInput) {
        return e.includes('admin') || n.includes('مدير') || uRole === 'admin';
      }

      // 4. إذا كان الإدخال موجهاً للمندوب باقر علي (باقر / باقر علي / baqer)
      const isBaqerRepInput = target.includes('باقر علي') || target === 'baqer' || target === 'باقر';
      if (isBaqerRepInput) {
        return (e === 'baqer@pharma.com' || n === 'باقر علي' || (e.includes('baqer') && !e.includes('admin')));
      }

      // 5. مطابقة جزئية في الاسم (دون الخلط مع الأدمن)
      if (n.includes(target) && !n.includes('مدير')) return true;

      return false;
    };

    // ── المحاولة الأولى: التحقق من وجود المستخدم في شيت الإدارة ──
    try {
      const sheetUsers = await fetchUsersFromAdminSheet();
      const sheetUser = sheetUsers.find(u => matchesUser(u.email, u.full_name, u.role));

      if (sheetUser) {
        if (!sheetUser.is_active) {
          throw { statusCode: 403, message: 'هذا الحساب معطل حالياً في شيت الإدارة، يرجى مراجعة إدارة النظام' };
        }

        // مقارنة كلمة المرور المشفرة بـ bcrypt
        let isMatch = false;
        try {
          isMatch = await bcrypt.compare(input.password, sheetUser.password_hash);
        } catch {
          isMatch = input.password === sheetUser.password_hash;
        }

        // فصل كلمات المرور الافتراضية بدقة: الأدمن له admin123456، والمندوب له 123456
        if (!isMatch) {
          if (sheetUser.role === 'admin' && input.password === 'admin123456') {
            isMatch = true;
          } else if (sheetUser.role !== 'admin' && input.password === '123456') {
            isMatch = true;
          }
        }

        if (!isMatch) {
          throw { statusCode: 401, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }

        const payload = {
          userId: sheetUser.id,
          email: sheetUser.email,
          role: sheetUser.role,
          fullName: sheetUser.full_name,
          geminiApiKey: sheetUser.gemini_api_key || '',
          sheetId: sheetUser.sheet_id || '',
          webhookUrl: sheetUser.webhook_url || ''
        };

        const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
          expiresIn: ENV.JWT_EXPIRES_IN as any
        });

        const userResponse: UserResponse = {
          id: sheetUser.id,
          email: sheetUser.email,
          full_name: sheetUser.full_name,
          role: sheetUser.role,
          is_active: sheetUser.is_active,
          created_at: new Date(),
          gemini_api_key: sheetUser.gemini_api_key,
          sheet_id: sheetUser.sheet_id,
          webhook_url: sheetUser.webhook_url
        };

        return {
          accessToken,
          tokenType: 'Bearer',
          expiresIn: ENV.JWT_EXPIRES_IN,
          user: userResponse
        };
      }
    } catch (sheetErr: any) {
      if (sheetErr.statusCode) throw sheetErr;
      console.warn('Admin Google Sheet user check fallback:', sheetErr.message);
    }

    // ── المحاولة الثانية: الاحتياطي (قاعدة البيانات المحلية / In-Memory) ──
    let user: UserEntity | null = null;

    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT u.*, r.name as role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.email = $1`,
        [emailLower]
      );
      if (res.rows.length > 0) user = res.rows[0];
    } else {
      user = inMemoryStore.users.find(u => matchesUser(u.email, u.full_name, u.role_name)) || null;
    }

    if (!user) {
      throw { statusCode: 401, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    if (!user.is_active) {
      throw { statusCode: 403, message: 'هذا الحساب معطل حالياً، يرجى مراجعة إدارة النظام' };
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(input.password, user.password_hash);
    } catch {
      isMatch = input.password === user.password_hash;
    }
    if (!isMatch) {
      if (user.role_name === 'admin' && input.password === 'admin123456') {
        isMatch = true;
      } else if (user.role_name !== 'admin' && input.password === '123456') {
        isMatch = true;
      }
    }

    if (!isMatch) {
      throw { statusCode: 401, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    const roleName = (user.role_name || 'medical_rep') as UserRole;

    const payload = {
      userId: user.id,
      email: user.email,
      role: roleName,
      fullName: user.full_name,
      geminiApiKey: '',
      sheetId: '',
      webhookUrl: ''
    };

    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as any
    });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: roleName,
      is_active: user.is_active,
      created_at: user.created_at
    };

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: ENV.JWT_EXPIRES_IN,
      user: userResponse
    };
  }

  // 2. إنشاء مستخدم أو مندوب جديد (للإدارة فقط)
  static async registerUser(input: RegisterUserInput): Promise<UserResponse> {
    const emailLower = input.email.toLowerCase().trim();

    if (isUsingPostgres()) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [emailLower]);
      if (existing.rows.length > 0) {
        throw { statusCode: 409, message: 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر' };
      }
    } else {
      if (inMemoryStore.users.some(u => u.email.toLowerCase() === emailLower)) {
        throw { statusCode: 409, message: 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر' };
      }
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const userId = crypto.randomUUID();
    const now = new Date();

    if (isUsingPostgres()) {
      const roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', [input.roleName]);
      if (roleRes.rows.length === 0) {
        throw { statusCode: 400, message: 'الدور المحدد غير معرف في النظام' };
      }
      const roleId = roleRes.rows[0].id;

      const insertRes = await pool.query(
        `INSERT INTO users (id, role_id, email, password_hash, full_name, phone, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, email, full_name, phone, is_active, created_at`,
        [userId, roleId, emailLower, passwordHash, input.fullName, input.phone || null, true, now, now]
      );

      return {
        ...insertRes.rows[0],
        role: input.roleName
      };
    } else {
      const roleObj = inMemoryStore.roles.find(r => r.name === input.roleName);
      if (!roleObj) throw { statusCode: 400, message: 'الدور المحدد غير معرف' };

      const newUser: UserEntity = {
        id: userId,
        role_id: roleObj.id,
        role_name: input.roleName,
        email: emailLower,
        password_hash: passwordHash,
        full_name: input.fullName,
        phone: input.phone,
        is_active: true,
        created_at: now,
        updated_at: now
      };

      inMemoryStore.users.push(newUser);

      return {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: input.roleName,
        is_active: newUser.is_active,
        created_at: newUser.created_at
      };
    }
  }

  // 3. جلب الملف الشخصي للمستخدم الحالي
  static async getCurrentUser(userId: string): Promise<UserResponse> {
    // التحقق من شيت الإدارة
    try {
      const sheetUsers = await fetchUsersFromAdminSheet();
      const sUser = sheetUsers.find(u => u.id === userId);
      if (sUser) {
        return {
          id: sUser.id,
          email: sUser.email,
          full_name: sUser.full_name,
          role: sUser.role,
          is_active: sUser.is_active,
          created_at: new Date(),
          gemini_api_key: sUser.gemini_api_key,
          sheet_id: sUser.sheet_id,
          webhook_url: sUser.webhook_url
        };
      }
    } catch {}

    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT u.id, u.email, u.full_name, u.phone, u.is_active, u.created_at, r.name as role 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.id = $1`,
        [userId]
      );
      if (res.rows.length === 0) {
        throw { statusCode: 404, message: 'المستخدم غير موجود' };
      }
      return res.rows[0];
    } else {
      const user = inMemoryStore.users.find(u => u.id === userId);
      if (!user) throw { statusCode: 404, message: 'المستخدم غير موجود' };
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: (user.role_name || 'medical_rep') as UserRole,
        is_active: user.is_active,
        created_at: user.created_at
      };
    }
  }

  // 4. استعراض كافة المندوبين والمستخدمين (دمج شيت الإدارة مع النظام)
  static async listUsers(roleFilter?: UserRole): Promise<UserResponse[]> {
    const result: UserResponse[] = [];
    const seenEmails = new Set<string>();

    // جلب من شيت الإدارة
    try {
      const sheetUsers = await fetchUsersFromAdminSheet();
      for (const su of sheetUsers) {
        if (!seenEmails.has(su.email)) {
          seenEmails.add(su.email);
          if (!roleFilter || su.role === roleFilter) {
            result.push({
              id: su.id,
              email: su.email,
              full_name: su.full_name,
              role: su.role,
              is_active: su.is_active,
              created_at: new Date(),
              gemini_api_key: su.gemini_api_key,
              sheet_id: su.sheet_id,
              webhook_url: su.webhook_url
            });
          }
        }
      }
    } catch {}

    // جلب من التخزين المحلي
    const localUsers = inMemoryStore.users;
    for (const lu of localUsers) {
      if (!seenEmails.has(lu.email.toLowerCase())) {
        seenEmails.add(lu.email.toLowerCase());
        const role = (lu.role_name || 'medical_rep') as UserRole;
        if (!roleFilter || role === roleFilter) {
          result.push({
            id: lu.id,
            email: lu.email,
            full_name: lu.full_name,
            phone: lu.phone,
            role,
            is_active: lu.is_active,
            created_at: lu.created_at
          });
        }
      }
    }

    return result;
  }
}
