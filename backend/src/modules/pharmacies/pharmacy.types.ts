export interface PharmacyEntity {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  assigned_rep_id?: string;
  assigned_rep_name?: string;
  created_at: Date;
}

export interface CreatePharmacyInput {
  name: string;
  city: string;
  address?: string;
  phone?: string;
  assigned_rep_id?: string;
}

export interface UpdatePharmacyInput {
  name?: string;
  city?: string;
  address?: string;
  phone?: string;
  assigned_rep_id?: string;
}
