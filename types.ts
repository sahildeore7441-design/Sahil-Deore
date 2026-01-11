
export enum Language {
  ENGLISH = 'en',
  MARATHI = 'mr'
}

export enum Role {
  CITIZEN = 'citizen',
  ADMIN = 'admin'
}

export enum IssueType {
  POTHOLE = 'pothole',
  GARBAGE = 'garbage',
  STREETLIGHT = 'streetlight',
  WATER_LEAKAGE = 'water_leakage',
  DRAINAGE = 'drainage'
}

export enum Severity {
  CRITICAL = 'critical',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum IssueStatus {
  REPORTED = 'reported',
  IN_PROGRESS = 'in_progress',
  FIXED = 'fixed'
}

export interface User {
  id: string;
  fullName: string;
  age: number;
  city: string;
  email: string;
  preferredLanguage: Language;
  role: Role;
  department?: string;
  issuesReportedCount: number;
  issuesHandledCount?: number;
}

export interface Issue {
  id: string;
  reporterId: string;
  reporterName: string;
  type: IssueType;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    ward: string;
  };
  severity: Severity;
  isAnonymous: boolean;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  fixedAt?: string;
  confirmations: number;
  isVerified: boolean;
  needsReview: boolean;
  assignedDepartment: string;
  isDemo?: boolean;
  source?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
  issueId?: string;
}

export interface CityStats {
  city: string;
  civicHealthScore: number;
  totalIssues: number;
  resolvedIssues: number;
  avgFixTimeHours: number;
}
