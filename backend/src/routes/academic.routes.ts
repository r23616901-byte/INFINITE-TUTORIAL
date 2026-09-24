import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getClassesHandler,
  addClassHandler,
  getBoardsHandler,
  addBoardHandler,
  getSubjectsHandler,
  addSubjectHandler,
  getBatchesHandler,
  createBatchHandler,
} from '../controllers/academicController';

const router = Router();

// Academic endpoints (Readable by all authenticated roles, writable by Admin)
router.use(authenticate);

router.get('/classes', getClassesHandler);
router.post('/classes', authorize('ADMIN'), addClassHandler);

router.get('/boards', getBoardsHandler);
router.post('/boards', authorize('ADMIN'), addBoardHandler);

router.get('/subjects', getSubjectsHandler);
router.post('/subjects', authorize('ADMIN'), addSubjectHandler);

router.get('/batches', getBatchesHandler);
router.post('/batches', authorize('ADMIN'), createBatchHandler);

export default router;
