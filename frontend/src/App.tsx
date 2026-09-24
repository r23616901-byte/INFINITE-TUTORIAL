import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AdminLayout } from './layouts/AdminLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { ParentLayout } from './layouts/ParentLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage';
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentProfilePage } from './pages/parent/ParentProfilePage';
import { TakeAttendancePage } from './pages/attendance/TakeAttendancePage';
import { AttendanceHistoryPage } from './pages/attendance/AttendanceHistoryPage';
import { ParentAttendancePage } from './pages/parent/ParentAttendancePage';
import { AdminBatchesPage } from './pages/admin/AdminBatchesPage';
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage';
import { ParentLeavesPage } from './pages/parent/ParentLeavesPage';
import { ReviewLeavesPage } from './pages/teacher/ReviewLeavesPage';
import { TestManagementPage } from './pages/teacher/TestManagementPage';
import { ParentTestsPage } from './pages/parent/ParentTestsPage';
import { ParentTuitionReachPage } from './pages/parent/ParentTuitionReachPage';
import { TeacherHomeReachPage } from './pages/teacher/TeacherHomeReachPage';
import { AdminHomeReachPage } from './pages/admin/AdminHomeReachPage';
import { MarksEntryPage } from './pages/teacher/MarksEntryPage';
import { ParentMarksPage } from './pages/parent/ParentMarksPage';
import { TeacherScorecardsPage } from './pages/teacher/TeacherScorecardsPage';
import { ParentPerformanceGraphsPage } from './pages/parent/ParentPerformanceGraphsPage';
import { TeacherAnalyticsPage } from './pages/teacher/TeacherAnalyticsPage';
import { DailyUpdatesPage } from './pages/teacher/DailyUpdatesPage';
import { ParentDailyUpdatesPage } from './pages/parent/ParentDailyUpdatesPage';
import { FileManagerPage } from './pages/admin/FileManagerPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { LoadingProvider } from './context/LoadingContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';

// Smart Home / Root route: Shows RoleSelectionPage for visitors, or redirects to dashboard if authenticated
const RootRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading Infinite Tutorial..." subMessage="Checking your portal permissions and records" />;
  }

  if (isAuthenticated && user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
    return <Navigate to="/parent" replace />;
  }

  return <RoleSelectionPage />;
};

// Login Route wrapper (redirects logged-in user away from /login)
const LoginRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
    return <Navigate to="/parent" replace />;
  }

  return <LoginPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Role Selection Routes */}
            <Route path="/" element={<RootRoute />} />
            <Route path="/select-role" element={<RootRoute />} />

            {/* Role-Specific & Standard Login Routes */}
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/login/:role" element={<LoginRoute />} />

            {/* Protected Admin Routes with AdminLayout */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<AdminStudentsPage />} />
                <Route path="/admin/parents" element={<AdminStudentsPage />} />
                <Route path="/admin/teachers" element={<AdminTeachersPage />} />
                <Route path="/admin/attendance" element={<TakeAttendancePage />} />
                <Route path="/admin/attendance-history" element={<AttendanceHistoryPage />} />
                <Route path="/admin/leave-requests" element={<ReviewLeavesPage />} />
                <Route path="/admin/leaves" element={<ReviewLeavesPage />} />
                <Route path="/admin/tests" element={<TestManagementPage />} />
                <Route path="/admin/batches" element={<AdminBatchesPage />} />
                <Route path="/admin/subjects" element={<AdminSubjectsPage />} />
                <Route path="/admin/home-reach" element={<AdminHomeReachPage />} />
                <Route path="/admin/marks" element={<MarksEntryPage />} />
                <Route path="/admin/answer-sheets" element={<MarksEntryPage />} />
                <Route path="/admin/scorecards" element={<TeacherScorecardsPage />} />
                <Route path="/admin/performance" element={<TeacherAnalyticsPage />} />
                <Route path="/admin/analytics" element={<TeacherAnalyticsPage />} />
                <Route path="/admin/daily-updates" element={<DailyUpdatesPage />} />
                <Route path="/admin/files" element={<FileManagerPage />} />
                <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>
            </Route>

          {/* Protected Teacher Routes with TeacherLayout */}
          <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<TeacherStudentsPage />} />
              <Route path="/teacher/attendance" element={<TakeAttendancePage />} />
              <Route path="/teacher/attendance-history" element={<AttendanceHistoryPage />} />
              <Route path="/teacher/leave-requests" element={<ReviewLeavesPage />} />
              <Route path="/teacher/tests" element={<TestManagementPage />} />
              <Route path="/teacher/test-papers" element={<TestManagementPage />} />
              <Route path="/teacher/home-reach" element={<TeacherHomeReachPage />} />
              <Route path="/teacher/marks-entry" element={<MarksEntryPage />} />
              <Route path="/teacher/answer-sheets" element={<MarksEntryPage />} />
              <Route path="/teacher/marks" element={<MarksEntryPage />} />
              <Route path="/teacher/scorecards" element={<TeacherScorecardsPage />} />
              <Route path="/teacher/performance" element={<TeacherAnalyticsPage />} />
              <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
              <Route path="/teacher/daily-updates" element={<DailyUpdatesPage />} />
              <Route path="/teacher/*" element={<TeacherDashboard />} />
            </Route>
          </Route>

          {/* Protected Parent Routes with ParentLayout */}
          <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
            <Route element={<ParentLayout />}>
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/profile" element={<ParentProfilePage />} />
              <Route path="/parent/attendance" element={<ParentAttendancePage />} />
              <Route path="/parent/leaves" element={<ParentLeavesPage />} />
              <Route path="/parent/test-papers" element={<ParentTestsPage />} />
              <Route path="/parent/tuition-reach" element={<ParentTuitionReachPage />} />
              <Route path="/parent/marks" element={<ParentMarksPage />} />
              <Route path="/parent/scorecards" element={<ParentMarksPage />} />
              <Route path="/parent/performance-graphs" element={<ParentPerformanceGraphsPage />} />
              <Route path="/parent/answer-sheets" element={<ParentMarksPage />} />
              <Route path="/parent/daily-updates" element={<ParentDailyUpdatesPage />} />
              <Route path="/parent/*" element={<ParentDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  </AuthProvider>
);
};

export default App;
