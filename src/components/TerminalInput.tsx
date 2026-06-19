import { useRef, useEffect } from 'react';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  prompt?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  prompt = '>',
  disabled = false,
  autoFocus = true,
  placeholder = '',
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && !disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center font-dos text-lg">
      <span className="text-dos-green mr-2">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-dos-green dos-input text-lg"
        style={{
          caretColor: '#00FF00',
          textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
        }}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
