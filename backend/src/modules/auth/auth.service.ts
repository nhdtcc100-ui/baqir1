import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool, isUsingPostgres, inMemoryStore, UserEntity } from '../../database/db';
import { ENV } from '../../config/env';
import { LoginInput, RegisterUserInput, UpdateProfileInput } from './auth.validation';
import { AuthTokens, UserResponse, UserRole } from './auth.types';

export class AuthService {
  // 1. تسجيل الدخول والتحقق من كلمة المرور
  static async login(input: LoginInput): Promise<AuthTokens> {
    let user: UserEntity | null = null;

    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT u.*, r.name as role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.email = $1`,
        [input.email.toLowerCase()]
      );
      if (res.rows.length > 0) user = res.rows[0];
    } else {
      user = inMemoryStore.users.find(u => u.email.toLowerCase() === input.email.toLowerCase()) || null;
    }

    if (!user) {
      throw { statusCode: 401, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    if (!user.is_active) {
      throw { statusCode: 403, message: 'هذا الحساب معطل حالياً، يرجى مراجعة إدارة النظام' };
    }

    const isMatch = await bcrypt.compare(input.password, user.password_hash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    const roleName = (user.role_name || 'medical_rep') as UserRole;

    const payload = {
      userId: user.id,
      email: user.email,
      role: roleName,
      fullName: user.full_name
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
    const emailLower = input.email.toLowerCase();

    // فحص ما إذا كان البريد مسجلاً مسبقاً
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

  // 4. استعراض كافة المندوبين والمستخدمين (Admin & Supervisor)
  static async listUsers(roleFilter?: UserRole): Promise<UserResponse[]> {
    if (isUsingPostgres()) {
      let query = `
        SELECT u.id, u.email, u.full_name, u.phone, u.is_active, u.created_at, r.name as role 
        FROM users u 
        JOIN roles r ON u.role_id = r.id
      `;
      const params: any[] = [];
      if (roleFilter) {
        query += ` WHERE r.name = $1`;
        params.push(roleFilter);
      }
      query += ` ORDER BY u.created_at DESC`;
      const res = await pool.query(query, params);
      return res.rows;
    } else {
      let users = inMemoryStore.users;
      if (roleFilter) {
        users = users.filter(u => u.role_name === roleFilter);
      }
      return users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        phone: u.phone,
        role: (u.role_name || 'medical_rep') as UserRole,
        is_active: u.is_active,
        created_at: u.created_at
      }));
    }
  }
}
