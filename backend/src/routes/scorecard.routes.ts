import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getStudentScorecardHandler,
  getMyChildScorecardHandler,
} from '../controllers/scorecardController';

const router = Router();

router.use(authenticate);

// Parent direct child endpoint
router.get('/me', getMyChildScorecardHandler);

// Specific student scorecard (enforces parent isolation in controller/service)
router.get('/student/:studentId', getStudentScorecardHandler);

export default router;
