import apiClient from './apiClient';
import { Grievance, GrievanceStatus, SubmitGrievancePayload } from '../types/grievance';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GrievanceListParams {
  skip?: number;
  limit?: number;
  status?: string;
  department?: string;
  search?: string;
}

export interface GrievanceListResponse {
  grievances: Grievance[];
  total: number;
}

export interface GrievanceStats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  [key: string]: number;
}

export interface GrievanceQuery {
  id: number | string;
  token: string;
  message: string;
  sender: 'user' | 'admin';
  created_at: string;
}

export interface OtpResponse {
  message: string;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────

const adapt = (g: any): Grievance => ({
  token:          g.token,
  name:           g.name,
  mobile:         g.mobile,
  email:          g.email,
  constituency:   g.constituency,
  address:        g.address,
  description:    g.description,
  department:     g.department,
  status:         g.status as GrievanceStatus,
  createdAt:      g.created_at,
  updatedAt:      g.updated_at,
  assignedTo:     g.assigned_to   ?? undefined,
  remarks:        g.remarks       ?? undefined,
  attachment_url: g.attachment_url ?? undefined,
  queries:        g.queries       ?? [],
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const encodeToken = (token: string): string =>
  encodeURIComponent(token.trim().toUpperCase());

const stripNonDigits = (value: string): string => value.replace(/\D/g, '');

// ─── Service ──────────────────────────────────────────────────────────────────

export const grievanceService = {

  // ── Submit a grievance ──────────────────────────────────────────────────────
  async submitGrievance(payload: SubmitGrievancePayload): Promise<Grievance> {
    const formData = new FormData();
    formData.append('name',         payload.name);
    formData.append('mobile',       payload.mobile);
    formData.append('email',        payload.email);
    formData.append('constituency', payload.constituency);
    formData.append('address',      payload.address);
    formData.append('department',   payload.department || '');
    formData.append('description',  payload.description);

    if (payload.attachment) {
      formData.append('attachment', payload.attachment);
    }

    const res = await apiClient.post<any>('/grievances/', formData);
    return adapt(res.data);
  },

  // ── Track by token ──────────────────────────────────────────────────────────
  async getGrievanceByToken(token: string): Promise<Grievance | null> {
    try {
      const res = await apiClient.get<any>(`/grievances/track/${encodeToken(token)}`);
      return adapt(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  // ── Track by mobile ─────────────────────────────────────────────────────────
  async getGrievancesByMobile(mobile: string): Promise<Grievance[]> {
    try {
      const res = await apiClient.get<any[]>(`/grievances/by-mobile/${stripNonDigits(mobile)}`);
      return res.data.map(adapt);
    } catch (err: any) {
      if (err.response?.status === 404) return [];
      throw err;
    }
  },

  // ── List all grievances (admin) ─────────────────────────────────────────────
  async getAllGrievances(params?: GrievanceListParams): Promise<GrievanceListResponse> {
    const res = await apiClient.get<{ grievances: any[]; total: number }>(
      '/grievances/',
      { params }
    );
    return {
      grievances: res.data.grievances.map(adapt),
      total:      res.data.total,
    };
  },

  // ── Update grievance status ─────────────────────────────────────────────────
  async updateGrievanceStatus(
    token:      string,
    status:     GrievanceStatus,
    assignedTo?: string,
    remarks?:    string
  ): Promise<Grievance> {
    const res = await apiClient.patch<any>(
      `/grievances/${encodeToken(token)}`,
      {
        status,
        assigned_to: assignedTo ?? null,
        remarks:     remarks    ?? null,
      }
    );
    return adapt(res.data);
  },

  // ── Stats ───────────────────────────────────────────────────────────────────
  async getStats(): Promise<GrievanceStats> {
    const res = await apiClient.get<GrievanceStats>('/grievances/stats/summary');
    return res.data;
  },

  // ── Get queries for a grievance ─────────────────────────────────────────────
  async getQueries(token: string): Promise<GrievanceQuery[]> {
    const res = await apiClient.get<GrievanceQuery[]>(
      `/grievances/${encodeToken(token)}/queries`
    );
    return res.data;
  },

  // ── Post a query on a grievance ─────────────────────────────────────────────
  async createQuery(
    token:   string,
    message: string,
    sender:  'user' | 'admin'
  ): Promise<GrievanceQuery> {
    const res = await apiClient.post<GrievanceQuery>(
      `/grievances/${encodeToken(token)}/queries`,
      { message, sender }
    );
    return res.data;
  },

  // ── Send OTP ────────────────────────────────────────────────────────────────
  async sendOtp(mobile: string): Promise<OtpResponse> {
    const formData = new FormData();
    formData.append('mobile', stripNonDigits(mobile));

    const res = await apiClient.post<OtpResponse>('/grievances/send-otp', formData);
    return res.data;
  },

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  async verifyOtp(mobile: string, otp: string): Promise<OtpResponse> {
    const formData = new FormData();
    formData.append('mobile', stripNonDigits(mobile));
    formData.append('otp',    otp.trim());

    const res = await apiClient.post<OtpResponse>('/grievances/verify-otp', formData);
    return res.data;
  },
};

export default grievanceService;