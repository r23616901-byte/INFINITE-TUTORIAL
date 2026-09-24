import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware';
import {
  uploadFile,
  listFiles,
  getFileById,
  deleteFile,
} from '../controllers/fileController';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max limit
});

router.use(authenticate);

router.get('/', listFiles);
router.get('/:id', getFileById);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

export default router;
