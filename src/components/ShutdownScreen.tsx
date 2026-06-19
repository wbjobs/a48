import { useEffect, useState } from 'react';

const SHUTDOWN_MESSAGES = [
  '验证失败...',
  '',
  '系统检测到未授权访问尝试',
  '正在终止所有进程...',
  '',
  '╔══════════════════════════════════╗',
  '║     系统即将关闭            ║',
  '║     请联系管理员获取访问权限     ║',
  '╚══════════════════════════════════╝',
  '',
  '提示: 下次记得把答案写在手上 :)',
  '',
];

interface ShutdownScreenProps {
  onRestart: () => void;
}

export default function ShutdownScreen({ onRestart }: ShutdownScreenProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showRestart, setShowRestart] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    SHUTDOWN_MESSAGES.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
      }, 300 + index * 400);
      timers.push(timer);
    });

    const shutdownTimer = setTimeout(() => {
      setIsShuttingDown(true);
    }, 300 + SHUTDOWN_MESSAGES.length * 400 + 500);
    timers.push(shutdownTimer);

    const restartTimer = setTimeout(() => {
      setShowRestart(true);
    }, 300 + SHUTDOWN_MESSAGES.length * 400 + 2500);
    timers.push(restartTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full h-full p-6 overflow-y-auto flex flex-col items-center justify-center">
      <div className={`${isShuttingDown ? 'screen-shutdown' : ''}`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`font-dos text-lg ${
              msg.includes('═') || msg.includes('║') ? 'text-dos-red glow-red' : 'text-dos-red'
            }`}
          >
            {msg || '\u00A0'}
          </div>
        ))}
      </div>

      {showRestart && (
        <div
          className="mt-8 text-dos-amber font-dos cursor-pointer hover:text-amber-300 transition-colors"
          onClick={onRestart}
        >
          [ 点击重新开机 ]
        </div>
      )}
    </div>
  );
}
