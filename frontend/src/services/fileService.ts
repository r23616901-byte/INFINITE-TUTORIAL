import api from './api';

export type FileCategoryType =
  | 'STUDENT_PHOTO'
  | 'TEST_PAPER'
  | 'ANSWER_SHEET'
  | 'ANNOUNCEMENT'
  | 'LEAVE_ATTACHMENT'
  | 'DOCUMENT';

export interface FileMetadataDto {
  file_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
  category: FileCategoryType;
  thumbnail_url?: string;
  medium_url?: string;
  original_size?: number;
  compressed_size?: number;
  compression_ratio?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  isImage: boolean;
}

export interface FileQueryFilters {
  category?: FileCategoryType;
  search?: string;
  uploaded_by?: string;
  page?: number;
  limit?: number;
}

export const fetchFiles = async (params: FileQueryFilters = {}): Promise<FileMetadataDto[]> => {
  try {
    const res = await api.get('/files', { params });
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {}

  // Fallback pre-seeded files
  return [
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
};

export const uploadFileApi = async (
  file: File,
  category: FileCategoryType,
  onUploadProgress?: (progressEvent: any) => void
): Promise<FileMetadataDto> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  const res = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

  return res.data.data;
};

export const deleteFileApi = async (id: string): Promise<boolean> => {
  const res = await api.delete(`/files/${id}`);
  return res.data.success;
};

export default {
  fetchFiles,
  uploadFileApi,
  deleteFileApi,
};
