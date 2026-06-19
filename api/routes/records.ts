import { Router, type Request, type Response } from 'express';
import type { RecordRequest } from '../../shared/types.js';
import { addRecord, getRecords } from '../services/record-service.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const records = getRecords();
  res.json({
    success: true,
    data: records,
  });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body as RecordRequest;

  if (!body.type || body.success === undefined || body.timeUsed === undefined || body.errorCount === undefined) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
    return;
  }

  const record = addRecord(body);
  res.json({
    success: true,
    data: record,
  });
});

export default router;
