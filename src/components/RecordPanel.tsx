import { useEffect, useState } from 'react';
import { getRecords } from '@/services/api';
import type { Record as RecordItem } from '../../shared/types';

const typeNames: Record<string, string> = {
  math: '数学挑战',
  rot13: 'Rot13解密',
  matrix: '矩阵识别',
};

interface RecordPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordPanel({ isOpen, onClose }: RecordPanelProps) {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRecords();
    }
  }, [isOpen]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getRecords();
      setRecords(data.records);
      setTotal(data.total);
      setSuccessCount(data.successCount);
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg border-2 border-dos-green bg-black p-6 font-dos">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-dos-green glow-green">验证历史记录</h2>
          <button
            onClick={onClose}
            className="text-dos-red hover:text-red-400 text-xl"
          >
            [X]
          </button>
        </div>

        <div className="mb-4 text-dos-amber text-sm">
          <div>总次数: {total}</div>
          <div>成功次数: {successCount}</div>
          <div>成功率: {successRate}%</div>
        </div>

        <div className="border-t border-dos-green-dark pt-4 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-dos-green">加载中...</div>
          ) : records.length === 0 ? (
            <div className="text-dos-green-dark">暂无记录</div>
          ) : (
            <div className="space-y-2 text-sm">
              {records.map((record, index) => (
                <div
                  key={record.id}
                  className={`flex justify-between items-center ${
                    record.success ? 'text-dos-green' : 'text-dos-red'
                  }`}
                >
                  <span className="w-6">#{index + 1}</span>
                  <span className="w-20">{typeNames[record.type] || record.type}</span>
                  <span className="w-16">{record.success ? '成功' : '失败'}</span>
                  <span className="w-20">{(record.timeUsed / 1000).toFixed(1)}s</span>
                  <span className="w-16">错误: {record.errorCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-dos-green hover:text-green-300"
          >
            [ 关闭 ]
          </button>
        </div>
      </div>
    </div>
  );
}
