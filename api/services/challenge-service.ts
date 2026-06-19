import type { ChallengeType, Challenge, ChallengeResponse, VerifyResponse } from '../../shared/types.js';
import { generateMathChallenge, verifyMathAnswer } from './math-challenge.js';
import { generateRot13Challenge, verifyRot13Answer } from './rot13-challenge.js';
import { generateMatrixChallenge, verifyMatrixAnswer } from './matrix-challenge.js';
import { store } from '../store/memory-store.js';

function getRandomType(): ChallengeType {
  const types: ChallengeType[] = ['math', 'rot13', 'matrix'];
  return types[Math.floor(Math.random() * types.length)];
}

export function generateChallenge(type?: ChallengeType): ChallengeResponse {
  const challengeType = type || getRandomType();
  let challenge: Challenge;

  switch (challengeType) {
    case 'math': {
      const math = generateMathChallenge();
      challenge = {
        ...math,
        type: 'math',
        createdAt: Date.now(),
      };
      break;
    }
    case 'rot13': {
      const rot13 = generateRot13Challenge();
      challenge = {
        ...rot13,
        type: 'rot13',
        createdAt: Date.now(),
      };
      break;
    }
    case 'matrix': {
      const matrix = generateMatrixChallenge();
      challenge = {
        id: matrix.id,
        type: 'matrix',
        question: matrix.question,
        answer: matrix.answer,
        hint: matrix.hint,
        timeLimit: matrix.timeLimit,
        createdAt: Date.now(),
      };
      break;
    }
    default: {
      const math = generateMathChallenge();
      challenge = {
        ...math,
        type: 'math',
        createdAt: Date.now(),
      };
    }
  }

  store.setChallenge(challenge);

  return {
    id: challenge.id,
    type: challenge.type,
    question: challenge.question,
    hint: challenge.hint,
    timeLimit: challenge.timeLimit,
  };
}

export function verifyAnswer(id: string, userAnswer: string): VerifyResponse {
  const challenge = store.getChallenge(id);

  if (!challenge) {
    return {
      correct: false,
      message: '验证会话已过期，请重新开始',
    };
  }

  let correct = false;

  switch (challenge.type) {
    case 'math':
      correct = verifyMathAnswer(userAnswer, challenge.answer);
      break;
    case 'rot13':
      correct = verifyRot13Answer(userAnswer, challenge.answer);
      break;
    case 'matrix':
      correct = verifyMatrixAnswer(userAnswer, challenge.answer);
      break;
    default:
      correct = false;
  }

  const mockMessages = [
    '就这？这么简单的题都能错？',
    '你的智商是用脚指头算的吗？',
    '不行就别勉强自己了，关机吧',
    '这都不会？回小学重读吧',
    '系统表示对你很失望',
  ];

  if (correct) {
    return {
      correct: true,
      message: '验证通过！系统即将启动...',
    };
  } else {
    const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
    return {
      correct: false,
      message: randomMessage,
      correctAnswer: challenge.answer,
    };
  }
}

export function cleanupChallenge(id: string): void {
  store.deleteChallenge(id);
}
