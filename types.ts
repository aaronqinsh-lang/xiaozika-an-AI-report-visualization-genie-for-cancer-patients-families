
export type IndicatorType = 'Tumor' | 'Blood' | 'Liver' | 'Infection' | 'Coagulation' | 'Renal' | 'Cholestasis';

export interface IndicatorData {
  [key: string]: number;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  indicators: IndicatorData;
  treatmentPhase?: string;
  hospital?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  contact: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface HealthArchive {
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  medicalHistory: string;
  doctors: Doctor[];
  emergency: EmergencyContact;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'line' | 'area';
  metrics: string[];
  isPinned: boolean;
}

export interface MonitoringScenario {
  id: string;
  label: string;
  metrics: string[];
  description: string;
  icon: string;
}
