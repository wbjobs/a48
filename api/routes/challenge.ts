import { Router, type Request, type Response } from 'express';
import type { ChallengeType, VerifyRequest } from '../../shared/types.js';
import { generateChallenge, verifyAnswer } from '../services/challenge-service.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const type = req.query.type as ChallengeType | undefined;

  if (type && !['math', 'rot13', 'matrix'].includes(type)) {
    res.status(400).json({
      success: false,
      error: 'Invalid challenge type',
    });
    return;
  }

  const challenge = generateChallenge(type);
  res.json({
    success: true,
    data: challenge,
  });
});

router.post('/verify', (req: Request, res: Response) => {
  const { id, answer } = req.body as VerifyRequest;

  if (!id || answer === undefined) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
    return;
  }

  const result = verifyAnswer(id, answer);
  res.json({
    success: true,
    data: result,
  });
});

export default router;
