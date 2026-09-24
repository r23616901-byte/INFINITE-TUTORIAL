import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadTestPaper } from '../middleware/uploadMiddleware';
import {
  uploadTestPaperHandler,
  getTestTypesHandler,
  addTestTypeHandler,
  deleteTestTypeHandler,
  getTestsHandler,
  getTestByIdHandler,
  createTestHandler,
  updateTestHandler,
  deleteTestHandler,
} from '../controllers/testController';

const router = Router();

router.use(authenticate);

// Test Paper File Upload (Teacher & Admin)
router.post(
  '/upload',
  authorize('TEACHER', 'ADMIN'),
  uploadTestPaper.single('testPaper'),
  uploadTestPaperHandler
);

// Dynamic Test Types (Step 15)
router.get('/types', getTestTypesHandler);
router.post('/types', authorize('ADMIN'), addTestTypeHandler);
router.delete('/types/:id', authorize('ADMIN'), deleteTestTypeHandler);

// Tests CRUD (Steps 14, 16)
router.get('/', getTestsHandler);
router.get('/:id', getTestByIdHandler);
router.post('/', authorize('TEACHER', 'ADMIN'), createTestHandler);
router.put('/:id', authorize('TEACHER', 'ADMIN'), updateTestHandler);
router.delete('/:id', authorize('TEACHER', 'ADMIN'), deleteTestHandler);

export default router;
