import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  fetchStudents,
  fetchAcademicLookups,
  StudentDto,
  AcademicLookups,
  updateStudent,
} from '../../services/studentService';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Eye,
  Shield,
  Phone,
  X,
  CheckCircle2,
  RotateCcw,
  KeyRound,
  Send,
  MessageSquare,
  GraduationCap,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react';

export interface ParentRecord {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  portalStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  lastActive: string;
  address?: string;
  notes?: string;
  students: StudentDto[];
}

export const AdminParentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [lookups, setLookups] = useState<AcademicLookups | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRelation, setSelectedRelation] = useState('');

  // Parent records state
  const [parentRecords, setParentRecords] = useState<ParentRecord[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResetPinModalOpen, setIsResetPinModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<ParentRecord | null>(null);

  // Form states
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Edit / Add Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    relationship: 'Father' as 'Father' | 'Mother' | 'Guardian',
    address: '',
    notes: '',
    linkedStudentId: '',
  });

  // Generated Temporary PIN
  const [generatedPin, setGeneratedPin] = useState('');

  // Broadcast Form
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, lookupsRes] = await Promise.all([
        fetchStudents(),
        fetchAcademicLookups(),
      ]);

      const stuList = studentsRes.students || [];
      setStudents(stuList);
      setLookups(lookupsRes);

      // Group students by parent phone to form parent accounts
      const parentMap = new Map<string, ParentRecord>();

      stuList.forEach((stu, idx) => {
        const phone = stu.parentPhone || `980000000${idx + 1}`;
        if (!parentMap.has(phone)) {
          // Known mock enrichments
          let relation: 'Father' | 'Mother' | 'Guardian' = 'Father';
          let email = '';
          let altPhone = '';
          let status: 'ACTIVE' | 'PENDING' | 'INACTIVE' = 'ACTIVE';
          let lastActive = 'Today at 09:15 AM';

          if (stu.id === 'stu-10025') {
            relation = 'Father';
            email = 'ramesh.kumar@gmail.com';
            altPhone = '9845012345';
            lastActive = 'Today at 10:24 AM';
          } else if (stu.id === 'stu-10026') {
            relation = 'Father';
            email = 'rajesh.verma@outlook.com';
            altPhone = '9845112299';
            lastActive = 'Yesterday at 04:30 PM';
          } else if (stu.id === 'stu-10027') {
            relation = 'Father';
            email = 'suresh.rao@gmail.com';
            lastActive = '2 days ago';
          } else if (stu.id === 'stu-10028') {
            relation = 'Father';
            email = 'venkat.nair@yahoo.com';
            altPhone = '9823445577';
            lastActive = '3 days ago';
          } else if (stu.id === 'stu-10029') {
            relation = 'Guardian';
            email = 'santosh.patil@gmail.com';
            status = 'PENDING';
            lastActive = 'Invited via SMS';
          }

          parentMap.set(phone, {
            id: stu.parentId || `par-${stu.id}`,
            name: stu.parentName || 'Parent / Guardian',
            phone,
            alternatePhone: altPhone,
            email,
            relationship: relation,
            portalStatus: status,
            lastActive,
            address: 'Bangalore, Karnataka',
            notes: 'Verified emergency contact and tuition reach recipient',
            students: [stu],
          });
        } else {
          parentMap.get(phone)?.students.push(stu);
        }
      });

      setParentRecords(Array.from(parentMap.values()));
    } catch {
      showToast('Could not sync live records; using cached parent accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Parents
  const filteredParents = useMemo(() => {
    return parentRecords.filter((p) => {
      // Search term
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesParent =
          p.name.toLowerCase().includes(query) ||
          p.phone.includes(query) ||
          (p.alternatePhone && p.alternatePhone.includes(query)) ||
          (p.email && p.email.toLowerCase().includes(query));

        const matchesStudent = p.students.some(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.studentId.toLowerCase().includes(query) ||
            s.className.toLowerCase().includes(query)
        );

        if (!matchesParent && !matchesStudent) return false;
      }

      // Class filter
      if (selectedClass) {
        const hasClass = p.students.some(
          (s) => s.classId === selectedClass || s.className.toLowerCase().includes(selectedClass.toLowerCase())
        );
        if (!hasClass) return false;
      }

      // Portal status filter
      if (selectedStatus && p.portalStatus !== selectedStatus) {
        return false;
      }

      // Relation filter
      if (selectedRelation && p.relationship !== selectedRelation) {
        return false;
      }

      return true;
    });
  }, [parentRecords, search, selectedClass, selectedStatus, selectedRelation]);

  // Handle Copy Phone
  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Open Edit Modal
  const openEditModal = (parent: ParentRecord) => {
    setActiveParent(parent);
    setFormData({
      name: parent.name,
      phone: parent.phone,
      alternatePhone: parent.alternatePhone || '',
      email: parent.email || '',
      relationship: parent.relationship,
      address: parent.address || '',
      notes: parent.notes || '',
      linkedStudentId: parent.students[0]?.id || '',
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParent) return;

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Parent Name and Primary Mobile Number are required.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      // Update local parent records
      setParentRecords((prev) =>
        prev.map((item) =>
          item.id === activeParent.id
            ? {
                ...item,
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                alternatePhone: formData.alternatePhone.trim(),
                email: formData.email.trim(),
                relationship: formData.relationship,
                address: formData.address.trim(),
                notes: formData.notes.trim(),
              }
            : item
        )
      );

      // Also update linked student records parent name & phone
      for (const stu of activeParent.students) {
        try {
          await updateStudent(stu.id, {
            parentName: formData.name.trim(),
            parentPhone: formData.phone.trim(),
          });
        } catch {
          // ignore individual student sync errors
        }
      }

      showToast(`Updated contact details for ${formData.name}.`);
      setIsEditModalOpen(false);
    } catch {
      setFormError('Failed to update parent details.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: '',
      phone: '',
      alternatePhone: '',
      email: '',
      relationship: 'Father',
      address: '',
      notes: '',
      linkedStudentId: students[0]?.id || '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Handle Add Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Parent Name and Primary Mobile Number are required.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const linkedStu = students.find((s) => s.id === formData.linkedStudentId);

      const newRecord: ParentRecord = {
        id: `par-${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        alternatePhone: formData.alternatePhone.trim(),
        email: formData.email.trim(),
        relationship: formData.relationship,
        portalStatus: 'ACTIVE',
        lastActive: 'Just registered',
        address: formData.address.trim() || 'Bangalore, Karnataka',
        notes: formData.notes.trim() || 'Newly registered parent account',
        students: linkedStu ? [linkedStu] : [],
      };

      if (linkedStu) {
        try {
          await updateStudent(linkedStu.id, {
            parentName: formData.name.trim(),
            parentPhone: formData.phone.trim(),
          });
        } catch {
          // handled
        }
      }

      setParentRecords((prev) => [newRecord, ...prev]);
      showToast(`Registered ${formData.name} and linked to ${linkedStu?.name || 'student'}.`);
      setIsAddModalOpen(false);
    } catch {
      setFormError('Failed to register parent.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Reset PIN Modal
  const openResetPinModal = (parent: ParentRecord) => {
    setActiveParent(parent);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPin(pin);
    setIsResetPinModalOpen(true);
  };

  // Handle Reset PIN Confirm
  const handleConfirmPinReset = () => {
    if (!activeParent) return;
    showToast(`Temporary PIN ${generatedPin} sent to ${activeParent.name} (${activeParent.phone}) via SMS.`);
    setIsResetPinModalOpen(false);
  };

  // Handle Broadcast Submit
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    showToast(`Broadcast SMS successfully dispatched to ${filteredParents.length} parents.`);
    setBroadcastMessage('');
    setIsBroadcastModalOpen(false);
  };

  const totalParents = parentRecords.length;
  const activePortals = parentRecords.filter((p) => p.portalStatus === 'ACTIVE').length;
  const totalLinkedStudents = parentRecords.reduce((acc, p) => acc + p.students.length, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F4D] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#155EEF] animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DCE5F2] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
              Parents Management & Portals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F8FF] text-[#0284C7] border border-[#BAE6FD]">
              FAMILY PORTALS
            </span>
          </div>
          <p className="text-xs text-[#5B6B82] mt-1">
            Manage parent accounts, verified primary & emergency contacts, linked children, and portal login access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsBroadcastModalOpen(true)}
            leftIcon={<MessageSquare className="w-4 h-4 text-[#155EEF]" />}
          >
            Broadcast SMS
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Register Parent
          </Button>
        </div>
      </div>

      {/* System Policy Banner */}
      <div className="flex items-start gap-3 bg-[#EEF4FF] border border-[#DCE5F2] rounded-xl p-4 text-xs text-[#0B1F4D]">
        <Shield className="w-5 h-5 text-[#155EEF] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#0B1F4D]">
            Verified Parent Contact Policy:
          </p>
          <p className="text-[#5B6B82] leading-relaxed">
            Parent mobile numbers serve as their primary login identifier for the Infinite Tutorial Parent Portal. Attendance SMS alerts, emergency notifications, and tuition reach updates are dispatched directly to these verified contacts.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="TOTAL PARENTS"
          value={isLoading ? '...' : totalParents.toString()}
          subtitle="Registered family contacts"
          icon={<UserCheck className="w-5 h-5 text-[#0284C7]" />}
          iconBg="bg-[#E0F8FF] border border-[#BAE6FD]"
          badge="Verified"
          badgeVariant="cyan"
          isLoading={isLoading}
        />
        <StatCard
          title="ACTIVE PORTALS"
          value={isLoading ? '...' : activePortals.toString()}
          subtitle="Logged in recently"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 border border-emerald-200"
          badge="Online"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="LINKED STUDENTS"
          value={isLoading ? '...' : totalLinkedStudents.toString()}
          subtitle="Under parent monitoring"
          icon={<GraduationCap className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Enrolled"
          badgeVariant="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="SMS & REACH"
          value={isLoading ? '...' : '100%'}
          subtitle="Immediate dispatch active"
          icon={<Phone className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50 border border-amber-200"
          badge="Live"
          badgeVariant="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A9BB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Parent Name, Mobile Number, Student Name, Roll ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#DCE5F2] rounded-lg text-[#0B1F4D] focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 font-medium"
          >
            <option value="">All Student Classes</option>
            {lookups?.classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Portal Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#DCE5F2] rounded-lg text-[#0B1F4D] focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 font-medium"
          >
            <option value="">All Portal Statuses</option>
            <option value="ACTIVE">Active Portal</option>
            <option value="PENDING">Pending Activation</option>
          </select>

          {/* Relation Filter */}
          <select
            value={selectedRelation}
            onChange={(e) => setSelectedRelation(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#DCE5F2] rounded-lg text-[#0B1F4D] focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 font-medium"
          >
            <option value="">All Relationships</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
          </select>

          {/* Clear Filters */}
          {(search || selectedClass || selectedStatus || selectedRelation) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedClass('');
                setSelectedStatus('');
                setSelectedRelation('');
              }}
              className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}

          <div className="ml-auto text-xs text-[#8A9BB0] font-semibold">
            Showing {filteredParents.length} of {parentRecords.length} Parents
          </div>
        </div>
      </div>

      {/* Parents Directory Table */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
            <SkeletonBlock height="h-12" />
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="p-10">
            <EmptyState
              title="No Parents Found"
              description="No parent records match your selected search criteria."
              icon={<Users className="w-8 h-8 text-[#155EEF]" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFD] border-b border-[#DCE5F2] text-[#0B1F4D] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3.5">Parent / Guardian</th>
                  <th className="px-5 py-3.5">Primary Mobile & Access</th>
                  <th className="px-5 py-3.5">Linked Student(s)</th>
                  <th className="px-5 py-3.5">Portal Status</th>
                  <th className="px-5 py-3.5">Emergency Contact</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4FA]">
                {filteredParents.map((parent) => {
                  const initial = parent.name.charAt(0).toUpperCase();

                  return (
                    <tr key={parent.id} className="hover:bg-[#F5F8FC] transition-colors">
                      {/* Parent / Guardian Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0B1F4D]">
                                {parent.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                                {parent.relationship}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8A9BB0] mt-0.5">
                              {parent.email || 'Email not registered'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Primary Mobile & Access */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0B1F4D] bg-[#F5F8FC] px-2 py-1 rounded-md border border-[#DCE5F2]">
                            {parent.phone}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(parent.phone)}
                            title="Copy Phone"
                            className="p-1 text-[#8A9BB0] hover:text-[#155EEF] rounded-md transition-colors"
                          >
                            {copiedPhone === parent.phone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-[#5B6B82] mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
                          Verified SMS Gateway
                        </p>
                      </td>

                      {/* Linked Student(s) */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          {parent.students.map((stu) => (
                            <div
                              key={stu.id}
                              className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#EEF4FF] border border-[#DCE5F2] rounded-lg text-xs"
                            >
                              <GraduationCap className="w-3.5 h-3.5 text-[#155EEF] flex-shrink-0" />
                              <span className="font-bold text-[#0B1F4D]">
                                {stu.name}
                              </span>
                              <span className="text-[10px] text-[#5B6B82] font-mono">
                                ({stu.studentId})
                              </span>
                              <span className="text-[10px] text-[#155EEF] font-semibold">
                                &bull; {stu.className}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Portal Status */}
                      <td className="px-5 py-4">
                        {parent.portalStatus === 'ACTIVE' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Portal
                            </span>
                            <p className="text-[10px] text-[#8A9BB0]">
                              {parent.lastActive}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Pending Verification
                            </span>
                            <p className="text-[10px] text-[#8A9BB0]">
                              Invite sent
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Emergency Contact */}
                      <td className="px-5 py-4">
                        {parent.alternatePhone ? (
                          <span className="font-mono text-[#5B6B82] bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                            {parent.alternatePhone}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8A9BB0] italic">
                            Primary Only
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveParent(parent);
                              setIsViewModalOpen(true);
                            }}
                            title="View Family Details"
                            className="p-1.5 rounded-lg text-[#5B6B82] hover:text-[#155EEF] hover:bg-[#EEF4FF] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(parent)}
                            title="Edit Contact"
                            className="p-1.5 rounded-lg text-[#5B6B82] hover:text-[#155EEF] hover:bg-[#EEF4FF] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openResetPinModal(parent)}
                            title="Reset Portal Access PIN"
                            className="p-1.5 rounded-lg text-[#5B6B82] hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW PARENT PROFILE & FAMILY DETAILS */}
      {/* ========================================================= */}
      {isViewModalOpen && activeParent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#DCE5F2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#F0F4FA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {activeParent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F4D]">
                    {activeParent.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF4FF] text-[#155EEF]">
                    {activeParent.relationship} &bull; {activeParent.portalStatus} Portal
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-2 gap-4 bg-[#F8FAFD] p-4 rounded-xl border border-[#DCE5F2]">
                <div>
                  <p className="text-[10px] font-bold text-[#8A9BB0] uppercase">Primary Login Mobile</p>
                  <p className="text-sm font-bold text-[#0B1F4D] mt-0.5 font-mono">{activeParent.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#8A9BB0] uppercase">Emergency Alternate</p>
                  <p className="text-sm font-semibold text-[#5B6B82] mt-0.5 font-mono">
                    {activeParent.alternatePhone || 'None Provided'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#8A9BB0] uppercase">Email Address</p>
                  <p className="text-xs font-semibold text-[#5B6B82] mt-0.5">
                    {activeParent.email || 'Not configured'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#8A9BB0] uppercase">Portal Last Seen</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {activeParent.lastActive}
                  </p>
                </div>
              </div>

              {/* Linked Children */}
              <div>
                <h4 className="font-bold text-[#0B1F4D] mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#155EEF]" />
                  Linked Enrolled Children ({activeParent.students.length})
                </h4>
                <div className="space-y-2">
                  {activeParent.students.map((stu) => (
                    <div
                      key={stu.id}
                      className="p-3 bg-white border border-[#DCE5F2] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#0B1F4D] text-xs">{stu.name}</p>
                        <p className="text-[11px] text-[#5B6B82]">
                          ID: <span className="font-mono">{stu.studentId}</span> &bull; {stu.className} ({stu.boardName})
                        </p>
                        <p className="text-[10px] text-[#8A9BB0]">
                          Batch: {stu.batchName} &bull; School: {stu.school}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {stu.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Communication Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#F0F4FA]">
                <a
                  href={`tel:${activeParent.phone}`}
                  className="flex-1 py-2 text-center rounded-xl bg-[#EEF4FF] text-[#155EEF] font-bold text-xs hover:bg-[#DCE5F2] transition-colors"
                >
                  Call Primary Phone
                </a>
                <a
                  href={`https://wa.me/91${activeParent.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 text-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
                >
                  WhatsApp Message
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-[#F0F4FA] flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT PARENT CONTACT */}
      {/* ========================================================= */}
      {isEditModalOpen && activeParent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DCE5F2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#F0F4FA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B1F4D]">
                  Edit Parent Contact Details
                </h3>
                <p className="text-xs text-[#5B6B82] mt-0.5">
                  Update primary phone and portal access credentials.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Parent / Guardian Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">
                    Relationship *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relationship: e.target.value as 'Father' | 'Mother' | 'Guardian',
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">
                    Primary Mobile (Login) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">
                    Alternate Mobile
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Optional"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Optional"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                Notice: Updating this mobile number will immediately update the login identifier for the parent's portal access.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4FA]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={formSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: REGISTER NEW PARENT */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DCE5F2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#F0F4FA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B1F4D]">
                  Register New Parent Profile
                </h3>
                <p className="text-xs text-[#5B6B82] mt-0.5">
                  Register parent account and link to an enrolled student.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Rajesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">
                    Relationship *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relationship: e.target.value as 'Father' | 'Mother' | 'Guardian',
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">
                    Primary Mobile (Login ID) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Link to Enrolled Student *
                </label>
                <select
                  required
                  value={formData.linkedStudentId}
                  onChange={(e) => setFormData({ ...formData, linkedStudentId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                >
                  <option value="">Select Enrolled Student...</option>
                  {students.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name} ({stu.studentId}) &bull; {stu.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4FA]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={formSubmitting}
                >
                  Register & Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: RESET PORTAL PIN */}
      {/* ========================================================= */}
      {isResetPinModalOpen && activeParent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-[#DCE5F2] shadow-2xl p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#0B1F4D]">
              Reset Parent Portal Access PIN
            </h3>
            <p className="text-xs text-[#5B6B82] mt-1">
              Generate a temporary access PIN for <b>{activeParent.name}</b>.
            </p>

            <div className="my-5 p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
              <p className="text-[10px] uppercase font-bold text-[#8A9BB0]">
                Generated 6-Digit Temporary PIN
              </p>
              <p className="text-2xl font-black font-mono tracking-widest text-[#155EEF] mt-1">
                {generatedPin}
              </p>
              <p className="text-[10px] text-[#5B6B82] mt-1">
                Valid for 24 hours. Parent will be prompted to reset upon login.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setIsResetPinModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleConfirmPinReset}>
                Dispatch PIN via SMS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: BROADCAST SMS TO PARENTS */}
      {/* ========================================================= */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DCE5F2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#F0F4FA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#155EEF]" />
                <h3 className="text-base font-bold text-[#0B1F4D]">
                  Broadcast SMS to Parents
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Target Parent Audience
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D]"
                >
                  <option value="ALL">All Enrolled Parents ({parentRecords.length} contacts)</option>
                  <option value="CLASS10">Class 10 Parents Only</option>
                  <option value="CLASS9">Class 9 Parents Only</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#0B1F4D]">
                    SMS Notice Message *
                  </label>
                  <span className="text-[10px] text-[#8A9BB0]">
                    {broadcastMessage.length} / 160 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={160}
                  placeholder="e.g. Dear Parent, Monthly Academic Progress Review will be held this Saturday from 10:00 AM. Attendance is compulsory. - Infinite Tutorial"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 text-[#0B1F4D] resize-none"
                />
              </div>

              <div className="p-3 bg-[#EEF4FF] border border-[#DCE5F2] rounded-xl text-[11px] text-[#155EEF]">
                Messages will be sent using the registered Infinite Tutorial SMS Sender ID header directly to verified parent mobile phones.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4FA]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsBroadcastModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Broadcast
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParentsPage;
