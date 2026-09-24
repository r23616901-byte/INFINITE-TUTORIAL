import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { useLoading } from '../../context/LoadingContext';
import {
  FileMetadataDto,
  FileCategoryType,
  fetchFiles,
  uploadFileApi,
  deleteFileApi,
} from '../../services/fileService';
import {
  FolderArchive,
  UploadCloud,
  Search,
  FileText,
  Image as ImageIcon,
  GraduationCap,
  FileQuestion,
  Award,
  Bell,
  CalendarCheck,
  Download,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HardDrive,
} from 'lucide-react';

const CATEGORIES: Array<{ key: string; label: string; icon: any }> = [
  { key: '', label: 'All Files', icon: FolderArchive },
  { key: 'STUDENT_PHOTO', label: 'Student Photos', icon: GraduationCap },
  { key: 'TEST_PAPER', label: 'Test Papers', icon: FileQuestion },
  { key: 'ANSWER_SHEET', label: 'Answer Sheets', icon: Award },
  { key: 'ANNOUNCEMENT', label: 'Announcements', icon: Bell },
  { key: 'LEAVE_ATTACHMENT', label: 'Leave Attachments', icon: CalendarCheck },
  { key: 'DOCUMENT', label: 'Documents', icon: FileText },
];

export const FileManagerPage: React.FC = () => {
  const { startLoading, stopLoading } = useLoading();
  const [files, setFiles] = useState<FileMetadataDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileMetadataDto | null>(null);
  const [previewTier, setPreviewTier] = useState<'thumbnail' | 'medium' | 'high'>('medium');

  // Upload Form
  const [uploadCategory, setUploadCategory] = useState<FileCategoryType>('STUDENT_PHOTO');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    startLoading('Loading stored files & media...');
    try {
      const data = await fetchFiles({
        category: (selectedCategory as FileCategoryType) || undefined,
        search: search || undefined,
      });
      setFiles(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load files');
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    loadFiles();
  }, [selectedCategory, search]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    startLoading('Uploading and compressing file...');

    try {
      await uploadFileApi(selectedFile, uploadCategory, (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        }
      });

      setUploadSuccess('File uploaded, optimized, and saved with metadata!');
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setUploadProgress(0);
        loadFiles();
      }, 800);
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      stopLoading();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this file and all its optimized variants?')) return;
    startLoading('Deleting file from storage...');
    try {
      await deleteFileApi(id);
      await loadFiles();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete file');
    } finally {
      stopLoading();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalBytes = files.reduce((acc, f) => acc + f.file_size, 0);
  const imageCount = files.filter((f) => f.isImage).length;
  const docCount = files.filter((f) => !f.isImage).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              File Management & Image Processing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              STORAGE SEPARATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated multi-tier image compression, storage separation, and complete metadata management.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setUploadError('');
            setUploadSuccess('');
            setSelectedFile(null);
            setIsUploadModalOpen(true);
          }}
          leftIcon={<UploadCloud className="w-4 h-4" />}
        >
          Upload New File
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Files"
          value={files.length}
          subtitle="Cataloged in registry"
          icon={<FolderArchive className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Storage Used"
          value={formatFileSize(totalBytes)}
          subtitle="Disk storage footprint"
          icon={<HardDrive className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Optimized Images"
          value={imageCount}
          subtitle="3-Tier compression active"
          icon={<ImageIcon className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="PDFs & Documents"
          value={docCount}
          subtitle="Papers & circulars"
          icon={<FileText className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Category Tabs & Search Bar */}
      <Card>
        <div className="space-y-4">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by file name, author, or category..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {(search || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setSearch('');
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors self-end sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Files Display Table / Grid */}
      <Card>
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-14" />
            <SkeletonBlock height="h-14" />
            <SkeletonBlock height="h-14" />
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to Retrieve Files"
            message={error}
            onRetry={loadFiles}
          />
        ) : files.length === 0 ? (
          <EmptyState
            title="No Files Found"
            description="No files matched the selected category or search filters. Click 'Upload New File' to upload student photos, answer sheets, or test papers."
            actionText="Clear Filters"
            onAction={() => {
              setSelectedCategory('');
              setSearch('');
            }}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">File Details & Preview</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Size & Optimization</th>
                  <th className="px-6 py-3.5">Uploaded By</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {files.map((file) => (
                  <tr key={file.file_id} className="hover:bg-slate-50/60 transition-colors">
                    {/* File Details */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {file.isImage && (file.thumbnail_url || file.file_url) ? (
                            <img
                              src={file.thumbnail_url || file.file_url}
                              alt={file.file_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="max-w-xs sm:max-w-sm">
                          <p className="font-bold text-slate-900 truncate" title={file.file_name}>
                            {file.file_name}
                          </p>
                          <span className="text-[11px] font-mono text-slate-400">
                            {file.file_id} &bull; {file.file_type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {file.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Size & Compression Ratio (Step 42) */}
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-slate-800">{formatFileSize(file.file_size)}</p>
                      {file.compression_ratio && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {file.compression_ratio}
                        </span>
                      )}
                    </td>

                    {/* Uploaded By (Step 41) */}
                    <td className="px-6 py-3.5 text-slate-600 font-medium">
                      {file.uploaded_by}
                    </td>

                    {/* Uploaded At (Step 41) */}
                    <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">
                      {file.uploaded_at ? String(file.uploaded_at).split('T')[0] : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFile(file);
                            setPreviewTier(file.category === 'STUDENT_PHOTO' ? 'thumbnail' : 'medium');
                          }}
                          title="Preview Multi-Tier Quality"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          download={file.file_name}
                          title="Download File"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(file.file_id)}
                          title="Delete File & Variants"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ================= UPLOAD MODAL ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Upload & Optimize File</h3>
                  <p className="text-xs text-slate-500">Automated sharp compression and storage routing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Category *</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as FileCategoryType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="STUDENT_PHOTO">Student Photo (Cropped 200x200 Avatar)</option>
                  <option value="TEST_PAPER">Test Paper (High Quality PDF/Image)</option>
                  <option value="ANSWER_SHEET">Answer Sheet (Readable Text Preserved)</option>
                  <option value="ANNOUNCEMENT">Announcement / Circular</option>
                  <option value="LEAVE_ATTACHMENT">Leave Attachment</option>
                  <option value="DOCUMENT">General Document</option>
                </select>
              </div>

              {/* Drag & Drop File Input */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 space-y-2">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                <div>
                  <label className="cursor-pointer text-indigo-600 font-bold hover:underline">
                    <span>Click to select file</span>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,application/pdf"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP, or PDF up to 25MB</p>
                </div>
                {selectedFile && (
                  <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-bold inline-block mt-2">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
              </div>

              {/* Upload Progress Bar (Step 45) */}
              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-indigo-700">
                    <span>Processing & Compressing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={uploading}
                >
                  Start Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MULTI-TIER PREVIEW MODAL (STEP 42) ================= */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{previewFile.file_name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {previewFile.file_id} &bull; {previewFile.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quality Tier Switcher (Step 42: Thumbnail, Normal Quality, High-Quality) */}
            {previewFile.isImage && (
              <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewTier('thumbnail')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewTier === 'thumbnail'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Thumbnail (200px)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTier('medium')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewTier === 'medium'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Normal Quality (Optimized)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTier('high')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewTier === 'high'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  High-Quality (Original Text)
                </button>
              </div>
            )}

            {/* Preview Canvas */}
            <div className="max-h-96 overflow-auto bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-4">
              {previewFile.isImage ? (
                <img
                  src={
                    previewTier === 'thumbnail'
                      ? previewFile.thumbnail_url || previewFile.file_url
                      : previewTier === 'medium'
                      ? previewFile.medium_url || previewFile.file_url
                      : previewFile.file_url
                  }
                  alt={previewFile.file_name}
                  className={`max-h-80 object-contain rounded-lg shadow-xs ${
                    previewTier === 'thumbnail' ? 'w-48 h-48 object-cover' : 'w-auto'
                  }`}
                />
              ) : (
                <div className="text-center py-10 space-y-3">
                  <FileText className="w-16 h-16 text-indigo-500 mx-auto" />
                  <p className="text-xs text-slate-600 font-bold">Document format ({previewFile.file_type})</p>
                  <a
                    href={previewFile.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                  >
                    <Eye className="w-4 h-4" /> Open in Viewer
                  </a>
                </div>
              )}
            </div>

            {/* Metadata Summary (Step 41: all 7 fields) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">FILE ID</span>
                <span className="font-mono font-bold text-slate-800">{previewFile.file_id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">SIZE</span>
                <span className="font-bold text-slate-800">{formatFileSize(previewFile.file_size)}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">SAVINGS</span>
                <span className="font-bold text-emerald-600">{previewFile.compression_ratio || 'Lossless'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">UPLOADED BY</span>
                <span className="font-bold text-slate-800">{previewFile.uploaded_by}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <a
                href={previewFile.file_url}
                download={previewFile.file_name}
                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                <Download className="w-3.5 h-3.5" />
                Download Original
              </a>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPreviewFile(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagerPage;
