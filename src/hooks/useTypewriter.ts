import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
): {
  displayText: string;
  isComplete: boolean;
  reset: () => void;
  skip: () => void;
} {
  const { speed = 30, delay = 0, onComplete } = options;
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    setDisplayText('');
    setIsComplete(false);
    indexRef.current = 0;
    startedRef.current = false;
  }, [clear]);

  const skip = useCallback(() => {
    clear();
    setDisplayText(text);
    setIsComplete(true);
    if (onComplete) {
      onComplete();
    }
  }, [text, onComplete, clear]);

  useEffect(() => {
    reset();

    if (!text) {
      setIsComplete(true);
      return;
    }

    const type = () => {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    const startDelay = delay;
    timeoutRef.current = setTimeout(() => {
      startedRef.current = true;
      type();
    }, startDelay);

    return clear;
  }, [text, speed, delay, onComplete, reset, clear]);

  return { displayText, isComplete, reset, skip };
}

export default useTypewriter;
