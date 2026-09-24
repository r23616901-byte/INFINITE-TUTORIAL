import { Request, Response } from 'express';
import * as testService from '../services/testService';

/**
 * Upload a test paper (PDF / Image)
 * POST /api/tests/upload
 */
export const uploadTestPaperHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded or file rejected by validator',
      });
      return;
    }

    const file = req.file;
    const fileUrl = `/uploads/test-papers/${file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Test paper uploaded successfully',
      data: {
        url: fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to upload test paper',
    });
  }
};

/**
 * Get all test types
 * GET /api/tests/types
 */
export const getTestTypesHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const types = await testService.getTestTypes();
    res.status(200).json({
      success: true,
      data: types,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to retrieve test types',
    });
  }
};

/**
 * Add a custom test type (Admin only)
 * POST /api/tests/types
 */
export const addTestTypeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Test type name is required',
      });
      return;
    }

    const created = await testService.addTestType(name);
    res.status(201).json({
      success: true,
      message: `Test type "${created.name}" created successfully`,
      data: created,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to add test type',
    });
  }
};

/**
 * Delete a custom test type (Admin only)
 * DELETE /api/tests/types/:id
 */
export const deleteTestTypeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await testService.deleteTestType(id);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to delete test type',
    });
  }
};

/**
 * Get all tests with filters
 * GET /api/tests
 */
export const getTestsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      classId,
      boardId,
      subjectId,
      chapter,
      testType,
      search,
      startDate,
      endDate,
    } = req.query;

    const tests = await testService.getTests({
      classId: classId as string,
      boardId: boardId as string,
      subjectId: subjectId as string,
      chapter: chapter as string,
      testType: testType as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch tests',
    });
  }
};

/**
 * Get single test details
 * GET /api/tests/:id
 */
export const getTestByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const test = await testService.getTestById(id);
    if (!test) {
      res.status(404).json({
        success: false,
        message: `Test "${id}" not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch test',
    });
  }
};

/**
 * Create a new test (Admin & Teacher)
 * POST /api/tests
 */
export const createTestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || {
      id: 'teacher-001',
      name: 'Faculty Teacher',
      role: 'TEACHER',
    };

    const newTest = await testService.createTest(req.body, user);
    res.status(201).json({
      success: true,
      message: `Test "${newTest.name}" created successfully with ID ${newTest.testId}`,
      data: newTest,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to create test',
    });
  }
};

/**
 * Update an existing test (Admin & Teacher)
 * PUT /api/tests/:id
 */
export const updateTestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = (req as any).user || {
      id: 'admin-001',
      role: 'ADMIN',
    };

    const updated = await testService.updateTest(id, req.body, user);
    res.status(200).json({
      success: true,
      message: `Test "${updated.name}" updated successfully`,
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to update test',
    });
  }
};

/**
 * Delete a test (Admin or Creator Teacher)
 * DELETE /api/tests/:id
 */
export const deleteTestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = (req as any).user || {
      id: 'admin-001',
      role: 'ADMIN',
    };

    const result = await testService.deleteTest(id, user);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(403).json({
      success: false,
      message: err.message || 'Failed to delete test',
    });
  }
};
