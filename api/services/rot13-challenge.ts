import crypto from 'crypto';

interface Rot13Challenge {
  id: string;
  question: string;
  answer: string;
  hint: string;
  timeLimit: number;
}

const WORDS = [
  'HELLO', 'WORLD', 'PROGRAM', 'COMPUTER', 'KEYBOARD',
  'MONITOR', 'SYSTEM', 'NETWORK', 'DATABASE', 'ALGORITHM',
  'FUNCTION', 'VARIABLE', 'PASSWORD', 'SECURITY', 'ENCRYPT',
  'DECRYPT', 'TERMINAL', 'CONSOLE', 'COMMAND', 'OPERATING'
];

function generateId(): string {
  return crypto.randomUUID();
}

function rot13(str: string): string {
  return str.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function generateRot13Challenge(): Rot13Challenge {
  const word = getRandomWord();
  const encoded = rot13(word);

  return {
    id: generateId(),
    question: `请解密以下 Rot13 编码的字符串: ${encoded}`,
    answer: word,
    hint: 'Rot13 是一种简单的字母替换密码，将每个字母替换为字母表中第13个之后的字母',
    timeLimit: 15,
  };
}

export function verifyRot13Answer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toUpperCase() === correctAnswer.toUpperCase();
}
