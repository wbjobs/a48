import { useState, useEffect, useCallback } from 'react';
import TerminalLine from './TerminalLine';
import TerminalInput from './TerminalInput';
import { useGameStore } from '@/store/gameStore';
import { getChallenge, verifyAnswer, submitRecord } from '@/services/api';
import type { ChallengeType } from '../../shared/types';

const MAX_ATTEMPTS = 3;

const challengeTypeNames: Record<ChallengeType, string> = {
  math: '数学挑战',
  rot13: 'Rot13 解密',
  matrix: '字符矩阵识别',
};

const introLines = [
  '╔══════════════════════════════════════════╗',
  '║         系统安全验证程序 v1.0            ║',
  '╚══════════════════════════════════════════╝',
  '',
  '警告: 未经授权的访问将被记录！',
  '',
  '请选择验证类型:',
  '  [1] 数学挑战',
  '  [2] Rot13 解密',
  '  [3] 字符矩阵识别',
  '  [0] 随机挑战 (推荐)',
  '',
];

export default function ChallengeScreen() {
  const {
    phase,
    setPhase,
    currentChallenge,
    setChallenge,
    errorCount,
    setErrorCount,
    startTime,
    setStartTime,
    timeLeft,
    setTimeLeft,
    message,
    setMessage,
    showHint,
    setShowHint,
  } = useGameStore();

  const [inputValue, setInputValue] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [flashRed, setFlashRed] = useState(false);

  useEffect(() => {
    if (phase === 'ready' && showIntro) {
      const allLines = [...introLines];
      setLines(allLines);
    }
  }, [phase, showIntro]);

  const startChallenge = useCallback(async (type?: ChallengeType) => {
    try {
      setMessage('正在生成验证题目...');
      const challenge = await getChallenge(type);
      setChallenge(challenge);
      setErrorCount(0);
      setStartTime(Date.now());
      setTimeLeft(challenge.timeLimit);
      setShowHint(false);
      setMessage('');
      setInputValue('');
      setShowIntro(false);
      setPhase('challenge');
    } catch (err) {
      setMessage('错误: 无法生成验证题目，请重试');
    }
  }, [setChallenge, setErrorCount, setStartTime, setTimeLeft, setShowHint, setMessage, setPhase]);

  useEffect(() => {
    if (phase !== 'challenge' || !currentChallenge) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, currentChallenge, setTimeLeft]);

  const handleTimeout = useCallback(() => {
    const newErrorCount = errorCount + 1;
    setErrorCount(newErrorCount);
    setFlashRed(true);
    setTimeout(() => setFlashRed(false), 400);

    if (newErrorCount >= MAX_ATTEMPTS) {
      handleShutdown();
    } else {
      setMessage(`时间到！还剩 ${MAX_ATTEMPTS - newErrorCount} 次机会... 正在重新生成题目`);
      setTimeout(() => {
        if (currentChallenge) {
          startChallenge(currentChallenge.type);
        }
      }, 1500);
    }
  }, [errorCount, currentChallenge, setErrorCount, setMessage, startChallenge]);

  const handleShutdown = useCallback(async () => {
    const timeUsed = Date.now() - startTime;
    setMessage('验证失败！系统正在关机...');

    try {
      await submitRecord({
        type: currentChallenge?.type || 'math',
        success: false,
        timeUsed,
        errorCount: MAX_ATTEMPTS,
      });
    } catch (e) {
      console.error('Failed to submit record:', e);
    }

    setTimeout(() => {
      setPhase('shutdown');
    }, 1000);
  }, [startTime, currentChallenge, setMessage, setPhase]);

  const handleSubmit = useCallback(async () => {
    if (!currentChallenge || isVerifying || !inputValue.trim()) return;

    setIsVerifying(true);
    setLines((prev) => [...prev, `> ${inputValue}`]);

    try {
      const result = await verifyAnswer(currentChallenge.id, inputValue.trim());

      if (result.correct) {
        const timeUsed = Date.now() - startTime;
        setMessage(result.message);

        try {
          await submitRecord({
            type: currentChallenge.type,
            success: true,
            timeUsed,
            errorCount,
          });
        } catch (e) {
          console.error('Failed to submit record:', e);
        }

        setTimeout(() => {
          setPhase('success');
        }, 1500);
      } else {
        const newErrorCount = errorCount + 1;
        setErrorCount(newErrorCount);
        setFlashRed(true);
        setTimeout(() => setFlashRed(false), 400);
        setMessage(`${result.message} (还剩 ${MAX_ATTEMPTS - newErrorCount} 次机会)`);
        setInputValue('');

        if (newErrorCount >= MAX_ATTEMPTS) {
          setTimeout(() => {
            handleShutdown();
          }, 1500);
        }
      }
    } catch (err) {
      setMessage('验证出错，请重试');
    } finally {
      setIsVerifying(false);
    }
  }, [currentChallenge, isVerifying, inputValue, startTime, errorCount, setErrorCount, setMessage, setPhase, handleShutdown]);

  const handleKeySelect = useCallback((key: string) => {
    if (phase !== 'ready' || !showIntro) return;

    switch (key) {
      case '1':
        startChallenge('math');
        break;
      case '2':
        startChallenge('rot13');
        break;
      case '3':
        startChallenge('matrix');
        break;
      case '0':
        startChallenge();
        break;
    }
  }, [phase, showIntro, startChallenge]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'ready' && showIntro) {
        handleKeySelect(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, showIntro, handleKeySelect]);

  const getTimeBar = () => {
    if (!currentChallenge) return '';
    const percentage = (timeLeft / currentChallenge.timeLimit) * 100;
    const filled = Math.round(percentage / 5);
    const empty = 20 - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  };

  return (
    <div className={`w-full h-full p-6 overflow-y-auto ${flashRed ? 'flash-red' : ''}`}>
      {showIntro ? (
        <>
          {lines.map((line, index) => (
            <TerminalLine
              key={index}
              text={line}
              speed={0}
              color="green"
            />
          ))}
          {message && (
            <TerminalLine text={message} speed={20} color="amber" />
          )}
          <TerminalLine text="请输入选项: " speed={0} color="green" showCursor />
        </>
      ) : (
        <>
          <div className="mb-2 text-dos-amber font-dos text-lg">
            [ {challengeTypeNames[currentChallenge?.type || 'math']} ]
          </div>

          <div className="mb-4 font-dos text-dos-green">
            剩余时间: {timeLeft}s {getTimeBar()}
          </div>

          <div className="mb-4 text-dos-green font-dos text-lg whitespace-pre-wrap leading-relaxed">
            {currentChallenge?.question}
          </div>

          {showHint && currentChallenge?.hint && (
            <div className="mb-4 text-dos-amber font-dos text-base border-l-2 border-dos-amber pl-3">
              提示: {currentChallenge.hint}
            </div>
          )}

          {errorCount > 0 && (
            <div className="mb-4 text-dos-red font-dos">
              错误次数: {errorCount} / {MAX_ATTEMPTS}
            </div>
          )}

          {message && (
            <div className="mb-4 text-dos-amber font-dos text-lg">
              {message}
            </div>
          )}

          <div className="mt-6">
            <TerminalInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              prompt=">"
              disabled={isVerifying || phase !== 'challenge'}
              placeholder="输入答案..."
            />
          </div>

          <div className="mt-6 flex gap-4 font-dos text-sm">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-dos-amber hover:text-amber-300 transition-colors"
            >
              [H] 提示
            </button>
            <button
              onClick={() => {
                setShowIntro(true);
                setPhase('ready');
                setMessage('');
              }}
              className="text-dos-green hover:text-green-300 transition-colors"
            >
              [B] 返回
            </button>
          </div>
        </>
      )}
    </div>
  );
}
