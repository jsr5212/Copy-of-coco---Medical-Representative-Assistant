
export interface MedicineData {
  id: string;
  brand: string;
  division: string;
  specialty: string;
  indications: string;
  dosage: string;
  usp: string;
  targetAudience: string;
  imageUrl?: string;
  assignedTo?: string[];
  adminLocked?: boolean;
  itLocked?: boolean;
  seniorLocked?: boolean;
}

export interface MedicalRep {
  id: string;
  name: string;
  email: string;
  region: string;
  username: string;
  tempPass: string;
  assignedDivisions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  itLocked?: boolean;
  seniorLocked?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  alignedMedicineIds: string[];
  lastVisitDate?: string;
  followUpDate?: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  billingCycle: 'MONTHLY' | 'YEARLY';
  amount: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

export interface SupportTicket {
  id: string;
  companyId: string;
  companyName: string;
  subject: string;
  category: 'TECHNICAL' | 'BILLING' | 'DATA_ISSUE' | 'GENERAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

export interface PharmaintelUser {
  id: string;
  name: string;
  role: 'SYSTEM_ADMIN' | 'IT_DIRECTOR' | 'SALES_LEAD' | 'FINANCIAL_CONTROLLER';
  status: 'ONLINE' | 'OFFLINE';
}

export interface Company {
  id: string;
  name: string;
  adminName: string;
  contact: string;
  email: string;
  sector: string;
  password?: string;
  status: 'PENDING' | 'VERIFIED';
  productCount: number;
  repsCount: number;
  createdAt: string;
  dataSanctityScore: number;
  subscription?: Subscription;
}

export interface SyncEvent {
  type: 'SYNC_NAVIGATE' | 'SYNC_START' | 'SYNC_STOP' | 'SYNC_PRODUCT';
  payload: any;
}

export interface VerificationRequest {
  id: string;
  companyId: string;
  type: 'MEDICINE' | 'REPRESENTATIVE';
  action: 'UPDATE' | 'DELETE';
  entityId: string;
  originalData: any;
  proposedData: any;
  itVerified: boolean;
  seniorVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export type UserRole = 'GUEST' | 'COMPANY_USER' | 'ADMIN' | 'IT_VERIFIER' | 'SENIOR_VERIFIER' | 'DOCTOR_VIEW' | 'SUPER_ADMIN' | 'FIELD_REP';
export type AppState = 'INITIALIZING' | 'IDLE' | 'REGISTERING' | 'LOGIN' | 'SUPER_LOGIN' | 'UPLOADING' | 'ANALYZING' | 'VIEWING' | 'ADMIN_PANEL' | 'DOCTOR_PORTAL' | 'SUPER_DASHBOARD' | 'IT_DASHBOARD';
export type CompanySubView = 'PORTFOLIO' | 'TEAM' | 'STRATEGY' | 'VERIFICATION' | 'SYNC_CENTER' | 'MY_DOCTORS' | 'FOLLOW_UPS';
