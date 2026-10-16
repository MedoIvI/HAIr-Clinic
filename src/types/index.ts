export type UserRole = 'admin' | 'surgeon' | 'receptionist' | 'finance';

export interface UserProfile {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  role: UserRole;
  avatarInitials: string;
  email: string;
  badge: string;
}

export type ClientStatus = 'Consultation' | 'Cleared' | 'In Surgery' | 'Post-Op Care' | 'Completed';

export type ProcedureType =
  | 'Sapphire FUE'
  | 'DHI Micro-Choi'
  | 'Beard & Mustache'
  | 'Eyebrow Restoration'
  | 'Stem Cell & PRP Therapy';

export type NorwoodScale =
  | 'Stage I'
  | 'Stage II'
  | 'Stage III'
  | 'Stage III Vertex'
  | 'Stage IV'
  | 'Stage V'
  | 'Stage VI'
  | 'Stage VII'
  | 'Ludwig II (Female)';

export interface DonorMetrics {
  density: number; // hairs/cm²
  caliber: string; // e.g. "68 µm (Coarse)"
  laxity: 'Normal' | 'Loose' | 'Tight';
  safeDonorZoneYield: number; // estimated safe grafts
  miniaturizationRate: string; // e.g. "12%"
  evaluationNotes: string;
}

export interface SurgicalPlan {
  targetGrafts: number;
  extractionTechnique: string;
  anesthesia: string;
  leadSurgeon: string;
  singleGrafts: number;
  doubleGrafts: number;
  multipleGrafts: number;
  hairlineDesign: string;
  surgeryTheater: string;
}

export interface MedicalClearancePanel {
  cbc: boolean;
  hbv_hcv_hiv: boolean;
  pt_inr: boolean;
  ecg: boolean;
  glucose: boolean;
}

export interface MedicalHistory {
  pastSurgeries: string[];
  chronicConditions: string[];
  bloodType: string;
  allergies: string[];
  medications: string[];
  clearances: MedicalClearancePanel;
  isCleared: boolean;
}

export interface TreatmentLog {
  id: string;
  date: string;
  stage: string;
  notes: string;
  recordedBy: string;
}

export interface PhotoCase {
  preOpUrl: string;
  postOpUrl: string;
  timeframe: string;
  notes: string;
}

export interface Client {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  nationalId: string; // 14 digits strictly matching Egyptian formula
  gender: 'male' | 'female';
  birthDate: string;
  governorate: string;
  governorateCode: string;
  phone: string; // +20 10/11/12/15
  address: string;
  age: number;
  status: ClientStatus;
  procedureType: ProcedureType;
  consultationDate: string;
  procedureDate: string;
  norwood: NorwoodScale;
  donorMetrics: DonorMetrics;
  surgicalPlan: SurgicalPlan;
  medicalHistory: MedicalHistory;
  treatmentLogs: TreatmentLog[];
  photos: PhotoCase[];
  totalPriceEGP: number;
  paidAmountEGP: number;
  assignedDoctor: string;
}

export type PaymentMethod = 'InstaPay' | 'Vodafone Cash' | 'Credit/Debit Card' | 'Cash';
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending';

export interface InvoiceItem {
  description: string;
  descriptionAr: string;
  quantity: number;
  unitPriceEGP: number;
  totalEGP: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientNameEn: string;
  clientNameAr: string;
  clientNationalId: string;
  clientPhone: string;
  clientAddress: string;
  date: string;
  dueDate: string;
  procedure: string;
  items: InvoiceItem[];
  subtotalEGP: number;
  taxEGP: number;
  totalEGP: number;
  paidAmountEGP: number;
  remainingEGP: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  clientId: string;
  clientNameEn: string;
  clientNameAr: string;
  amountEGP: number;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  date: string;
  notes: string;
  receivedBy: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientNameEn: string;
  clientNameAr: string;
  type: 'Consultation' | 'FUE Surgery' | 'DHI Surgery' | 'PRP Session' | 'Post-Op Followup';
  room: 'OR 1 - Sapphire Suite' | 'OR 2 - DHI Precision' | 'Consultation Clinic A' | 'Trichology Lab B';
  doctor: string;
  time: string;
  duration: string;
  status: 'Scheduled' | 'In Surgery' | 'Checked In' | 'Completed' | 'Pending Clearance';
  graftTarget?: number;
}
