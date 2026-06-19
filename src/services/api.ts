import type {
  ChallengeType,
  ChallengeResponse,
  VerifyResponse,
  RecordRequest,
  Record,
  RecordsResponse,
} from '../../shared/types';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return data.data as T;
}

export async function getChallenge(type?: ChallengeType): Promise<ChallengeResponse> {
  const path = type ? `/challenge?type=${type}` : '/challenge';
  return request<ChallengeResponse>(path);
}

export async function verifyAnswer(id: string, answer: string): Promise<VerifyResponse> {
  return request<VerifyResponse>('/challenge/verify', {
    method: 'POST',
    body: JSON.stringify({ id, answer }),
  });
}

export async function submitRecord(data: RecordRequest): Promise<Record> {
  return request<Record>('/records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getRecords(): Promise<RecordsResponse> {
  return request<RecordsResponse>('/records');
}
