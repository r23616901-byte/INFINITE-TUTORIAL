import { Response } from 'express';
import { AuthRequest } from '../types';
import * as academicService from '../services/academicService';

export const getClassesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await academicService.getClasses();
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addClassHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, grade, description } = req.body;
    if (!name || grade === undefined) {
      res.status(400).json({ success: false, message: 'Class name and grade are required' });
      return;
    }
    const data = await academicService.addClass({ name, grade: Number(grade), description });
    res.status(201).json({ success: true, data, message: 'Class created successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getBoardsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await academicService.getBoards();
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addBoardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      res.status(400).json({ success: false, message: 'Board name and code are required' });
      return;
    }
    const data = await academicService.addBoard({ name, code });
    res.status(201).json({ success: true, data, message: 'Board created successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSubjectsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { boardId } = req.query;
    const data = await academicService.getSubjects(boardId ? String(boardId) : undefined);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addSubjectHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, boardId } = req.body;
    if (!name || !code) {
      res.status(400).json({ success: false, message: 'Subject name and code are required' });
      return;
    }
    const data = await academicService.addSubject({ name, code, boardId });
    res.status(201).json({ success: true, data, message: 'Subject created successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getBatchesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, boardId, session } = req.query;
    const data = await academicService.getBatches({
      classId: classId ? String(classId) : undefined,
      boardId: boardId ? String(boardId) : undefined,
      session: session ? String(session) : undefined,
    });
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createBatchHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, timing, session, startTime, endTime, days, status, classId, boardId, academicYear, assignedTeacherName } = req.body;
    if (!name || !classId || !boardId) {
      res.status(400).json({ success: false, message: 'Batch name, classId, and boardId are required' });
      return;
    }
    const data = await academicService.createBatch({
      name,
      timing,
      session,
      startTime,
      endTime,
      days,
      status,
      classId,
      boardId,
      academicYear,
      assignedTeacherName,
    });
    res.status(201).json({ success: true, data, message: 'Batch created successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
