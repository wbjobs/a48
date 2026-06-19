import crypto from 'crypto';
import type { RecordRequest, Record, RecordsResponse } from '../../shared/types.js';
import { store } from '../store/memory-store.js';

function generateId(): string {
  return crypto.randomUUID();
}

export function addRecord(request: RecordRequest): Record {
  const record: Record = {
    id: generateId(),
    type: request.type,
    success: request.success,
    timeUsed: request.timeUsed,
    errorCount: request.errorCount,
    timestamp: Date.now(),
  };

  store.addRecord(record);
  return record;
}

export function getRecords(): RecordsResponse {
  const records = store.getRecords();
  const stats = store.getStats();

  return {
    total: stats.total,
    successCount: stats.successCount,
    records: records.slice(0, 20),
  };
}
