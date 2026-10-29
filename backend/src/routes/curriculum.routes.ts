import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getCurriculumHandler,
  getCurriculumByBatchHandler,
  getQuestionPapersHandler,
  getQuestionPaperByIdHandler,
  updateChapterProgressHandler,
  addCurriculumChapterHandler,
} from '../controllers/curriculumController';

const router = Router();

// Allow public or authenticated read for seamless offline/portal views
router.use(authenticate);

// Curriculum/Syllabus endpoints
router.get('/', getCurriculumHandler);
router.get('/batch/:batchId', getCurriculumByBatchHandler);
router.post('/', authorize('ADMIN'), addCurriculumChapterHandler);
router.patch('/chapter/:chapterId', authorize('ADMIN', 'TEACHER'), updateChapterProgressHandler);

// Question Papers endpoints
router.get('/question-papers', getQuestionPapersHandler);
router.get('/question-papers/:id', getQuestionPaperByIdHandler);

export default router;
