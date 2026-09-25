import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { fetchMyStudentProfile, StudentDto } from '../../services/studentService';
import {
  ShieldAlert,
  GraduationCap,
  Calendar,
  Phone,
  User,
  Building,
  Award,
  Layers,
  Clock,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMyStudentProfile();
        setStudent(data);
      } catch {
        // Handled in service fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Format date to DD/MM/YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonBlock height="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonBlock height="h-64" />
          <SkeletonBlock height="h-64" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl border border-slate-200">
        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">Student Profile Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          No student profile is currently linked to your login. Please contact the administrative office.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ========================================================= */}
      {/* MANDATORY LOCKED PROFILE NOTICE (NO EDIT PROFILE BUTTON) */}
      {/* ========================================================= */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
        </div>
        <div className="text-xs space-y-1 text-amber-950 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-amber-900 text-sm">
              Locked Student Profile
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/60 text-amber-900 border border-amber-300">
              Read-Only
            </span>
          </div>
          <p className="font-medium text-amber-900/90">
            Profile information is managed by Infinite Tutorial Admin.
          </p>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Only Admin can modify these fields. Teachers can view the information but cannot modify it. To update address or student details, please submit an official request to the administrative desk.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STUDENT PROFILE CARD HEADER */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Student Photo */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-sm flex items-center justify-center flex-shrink-0">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2">
                  <User className="w-12 h-12 text-slate-300 mx-auto" />
                  <span className="text-[10px] font-semibold text-slate-400 block mt-1">[PHOTO]</span>
                </div>
              )}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              {student.status}
            </span>
          </div>

          {/* Student Identity Highlights */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <p className="text-xs font-semibold text-blue-600 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5" />
                  {student.school}
                </p>
              </div>

              {/* Student ID Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 self-center sm:self-auto">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student ID:</span>
                <span className="text-xs font-black text-slate-900">{student.studentId}</span>
              </div>
            </div>

            {/* Quick Cohort Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                {student.className}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#EEF4FF] text-[#1048B5] font-semibold border border-[#DCE5F2]">
                {student.boardName}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                {student.batchName}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                AY {student.academicYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACADEMIC & IDENTITY DETAIL SECTIONS (READ-ONLY) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Enrollment Details */}
        <Card
          title="Academic Enrollment Record"
          subtitle="Registered curriculum, cohort and institutional affiliation"
        >
          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                Student ID
              </dt>
              <dd className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {student.studentId}
              </dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                School Name
              </dt>
              <dd className="font-semibold text-slate-800 text-right">{student.school}</dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" />
                Class / Grade
              </dt>
              <dd className="font-semibold text-slate-800">{student.className}</dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                Board of Examination
              </dt>
              <dd className="font-semibold text-slate-800">{student.boardName}</dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Assigned Batch
              </dt>
              <dd className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {student.batchName}
              </dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Academic Year
              </dt>
              <dd className="font-semibold text-slate-800">{student.academicYear}</dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                Admission Date
              </dt>
              <dd className="font-semibold text-slate-800">{formatDate(student.admissionDate)}</dd>
            </div>
          </dl>
        </Card>

        {/* Parent & Contact Profile */}
        <Card
          title="Parent & Contact Record"
          subtitle="Authorized emergency contact and guardian identity"
        >
          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                Parent Name
              </dt>
              <dd className="font-bold text-slate-900">{student.parentName}</dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                Parent Phone Number
              </dt>
              <dd className="font-bold text-slate-900 tracking-wide">{student.parentPhone}</dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                Student Phone Number
              </dt>
              <dd className="font-medium text-slate-600">
                {student.studentPhone || 'Not Applicable / Not Registered'}
              </dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Date of Birth (DOB)
              </dt>
              <dd className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {formatDate(student.dateOfBirth)}
              </dd>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-slate-500 font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-400" />
                Account Status
              </dt>
              <dd>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {student.status} (Verified)
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
            <strong>Security Notice:</strong> The parent phone number registered here receives all SMS alerts, attendance logs, and test scorecards from Infinite Tutorial.
          </div>
        </Card>
      </div>

      {/* Return to Dashboard Shortcut */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/parent')}
        >
          Return to Parent Dashboard
        </Button>
      </div>
    </div>
  );
};
