export type ChallengeType = 'math' | 'rot13' | 'matrix';

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  answer: string;
  hint?: string;
  timeLimit: number;
  createdAt: number;
}

export interface ChallengeResponse {
  id: string;
  type: ChallengeType;
  question: string;
  hint?: string;
  timeLimit: number;
}

export interface VerifyRequest {
  id: string;
  answer: string;
}

export interface VerifyResponse {
  correct: boolean;
  message: string;
  correctAnswer?: string;
}

export interface Record {
  id: string;
  type: ChallengeType;
  success: boolean;
  timeUsed: number;
  errorCount: number;
  timestamp: number;
}

export interface RecordRequest {
  type: ChallengeType;
  success: boolean;
  timeUsed: number;
  errorCount: number;
}

export interface RecordsResponse {
  total: number;
  successCount: number;
  records: Record[];
}
