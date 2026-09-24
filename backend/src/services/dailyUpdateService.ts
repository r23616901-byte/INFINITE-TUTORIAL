import prisma from './prisma';
import { checkDbAvailability } from './academicService';
import {
  DailyUpdateDto,
  CreateDailyUpdateDto,
  UpdateDailyUpdateDto,
  DailyUpdateFilters,
} from '../types';

// Pre-seeded in-memory daily updates
let inMemoryDailyUpdates: DailyUpdateDto[] = [
  {
    id: 'update-101',
    date: '2026-09-23',
    batchId: 'batch-10a-morning',
    batchName: '10-A Morning',
    title: "Today's Update",
    todayLesson: 'Physics Chapter 4 Ray Optics, Chemistry Solutions, Maths Arithmetic Progressions',
    topicsCovered: 'Refraction through glass prisms, Molarity numericals, AP nth term derivation',
    homework: 'Complete questions 1–10.',
    instructions: "Bring NCERT exemplar and graph book for tomorrow's mathematics session.",
    subjectUpdates: [
      { subject: 'Physics', status: 'Chapter 4 completed.' },
      { subject: 'Chemistry', status: 'Numericals discussed.' },
      { subject: 'Mathematics', status: 'Exercise 5.2 completed.' },
    ],
    postedById: 'teacher-prof-1',
    postedByName: 'Prof. Rajesh Sharma (Physics)',
    postedByRole: 'TEACHER',
    createdAt: '2026-09-23T11:00:00.000Z',
    updatedAt: '2026-09-23T11:00:00.000Z',
  },
  {
    id: 'update-100',
    date: '2026-09-22',
    batchId: 'batch-10a-morning',
    batchName: '10-A Morning',
    title: 'Daily Class Summary',
    todayLesson: 'Biology Life Processes, Physics Reflection laws review',
    topicsCovered: 'Respiration in humans, Aerobic vs anaerobic respiration, Ray diagrams review',
    homework: 'Draw labeled diagram of Human Respiratory System in biology notebook.',
    instructions: 'Prepare for Chapter 3 Physics revision test scheduled on Friday.',
    subjectUpdates: [
      { subject: 'Biology', status: 'Life Processes respiration section covered.' },
      { subject: 'Physics', status: 'Light reflection doubt clearing completed.' },
    ],
    postedById: 'teacher-prof-3',
    postedByName: 'Mrs. Sunita Rao (Biology)',
    postedByRole: 'TEACHER',
    createdAt: '2026-09-22T10:45:00.000Z',
    updatedAt: '2026-09-22T10:45:00.000Z',
  },
  {
    id: 'update-102',
    date: '2026-09-23',
    batchId: 'batch-10b-evening',
    batchName: '10-B Evening',
    title: "Today's Evening Update",
    todayLesson: 'Mathematics Quadratic Equations, Chemistry Carbon Compounds',
    topicsCovered: 'Solving quadratics by formula method, Covalent bonding in methane & ethane',
    homework: 'Solve textbook exercise 4.3 questions 1 to 5.',
    instructions: 'Parent-teacher meeting circular distributed. Submit signed slip tomorrow.',
    subjectUpdates: [
      { subject: 'Mathematics', status: 'Exercise 4.3 completed.' },
      { subject: 'Chemistry', status: 'Introduction to Hydrocarbons completed.' },
    ],
    postedById: 'teacher-prof-4',
    postedByName: 'Mr. Vikram Sen (Mathematics)',
    postedByRole: 'TEACHER',
    createdAt: '2026-09-23T19:30:00.000Z',
    updatedAt: '2026-09-23T19:30:00.000Z',
  },
];

/**
 * Get batch name helper
 */
const getBatchNameById = (batchId: string): string => {
  const map: Record<string, string> = {
    'batch-10a-morning': '10-A Morning',
    'batch-10b-evening': '10-B Evening',
    'batch-9a-evening': '9-A Evening',
  };
  return map[batchId] || '10-A Morning';
};

/**
 * Retrieve daily updates with filtering
 */
export const getDailyUpdates = async (filters: DailyUpdateFilters = {}) => {
  const { batchId, date, search, page = 1, limit = 50 } = filters;

  // Try Prisma first if DB available
  if (await checkDbAvailability()) {
    try {
      const where: any = {};
      if (batchId) where.batchId = batchId;
      if (date) where.date = date;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { todayLesson: { contains: search, mode: 'insensitive' } },
          { topicsCovered: { contains: search, mode: 'insensitive' } },
          { homework: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Check if model exists on prisma client
      if ((prisma as any).dailyUpdate) {
        const [items, total] = await Promise.all([
          (prisma as any).dailyUpdate.findMany({
            where,
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
          }),
          (prisma as any).dailyUpdate.count({ where }),
        ]);

        if (items && items.length > 0) {
          return { data: items, total, page, limit };
        }
      }
    } catch {
      // Fall through to in-memory store
    }
  }

  // High-fidelity In-Memory store
  let filtered = [...inMemoryDailyUpdates];

  if (batchId) {
    filtered = filtered.filter(
      (u) => u.batchId === batchId || u.batchName.toLowerCase().includes(batchId.toLowerCase())
    );
  }

  if (date) {
    filtered = filtered.filter((u) => u.date === date);
  }

  if (search) {
    const sTerm = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.title.toLowerCase().includes(sTerm) ||
        u.todayLesson.toLowerCase().includes(sTerm) ||
        u.topicsCovered.toLowerCase().includes(sTerm) ||
        u.homework.toLowerCase().includes(sTerm) ||
        u.subjectUpdates.some((s) => s.subject.toLowerCase().includes(sTerm) || s.status.toLowerCase().includes(sTerm))
    );
  }

  // Sort descending by date, then createdAt
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  return { data, total, page, limit };
};

/**
 * Get single daily update by ID
 */
export const getDailyUpdateById = async (id: string): Promise<DailyUpdateDto | null> => {
  if (await checkDbAvailability()) {
    try {
      if ((prisma as any).dailyUpdate) {
        const item = await (prisma as any).dailyUpdate.findUnique({ where: { id } });
        if (item) return item;
      }
    } catch {}
  }

  const found = inMemoryDailyUpdates.find((u) => u.id === id);
  return found || null;
};

/**
 * Publish / Create new daily update (Teacher / Admin)
 */
export const createDailyUpdate = async (
  payload: CreateDailyUpdateDto,
  user: { id: string; name: string; role: string }
): Promise<DailyUpdateDto> => {
  const newId = `update-${Date.now()}`;
  const batchName = payload.batchName || getBatchNameById(payload.batchId);
  const now = new Date().toISOString();

  const newRecord: DailyUpdateDto = {
    id: newId,
    date: payload.date || now.split('T')[0],
    batchId: payload.batchId,
    batchName,
    title: payload.title || "Today's Update",
    todayLesson: payload.todayLesson || '',
    topicsCovered: payload.topicsCovered || payload.todayLesson || '',
    homework: payload.homework || 'No homework assigned.',
    instructions: payload.instructions || '',
    subjectUpdates: payload.subjectUpdates || [],
    postedById: user.id || 'admin',
    postedByName: user.name || 'Faculty / Admin',
    postedByRole: user.role || 'TEACHER',
    createdAt: now,
    updatedAt: now,
  };

  // Try Prisma if available
  if (await checkDbAvailability()) {
    try {
      if ((prisma as any).dailyUpdate) {
        const created = await (prisma as any).dailyUpdate.create({
          data: {
            ...newRecord,
            subjectUpdates: JSON.stringify(newRecord.subjectUpdates),
          },
        });
        if (created) return created;
      }
    } catch {}
  }

  // Prepend to in-memory store
  inMemoryDailyUpdates.unshift(newRecord);
  return newRecord;
};

/**
 * Update existing daily update
 */
export const updateDailyUpdate = async (
  id: string,
  payload: UpdateDailyUpdateDto,
  user: { id: string; name: string; role: string }
): Promise<DailyUpdateDto> => {
  const existing = await getDailyUpdateById(id);
  if (!existing) {
    throw new Error('Daily update not found');
  }

  // Only author or ADMIN can edit
  if (user.role !== 'ADMIN' && existing.postedById !== user.id) {
    throw new Error('Unauthorized to modify this daily update');
  }

  const now = new Date().toISOString();
  const updated: DailyUpdateDto = {
    ...existing,
    title: payload.title !== undefined ? payload.title : existing.title,
    todayLesson: payload.todayLesson !== undefined ? payload.todayLesson : existing.todayLesson,
    topicsCovered: payload.topicsCovered !== undefined ? payload.topicsCovered : existing.topicsCovered,
    homework: payload.homework !== undefined ? payload.homework : existing.homework,
    instructions: payload.instructions !== undefined ? payload.instructions : existing.instructions,
    subjectUpdates: payload.subjectUpdates !== undefined ? payload.subjectUpdates : existing.subjectUpdates,
    updatedAt: now,
  };

  // In-memory update
  const index = inMemoryDailyUpdates.findIndex((u) => u.id === id);
  if (index !== -1) {
    inMemoryDailyUpdates[index] = updated;
  }

  return updated;
};

/**
 * Delete daily update
 */
export const deleteDailyUpdate = async (
  id: string,
  user: { id: string; name: string; role: string }
): Promise<boolean> => {
  const existing = await getDailyUpdateById(id);
  if (!existing) {
    throw new Error('Daily update not found');
  }

  if (user.role !== 'ADMIN' && existing.postedById !== user.id) {
    throw new Error('Unauthorized to delete this daily update');
  }

  inMemoryDailyUpdates = inMemoryDailyUpdates.filter((u) => u.id !== id);
  return true;
};

export default {
  getDailyUpdates,
  getDailyUpdateById,
  createDailyUpdate,
  updateDailyUpdate,
  deleteDailyUpdate,
};
