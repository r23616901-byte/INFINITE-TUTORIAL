import { Response } from 'express';
import { AuthRequest } from '../types';
import * as curriculumService from '../services/curriculumService';

export const getCurriculumHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, boardId, subjectId } = req.query;
    const data = await curriculumService.getCurriculum({
      classId: classId ? String(classId) : undefined,
      boardId: boardId ? String(boardId) : undefined,
      subjectId: subjectId ? String(subjectId) : undefined,
    });
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCurriculumByBatchHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const batchId = String(req.params.batchId);
    const data = await curriculumService.getCurriculumByBatch(batchId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuestionPapersHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, boardId, subjectId } = req.query;
    const data = await curriculumService.getQuestionPapers({
      classId: classId ? String(classId) : undefined,
      boardId: boardId ? String(boardId) : undefined,
      subjectId: subjectId ? String(subjectId) : undefined,
    });
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuestionPaperByIdHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const data = await curriculumService.getQuestionPaperById(id);
    if (!data) {
      res.status(404).json({ success: false, message: 'Question paper not found' });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateChapterProgressHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chapterId = String(req.params.chapterId);
    const updated = await curriculumService.updateChapterProgress(chapterId, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Curriculum chapter not found' });
      return;
    }
    res.status(200).json({ success: true, data: updated, message: 'Progress updated successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addCurriculumChapterHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const newChapter = await curriculumService.addCurriculumChapter(req.body);
    res.status(201).json({ success: true, data: newChapter, message: 'Chapter added successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
