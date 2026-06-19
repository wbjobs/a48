import { useState, useCallback, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import BootScreen from '@/components/BootScreen';
import ChallengeScreen from '@/components/ChallengeScreen';
import SuccessScreen from '@/components/SuccessScreen';
import ShutdownScreen from '@/components/ShutdownScreen';
import RecordPanel from '@/components/RecordPanel';
import { useGameStore } from '@/store/gameStore';
import { getRecords } from '@/services/api';

export default function Home() {
  const { phase, setPhase, resetGame } = useGameStore();
  const [showRecords, setShowRecords] = useState(false);

  const handleBootComplete = useCallback(() => {
    setPhase('ready');
  }, [setPhase]);

  const handleRestart = useCallback(() => {
    resetGame();
    setTimeout(() => {
      setPhase('ready');
    }, 500);
  }, [resetGame, setPhase]);

  useEffect(() => {
    getRecords().catch(() => {});
  }, []);

  const renderPhase = () => {
    switch (phase) {
      case 'boot':
        return <BootScreen onComplete={handleBootComplete} />;
      case 'ready':
      case 'challenge':
        return <ChallengeScreen />;
      case 'success':
        return <SuccessScreen onRestart={handleRestart} />;
      case 'shutdown':
        return <ShutdownScreen onRestart={handleRestart} />;
      default:
        return <BootScreen onComplete={handleBootComplete} />;
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] max-h-[700px] border-4 border-dos-green-dark rounded shadow-2xl shadow-green-900/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 bg-dos-green-dark/20 border-b border-dos-green-dark flex items-center px-4 z-30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center font-dos text-dos-green text-sm">
            TRAE-OS Terminal - 系统安全验证
          </div>
          <button
            onClick={() => setShowRecords(true)}
            className="text-dos-amber text-sm font-dos hover:text-amber-300 transition-colors"
          >
            [记录]
          </button>
        </div>

        <div className="pt-8 h-full">
          <Terminal className="h-full">
            <div className="h-full pt-2">
              {renderPhase()}
            </div>
          </Terminal>
        </div>

        <RecordPanel isOpen={showRecords} onClose={() => setShowRecords(false)} />
      </div>
    </div>
  );
}
