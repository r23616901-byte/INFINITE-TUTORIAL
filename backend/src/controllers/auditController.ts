import { Response } from 'express';
import { AuthRequest } from '../types';
import * as auditService from '../services/auditService';

/**
 * GET /api/audit-logs
 * List audit logs with multi-field filtering
 */
export const getAuditLogsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      entity: req.query.entity as string | undefined,
      action: req.query.action as string | undefined,
      userId: req.query.userId as string | undefined,
      userRole: req.query.userRole as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    };

    const result = await auditService.getAuditLogs(filters);

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    console.error('[AuditController] Error retrieving audit logs:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve audit logs',
      message: err.message,
    });
  }
};

/**
 * GET /api/audit-logs/:id
 * Retrieve a single audit log with full diff payload
 */
export const getAuditLogByIdHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const log = await auditService.getAuditLogById(id);

    if (!log) {
      res.status(404).json({
        success: false,
        error: 'Audit log not found',
        message: `No audit log exists with ID "${id}"`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err: any) {
    console.error('[AuditController] Error retrieving audit log by ID:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve audit log',
      message: err.message,
    });
  }
};

/**
 * GET /api/audit-logs/export
 * Export audit logs as downloadable CSV
 */
export const exportAuditLogsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      entity: req.query.entity as string | undefined,
      action: req.query.action as string | undefined,
      userId: req.query.userId as string | undefined,
      userRole: req.query.userRole as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      search: req.query.search as string | undefined,
    };

    const csvData = await auditService.exportAuditLogsToCsv(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit_trail_${new Date().toISOString().split('T')[0]}.csv"`
    );
    res.status(200).send(csvData);
  } catch (err: any) {
    console.error('[AuditController] Error exporting audit logs:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit logs',
      message: err.message,
    });
  }
};
