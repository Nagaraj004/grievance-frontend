// grievanceService.ts
import apiClient from './apiClient';
import { Grievance, GrievanceStatus, SubmitGrievancePayload } from '../types/grievance';

const adapt = (g: any): Grievance => ({
  token: g.token,
  name: g.name,
  mobile: g.mobile,
  email: g.email,
  constituency: g.constituency,
  address: g.address,
  description: g.description,
  department: g.department,
  status: g.status as GrievanceStatus,
  createdAt: g.created_at,
  updatedAt: g.updated_at,
  assignedTo: g.assigned_to ?? undefined,
  remarks: g.remarks ?? undefined,
  attachment_url: g.attachment_url ?? undefined,
  queries: g.queries ?? [],
});

export const grievanceService = {

  // ---------------- Submit a grievance ----------------
  async submitGrievance(payload: SubmitGrievancePayload): Promise<Grievance> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('mobile', payload.mobile);
    formData.append('email', payload.email);
    formData.append('constituency', payload.constituency);
    formData.append('address', payload.address);
    formData.append('department', payload.department || '');
    formData.append('description', payload.description);

    if (payload.attachment) {
      formData.append('attachment', payload.attachment);
    }

    const res = await apiClient.post('/grievances/', formData);
    return adapt(res.data);
  },

  // ---------------- Track by token ----------------
  async getGrievanceByToken(token: string): Promise<Grievance | null> {
    try {
      const cleanToken = encodeURIComponent(token.trim().toUpperCase());
      const res = await apiClient.get(`/grievances/track/${cleanToken}`);
      return adapt(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  // ---------------- Track by mobile number ----------------
 async getGrievancesByMobile(mobile: string): Promise<Grievance[]> {
  try {
    const cleanMobile = mobile.replace(/\D/g, ''); // keep only digits
    const res = await apiClient.get(`/grievances/by-mobile/${cleanMobile}`);
    return res.data.map(adapt);
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    throw err;
  }
},

  // ---------------- List all grievances ----------------
  async getAllGrievances(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    department?: string;
    search?: string;
  }): Promise<{ grievances: Grievance[]; total: number }> {
    const res = await apiClient.get('/grievances/', { params });
    return {
      grievances: res.data.grievances.map(adapt),
      total: res.data.total,
    };
  },

  // ---------------- Update grievance ----------------
  async updateGrievanceStatus(
    token: string,
    status: GrievanceStatus,
    assignedTo?: string,
    remarks?: string
  ): Promise<Grievance> {
    const res = await apiClient.patch(`/grievances/${encodeURIComponent(token)}`, {
      status,
      assigned_to: assignedTo ?? null,
      remarks: remarks ?? null,
    });
    return adapt(res.data);
  },

  // ---------------- Stats ----------------
  async getStats(): Promise<any> {
    const res = await apiClient.get('/grievances/stats/summary');
    return res.data;
  },

  // ---------------- Queries ----------------
  async getQueries(token: string) {
    const res = await apiClient.get(`/grievances/${encodeURIComponent(token)}/queries`);
    return res.data;
  },

  async createQuery(token: string, message: string, sender: "user" | "admin") {
  return apiClient.post(`/grievances/${token}/queries`, {
    message,
    sender,
  }).then(res => res.data);
},
// ---------------- Send OTP ----------------
// ✅ FIXED
async sendOtp(mobile: string): Promise<{ message: string }> {
  const cleanMobile = mobile.replace(/\D/g, "");

  const formData = new FormData();
  formData.append("mobile", cleanMobile);

  const res = await apiClient.post("/grievances/send-otp", formData);
  return res.data;
},

// ✅ FIXED
async verifyOtp(mobile: string, otp: string): Promise<{ message: string }> {
  const cleanMobile = mobile.replace(/\D/g, "");

  const formData = new FormData();
  formData.append("mobile", cleanMobile);
  formData.append("otp", otp.trim()); // 👈 IMPORTANT

  const res = await apiClient.post("/grievances/verify-otp", formData);

  return res.data;
}
};