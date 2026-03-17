export type GrievanceStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type Department =
  | "Health"
  | "Education"
  | "Water Supply"
  | "Roads & Infrastructure"
  | "Electricity"
  | "Revenue"
  | "Police"
  | "Agriculture"
  | "Housing"
  | "Social Welfare"
  | "Other";

/* ---------------- QUERY TYPE ---------------- */

export interface Query {
  id: string;
  message: string;
  sender?: "user" | "admin";
  createdAt: string;
}

/* ---------------- GRIEVANCE TYPE ---------------- */

export interface Grievance {
  token: string;

  name: string;
  mobile: string;
  email: string;

  address: string;
  constituency: string;

  description: string;
  department: Department;

  status: GrievanceStatus;

  createdAt: string;
  updatedAt: string;

  assignedTo?: string;
  remarks?: string;

  attachment_url?: string;

  attachments?: { url: string; filename?: string }[];

  /* OTP flow */
  otpToken?: string;
  otpVerified?: boolean;

  /* Query chat */
  queries?: Query[];
}

/* ---------------- SUBMIT PAYLOAD ---------------- */

export interface SubmitGrievancePayload {
  name: string;
  mobile: string;
  email: string;
  address: string;
  constituency: string;
  description: string;
  department: Department;
  attachment?: File;
}

/* ---------------- CREATE QUERY PAYLOAD ---------------- */

export interface CreateQueryPayload {
  grievance_token: string;
  message: string;
  sender: "user" | "admin";
}
