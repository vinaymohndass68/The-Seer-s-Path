
export type AnalysisMode = 'PERSONAL' | 'COMPATIBILITY' | 'COMPANY' | 'PAST_LIFE';

export interface UserInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  mode: AnalysisMode;
  partnerName?: string;
  partnerBirthDate?: string; // YYYY-MM-DD
  companyName?: string;
  natureOfWork?: string;
}

export interface Scores {
  // Personal
  birth?: number;
  name?: number;
  destiny?: number;
  year?: number;
  month?: number;
  day?: number;
  // Compatibility
  harmony?: number;
  communication?: number;
  longevity?: number;
  // Company
  businessSuccess?: number;
  brandPower?: number;
  ownerCompatibility?: number;
  // Past Life
  karmicIntensity?: number;
  soulMaturity?: number;
  spiritualPotential?: number;
}

export interface SuggestedName {
  name: string;
  numerology: number;
  rationale: string;
}

export interface PersonData {
  fullName: string;
  birthDate: string;
  birthNumber: number;
  birthCompound: number;
  nameNumber: number;
  nameCompound: number;
  destinyNumber: number;
  destinyCompound: number;
  luckyDays: string[];
  luckyColors: string[];
  luckyStone: string;
}

export interface CompanyData {
  name: string;
  nameNumber: number;
  nameCompound: number;
  natureOfWork: string;
}

export interface NumerologyResult extends PersonData {
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  targetDate: string; // YYYY-MM-DD
  mode: AnalysisMode;
  partner?: PersonData & {
    personalYear: number;
  };
  company?: CompanyData;
}

export interface TurningPoint {
  age: number;
  year: number;
  type: string;
  description: string;
}

export interface PredictionData {
  text: string;
  scores?: Scores;
  yearlySummary?: string;
  // Past Life
  pastLifeArchetype?: string;
  pastLifeRole?: string;
  pastLifeCountry?: string;
  pastLifePlace?: string;
  pastLifeFamily?: string;
  pastLifePeriod?: string;
  pastLifeArtifacts?: string[];
  pastLifeArtifactImages?: string[]; // Base64 strings for artifact images
  pastLifeEnvironment?: string;
  pastLifeSocietalNorms?: string;
  pastLifeCulture?: string;
  pastLifeImageUrl?: string; // Base64 or URL of the generated image
  // Personal
  turningPoints?: TurningPoint[];
  personalNameSuggestions?: SuggestedName[];
  // Company
  suggestedNames?: SuggestedName[];
  loading: boolean;
  imageLoading?: boolean;
  artifactsLoading?: boolean;
  suggestionsLoading?: boolean;
  error: string | null;
}

export enum CalculationStep {
  INPUT = 'INPUT',
  CALCULATING = 'CALCULATING',
  RESULT = 'RESULT'
}
