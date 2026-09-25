import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import {
  getTestsApi,
  createTestApi,
  updateTestApi,
  deleteTestApi,
  uploadTestPaperApi,
  getTestTypesApi,
  addTestTypeApi,
  deleteTestTypeApi,
} from '../../services/testService';
import { getClassesApi, getBoardsApi, getSubjectsApi } from '../../services/academicService';
import { TestItem, TestType, CreateTestPayload } from '../../types/test';
import { ClassItem, BoardItem, SubjectItem } from '../../types/attendance';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Award,
  UploadCloud,
  CheckCircle2,
  X,
  Eye,
  Download,
  Trash2,
  Edit3,
  Layers,
  BookOpen,
  AlertCircle,
  FileCheck,
  Tag,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const POPULAR_CHAPTERS: Record<string, string[]> = {
  Mathematics: [
    'Chapter 1: Real Numbers',
    'Chapter 2: Polynomials',
    'Chapter 3: Pair of Linear Equations in Two Variables',
    'Chapter 4: Quadratic Equations',
    'Chapter 5: Arithmetic Progressions',
    'Chapter 6: Triangles',
    'Chapter 7: Coordinate Geometry',
    'Chapter 8: Introduction to Trigonometry',
    'Chapter 12: Areas Related to Circles',
    'Chapter 13: Surface Areas and Volumes',
    'Chapter 14: Statistics',
    'Chapter 15: Probability',
  ],
  Physics: [
    'Chapter 10: Light - Reflection and Refraction',
    'Chapter 11: The Human Eye and the Colourful World',
    'Chapter 12: Electricity',
    'Chapter 13: Magnetic Effects of Electric Current',
  ],
  Chemistry: [
    'Chapter 1: Chemical Reactions and Equations',
    'Chapter 2: Acids, Bases and Salts',
    'Chapter 3: Metals and Non-metals',
    'Chapter 4: Carbon and its Compounds',
  ],
  Biology: [
    'Chapter 6: Life Processes',
    'Chapter 7: Control and Coordination',
    'Chapter 8: How do Organisms Reproduce?',
    'Chapter 9: Heredity and Evolution',
    'Chapter 15: Our Environment',
  ],
};

export const TestManagementPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const location = useLocation();
  const isPaperUploadView = location.pathname.includes('test-papers');

  // Data State
  const [tests, setTests] = useState<TestItem[]>([]);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [boardFilter, setBoardFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Sequential Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Wizard Step Form Fields
  const [wizardClassId, setWizardClassId] = useState('');
  const [wizardBoardId, setWizardBoardId] = useState('');
  const [wizardSubjectId, setWizardSubjectId] = useState('');
  const [wizardChapter, setWizardChapter] = useState('');
  const [wizardTestType, setWizardTestType] = useState('Unit Test');
  const [wizardTestName, setWizardTestName] = useState('');
  const [wizardDate, setWizardDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [wizardMaxMarks, setWizardMaxMarks] = useState<number>(50);
  const [wizardDuration, setWizardDuration] = useState('90 mins');
  const [wizardInstructions, setWizardInstructions] = useState(
    '1. All questions are compulsory.\n2. Write clearly with question numbers mentioned.\n3. Calculators are strictly prohibited.'
  );

  // Test Paper Upload State
  const [uploadedPaperUrl, setUploadedPaperUrl] = useState<string | null>(null);
  const [uploadedPaperName, setUploadedPaperName] = useState<string | null>(null);
  const [uploadedPaperSize, setUploadedPaperSize] = useState<number | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Submit and Notification State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Paper Viewer Modal State
  const [viewingPaper, setViewingPaper] = useState<{
    url: string;
    name: string;
    mimeType?: string | null;
  } | null>(null);

  // Admin Custom Test Types Modal
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);
  const [newCustomTypeName, setNewCustomTypeName] = useState('');
  const [isAddingType, setIsAddingType] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Initial Academic Lookups and Tests
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [testData, typeData, classData, boardData, subjectData] = await Promise.all([
        getTestsApi(),
        getTestTypesApi(),
        getClassesApi(),
        getBoardsApi(),
        getSubjectsApi(),
      ]);
      setTests(testData);
      setTestTypes(typeData);
      setClasses(classData);
      setBoards(boardData);
      setSubjects(subjectData);

      // Default wizard fields
      if (classData.length > 0 && !wizardClassId) setWizardClassId(classData[0].id);
      if (boardData.length > 0 && !wizardBoardId) setWizardBoardId(boardData[0].id);
      if (subjectData.length > 0 && !wizardSubjectId) setWizardSubjectId(subjectData[0].id);
    } catch (err: any) {
      console.error('Failed to load tests data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When class/subject changes, auto-suggest test name
  useEffect(() => {
    const selClass = classes.find((c) => c.id === wizardClassId)?.name || 'Class 10';
    const selBoard = boards.find((b) => b.id === wizardBoardId)?.name || 'CBSE';
    const selSubj = subjects.find((s) => s.id === wizardSubjectId)?.name || 'Mathematics';
    const chapShort = wizardChapter ? wizardChapter.split(':')[0] : 'Unit Test';

    if (!editingTestId) {
      setWizardTestName(`${selClass} ${selBoard} ${selSubj} - ${chapShort} ${wizardTestType}`);
    }
  }, [wizardClassId, wizardBoardId, wizardSubjectId, wizardChapter, wizardTestType, editingTestId, classes, boards, subjects]);

  // Open Wizard for Creation
  const handleOpenCreateWizard = () => {
    setEditingTestId(null);
    if (classes.length > 0) setWizardClassId(classes[0].id);
    if (boards.length > 0) setWizardBoardId(boards[0].id);
    if (subjects.length > 0) setWizardSubjectId(subjects[0].id);
    setWizardChapter('Chapter 1: Real Numbers');
    setWizardTestType('Unit Test');
    setWizardDate(new Date().toISOString().split('T')[0]);
    setWizardMaxMarks(50);
    setWizardDuration('90 mins');
    setWizardInstructions(
      '1. All questions are compulsory.\n2. Write clearly with question numbers mentioned.\n3. Calculators are strictly prohibited.'
    );
    setUploadedPaperUrl(null);
    setUploadedPaperName(null);
    setUploadedPaperSize(null);
    setUploadedMimeType(null);
    setUploadError('');
    setIsWizardOpen(true);
  };

  // Open Wizard for Editing
  const handleOpenEditWizard = (test: TestItem) => {
    setEditingTestId(test.id);
    setWizardClassId(test.classId);
    setWizardBoardId(test.boardId);
    setWizardSubjectId(test.subjectId);
    setWizardChapter(test.chapter);
    setWizardTestType(test.testType);
    setWizardTestName(test.name);
    setWizardDate(test.date);
    setWizardMaxMarks(test.maxMarks);
    setWizardDuration(test.duration);
    setWizardInstructions(test.instructions || '');
    setUploadedPaperUrl(test.testPaperUrl || null);
    setUploadedPaperName(test.testPaperName || null);
    setUploadedPaperSize(test.testPaperSize || null);
    setUploadedMimeType(test.mimeType || null);
    setUploadError('');
    setIsWizardOpen(true);
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds the 15MB limit. Please upload a smaller file.');
      return;
    }

    // Validate extension
    const validExts = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExts.includes(ext)) {
      setUploadError('Only PDF, JPG, JPEG, and PNG files are supported for test papers.');
      return;
    }

    try {
      setIsUploadingFile(true);
      setUploadError('');
      const uploaded = await uploadTestPaperApi(file);
      setUploadedPaperUrl(uploaded.url);
      setUploadedPaperName(uploaded.fileName);
      setUploadedPaperSize(uploaded.fileSize);
      setUploadedMimeType(uploaded.mimeType);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload test paper');
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Submit Test Creation or Edit
  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardTestName.trim() || !wizardChapter.trim() || !wizardDate) {
      setUploadError('Please fill in all mandatory test details.');
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadError('');

      const payload: CreateTestPayload = {
        name: wizardTestName.trim(),
        classId: wizardClassId,
        boardId: wizardBoardId,
        subjectId: wizardSubjectId,
        chapter: wizardChapter.trim(),
        testType: wizardTestType,
        date: wizardDate,
        maxMarks: Number(wizardMaxMarks),
        duration: wizardDuration,
        durationMinutes: parseInt(wizardDuration) || 90,
        testPaperUrl: uploadedPaperUrl || undefined,
        testPaperName: uploadedPaperName || undefined,
        testPaperSize: uploadedPaperSize || undefined,
        mimeType: uploadedMimeType || undefined,
        instructions: wizardInstructions.trim() || undefined,
      };

      if (editingTestId) {
        const updated = await updateTestApi(editingTestId, payload);
        setTests((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setNotification({
          type: 'success',
          message: `Test "${updated.name}" updated successfully.`,
        });
      } else {
        const created = await createTestApi(payload);
        setTests((prev) => [created, ...prev]);
        setNotification({
          type: 'success',
          message: `Test "${created.name}" created with ID ${created.testId}.`,
        });
      }

      setIsWizardOpen(false);
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to save test');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Test
  const handleDeleteTest = async (test: TestItem) => {
    if (!window.confirm(`Are you sure you want to delete test "${test.name}"?`)) return;

    try {
      await deleteTestApi(test.id);
      setTests((prev) => prev.filter((t) => t.id !== test.id));
      setNotification({
        type: 'success',
        message: `Test "${test.name}" deleted successfully.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to delete test',
      });
    }
  };

  // Add Custom Test Type
  const handleAddCustomType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTypeName.trim()) return;

    try {
      setIsAddingType(true);
      const created = await addTestTypeApi(newCustomTypeName.trim());
      setTestTypes((prev) => [...prev, created]);
      setNewCustomTypeName('');
      setNotification({
        type: 'success',
        message: `Custom test type "${created.name}" added successfully.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to add test type');
    } finally {
      setIsAddingType(false);
    }
  };

  // Delete Custom Test Type
  const handleDeleteCustomType = async (type: TestType) => {
    if (type.isDefault) {
      alert('System default test types cannot be deleted.');
      return;
    }
    if (!window.confirm(`Remove custom test type "${type.name}"?`)) return;

    try {
      await deleteTestTypeApi(type.id);
      setTestTypes((prev) => prev.filter((t) => t.id !== type.id));
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to delete test type');
    }
  };

  // Filtered Tests
  const filteredTests = tests.filter((t) => {
    if (classFilter !== 'ALL' && t.classId !== classFilter && !t.className.includes(classFilter)) {
      return false;
    }
    if (boardFilter !== 'ALL' && t.boardId !== boardFilter && !t.boardName.includes(boardFilter)) {
      return false;
    }
    if (subjectFilter !== 'ALL' && t.subjectId !== subjectFilter && !t.subjectName.toLowerCase().includes(subjectFilter.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'ALL' && t.testType !== typeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchId = t.testId.toLowerCase().includes(q);
      const matchChap = t.chapter.toLowerCase().includes(q);
      const matchSub = t.subjectName.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchChap && !matchSub) return false;
    }
    return true;
  });

  const totalTestsCount = tests.length;
  const testsWithPapers = tests.filter((t) => !!t.testPaperUrl).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <FileText className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                {isPaperUploadView ? 'Upload & Manage Test Papers' : 'Test Management System'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                {isPaperUploadView ? 'OFFICIAL QUESTION PAPERS VAULT' : 'QUESTION PAPERS & EXAMS'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isPaperUploadView
                ? 'Upload, preview, and replace official test papers and solutions (PDF or Images) for Class 10 CBSE & State Board examinations.'
                : 'Create tests using the sequential workflow (Class → Board → Subject → Chapter → Test Type → Details → Upload Paper → Save).'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTypesModalOpen(true)}
              leftIcon={<Tag className="w-3.5 h-3.5" />}
            >
              Test Types ({testTypes.length})
            </Button>
          )}

          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenCreateWizard}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Test
          </Button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Tests"
          value={totalTestsCount.toString()}
          subtitle="All Academic Tests"
          icon={<FileText className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF]"
          badge="Active"
          badgeVariant="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Papers Uploaded"
          value={testsWithPapers.toString()}
          subtitle="PDF / Image Test Papers"
          icon={<UploadCloud className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="Stored Securely"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Supported Types"
          value={testTypes.length.toString()}
          subtitle="Chapter, Unit, Revision & More"
          icon={<Tag className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          badge="Extensible"
          badgeVariant="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Classes & Boards"
          value={`${classes.length} Cls / ${boards.length} Brd`}
          subtitle="9th, 10th CBSE & State"
          icon={<Layers className="w-5 h-5 text-[#0B1F4D]" />}
          iconBg="bg-[#EEF4FF]"
          badge="Configured"
          badgeVariant="blue"
          isLoading={isLoading}
        />
      </div>

      {/* Filters and Test Catalog */}
      <Card
        title="Tests & Question Papers Directory"
        subtitle={`Showing ${filteredTests.length} of ${tests.length} tests`}
        headerAction={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>
        }
      >
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tests, chapters, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF] font-medium"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF] font-semibold text-slate-700"
          >
            <option value="ALL">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF] font-semibold text-slate-700"
          >
            <option value="ALL">All Boards</option>
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF] font-semibold text-slate-700"
          >
            <option value="ALL">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF] font-semibold text-slate-700"
          >
            <option value="ALL">All Test Types</option>
            {testTypes.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tests List / Cards */}
        {isLoading ? (
          <div className="space-y-4 py-4">
            <SkeletonBlock height="100px" />
            <SkeletonBlock height="100px" />
            <SkeletonBlock height="100px" />
          </div>
        ) : filteredTests.length === 0 ? (
          <EmptyState
            title="No tests found"
            description={
              tests.length === 0
                ? "Create your first test to get started."
                : "No tests match your selected class, board, subject, or search filters. Try adjusting your criteria or create a new test."
            }
            icon={<FileText className="w-8 h-8 text-[#155EEF] stroke-[1.5]" />}
            actionText="Create Test"
            onAction={handleOpenCreateWizard}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTests.map((test) => {
              const hasPaper = !!test.testPaperUrl;
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#B2CCFF] transition-all space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] border border-[#DCE5F2] flex items-center justify-center font-bold text-[#1048B5] text-xs flex-shrink-0">
                        {test.subjectName.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {test.name}
                          </h3>
                          <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold border border-slate-200">
                            {test.testId}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF4FF] text-[#1048B5] border border-[#DCE5F2]">
                            {test.testType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                          <span className="font-semibold text-slate-700">
                            {test.className} &bull; {test.boardName} &bull; {test.subjectName}
                          </span>
                          <span>&bull;</span>
                          <span className="text-slate-600">
                            Created by <strong>{test.createdByName}</strong> on{' '}
                            {new Date(test.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {hasPaper ? (
                        <>
                          <button
                            onClick={() =>
                              setViewingPaper({
                                url: test.testPaperUrl!,
                                name: test.testPaperName || test.name,
                                mimeType: test.mimeType,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EEF4FF] text-[#1048B5] hover:bg-[#EEF4FF] border border-[#DCE5F2] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview Paper
                          </button>
                          <a
                            href={test.testPaperUrl!}
                            download={test.testPaperName || 'test-paper.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Paper Pending
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenEditWizard(test)}
                        title="Edit Test Details"
                        className="p-1.5 text-slate-500 hover:text-[#155EEF] hover:bg-[#EEF4FF] rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTest(test)}
                        title="Delete Test"
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 14 Fields Information Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Chapter
                      </div>
                      <div className="font-bold text-slate-800 truncate" title={test.chapter}>
                        {test.chapter}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Date Scheduled
                      </div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#155EEF]" />
                        {test.date}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Maximum Marks
                      </div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        {test.maxMarks} Marks
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Duration
                      </div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {test.duration}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Test Paper File
                      </div>
                      <div className="font-semibold text-slate-700 truncate" title={test.testPaperName || 'None'}>
                        {test.testPaperName ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            {test.testPaperName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No file uploaded</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        File Size
                      </div>
                      <div className="font-semibold text-slate-600">
                        {test.testPaperSize
                          ? `${(test.testPaperSize / 1024).toFixed(1)} KB`
                          : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Instructions Quote */}
                  {test.instructions && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <div className="font-bold text-[11px] text-slate-500 mb-0.5 uppercase tracking-wider">
                        Instructions to Students:
                      </div>
                      <div className="whitespace-pre-line leading-relaxed italic">
                        {test.instructions}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ======================================================================= */}
      {/* SEQUENTIAL WORKFLOW MODAL: Class -> Board -> Subject -> Chapter -> Save */}
      {/* ======================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#155EEF] flex items-center justify-center text-white font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingTestId ? 'Edit Test & Question Paper' : 'Create Test (Sequential Workflow)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Step-by-step hierarchy: Class &rarr; Board &rarr; Subject &rarr; Chapter &rarr; Test Type &rarr; Details &rarr; Upload Paper
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTest} className="py-4 space-y-4 text-xs">
              {/* Step 1, 2, 3: Class, Board, Subject */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#155EEF]" />
                  Hierarchy Step 1 &bull; Academic Target
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      1. Select Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={wizardClassId}
                      onChange={(e) => setWizardClassId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-[#155EEF]"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      2. Select Board <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={wizardBoardId}
                      onChange={(e) => setWizardBoardId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-[#155EEF]"
                    >
                      {boards.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      3. Select Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={wizardSubjectId}
                      onChange={(e) => setWizardSubjectId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-[#155EEF]"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 4 & 5: Chapter & Test Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    4. Select / Enter Chapter <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="chapter-suggestions"
                    placeholder="e.g. Chapter 1: Real Numbers"
                    value={wizardChapter}
                    onChange={(e) => setWizardChapter(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#155EEF] font-semibold text-slate-800"
                  />
                  <datalist id="chapter-suggestions">
                    {Object.values(POPULAR_CHAPTERS)
                      .flat()
                      .map((ch, idx) => (
                        <option key={idx} value={ch} />
                      ))}
                  </datalist>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Pick a popular NCERT/State Board chapter or type custom chapter name.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    5. Select Test Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={wizardTestType}
                    onChange={(e) => setWizardTestType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#155EEF] font-semibold text-slate-800"
                  >
                    {testTypes.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supports Test 1, Test 2, Chapter-wise, Unit, Monthly, Revision, Custom Test.
                  </p>
                </div>
              </div>

              {/* Step 6: Test Details (Name, Date, Max Marks, Duration) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#155EEF]" />
                  Hierarchy Step 2 &bull; Test Details & Instructions
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wizardTestName}
                    onChange={(e) => setWizardTestName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#155EEF] font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Test Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={wizardDate}
                      onChange={(e) => setWizardDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-[#155EEF] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Maximum Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={500}
                      value={wizardMaxMarks}
                      onChange={(e) => setWizardMaxMarks(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-[#155EEF] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 90 mins"
                      value={wizardDuration}
                      onChange={(e) => setWizardDuration(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-[#155EEF] font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Instructions to Students
                  </label>
                  <textarea
                    rows={2}
                    value={wizardInstructions}
                    onChange={(e) => setWizardInstructions(e.target.value)}
                    placeholder="Enter examination guidelines, section-wise marks distribution, or forbidden materials..."
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-[#155EEF] text-xs"
                  />
                </div>
              </div>

              {/* Step 7: Test Paper Upload */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-[#155EEF]" />
                    Hierarchy Step 3 &bull; Upload Test Paper (PDF, JPG, JPEG, PNG)
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Max size: 15MB &bull; Stored in dedicated file storage
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
                  className="hidden"
                />

                {uploadedPaperUrl ? (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {uploadedPaperName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {uploadedPaperSize ? `${(uploadedPaperSize / 1024).toFixed(1)} KB` : 'Uploaded'}{' '}
                          &bull; Ready to save
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setViewingPaper({
                            url: uploadedPaperUrl,
                            name: uploadedPaperName || 'Test Paper',
                            mimeType: uploadedMimeType,
                          })
                        }
                        className="px-2 py-1 text-xs font-semibold text-[#155EEF] hover:text-[#0B1F4D] bg-[#EEF4FF] rounded-md"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-md"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPaperUrl(null);
                          setUploadedPaperName(null);
                          setUploadedPaperSize(null);
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isUploadingFile
                        ? 'border-[#155EEF] bg-[#EEF4FF]/50'
                        : 'border-slate-300 hover:border-[#155EEF] hover:bg-slate-100/70'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 mx-auto mb-1 text-[#155EEF]" />
                    <p className="font-bold text-slate-800 text-xs">
                      {isUploadingFile ? 'Uploading test paper...' : 'Click to browse or drop question paper file'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Supports PDF, JPG, JPEG, and PNG up to 15MB.
                    </p>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWizardOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  className="bg-[#155EEF] hover:bg-[#1048B5] text-white font-bold"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {editingTestId ? 'Save Changes' : 'Save & Publish Test'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* EMBEDDED TEST PAPER VIEWER MODAL                                        */}
      {/* ======================================================================= */}
      {viewingPaper && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#00B8F8]" />
                <div>
                  <h4 className="font-bold text-sm truncate max-w-md">{viewingPaper.name}</h4>
                  <p className="text-[10px] text-slate-400">Secure Question Paper Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingPaper.url}
                  download={viewingPaper.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#155EEF] hover:bg-[#1048B5] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setViewingPaper(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 overflow-auto">
              {viewingPaper.url.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={viewingPaper.url}
                  title={viewingPaper.name}
                  className="w-full h-full rounded-xl bg-white border border-slate-200 shadow-xs"
                />
              ) : (
                <img
                  src={viewingPaper.url}
                  alt={viewingPaper.name}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-md border border-slate-200"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* ADMIN CUSTOM TEST TYPES MANAGER MODAL                                   */}
      {/* ======================================================================= */}
      {isTypesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#155EEF]" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Manage Test Types
                </h3>
              </div>
              <button
                onClick={() => setIsTypesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Add form */}
              <form onSubmit={handleAddCustomType} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New test type name (e.g. Diagnostic Test)..."
                  value={newCustomTypeName}
                  onChange={(e) => setNewCustomTypeName(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#155EEF] font-semibold"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isAddingType}
                  className="bg-[#155EEF] hover:bg-[#1048B5] text-white font-bold"
                >
                  Add Type
                </Button>
              </form>

              {/* Types list */}
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {testTypes.map((type) => (
                  <div
                    key={type.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{type.name}</span>
                      {type.isDefault && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-semibold">
                          System Default
                        </span>
                      )}
                    </div>
                    {!type.isDefault && (
                      <button
                        onClick={() => handleDeleteCustomType(type)}
                        title="Delete custom test type"
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTypesModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
