import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { FileMetadataDto, FileCategoryType, FileQueryFilters } from '../types';

// Base uploads root
const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');

// Ensure category directories exist
export const CATEGORY_FOLDERS: Record<FileCategoryType, string> = {
  STUDENT_PHOTO: path.join(UPLOADS_ROOT, 'student-photos'),
  TEST_PAPER: path.join(UPLOADS_ROOT, 'test-papers'),
  ANSWER_SHEET: path.join(UPLOADS_ROOT, 'answer-sheets'),
  ANNOUNCEMENT: path.join(UPLOADS_ROOT, 'announcements'),
  LEAVE_ATTACHMENT: path.join(UPLOADS_ROOT, 'leave-attachments'),
  DOCUMENT: path.join(UPLOADS_ROOT, 'documents'),
};

Object.values(CATEGORY_FOLDERS).forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Pre-seeded file metadata items
let inMemoryFiles: FileMetadataDto[] = [
  {
    file_id: 'file-stu-10025',
    file_name: 'rahul_kumar_avatar.jpg',
    file_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1080',
    thumbnail_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    medium_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
    file_type: 'image/jpeg',
    file_size: 142800,
    original_size: 1845000,
    compressed_size: 142800,
    compression_ratio: '92% saved',
    uploaded_by: 'Admin',
    uploaded_at: '2026-06-15T10:00:00.000Z',
    category: 'STUDENT_PHOTO',
    isImage: true,
    dimensions: { width: 1080, height: 1350 },
  },
  {
    file_id: 'file-test-phy-001',
    file_name: 'Class_10_CBSE_Physics_Ch3_Light_Test.pdf',
    file_url: '/uploads/test-papers/Class_10_CBSE_Physics_Ch3_Light_Test.pdf',
    file_type: 'application/pdf',
    file_size: 2450000,
    uploaded_by: 'Prof. Rajesh Sharma (Physics)',
    uploaded_at: '2026-09-18T14:30:00.000Z',
    category: 'TEST_PAPER',
    isImage: false,
  },
  {
    file_id: 'file-ans-10025-phy',
    file_name: 'Rahul_Kumar_IT10025_Physics_Ch3_Answers.jpg',
    file_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=95&w=1600',
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=200',
    medium_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=85&w=1080',
    file_type: 'image/jpeg',
    file_size: 785000,
    original_size: 4200000,
    compressed_size: 785000,
    compression_ratio: '81% saved (High Quality Retained)',
    uploaded_by: 'Prof. Rajesh Sharma (Physics)',
    uploaded_at: '2026-09-18T17:30:00.000Z',
    category: 'ANSWER_SHEET',
    isImage: true,
    dimensions: { width: 1600, height: 2133 },
  },
  {
    file_id: 'file-ann-ptm-sept',
    file_name: 'Parent_Teacher_Meeting_Circular_Sept2026.pdf',
    file_url: '/uploads/announcements/Parent_Teacher_Meeting_Circular_Sept2026.pdf',
    file_type: 'application/pdf',
    file_size: 480000,
    uploaded_by: 'Admin',
    uploaded_at: '2026-09-15T09:00:00.000Z',
    category: 'ANNOUNCEMENT',
    isImage: false,
  },
  {
    file_id: 'file-leave-med-10025',
    file_name: 'Medical_Prescription_Dr_Sharma.jpg',
    file_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=85&w=1200',
    thumbnail_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=200',
    medium_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    file_type: 'image/jpeg',
    file_size: 320000,
    original_size: 1950000,
    compressed_size: 320000,
    compression_ratio: '83% saved',
    uploaded_by: 'Mr. Kumar (Parent)',
    uploaded_at: '2026-09-17T18:40:00.000Z',
    category: 'LEAVE_ATTACHMENT',
    isImage: true,
  },
];

/**
 * Process uploaded file with automatic multi-tier image processing (Step 42)
 * Original Image -> Validate -> Compress -> Resize -> Generate optimized version -> Store
 */
export const processAndStoreFile = async (
  file: Express.Multer.File,
  category: FileCategoryType,
  uploadedBy: string
): Promise<FileMetadataDto> => {
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const originalName = file.originalname;
  const mimeType = file.mimetype;
  const originalSize = file.size;
  const now = new Date().toISOString();

  const isImage = mimeType.startsWith('image/') && !mimeType.includes('svg');
  const targetFolder = CATEGORY_FOLDERS[category] || CATEGORY_FOLDERS.DOCUMENT;
  const categorySubPath = path.basename(targetFolder);

  // File extension
  const ext = path.extname(originalName) || (isImage ? '.jpg' : '.bin');
  const baseName = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);

  const originalDiskFileName = `${baseName}_orig_${Date.now()}${ext}`;
  const originalDiskPath = path.join(targetFolder, originalDiskFileName);

  let fileUrl = `/uploads/${categorySubPath}/${originalDiskFileName}`;
  let thumbnailUrl: string | undefined;
  let mediumUrl: string | undefined;
  let finalCompressedSize = originalSize;
  let compressionRatio = '0%';
  let dimensions: { width: number; height: number } | undefined;

  // Buffer source
  const fileBuffer = file.buffer || (file.path ? fs.readFileSync(file.path) : null);
  if (!fileBuffer) {
    throw new Error('Unable to read uploaded file buffer');
  }

  if (isImage) {
    // -------------------------------------------------------------
    // AUTOMATIC IMAGE PROCESSING PIPELINE (STEP 42)
    // -------------------------------------------------------------
    try {
      const imageInstance = sharp(fileBuffer);
      const metadata = await imageInstance.metadata();
      const origWidth = metadata.width || 1200;
      const origHeight = metadata.height || 800;
      dimensions = { width: origWidth, height: origHeight };

      // 1. TIER 1: THUMBNAIL (Fast, small avatar / card preview e.g. 200x200)
      const thumbDiskName = `${baseName}_thumb_${Date.now()}.webp`;
      const thumbDiskPath = path.join(targetFolder, thumbDiskName);

      if (category === 'STUDENT_PHOTO') {
        // Square crop for student faces
        await sharp(fileBuffer)
          .resize(200, 200, { fit: 'cover', position: 'center' })
          .webp({ quality: 80 })
          .toFile(thumbDiskPath);
      } else {
        // Proportional thumbnail for answer sheets / test papers
        await sharp(fileBuffer)
          .resize({ width: 250, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(thumbDiskPath);
      }
      thumbnailUrl = `/uploads/${categorySubPath}/${thumbDiskName}`;

      // 2. TIER 2: NORMAL QUALITY / OPTIMIZED WEB VERSION (Max 1080px, 82% quality)
      const mediumDiskName = `${baseName}_medium_${Date.now()}.webp`;
      const mediumDiskPath = path.join(targetFolder, mediumDiskName);

      const mediumResult = await sharp(fileBuffer)
        .resize({ width: 1080, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(mediumDiskPath);

      mediumUrl = `/uploads/${categorySubPath}/${mediumDiskName}`;

      // 3. TIER 3: HIGH-QUALITY VERSION (Answer sheets preserve readable text)
      if (category === 'ANSWER_SHEET' || category === 'TEST_PAPER') {
        // High quality preservation: keep high resolution so handwriting & text are readable
        const highDiskName = `${baseName}_high_${Date.now()}.jpg`;
        const highDiskPath = path.join(targetFolder, highDiskName);

        const highResult = await sharp(fileBuffer)
          .jpeg({ quality: 92, chromaSubsampling: '4:4:4' }) // crisp text
          .toFile(highDiskPath);

        fileUrl = `/uploads/${categorySubPath}/${highDiskName}`;
        finalCompressedSize = highResult.size;
      } else {
        // Default: save normal quality as primary
        fileUrl = mediumUrl;
        finalCompressedSize = mediumResult.size;
      }

      // Calculate savings
      if (originalSize > finalCompressedSize) {
        const pct = Math.round(((originalSize - finalCompressedSize) / originalSize) * 100);
        compressionRatio = `${pct}% saved`;
      } else {
        compressionRatio = 'Optimized';
      }
    } catch (err: any) {
      console.warn('[Sharp Processing] Falling back to direct file write:', err.message);
      fs.writeFileSync(originalDiskPath, fileBuffer);
    }
  } else {
    // Non-image documents (PDFs, docs): save directly to disk
    fs.writeFileSync(originalDiskPath, fileBuffer);
  }

  // Construct complete metadata record (Step 41)
  const record: FileMetadataDto = {
    file_id: fileId,
    file_name: originalName,
    file_url: fileUrl,
    thumbnail_url: thumbnailUrl,
    medium_url: mediumUrl,
    file_type: mimeType,
    file_size: finalCompressedSize,
    original_size: originalSize,
    compressed_size: finalCompressedSize,
    compression_ratio: compressionRatio,
    uploaded_by: uploadedBy,
    uploaded_at: now,
    category,
    dimensions,
    isImage,
  };

  inMemoryFiles.unshift(record);
  return record;
};

/**
 * List files with filters
 */
export const listFiles = async (filters: FileQueryFilters = {}) => {
  const { category, search, uploaded_by, page = 1, limit = 50 } = filters;

  let results = [...inMemoryFiles];

  if (category) {
    results = results.filter((f) => f.category === category);
  }

  if (uploaded_by) {
    results = results.filter((f) => f.uploaded_by.toLowerCase().includes(uploaded_by.toLowerCase()));
  }

  if (search) {
    const sTerm = search.toLowerCase();
    results = results.filter(
      (f) =>
        f.file_name.toLowerCase().includes(sTerm) ||
        f.uploaded_by.toLowerCase().includes(sTerm) ||
        f.category.toLowerCase().includes(sTerm)
    );
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const data = results.slice(startIndex, startIndex + limit);

  return { data, total, page, limit };
};

/**
 * Get file by ID
 */
export const getFileById = async (id: string): Promise<FileMetadataDto | null> => {
  const found = inMemoryFiles.find((f) => f.file_id === id);
  return found || null;
};

/**
 * Delete file
 */
export const deleteFile = async (id: string): Promise<boolean> => {
  const index = inMemoryFiles.findIndex((f) => f.file_id === id);
  if (index === -1) {
    throw new Error('File not found');
  }

  const file = inMemoryFiles[index];

  // Attempt to delete physical files from disk if local
  try {
    if (file.file_url.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), file.file_url);
      if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
    }
    if (file.thumbnail_url && file.thumbnail_url.startsWith('/uploads/')) {
      const thumbPath = path.join(process.cwd(), file.thumbnail_url);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }
    if (file.medium_url && file.medium_url.startsWith('/uploads/')) {
      const medPath = path.join(process.cwd(), file.medium_url);
      if (fs.existsSync(medPath)) fs.unlinkSync(medPath);
    }
  } catch {}

  inMemoryFiles.splice(index, 1);
  return true;
};

export default {
  processAndStoreFile,
  listFiles,
  getFileById,
  deleteFile,
  CATEGORY_FOLDERS,
};
