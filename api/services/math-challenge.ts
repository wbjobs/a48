import crypto from 'crypto';

interface MathChallenge {
  id: string;
  question: string;
  answer: string;
  timeLimit: number;
}

type Operation = '+' | '-' | '*' | '/';

function generateId(): string {
  return crypto.randomUUID();
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperation(): Operation {
  const operations: Operation[] = ['+', '-', '*'];
  return operations[Math.floor(Math.random() * operations.length)];
}

export function generateMathChallenge(): MathChallenge {
  const operation = getRandomOperation();
  let a: number;
  let b: number;
  let answer: number;

  switch (operation) {
    case '+':
      a = getRandomInt(10, 99);
      b = getRandomInt(10, 99);
      answer = a + b;
      break;
    case '-':
      a = getRandomInt(50, 99);
      b = getRandomInt(10, 49);
      answer = a - b;
      break;
    case '*':
      a = getRandomInt(2, 12);
      b = getRandomInt(2, 12);
      answer = a * b;
      break;
    default:
      a = getRandomInt(10, 99);
      b = getRandomInt(10, 99);
      answer = a + b;
  }

  return {
    id: generateId(),
    question: `请计算: ${a} ${operation} ${b} = ?`,
    answer: answer.toString(),
    timeLimit: 10,
  };
}

export function verifyMathAnswer(userAnswer: string, correctAnswer: string): boolean {
  const userNum = parseInt(userAnswer.trim(), 10);
  const correctNum = parseInt(correctAnswer, 10);
  return !isNaN(userNum) && userNum === correctNum;
}
