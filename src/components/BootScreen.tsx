import { useState, useEffect } from 'react';
import TerminalLine from './TerminalLine';

const BOOT_LINES = [
  { text: 'BIOS Version 2.13.0', delay: 0, color: 'green' as const },
  { text: 'Copyright (c) 2024 Trae Systems Inc.', delay: 200, color: 'green' as const },
  { text: '', delay: 300, color: 'green' as const },
  { text: 'CPU: TRAE-8086 @ 4.77MHz', delay: 500, color: 'green' as const },
  { text: 'Memory Test: 640KB OK', delay: 800, color: 'green' as const },
  { text: '', delay: 900, color: 'green' as const },
  { text: 'Fixed Disk 0: 20MB', delay: 1100, color: 'green' as const },
  { text: 'Floppy Disk 0: 1.44MB', delay: 1300, color: 'green' as const },
  { text: '', delay: 1400, color: 'green' as const },
  { text: 'Loading MS-DOS...', delay: 1600, color: 'amber' as const },
  { text: '', delay: 2000, color: 'green' as const },
  { text: 'MS-DOS Version 3.30', delay: 2200, color: 'green' as const },
  { text: '', delay: 2300, color: 'green' as const },
  { text: 'SYSTEM SECURITY CHECK REQUIRED', delay: 2500, color: 'amber' as const, bold: true },
  { text: '', delay: 2700, color: 'green' as const },
  { text: '正在初始化安全验证模块...', delay: 2900, color: 'green' as const },
  { text: '', delay: 3200, color: 'green' as const },
  { text: '> 按任意键继续...', delay: 3400, color: 'green' as const, showCursor: true },
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, BOOT_LINES[index].delay);
      timers.push(timer);
    });

    const lastTimer = setTimeout(() => {
      setCompleted(true);
    }, BOOT_LINES[BOOT_LINES.length - 1].delay + 500);
    timers.push(lastTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!completed) return;

    const handleKeyPress = () => {
      onComplete();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [completed, onComplete]);

  const handleClick = () => {
    if (completed) {
      onComplete();
    }
  };

  return (
    <div
      className="w-full h-full p-6 overflow-y-auto cursor-pointer"
      onClick={handleClick}
    >
      {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
        <TerminalLine
          key={index}
          text={line.text}
          speed={10}
          color={line.color}
          bold={line.bold}
          showCursor={index === visibleLines - 1 && line.showCursor}
        />
      ))}
      {completed && (
        <div className="mt-4 text-dos-green-dark text-sm font-dos">
          （点击屏幕或按任意键开始验证）
        </div>
      )}
    </div>
  );
}
