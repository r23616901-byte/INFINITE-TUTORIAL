import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  getClassesApi,
  addClassApi,
  getBoardsApi,
  addBoardApi,
  getSubjectsApi,
  addSubjectApi,
} from '../../services/academicService';
import { ClassItem, BoardItem, SubjectItem } from '../../types/attendance';
import {
  BookOpen,
  GraduationCap,
  Plus,
  Layers,
} from 'lucide-react';

export const AdminSubjectsPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Forms
  const [className, setClassName] = useState('');
  const [classGrade, setClassGrade] = useState(11);
  const [boardName, setBoardName] = useState('');
  const [boardCode, setBoardCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectBoardId, setSubjectBoardId] = useState('');

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const [clsList, brdList, subList] = await Promise.all([
        getClassesApi(),
        getBoardsApi(),
        getSubjectsApi(),
      ]);
      setClasses(clsList);
      setBoards(brdList);
      setSubjects(subList);
      if (brdList.length > 0) setSubjectBoardId(brdList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) return;
    try {
      const created = await addClassApi({ name: className, grade: Number(classGrade) });
      setClasses((prev) => [...prev, created]);
      setIsAddClassOpen(false);
      setClassName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName || !boardCode) return;
    try {
      const created = await addBoardApi({ name: boardName, code: boardCode.toUpperCase() });
      setBoards((prev) => [...prev, created]);
      setIsAddBoardOpen(false);
      setBoardName('');
      setBoardCode('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !subjectCode) return;
    try {
      const created = await addSubjectApi({
        name: subjectName,
        code: subjectCode.toUpperCase(),
        boardId: subjectBoardId,
      });
      setSubjects((prev) => [...prev, created]);
      setIsAddSubjectOpen(false);
      setSubjectName('');
      setSubjectCode('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0B1F4D] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Classes, Boards & Subjects
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                CURRICULUM ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure extensible academic structure without hardcoding. Class 9, Class 10, CBSE, Karnataka State Board, Physics, Chemistry, Biology, Mathematics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddClassOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Class
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddBoardOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Board
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddSubjectOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Subject
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Classes"
          value={classes.length.toString()}
          subtitle="9th, 10th (Expandable)"
          icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Supported Boards"
          value={boards.length.toString()}
          subtitle="CBSE & Karnataka State"
          icon={<Layers className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF]"
          isLoading={isLoading}
        />
        <StatCard
          title="Curriculum Subjects"
          value={subjects.length.toString()}
          subtitle="Physics, Chem, Bio, Maths"
          icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          isLoading={isLoading}
        />
      </div>

      {/* 3 Panels: Classes, Boards, Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classes Card */}
        <Card
          title="Classes / Grades"
          subtitle="Extensible grade hierarchy"
          headerAction={
            <Button size="sm" variant="ghost" onClick={() => setIsAddClassOpen(true)}>
              + Add
            </Button>
          }
        >
          <div className="space-y-2 pt-1">
            {classes.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{c.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Grade {c.grade}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Boards Card */}
        <Card
          title="Academic Boards"
          subtitle="State & National boards"
          headerAction={
            <Button size="sm" variant="ghost" onClick={() => setIsAddBoardOpen(true)}>
              + Add
            </Button>
          }
        >
          <div className="space-y-2 pt-1">
            {boards.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{b.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{b.code}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF4FF] text-[#0B1F4D]">
                  {b.code}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Subjects Card */}
        <Card
          title="Subjects"
          subtitle="Core subjects per board"
          headerAction={
            <Button size="sm" variant="ghost" onClick={() => setIsAddSubjectOpen(true)}>
              + Add
            </Button>
          }
        >
          <div className="space-y-2 pt-1">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[10px] text-slate-500">{s.boardName || 'CBSE'}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                  {s.code}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Class Modal */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Add New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name (e.g. Class 11)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 11"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grade Number
                </label>
                <input
                  type="number"
                  required
                  value={classGrade}
                  onChange={(e) => setClassGrade(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsAddClassOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Class
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Board Modal */}
      {isAddBoardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Add Academic Board</h3>
            <form onSubmit={handleAddBoard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Board Name (e.g. ICSE)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Certificate of Secondary Education"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Board Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICSE"
                  value={boardCode}
                  onChange={(e) => setBoardCode(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsAddBoardOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Board
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Add Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS10"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Board
                </label>
                <select
                  value={subjectBoardId}
                  onChange={(e) => setSubjectBoardId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                >
                  {boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsAddSubjectOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
