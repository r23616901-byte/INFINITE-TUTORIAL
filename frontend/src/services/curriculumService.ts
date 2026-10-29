import api from './api';
import {
  CurriculumChapter,
  QuestionPaper,
  QuestionPaperSection,
  KARNATAKA_CLASS_9_CHAPTERS,
  KARNATAKA_CLASS_10_CHAPTERS,
  CBSE_CLASS_9_CHAPTERS,
  CBSE_CLASS_10_CHAPTERS,
  ALL_CURRICULUM_CHAPTERS,
} from './curriculumData';
import {
  KARNATAKA_CLASS_9_QUESTION_PAPERS,
  KARNATAKA_CLASS_10_QUESTION_PAPERS,
  CBSE_CLASS_9_QUESTION_PAPERS,
  CBSE_CLASS_10_QUESTION_PAPERS,
  ALL_QUESTION_PAPERS,
} from './curriculumQuestionPapers';

export type {
  CurriculumChapter,
  QuestionPaper,
  QuestionPaperSection,
};

export {
  KARNATAKA_CLASS_9_CHAPTERS,
  KARNATAKA_CLASS_10_CHAPTERS,
  CBSE_CLASS_9_CHAPTERS,
  CBSE_CLASS_10_CHAPTERS,
  ALL_CURRICULUM_CHAPTERS,
  KARNATAKA_CLASS_9_QUESTION_PAPERS,
  KARNATAKA_CLASS_10_QUESTION_PAPERS,
  CBSE_CLASS_9_QUESTION_PAPERS,
  CBSE_CLASS_10_QUESTION_PAPERS,
  ALL_QUESTION_PAPERS,
};

// Client-side cache for offline/instant UI interaction
let clientChapters: CurriculumChapter[] = [...ALL_CURRICULUM_CHAPTERS];
let clientQuestionPapers: QuestionPaper[] = [...ALL_QUESTION_PAPERS];

export const getCurriculumApi = async (filters: {
  classId?: string;
  boardId?: string;
  subjectId?: string;
} = {}): Promise<CurriculumChapter[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.boardId) params.append('boardId', filters.boardId);
    if (filters.subjectId) params.append('subjectId', filters.subjectId);

    const res = await api.get(`/curriculum?${params.toString()}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Return local fallback below
  }

  let list = [...clientChapters];
  if (filters.classId && filters.classId !== 'ALL') {
    list = list.filter((c) => c.classId === filters.classId);
  }
  if (filters.boardId && filters.boardId !== 'ALL') {
    list = list.filter((c) => c.boardId === filters.boardId);
  }
  if (filters.subjectId && filters.subjectId !== 'ALL') {
    list = list.filter(
      (c) =>
        c.subjectId === filters.subjectId ||
        c.subjectName.toLowerCase() === filters.subjectId?.toLowerCase()
    );
  }
  return list;
};

export const getCurriculumByBatchApi = async (batchId: string): Promise<CurriculumChapter[]> => {
  try {
    const res = await api.get(`/curriculum/batch/${batchId}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Return local fallback
  }

  let classId = 'cls-10';
  let boardId = 'brd-cbse';

  if (batchId.includes('9a')) {
    classId = 'cls-9';
    boardId = 'brd-ksb';
  } else if (batchId.includes('9b')) {
    classId = 'cls-9';
    boardId = 'brd-cbse';
  } else if (batchId.includes('10b')) {
    classId = 'cls-10';
    boardId = 'brd-ksb';
  } else if (batchId.includes('10a')) {
    classId = 'cls-10';
    boardId = 'brd-cbse';
  } else if (batchId.includes('9')) {
    classId = 'cls-9';
    boardId = 'brd-ksb';
  } else {
    classId = 'cls-10';
    boardId = 'brd-cbse';
  }

  return getCurriculumApi({ classId, boardId });
};

export const getQuestionPapersApi = async (filters: {
  classId?: string;
  boardId?: string;
  subjectId?: string;
} = {}): Promise<QuestionPaper[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.boardId) params.append('boardId', filters.boardId);
    if (filters.subjectId) params.append('subjectId', filters.subjectId);

    const res = await api.get(`/curriculum/question-papers?${params.toString()}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  let list = [...clientQuestionPapers];
  if (filters.classId && filters.classId !== 'ALL') {
    list = list.filter((qp) => qp.classId === filters.classId);
  }
  if (filters.boardId && filters.boardId !== 'ALL') {
    list = list.filter((qp) => qp.boardId === filters.boardId);
  }
  if (filters.subjectId && filters.subjectId !== 'ALL') {
    list = list.filter(
      (qp) =>
        qp.subjectCode.toLowerCase() === filters.subjectId?.toLowerCase() ||
        qp.subject.toLowerCase() === filters.subjectId?.toLowerCase()
    );
  }
  return list;
};

export const getQuestionPaperByIdApi = async (id: string): Promise<QuestionPaper | null> => {
  try {
    const res = await api.get(`/curriculum/question-papers/${id}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  return clientQuestionPapers.find((p) => p.id === id) || null;
};

export const updateChapterProgressApi = async (
  chapterId: string,
  data: {
    status?: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
    completedLectures?: number;
    completionDate?: string;
    verifiedByAdmin?: boolean;
  }
): Promise<CurriculumChapter | null> => {
  try {
    const res = await api.patch(`/curriculum/chapter/${chapterId}`, data);
    if (res.data?.success && res.data.data) {
      const idx = clientChapters.findIndex((c) => c.id === chapterId);
      if (idx !== -1) clientChapters[idx] = res.data.data;
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  const idx = clientChapters.findIndex((c) => c.id === chapterId);
  if (idx === -1) return null;
  const current = clientChapters[idx];
  const updated: CurriculumChapter = {
    ...current,
    status: data.status || current.status,
    completedLectures:
      data.completedLectures !== undefined ? data.completedLectures : current.completedLectures,
    completionDate: data.completionDate || current.completionDate,
    verifiedByAdmin:
      data.verifiedByAdmin !== undefined ? data.verifiedByAdmin : current.verifiedByAdmin,
  };
  clientChapters[idx] = updated;
  return updated;
};
