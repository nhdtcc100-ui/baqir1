export type UserRole = 'admin' | 'supervisor' | 'medical_rep';

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  gemini_api_key?: string;
  sheet_id?: string;
  webhook_url?: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: UserResponse;
}
