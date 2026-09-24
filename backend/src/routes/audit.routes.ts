import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAuditLogsHandler,
  getAuditLogByIdHandler,
  exportAuditLogsHandler,
} from '../controllers/auditController';

const router = Router();

// Only authenticated ADMINs can access system-wide audit logs
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/export', exportAuditLogsHandler);
router.get('/', getAuditLogsHandler);
router.get('/:id', getAuditLogByIdHandler);

export default router;
