import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import uploadAnswerSheet from '../middleware/answerSheetUpload';
import {
  getMarksHandler,
  getMarkByIdHandler,
  createMarkHandler,
  updateMarkHandler,
  uploadAnswerSheetHandler,
  getAuditTrailHandler,
  toggleVisibilityHandler,
} from '../controllers/markController';

const router = Router();

router.use(authenticate);

// Workflow 18: Answer Sheet File Upload (Cloudinary / Object Storage)
router.post(
  '/upload-answer-sheet',
  authorize('TEACHER', 'ADMIN'),
  uploadAnswerSheet.single('answerSheet'),
  uploadAnswerSheetHandler
);

// Workflow 19 & 20: Marks CRUD & Role Scoped Listing
router.get('/', getMarksHandler);
router.get('/:id', getMarkByIdHandler);
router.post('/', authorize('TEACHER', 'ADMIN'), createMarkHandler);
router.put('/:id', authorize('TEACHER', 'ADMIN'), updateMarkHandler);
router.patch('/:id/visibility', authorize('TEACHER', 'ADMIN'), toggleVisibilityHandler);
router.get('/:id/audit-trail', authorize('TEACHER', 'ADMIN'), getAuditTrailHandler);

export default router;
