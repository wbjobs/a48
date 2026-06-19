import { useEffect, useState } from 'react';

interface TerminalLineProps {
  text: string;
  speed?: number;
  delay?: number;
  color?: 'green' | 'amber' | 'red' | 'white';
  onComplete?: () => void;
  showCursor?: boolean;
  bold?: boolean;
  className?: string;
}

const colorClasses = {
  green: 'text-dos-green',
  amber: 'text-dos-amber',
  red: 'text-dos-red',
  white: 'text-white',
};

export default function TerminalLine({
  text,
  speed = 25,
  delay = 0,
  color = 'green',
  onComplete,
  showCursor = false,
  bold = false,
  className = '',
}: TerminalLineProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);

    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        timeoutId = setTimeout(startTyping, speed);
      } else {
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay, onComplete]);

  return (
    <div className={`font-dos text-lg ${colorClasses[color]} ${className} ${bold ? 'font-bold' : ''}`}>
      <span className="whitespace-pre-wrap">{displayText}</span>
      {showCursor && (
        <span className="inline-block w-2 h-5 bg-dos-green ml-0.5 align-middle blink-cursor" />
      )}
    </div>
  );
}
