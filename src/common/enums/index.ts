// Company Enums
export enum CompanyType {
  ENTERPRISE = 'enterprise',
  BUSINESS_HOUSEHOLD = 'business_household',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

// Job Enums
export enum JobStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract',
}

// Application Enums
export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  CV_VIEWED = 'cv_viewed',
  CV_APPROVED = 'cv_approved',
  INTERVIEWING = 'interviewing',
  OFFERED = 'offered',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

// User Role (from Core System)
export enum UserRole {
  ADMIN = 'admin',
  UNIVERSITY = 'university',
  COMPANY = 'company',
  STUDENT = 'student',
  ALUMNI = 'alumni',
  RESEARCHER = 'researcher',
  STARTUP = 'startup',
}

