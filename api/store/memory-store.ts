import type { Challenge, Record } from '../../shared/types.js';

class MemoryStore {
  private challenges: Map<string, Challenge> = new Map();
  private records: Record[] = [];

  setChallenge(challenge: Challenge): void {
    this.challenges.set(challenge.id, challenge);
  }

  getChallenge(id: string): Challenge | undefined {
    return this.challenges.get(id);
  }

  deleteChallenge(id: string): boolean {
    return this.challenges.delete(id);
  }

  addRecord(record: Record): void {
    this.records.unshift(record);
    if (this.records.length > 100) {
      this.records = this.records.slice(0, 100);
    }
  }

  getRecords(): Record[] {
    return [...this.records];
  }

  getStats(): { total: number; successCount: number } {
    const total = this.records.length;
    const successCount = this.records.filter(r => r.success).length;
    return { total, successCount };
  }
}

export const store = new MemoryStore();
