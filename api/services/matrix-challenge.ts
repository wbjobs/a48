import crypto from 'crypto';

interface MatrixChallenge {
  id: string;
  question: string;
  answer: string;
  hint: string;
  timeLimit: number;
  matrix: string[][];
}

const TARGET_WORDS = [
  'SYSTEM', 'LOGIN', 'ACCESS', 'VERIFY', 'SECURE',
  'BOOT', 'BIOS', 'DISK', 'MEMORY', 'PROGRAM',
  'CODE', 'DATA', 'FILE', 'SHELL', 'KERNEL'
];

const MATRIX_SIZE = 10;

function generateId(): string {
  return crypto.randomUUID();
}

function getRandomWord(): string {
  return TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
}

function getRandomChar(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars[Math.floor(Math.random() * chars.length)];
}

function generateMatrix(word: string): { matrix: string[][]; direction: string } {
  const matrix: string[][] = [];

  for (let i = 0; i < MATRIX_SIZE; i++) {
    matrix[i] = [];
    for (let j = 0; j < MATRIX_SIZE; j++) {
      matrix[i][j] = getRandomChar();
    }
  }

  const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

  if (direction === 'horizontal') {
    const row = Math.floor(Math.random() * MATRIX_SIZE);
    const maxCol = MATRIX_SIZE - word.length;
    const col = Math.floor(Math.random() * (maxCol + 1));
    for (let i = 0; i < word.length; i++) {
      matrix[row][col + i] = word[i];
    }
  } else {
    const col = Math.floor(Math.random() * MATRIX_SIZE);
    const maxRow = MATRIX_SIZE - word.length;
    const row = Math.floor(Math.random() * (maxRow + 1));
    for (let i = 0; i < word.length; i++) {
      matrix[row + i][col] = word[i];
    }
  }

  return { matrix, direction };
}

function matrixToString(matrix: string[][]): string {
  let result = '';
  for (let i = 0; i < matrix.length; i++) {
    result += matrix[i].join(' ') + '\n';
  }
  return result;
}

export function generateMatrixChallenge(): MatrixChallenge {
  const word = getRandomWord();
  const { matrix, direction } = generateMatrix(word);
  const matrixStr = matrixToString(matrix);

  return {
    id: generateId(),
    question: `在下方字符矩阵中找出隐藏的英文单词（${direction === 'horizontal' ? '水平' : '垂直'}排列）:\n\n${matrixStr}`,
    answer: word,
    hint: `单词是${direction === 'horizontal' ? '水平' : '垂直'}排列的，长度为 ${word.length}`,
    timeLimit: 20,
    matrix,
  };
}

export function verifyMatrixAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toUpperCase() === correctAnswer.toUpperCase();
}
