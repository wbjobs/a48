import { useEffect, useState } from 'react';
import TerminalLine from './TerminalLine';

const SUCCESS_ART = `
╔══════════════════════════════════════════════════╗
║   ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗  ║
║   ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║  ║
║   ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║  ║
║   ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║  ║
║   ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║  ║
║   ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝  ║
╚══════════════════════════════════════════════════╝
`;

const SUCCESS_MESSAGES = [
  '系统启动成功！',
  '',
  '欢迎使用 TraeOS 操作系统',
  '',
  '当前时间: ' + new Date().toLocaleString('zh-CN'),
  '',
  '> 所有系统组件正常运行',
  '> 安全验证已通过',
  '> 用户访问已授权',
  '',
  '按任意键或点击重新开始验证...',
];

interface SuccessScreenProps {
  onRestart: () => void;
}

export default function SuccessScreen({ onRestart }: SuccessScreenProps) {
  const [showArt, setShowArt] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    const artTimer = setTimeout(() => setShowArt(true), 500);
    const msgTimer = setTimeout(() => setShowMessages(true), 1500);

    return () => {
      clearTimeout(artTimer);
      clearTimeout(msgTimer);
    };
  }, []);

  useEffect(() => {
    if (!showMessages) return;

    const handleKeyPress = () => {
      onRestart();
    };

    const timer = setTimeout(() => {
      window.addEventListener('keydown', handleKeyPress);
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showMessages, onRestart]);

  return (
    <div
      className="w-full h-full p-6 overflow-y-auto cursor-pointer flex flex-col items-center justify-center"
      onClick={onRestart}
    >
      {showArt && (
        <pre className="text-dos-green font-dos text-xs mb-6 glow-green whitespace-pre">
          {SUCCESS_ART}
        </pre>
      )}
      {showMessages && (
        <div className="text-center">
          {SUCCESS_MESSAGES.map((msg, index) => (
            <TerminalLine
              key={index}
              text={msg}
              speed={30}
              delay={index * 200}
              color={index === 0 ? 'green' : 'green'}
              bold={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
