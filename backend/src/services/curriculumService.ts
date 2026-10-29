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

export {
  CurriculumChapter,
  QuestionPaper,
  QuestionPaperSection,
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

// In-Memory store for active runtime modifications
let inMemoryCurriculum: CurriculumChapter[] = [...ALL_CURRICULUM_CHAPTERS];
let inMemoryQuestionPapers: QuestionPaper[] = [...ALL_QUESTION_PAPERS];

// ============================================================================
// SERVICE METHODS
// ============================================================================

export const getCurriculum = async (filters: {
  classId?: string;
  boardId?: string;
  subjectId?: string;
} = {}): Promise<CurriculumChapter[]> => {
  let list = [...inMemoryCurriculum];

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

export const getCurriculumByBatch = async (batchId: string): Promise<CurriculumChapter[]> => {
  // Map batchId to Class and Board explicitly based on Academic Configuration
  let classId = 'cls-10';
  let boardId = 'brd-cbse';

  if (batchId.includes('9a')) {
    // 9th A -> Class 9 Karnataka State Board
    classId = 'cls-9';
    boardId = 'brd-ksb';
  } else if (batchId.includes('9b')) {
    // 9th B -> Class 9 CBSE
    classId = 'cls-9';
    boardId = 'brd-cbse';
  } else if (batchId.includes('10b')) {
    // 10th B -> Class 10 Karnataka State Board
    classId = 'cls-10';
    boardId = 'brd-ksb';
  } else if (batchId.includes('10a')) {
    // 10th A -> Class 10 CBSE
    classId = 'cls-10';
    boardId = 'brd-cbse';
  } else if (batchId.includes('9')) {
    classId = 'cls-9';
    boardId = 'brd-ksb';
  } else {
    classId = 'cls-10';
    boardId = 'brd-cbse';
  }

  return getCurriculum({ classId, boardId });
};

export const getQuestionPapers = async (filters: {
  classId?: string;
  boardId?: string;
  subjectId?: string;
} = {}): Promise<QuestionPaper[]> => {
  let list = [...inMemoryQuestionPapers];

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

export const getQuestionPaperById = async (id: string): Promise<QuestionPaper | null> => {
  return inMemoryQuestionPapers.find((qp) => qp.id === id) || null;
};

export const updateChapterProgress = async (
  chapterId: string,
  data: {
    status?: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
    completedLectures?: number;
    completionDate?: string;
    verifiedByAdmin?: boolean;
  }
): Promise<CurriculumChapter | null> => {
  const index = inMemoryCurriculum.findIndex((c) => c.id === chapterId);
  if (index === -1) return null;

  const current = inMemoryCurriculum[index];
  const updated: CurriculumChapter = {
    ...current,
    status: data.status || current.status,
    completedLectures:
      data.completedLectures !== undefined ? data.completedLectures : current.completedLectures,
    completionDate: data.completionDate || current.completionDate,
    verifiedByAdmin:
      data.verifiedByAdmin !== undefined ? data.verifiedByAdmin : current.verifiedByAdmin,
  };

  inMemoryCurriculum[index] = updated;
  return updated;
};

export const addCurriculumChapter = async (
  chapter: Omit<CurriculumChapter, 'id'>
): Promise<CurriculumChapter> => {
  const newChapter: CurriculumChapter = {
    ...chapter,
    id: `cur-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };
  inMemoryCurriculum.push(newChapter);
  return newChapter;
};
