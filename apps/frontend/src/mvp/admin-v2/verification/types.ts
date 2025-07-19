// Types for Verification Section

export interface UserVerification {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  userType: 'college_student' | 'working_professional';
  profilePicture?: string;
  joinedDate: string;
  lastActive: string;
  
  // Verification statuses
  verificationStatus: {
    phone: VerificationStatus;
    email: VerificationStatus;
    officialEmail: VerificationStatus;
    aadharId: VerificationStatus;
    collegeId?: VerificationStatus;
    workId?: VerificationStatus;
    collegeMarksheet?: VerificationStatus;
  };
  
  // Additional details
  college?: {
    name: string;
    degree: string;
    graduationYear: string;
    marksheetUploaded: boolean;
    marksheetUrl?: string;
    studentIdUploaded: boolean;
    studentIdUrl?: string;
  };
  
  work?: {
    company: string;
    designation: string;
    officialEmail: string;
    workIdUploaded: boolean;
    workIdUrl?: string;
  };
  
  documents: {
    aadharUploaded: boolean;
    aadharUrl?: string;
    aadharNumber?: string; // Masked
  };
}

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';

export interface VerificationFilter {
  userType?: 'all' | 'college_student' | 'working_professional';
  verificationStatus?: 'all' | 'verified' | 'pending' | 'rejected' | 'not_submitted';
  specificVerification?: 'phone' | 'email' | 'officialEmail' | 'aadharId' | 'collegeId' | 'workId' | 'collegeMarksheet';
  city?: string;
  country?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface BulkEmailRequest {
  userIds: string[];
  templateId: string;
  targetUnverified?: string[]; // Which verifications to target
  customMessage?: string;
  scheduledTime?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'verification' | 'reminder' | 'general';
  variables: string[]; // e.g., ['userName', 'verificationLink']
  createdAt: string;
  updatedAt: string;
}

export interface VerificationUpdateRequest {
  userId: string;
  verificationType: keyof UserVerification['verificationStatus'];
  status: VerificationStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface VerificationStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  rejectedVerifications: number;
  
  byType: {
    phone: { verified: number; pending: number; rejected: number; notSubmitted: number };
    email: { verified: number; pending: number; rejected: number; notSubmitted: number };
    officialEmail: { verified: number; pending: number; rejected: number; notSubmitted: number };
    aadharId: { verified: number; pending: number; rejected: number; notSubmitted: number };
    collegeId: { verified: number; pending: number; rejected: number; notSubmitted: number };
    workId: { verified: number; pending: number; rejected: number; notSubmitted: number };
    collegeMarksheet: { verified: number; pending: number; rejected: number; notSubmitted: number };
  };
}