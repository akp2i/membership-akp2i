import React, { useState } from 'react';
import {
  FolderKanban,
  ClipboardList,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Download,
  Upload,
  UserCheck,
  Edit3,
  Video,
  FileText,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Search,
  AlertCircle,
  ShieldCheck,
  Play,
  Check,
  X,
  Trash2,
  RotateCcw,
  Camera,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  UserProfile,
  Program,
  Registration,
  ScheduleAgenda,
  ExamResult,
  Certificate,
  DocumentItem,
  validateProfileData,
  REQUIRED_PROFILE_DOC_TYPES,
} from '../../types/akp2i';
import {
  ResilientImage,
  formatRupiah,
  StatusLabel,
  QrCodeMatrixSvg,
} from '../ui/ResilientImage';

/* ============================================================================
   1. PARTICIPANT DASHBOARD VIEW (MODELED ON KLC SCREENSHOT 5)
   ============================================================================ */
interface ParticipantDashboardProps {
  user: UserProfile;
  programs: Program[];
  registrations: Registration[];
  schedules: ScheduleAgenda[];
  certificates: Certificate[];
  onExplorePrograms: () => void;
  onViewRegistrations: () => void;
  onOpenCourseLms: (program: Program) => void;
  onViewSchedule: () => void;
  onViewCertificates: () => void;
}

const REGISTRATION_STEPS = [
  'Pendaftaran',
  'Data Diverifikasi',
  'Pembayaran',
  'Pembayaran Diverifikasi',
  'Terdaftar',
  'Pelatihan Berlangsung',
  'Selesai',
  'Sertifikat Terbit',
];

export const ParticipantDashboardView: React.FC<ParticipantDashboardProps> = ({
  user,
  programs,
  registrations,
  schedules,
  certificates,
  onExplorePrograms,
  onViewRegistrations,
  onOpenCourseLms,
  onViewSchedule,
  onViewCertificates,
}) => {
  const userRegs = registrations.filter((r) => r.participantId === user.id);
  const activeRegs = userRegs.filter(
    (r) => r.status !== 'Selesai' && r.status !== 'Dibatalkan'
  );
  const ongoingCourses = userRegs.filter(
    (r) => r.status === 'Pelatihan Berlangsung' || r.status === 'Terdaftar'
  );
  const completedRegs = userRegs.filter((r) => r.status === 'Selesai');
  const latestReg = userRegs[0];

  return (
    <div className="space-y-6">
      {/* KLC Style Gradient Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#045A38] via-[#087A4B] to-[#0B8F5A] text-white p-6 sm:p-8 border border-[#0B8F5A]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center text-xl font-extrabold shrink-0 overflow-hidden">
            <ResilientImage
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-wider text-[#F4C430] uppercase">
              PESERTA PELATIHAN & SERTIFIKASI AKP2I
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
              Selamat Datang, {user.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#EAF7F0]/90 mt-0.5">
              Pantau pelatihan, jadwal, pendaftaran, hasil dan sertifikat Anda dari satu dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={onExplorePrograms}
          className="px-4 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Daftar Program Baru</span>
        </button>
      </div>

      {/* 5 Summary Stat Cards (KLC Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <button
          onClick={onExplorePrograms}
          className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-left flex items-center gap-3.5 hover:border-[#087A4B] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white tabular-nums">
              {programs.filter((p) => p.status === 'Sedang Dibuka').length}
            </div>
            <div className="text-[11px] font-bold text-[#66757F] dark:text-slate-400">
              PROGRAM TERSEDIA
            </div>
          </div>
        </button>

        <button
          onClick={onViewRegistrations}
          className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-left flex items-center gap-3.5 hover:border-[#087A4B] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-600 dark:text-[#F4C430] flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white tabular-nums">
              {activeRegs.length}
            </div>
            <div className="text-[11px] font-bold text-[#66757F] dark:text-slate-400">
              PENDAFTARAN AKTIF
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            const firstCourse = programs.find((p) => p.id === ongoingCourses[0]?.programId) || programs[0];
            onOpenCourseLms(firstCourse);
          }}
          className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-left flex items-center gap-3.5 hover:border-[#087A4B] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white tabular-nums">
              {ongoingCourses.length}
            </div>
            <div className="text-[11px] font-bold text-[#66757F] dark:text-slate-400">
              SEDANG DIIKUTI
            </div>
          </div>
        </button>

        <button
          onClick={onViewRegistrations}
          className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-left flex items-center gap-3.5 hover:border-[#087A4B] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white tabular-nums">
              {completedRegs.length}
            </div>
            <div className="text-[11px] font-bold text-[#66757F] dark:text-slate-400">
              PROGRAM SELESAI
            </div>
          </div>
        </button>

        <button
          onClick={onViewCertificates}
          className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-left flex items-center gap-3.5 hover:border-[#087A4B] transition-colors cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F4C430]/20 text-[#B45309] dark:text-[#F4C430] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white tabular-nums">
              {certificates.filter((c) => c.participantId === user.id).length}
            </div>
            <div className="text-[11px] font-bold text-[#66757F] dark:text-slate-400">
              SERTIFIKAT TERBIT
            </div>
          </div>
        </button>
      </div>

      {/* Pelatihan & Jadwal Mendatang Section */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#087A4B] dark:text-[#34D399]" />
            <h2 className="text-sm font-bold text-[#172026] dark:text-white">
              Pelatihan & Sesi Kelas Mendatang
            </h2>
          </div>
          <button
            onClick={onViewSchedule}
            className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] hover:underline cursor-pointer"
          >
            Lihat Kalender Lengkap
          </button>
        </div>

        {schedules.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#66757F] dark:text-slate-400">
            <Calendar className="w-8 h-8 mx-auto text-[#087A4B] opacity-50 mb-2" />
            <p className="font-bold text-[#172026] dark:text-white">Belum Ada Jadwal Zoom</p>
            <p className="text-[11px] mt-0.5">Seluruh sesi kelas Zoom telah di-reset / belum ada jadwal sesi aktif.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.slice(0, 2).map((sch) => {
              const linkedProg = programs.find((p) => p.id === sch.programId) || programs[0];
              return (
                <div
                  key={sch.id}
                  className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#087A4B] dark:text-[#34D399]">
                        {sch.programTitle}
                      </span>
                      <StatusLabel status={sch.status} />
                    </div>
                    <h3 className="text-sm font-bold text-[#172026] dark:text-white">
                      {sch.sessionTitle}
                    </h3>
                    <p className="text-xs text-[#66757F] dark:text-slate-400 tabular-nums">
                      {sch.displayDate} · {sch.time}
                    </p>
                    <p className="text-xs text-[#66757F] dark:text-slate-400">
                      Pengajar: {sch.instructor}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                    <button
                      onClick={onViewSchedule}
                      className="text-xs font-semibold text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                    >
                      Detail Zoom ID: <span className="font-mono">{sch.meetingId}</span>
                    </button>
                    <button
                      onClick={() => onOpenCourseLms(linkedProg)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Masuk Kelas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Pendaftaran & 8-Step Progress Stepper */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172026] dark:text-white">
              Status Pendaftaran & Progress Pelatihan Terkini
            </h2>
            {latestReg && (
              <p className="text-xs text-[#66757F] dark:text-slate-400 mt-0.5">
                Nomor Registrasi: <span className="font-mono font-semibold text-[#172026] dark:text-white">{latestReg.regNumber}</span> — {latestReg.programTitle}
              </p>
            )}
          </div>
          <button
            onClick={onViewRegistrations}
            className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] hover:underline cursor-pointer"
          >
            Detail Pendaftaran
          </button>
        </div>

        {latestReg ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {REGISTRATION_STEPS.map((stepLabel, idx) => {
                const stepNum = idx + 1;
                const isDone = stepNum <= latestReg.stepIndex;
                const isCurrent = stepNum === latestReg.stepIndex;
                return (
                  <div
                    key={stepLabel}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      isCurrent
                        ? 'border-[#F4C430] bg-[#F4C430]/10 dark:bg-[#F4C430]/10'
                        : isDone
                        ? 'border-[#087A4B]/40 bg-[#EAF7F0]/50 dark:bg-[#087A4B]/15'
                        : 'border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#66757F] dark:text-slate-400">
                        0{stepNum}
                      </span>
                      {isDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#172026] dark:text-white leading-snug">
                      {stepLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-xs text-[#66757F]">
            Belum ada riwayat pendaftaran aktif.
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   2. PROFILE VIEW (MODELED DIRECTLY ON KLC SCREENSHOT 4)
   ============================================================================ */
interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onShowToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(user);
  const [newCustomDocType, setNewCustomDocType] = useState('');
  const [showAddDocInput, setShowAddDocInput] = useState(false);

  // Sync draft whenever user prop changes
  React.useEffect(() => {
    setDraft(user);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateProfileData(draft);
    if (!check.isValid) {
      onShowToast(
        check.error ||
          'Mohon lengkapi seluruh formulir profil (tidak boleh hanya 1–5 karakter) dan unggah seluruh dokumen persyaratan wajib.'
      );
      return;
    }

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const submittedProfile: UserProfile = {
      ...draft,
      isVerified: false, // Setelah submit profil tidak langsung terverifikasi, tapi menunggu di verifikasi oleh admin
      verificationStatus: 'Menunggu Verifikasi Admin',
      profileSubmittedAt: nowStr,
    };

    setDraft(submittedProfile);
    onUpdateUser(submittedProfile);
    setIsEditing(false);
    onShowToast('Profil dan seluruh dokumen persyaratan berhasil disubmit! Menunggu verifikasi oleh Admin AKP2I.');
  };

  const handleDownloadDoc = (doc: DocumentItem) => {
    onShowToast(`Mengunduh dokumen ${doc.fileName} (${doc.fileSize})...`);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onShowToast('Ukuran foto maksimal adalah 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = { ...draft, avatarUrl: dataUrl };
        setDraft(updated);
        onUpdateUser(updated);
        onShowToast('Foto profil berhasil diperbarui.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadDoc = (
    docType: DocumentItem['type'],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onShowToast('Ukuran file dokumen maksimal adalah 5 MB.');
      return;
    }
    const sizeKb = Math.max(120, Math.round(file.size / 1024));
    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const existingIndex = draft.documents.findIndex((d) => d.type === docType);
    let updatedDocs: DocumentItem[];
    if (existingIndex >= 0) {
      updatedDocs = draft.documents.map((d, i) =>
        i === existingIndex
          ? {
              ...d,
              fileName: file.name,
              fileSize: `${sizeKb} KB`,
              uploadedAt: nowStr,
              status: 'Menunggu Verifikasi' as const,
              note: 'Menunggu Verifikasi Admin',
            }
          : d
      );
    } else {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        type: docType,
        fileName: file.name,
        fileSize: `${sizeKb} KB`,
        uploadedAt: nowStr,
        status: 'Menunggu Verifikasi',
        note: 'Menunggu Verifikasi Admin',
      };
      updatedDocs = [...draft.documents, newDoc];
    }

    const updated = { ...draft, documents: updatedDocs };
    setDraft(updated);
    onUpdateUser(updated);
    onShowToast(`Dokumen ${docType} (${file.name}) berhasil diunggah.`);
  };

  const handleDeleteDoc = (docId: string) => {
    const docToDelete = draft.documents.find((d) => d.id === docId);
    const updatedDocs = draft.documents.filter((d) => d.id !== docId);
    const updated = { ...draft, documents: updatedDocs };
    setDraft(updated);
    onUpdateUser(updated);
    onShowToast(`Dokumen ${docToDelete?.type || ''} berhasil dihapus.`);
  };

  const handleAddCustomDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomDocType.trim()) return;
    const typeName = newCustomDocType.trim();
    if (draft.documents.some((d) => d.type.toLowerCase() === typeName.toLowerCase())) {
      onShowToast(`Dokumen ${typeName} sudah ada dalam daftar.`);
      return;
    }
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      type: typeName,
      fileName: 'Belum ada file diunggah',
      fileSize: '0 KB',
      uploadedAt: 'Menunggu upload',
      status: 'Menunggu Verifikasi',
      note: 'Silakan klik unggah file',
    };
    const updated = { ...draft, documents: [...draft.documents, newDoc] };
    setDraft(updated);
    onUpdateUser(updated);
    setNewCustomDocType('');
    setShowAddDocInput(false);
    onShowToast(`Kategori dokumen ${typeName} berhasil ditambahkan. Silakan unggah filenya.`);
  };

  // Standard document types expected by AKP2I
  const standardTypes: DocumentItem['type'][] = ['KTP', 'NPWP', 'Pas Foto', 'Ijazah'];
  // Combine standard types with any custom uploaded documents
  const allDocCards = Array.from(
    new Set([...standardTypes, ...draft.documents.map((d) => d.type)])
  );

  return (
    <div className="space-y-6">
      {/* Header matching KLC Profile Saya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] tracking-wide uppercase">
            PESERTA
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
            Profil Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
            Lihat dan ubah seluruh data profil Anda, ganti foto profil, serta kelola unggahan dokumen persyaratan sertifikasi AKP2I secara mandiri.
          </p>
        </div>

        <button
          onClick={() => {
            setDraft(user);
            setIsEditing(!isEditing);
          }}
          className={`px-4 py-2.5 rounded-lg border text-xs font-bold inline-flex items-center gap-2 self-start cursor-pointer transition-colors shadow-xs ${
            isEditing
              ? 'bg-slate-100 dark:bg-slate-800 border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white'
              : 'bg-[#087A4B] hover:bg-[#045A38] text-white border-transparent'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Batal Edit Profil' : 'Edit Semua Data Profil'}</span>
        </button>
      </div>

      {/* VERIFICATION & COMPLETION STATUS BANNER */}
      {user.isVerified || user.verificationStatus === 'Terverifikasi' ? (
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-[#EAF7F0] dark:bg-emerald-950/30 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#087A4B] dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-xs text-[#087A4B] dark:text-emerald-300 uppercase tracking-wide">
              ✓ Profil Terverifikasi Resmi oleh Admin
            </span>
            <p className="text-xs text-[#087A4B]/90 dark:text-emerald-200/90 leading-relaxed">
              Seluruh data profil dan berkas persyaratan Anda telah disetujui oleh Administrator AKP2I{user.verifiedAt ? ` pada ${user.verifiedAt}` : ''}. Akun Anda telah aktif penuh untuk pendaftaran pelatihan dan sertifikasi.
            </p>
          </div>
        </div>
      ) : user.verificationStatus === 'Menunggu Verifikasi Admin' ? (
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 flex items-start gap-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                ⏳ Menunggu Verifikasi oleh Admin
              </span>
              {user.profileSubmittedAt && (
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  (Disubmit: {user.profileSubmittedAt})
                </span>
              )}
            </div>
            <p className="text-xs text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
              Data profil lengkap dan seluruh dokumen persyaratan Anda telah berhasil dikirim. Sesuai prosedur, data tidak langsung terverifikasi otomatis melainkan sedang dalam antrean verifikasi manual oleh Tim Administrator AKP2I.
            </p>
          </div>
        </div>
      ) : user.verificationStatus === 'Perlu Revisi' ? (
        <div className="p-4 rounded-xl border border-red-300 dark:border-red-700/60 bg-red-50 dark:bg-red-950/30 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-extrabold text-xs text-red-800 dark:text-red-300 uppercase tracking-wide">
              ⚠️ Profil Perlu Revisi / Perbaikan
            </span>
            <p className="text-xs text-red-800/90 dark:text-red-200/90 leading-relaxed">
              Administrator meminta perbaikan data profil atau berkas persyaratan Anda: <strong>{user.verificationNotes || 'Mohon periksa kembali kejelasan dokumen dan kelengkapan identitas Anda.'}</strong>
            </p>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>Revisi Profil Sekarang</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-950/30 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-extrabold text-xs text-rose-800 dark:text-rose-300 uppercase tracking-wide">
              ⚠️ Profil & Dokumen Wajib Dilengkapi
            </span>
            <p className="text-xs text-rose-800/90 dark:text-rose-200/90 leading-relaxed">
              Sebelum mendaftar pelatihan, peserta wajib melengkapi seluruh data profil (setiap form tidak boleh hanya 1–5 karakter) serta mengunggah seluruh dokumen persyaratan (KTP, NPWP, Pas Foto, dan Ijazah). Setelah disubmit, berkas akan menunggu verifikasi oleh Admin.
            </p>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-1 px-3 py-1.5 rounded-lg bg-[#087A4B] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>Lengkapi Profil & Dokumen Sekarang</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main 2-Column KLC Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Photo + Status + Documents */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Avatar & Account Verification with Instant Change Photo */}
          <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 text-center space-y-4">
            <div className="relative w-32 h-32 rounded-full mx-auto overflow-hidden border-3 border-[#087A4B] shadow-lg group">
              <ResilientImage
                src={draft.avatarUrl || user.avatarUrl}
                alt={draft.fullName || user.fullName}
                className="w-full h-full object-cover"
              />
              {/* Overlay button for instant photo upload */}
              <label
                className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2 text-center"
                title="Klik untuk ganti foto profil"
              >
                <Camera className="w-6 h-6 mb-1 text-[#F4C430]" />
                <span className="text-[10px] font-bold">Ganti Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#087A4B] bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold hover:bg-[#087A4B] hover:text-white transition-colors cursor-pointer shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Ganti Foto Profil</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#172026] dark:text-white">
                {draft.fullName || user.fullName}
              </h2>
              <p className="text-xs text-[#66757F] dark:text-slate-400 mt-0.5">
                {draft.email || user.email}
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#B45309] dark:text-[#F4C430] uppercase tracking-wider">
                {user.role}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold">
                {user.isVerified || user.verificationStatus === 'Terverifikasi' ? (
                  <span className="px-3 py-1 rounded-full bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] border border-[#087A4B]/30 flex items-center gap-1.5 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>✓ PROFIL TERVERIFIKASI ADMIN</span>
                  </span>
                ) : user.verificationStatus === 'Menunggu Verifikasi Admin' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>⏳ MENUNGGU VERIFIKASI ADMIN</span>
                  </span>
                ) : user.verificationStatus === 'Perlu Revisi' ? (
                  <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 flex items-center gap-1.5 shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>⚠️ PERLU REVISI PROFIL</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-700 flex items-center gap-1.5 shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>⚠️ PROFIL BELUM LENGKAP</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Status Dokumen Persyaratan & Direct Upload */}
          <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#172026] dark:text-white">
                  Dokumen Persyaratan
                </h3>
                <p className="text-[11px] text-[#66757F] dark:text-slate-400">
                  Unggah atau perbarui berkas kapan saja
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDocInput(!showAddDocInput)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[#087A4B] dark:text-[#34D399] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                title="Tambah Kategori Dokumen"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Optional Input to add custom doc type */}
            {showAddDocInput && (
              <form
                onSubmit={handleAddCustomDoc}
                className="p-3 bg-[#F6F8F7] dark:bg-[#0E1518] border-b border-[#D9E2DE] dark:border-[#243239] flex gap-2 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Nama dokumen baru (cth: Sertifikat Brevet)"
                  value={newCustomDocType}
                  onChange={(e) => setNewCustomDocType(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#087A4B] text-white font-bold cursor-pointer"
                >
                  Tambah
                </button>
              </form>
            )}

            <div className="p-4 space-y-3">
              {allDocCards.map((docType) => {
                const doc = draft.documents.find((d) => d.type === docType);
                const isUploaded = Boolean(doc && doc.fileName && doc.fileName !== 'Belum ada file diunggah');

                return (
                  <div
                    key={docType}
                    className="p-3.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-[#087A4B] dark:text-[#34D399] mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-bold text-[#172026] dark:text-white">
                              Dokumen {docType}
                            </p>
                            {REQUIRED_PROFILE_DOC_TYPES.includes(docType as any) && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                                * Wajib
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                isUploaded
                                  ? user.isVerified || user.verificationStatus === 'Terverifikasi'
                                    ? 'bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]'
                                    : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                                  : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {isUploaded
                                ? user.isVerified || user.verificationStatus === 'Terverifikasi'
                                  ? '✓ Terverifikasi'
                                  : '⏳ Menunggu Verifikasi'
                                : '⚠️ Belum Diunggah'}
                            </span>
                          </div>

                          {isUploaded && doc ? (
                            <>
                              <p className="text-[11px] font-mono text-[#66757F] truncate max-w-[200px] mt-0.5">
                                {doc.fileName}
                              </p>
                              <p className="text-[10px] text-[#66757F] mt-0.5">
                                {doc.fileSize} · Diunggah: {doc.uploadedAt}
                              </p>
                            </>
                          ) : (
                            <p className="text-[10px] text-[#66757F] mt-0.5">
                              Format PDF / JPG / PNG (Maks. 5 MB)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isUploaded && doc && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDownloadDoc(doc)}
                              className="p-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                              title="Unduh Dokumen"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] hover:border-red-500 text-slate-400 hover:text-red-500 cursor-pointer"
                              title="Hapus Dokumen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Upload / Ganti file button */}
                    <label className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg border border-dashed border-[#087A4B]/60 hover:bg-[#EAF7F0] dark:hover:bg-[#087A4B]/10 text-[11px] font-bold text-[#087A4B] dark:text-[#34D399] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                      <span>{isUploaded ? 'Ganti File Dokumen' : 'Pilih & Upload File Ini'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleUploadDoc(docType, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Full Editable Profile or Rich Details Display */}
        <div className="lg:col-span-8 space-y-6">
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-6 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                <div>
                  <h3 className="text-base font-extrabold text-[#172026] dark:text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#087A4B]" />
                    <span>Edit Semua Data Profil & Dokumen</span>
                  </h3>
                  <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-0.5">
                    Perbarui informasi identitas pribadi, kontak domisili, pendidikan, pekerjaan, serta tautan foto.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#EAF7F0] text-[#087A4B]">
                  Mode Edit Aktif
                </span>
              </div>

              {/* SECTION 1: FOTO PROFIL */}
              <div className="p-4 rounded-xl bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] space-y-3">
                <span className="font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider block">
                  1. FOTO PROFIL & AVATAR
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#087A4B] shadow-md shrink-0">
                    <ResilientImage
                      src={draft.avatarUrl}
                      alt={draft.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File Foto (JPG/PNG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                      >
                        Gunakan Foto Formal Contoh
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#66757F] mb-1">
                        Atau Masukkan URL Gambar Foto Langsung
                      </label>
                      <input
                        type="url"
                        value={draft.avatarUrl}
                        onChange={(e) => setDraft({ ...draft, avatarUrl: e.target.value })}
                        placeholder="https://domain.com/foto-anda.jpg"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: INFORMASI IDENTITAS PRIBADI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider block">
                    2. INFORMASI IDENTITAS PRIBADI (KTP & DATA DIRI)
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700/50">
                    * Wajib diisi (tidak boleh hanya 1–5 karakter)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      placeholder="Minimal 6 karakter"
                      value={draft.fullName}
                      onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter (tidak boleh 1–5 karakter)</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      NIK (16 Digit KTP) *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={16}
                      maxLength={16}
                      placeholder="16 digit angka NIK KTP"
                      value={draft.nik}
                      onChange={(e) => setDraft({ ...draft, nik: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Wajib 16 digit angka Nomor Induk Kependudukan</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      NPWP (15/16 Digit) *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={15}
                      maxLength={20}
                      placeholder="Minimal 15 digit angka NPWP"
                      value={draft.npwp}
                      onChange={(e) => setDraft({ ...draft, npwp: e.target.value })}
                      className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 15 karakter digit NPWP</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={draft.gender}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          gender: e.target.value as 'Laki-laki' | 'Perempuan',
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Wajib pilih jenis kelamin</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      placeholder="Contoh: Jakarta Pusat"
                      value={draft.birthPlace}
                      onChange={(e) => setDraft({ ...draft, birthPlace: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      placeholder="Contoh: 18 Mei 1994"
                      value={draft.birthDate}
                      onChange={(e) => setDraft({ ...draft, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter (Contoh: 18 Mei 1994)</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: KONTAK & DOMISILI */}
              <div className="space-y-3 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <span className="font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider block">
                  3. KONTAK & ALAMAT DOMISILI
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      minLength={6}
                      value={draft.email}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter format email aktif</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Nomor Telepon / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={10}
                      placeholder="Contoh: 081234567890"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 10 digit nomor aktif</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Provinsi *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={draft.province}
                      onChange={(e) => setDraft({ ...draft, province: e.target.value })}
                      placeholder="Contoh: DKI Jakarta"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={draft.city}
                      onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                      placeholder="Contoh: Jakarta Selatan"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#66757F] mb-1">
                      Alamat Lengkap Sesuai KTP *
                    </label>
                    <textarea
                      rows={2}
                      required
                      minLength={6}
                      placeholder="Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan..."
                      value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter alamat lengkap</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: RIWAYAT PENDIDIKAN */}
              <div className="space-y-3 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <span className="font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider block">
                  4. RIWAYAT PENDIDIKAN
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Pendidikan Terakhir *
                    </label>
                    <select
                      value={draft.educationLevel}
                      onChange={(e) => setDraft({ ...draft, educationLevel: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    >
                      <option value="S1 - Strata 1">S1 - Strata 1</option>
                      <option value="S2 - Magister">S2 - Magister</option>
                      <option value="S3 - Doktor">S3 - Doktor</option>
                      <option value="D4 - Diploma 4">D4 - Diploma 4</option>
                      <option value="D3 - Diploma 3">D3 - Diploma 3</option>
                      <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Institusi / Universitas *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={draft.institution}
                      onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
                      placeholder="Nama Kampus / Sekolah"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Fakultas / Program Studi *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={draft.major}
                      onChange={(e) => setDraft({ ...draft, major: e.target.value })}
                      placeholder="Contoh: Akuntansi Perpajakan"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: PEKERJAAN & JABATAN */}
              <div className="space-y-3 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <span className="font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider block">
                  5. PEKERJAAN & JABATAN PROFESIONAL
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Bidang Pekerjaan / Profesi *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={draft.occupation}
                      onChange={(e) => setDraft({ ...draft, occupation: e.target.value })}
                      placeholder="Contoh: Konsultan Pajak / Akuntan"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Jabatan / Posisi Kerja *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={draft.position}
                      onChange={(e) => setDraft({ ...draft, position: e.target.value })}
                      placeholder="Contoh: Senior Tax Specialist"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                    <span className="text-[10px] text-[#66757F] block mt-0.5">Minimal 6 karakter</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Profil untuk Verifikasi Admin</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Identitas Diri & Kontak Card (KLC Screenshot 4) */}
              <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#087A4B] dark:text-[#38BDF8]" />
                    <h3 className="text-xs font-bold text-[#172026] dark:text-white">
                      Identitas Diri & Kontak
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-[#087A4B] dark:text-[#34D399] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Data</span>
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Sub-column: INFORMASI PRIBADI */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b-2 border-[#087A4B] dark:border-[#38BDF8]">
                      <span className="text-xs font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider">
                        INFORMASI PRIBADI
                      </span>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        NAMA LENGKAP
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.fullName}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">NIK (16 DIGIT)</span>
                      <strong className="text-sm font-mono text-[#172026] dark:text-white mt-0.5 block tabular-nums">
                        {user.nik}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">NPWP</span>
                      <strong className="text-sm font-mono text-[#172026] dark:text-white mt-0.5 block tabular-nums">
                        {user.npwp}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        JENIS KELAMIN
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.gender}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        TEMPAT LAHIR
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.birthPlace || '-'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        TANGGAL LAHIR
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.birthDate || '-'}
                      </strong>
                    </div>
                  </div>

                  {/* Right Sub-column: KONTAK & ALAMAT */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b-2 border-[#087A4B] dark:border-[#38BDF8]">
                      <span className="text-xs font-extrabold text-[#087A4B] dark:text-[#38BDF8] tracking-wider">
                        KONTAK & DOMISILI
                      </span>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">EMAIL LOGIN</span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.email}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        NOMOR TELEPON / WHATSAPP
                      </span>
                      <strong className="text-sm font-mono text-[#172026] dark:text-white mt-0.5 block tabular-nums">
                        {user.phone}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        PROVINSI & KOTA
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.city ? `${user.city}, ${user.province}` : user.province || '-'}
                      </strong>
                    </div>

                    <div className="pb-3 border-b border-[#D9E2DE] dark:border-[#243239]">
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        ALAMAT LENGKAP KTP
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block leading-relaxed">
                        {user.address}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#66757F] block">
                        PEKERJAAN & JABATAN
                      </span>
                      <strong className="text-sm text-[#172026] dark:text-white mt-0.5 block">
                        {user.occupation || '-'} {user.position ? `— ${user.position}` : ''}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riwayat Pendidikan Card (Matching KLC Screenshot 4) */}
              <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#087A4B] dark:text-[#38BDF8]" />
                    <h3 className="text-xs font-bold text-[#172026] dark:text-white">
                      Riwayat Pendidikan & Institusi
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-[#087A4B] dark:text-[#34D399] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Ubah Pendidikan</span>
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="text-[11px] font-bold text-[#66757F] block">
                      PENDIDIKAN TERAKHIR
                    </span>
                    <strong className="text-sm text-[#172026] dark:text-white mt-1 block">
                      {user.educationLevel || '-'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#66757F] block">
                      INSTITUSI PENDIDIKAN TERAKHIR
                    </span>
                    <strong className="text-sm text-[#172026] dark:text-white mt-1 block">
                      {user.institution || '-'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#66757F] block">
                      FAKULTAS / JURUSAN
                    </span>
                    <strong className="text-sm text-[#172026] dark:text-white mt-1 block">
                      {user.major || '-'}
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. PENDAFTARAN SAYA & DETAIL PENDAFTARAN (MODELED ON KLC SCREENSHOT 2)
   ============================================================================ */
interface MyRegistrationsViewProps {
  registrations: Registration[];
  user: UserProfile;
  onUploadProof: (regId: string, fileName: string) => void;
  onExploreAgenda: () => void;
}

export const MyRegistrationsView: React.FC<MyRegistrationsViewProps> = ({
  registrations,
  user,
  onUploadProof,
  onExploreAgenda,
}) => {
  const userRegs = registrations.filter((r) => r.participantId === user.id);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] tracking-wide uppercase">
            PESERTA
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
            Pendaftaran Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
            Kelola dan pantau seluruh pendaftaran pelatihan serta status verifikasi pembayaran Anda.
          </p>
        </div>
        <button
          onClick={onExploreAgenda}
          className="px-4 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold self-start cursor-pointer"
        >
          + Daftar Program Lain
        </button>
      </div>

      {/* Info Box like KLC Screenshot 2 */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#172026] dark:text-white">
            Pendaftaran Aktif & Riwayat Program Anda
          </h2>
          <p className="text-xs text-[#66757F] dark:text-slate-400 mt-0.5">
            Pilih kartu pendaftaran di bawah untuk melihat rincian bukti bayar, dokumen, dan timeline verifikasi 8 tahap.
          </p>
        </div>
        <div className="text-xs font-mono text-[#66757F] dark:text-slate-400">
          Total: {userRegs.length} Pendaftaran
        </div>
      </div>

      {/* Registration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {userRegs.map((reg) => (
          <div
            key={reg.id}
            className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 flex flex-col justify-between gap-5 hover:border-[#087A4B] transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-[#66757F] dark:text-slate-400">
                  {reg.regNumber}
                </span>
                <div className="flex items-center gap-2">
                  <StatusLabel status={reg.status} />
                </div>
              </div>

              <h3 className="text-base font-extrabold text-[#172026] dark:text-white leading-snug">
                {reg.programTitle}
              </h3>

              <div className="space-y-1 text-xs text-[#66757F] dark:text-slate-400">
                <p>Dikirim: {reg.registeredAt}</p>
                <p>Jadwal Pelatihan: {reg.trainingDateText}</p>
                <p>Metode Pembayaran: {reg.paymentMethod}</p>
              </div>

              {reg.paymentRejectionReason && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
                  <strong>Alasan Penolakan Admin:</strong> {reg.paymentRejectionReason}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#66757F] block">Nominal Biaya</span>
                <span className="text-sm font-mono font-extrabold text-[#087A4B] dark:text-[#F4C430] tabular-nums">
                  {formatRupiah(reg.amount)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {(reg.paymentStatus === 'Belum Dibayar' ||
                  reg.paymentStatus === 'Pembayaran Ditolak') && (
                  <label className="px-3.5 py-2 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Bukti Bayar</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onUploadProof(reg.id, f.name);
                      }}
                    />
                  </label>
                )}
                <button
                  onClick={() => setSelectedReg(reg)}
                  className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 bg-[#0E1518] text-white flex items-center justify-between border-b border-[#243239]">
              <div>
                <span className="text-xs font-mono text-[#F4C430]">
                  Detail Pendaftaran · {selectedReg.regNumber}
                </span>
                <h3 className="text-base font-bold text-white">{selectedReg.programTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                <div>
                  <span className="text-[#66757F] block">Nama Peserta</span>
                  <strong className="text-[#172026] dark:text-white">
                    {selectedReg.participantName}
                  </strong>
                </div>
                <div>
                  <span className="text-[#66757F] block">Tanggal Daftar</span>
                  <strong className="text-[#172026] dark:text-white">
                    {selectedReg.registeredAt}
                  </strong>
                </div>
                <div>
                  <span className="text-[#66757F] block">Jadwal Pelatihan</span>
                  <strong className="text-[#172026] dark:text-white">
                    {selectedReg.trainingDateText}
                  </strong>
                </div>
                <div>
                  <span className="text-[#66757F] block">Metode Pembayaran</span>
                  <strong className="text-[#172026] dark:text-white">
                    {selectedReg.paymentMethod}
                  </strong>
                </div>
                <div>
                  <span className="text-[#66757F] block">Total Biaya</span>
                  <strong className="font-mono text-[#087A4B] dark:text-[#F4C430]">
                    {formatRupiah(selectedReg.amount)}
                  </strong>
                </div>
                <div>
                  <span className="text-[#66757F] block">Status Pembayaran</span>
                  <StatusLabel status={selectedReg.paymentStatus} />
                </div>
              </div>

              {/* Bukti Pembayaran Info */}
              <div className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#172026] dark:text-white">
                    File Bukti Pembayaran
                  </h4>
                  <p className="text-xs font-mono text-[#66757F] mt-0.5">
                    {selectedReg.paymentProofFileName
                      ? `${selectedReg.paymentProofFileName} (${selectedReg.paymentProofSize || '500 KB'}) — Diunggah ${selectedReg.paymentProofUploadedAt}`
                      : 'Belum ada bukti pembayaran yang diunggah'}
                  </p>
                </div>
                <label className="px-3 py-1.5 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer">
                  <span>Unggah Ulang Bukti</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        onUploadProof(selectedReg.id, f.name);
                        setSelectedReg(null);
                      }
                    }}
                  />
                </label>
              </div>

              {/* 8-Step Timeline */}
              <div>
                <h4 className="text-xs font-bold text-[#172026] dark:text-white mb-3">
                  Timeline Progress Pendaftaran (8 Tahap)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {REGISTRATION_STEPS.map((st, idx) => {
                    const done = idx + 1 <= selectedReg.stepIndex;
                    return (
                      <div
                        key={st}
                        className={`p-3 rounded-lg border text-xs ${
                          done
                            ? 'border-[#087A4B] bg-[#EAF7F0]/50 dark:bg-[#087A4B]/20 text-[#172026] dark:text-white font-bold'
                            : 'border-[#D9E2DE] dark:border-[#243239] text-[#66757F]'
                        }`}
                      >
                        <span className="font-mono text-[10px] block">Tahap 0{idx + 1}</span>
                        {st}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   4. PELATIHAN SAYA & INTERACTIVE LMS LEARNING PAGE + EXAM ENGINE
   ============================================================================ */
interface MyCoursesAndLmsViewProps {
  programs: Program[];
  registrations: Registration[];
  activeCourse: Program | null;
  onSelectCourse: (program: Program | null) => void;
  onCompleteExam: (program: Program, score: number) => void;
  onShowToast: (msg: string) => void;
}

export const MyCoursesAndLmsView: React.FC<MyCoursesAndLmsViewProps> = ({
  programs,
  registrations,
  activeCourse,
  onSelectCourse,
  onCompleteExam,
  onShowToast,
}) => {
  const [lmsTab, setLmsTab] = useState<
    'materi' | 'ujian' | 'tugas' | 'diskusi' | 'evaluasi'
  >('materi');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([
    'les-ukp-1',
    'les-ukp-2',
    'les-uskpa-1',
    'les-ctx-1',
  ]);

  // Interactive Quiz / Exam State
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Discussion state
  const [discussions, setDiscussions] = useState([
    {
      id: 'd-1',
      author: 'R Ahmad Faizal Kamal',
      role: 'Peserta',
      time: 'Kemarin, 20:15 WIB',
      text: 'Izin bertanya Pak Doktor, untuk pemotongan PPh Pasal 21 TER bagi pegawai tidak tetap yang dibayar bulanan apakah tetap menggunakan tabel TER A/B/C?',
      reply:
        'Dr. Bambang Praktikno, BKP: Betul sekali Pak Ahmad. Sesuai PP 58 Tahun 2023 dan PMK 168/2023, atas penghasilan pegawai tidak tetap yang diterima secara bulanan dihitung menggunakan tarif efektif bulanan (TER A/B/C) sesuai status PTKP-nya.',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  if (!activeCourse) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] uppercase">
            PESERTA · LEARNING MANAGEMENT SYSTEM
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
            Pelatihan Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
            Akses modul pembelajaran video, unduh PDF materi perpajakan, kerjakan tugas studi kasus, dan ikuti ujian CBT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.slice(0, 4).map((prog) => {
            const reg = registrations.find((r) => r.programId === prog.id);
            const progressPct =
              prog.id === 'prog-brevet-ab-coretax'
                ? 100
                : prog.id === 'prog-bimbel-uskp-a'
                ? 75
                : 50;

            return (
              <div
                key={prog.id}
                className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/9 bg-[#0E1518] relative">
                    <ResilientImage
                      src={prog.bannerUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#087A4B] dark:text-[#34D399]">
                        {prog.category}
                      </span>
                      <StatusLabel status={reg?.status || 'Terdaftar'} />
                    </div>
                    <h3 className="text-base font-bold text-[#172026] dark:text-white line-clamp-2">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-[#66757F] dark:text-slate-400">
                      Instruktur: {prog.instructorName}
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#66757F]">Progress Materi</span>
                        <span className="font-mono text-[#087A4B] dark:text-[#34D399] tabular-nums">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-[#087A4B] transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7]/50 dark:bg-[#0E1518]/50">
                  <button
                    onClick={() => {
                      setActiveLessonIndex(0);
                      setLmsTab('materi');
                      onSelectCourse(prog);
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Masuk Pelatihan (LMS)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE LMS COURSE VIEW
  const lessons =
    activeCourse.lessons.length > 0
      ? activeCourse.lessons
      : programs[0].lessons;
  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const questions =
    activeCourse.examQuestions.length > 0
      ? activeCourse.examQuestions
      : programs[0].examQuestions;

  const progressPercentage = Math.round(
    (lessons.filter((l) => completedLessonIds.includes(l.id)).length / lessons.length) * 100
  );

  const handleSubmitExam = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctIndex) correct += 1;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setExamSubmitted(true);
    onCompleteExam(activeCourse, finalScore);
  };

  return (
    <div className="space-y-6">
      {/* Top LMS Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9E2DE] dark:border-[#243239]">
        <div>
          <button
            onClick={() => onSelectCourse(null)}
            className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] hover:underline mb-1 inline-flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Pelatihan Saya</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172026] dark:text-white">
            {activeCourse.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-[#66757F] block">Penyelesaian Kelas</span>
            <span className="text-sm font-mono font-extrabold text-[#087A4B] dark:text-[#34D399] tabular-nums">
              {progressPercentage}% Selesai
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LMS Left Curriculum Sidebar */}
        <div className="lg:col-span-4 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
          <div className="p-4 bg-[#0E1518] text-white border-b border-[#243239]">
            <span className="text-xs font-bold text-[#F4C430] uppercase">
              Navigasi Pembelajaran LMS
            </span>
          </div>

          <div className="p-3 space-y-1 border-b border-[#D9E2DE] dark:border-[#243239]">
            {[
              { id: 'materi', label: 'Daftar Modul & Materi', icon: Video },
              { id: 'tugas', label: 'Tugas Studi Kasus SPT', icon: FileText },
              { id: 'ujian', label: 'Kuis & Ujian Akhir (CBT)', icon: Award },
              { id: 'diskusi', label: 'Forum Diskusi Kelas', icon: MessageSquare },
              { id: 'evaluasi', label: 'Evaluasi & Sertifikat', icon: CheckCircle2 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setLmsTab(item.id as any)}
                className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  lmsTab === item.id
                    ? 'bg-[#087A4B] text-white'
                    : 'text-[#172026] dark:text-slate-300 hover:bg-[#F6F8F7] dark:hover:bg-[#0E1518]'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {lmsTab === 'materi' && (
            <div className="p-3 space-y-2">
              <div className="px-2 py-1 text-[11px] font-bold text-[#66757F] uppercase">
                Modul Kurikulum ({lessons.length} Sesi)
              </div>
              {lessons.map((les, idx) => {
                const isDone = completedLessonIds.includes(les.id);
                const isActive = idx === activeLessonIndex;
                return (
                  <button
                    key={les.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#087A4B] bg-[#EAF7F0]/60 dark:bg-[#087A4B]/20'
                        : 'border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#66757F] mb-1">
                      <span className="font-mono font-bold">MODUL 0{les.moduleNumber}</span>
                      <span>{isDone ? '✓ Selesai' : les.duration}</span>
                    </div>
                    <div className="text-xs font-bold text-[#172026] dark:text-white leading-snug">
                      {les.title}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* LMS Right Main Content Viewport */}
        <div className="lg:col-span-8 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-6">
          {lmsTab === 'materi' && (
            <div className="space-y-6">
              {/* Simulated HD Video / Slide Player */}
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-[#0E1518] border border-[#243239] relative flex flex-col justify-between p-6 text-white">
                <ResilientImage
                  src={activeCourse.bannerUrl}
                  alt={currentLesson.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F4C430]">
                    MODUL 0{currentLesson.moduleNumber} · {currentLesson.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono bg-black/60 px-2.5 py-1 rounded">
                    Durasi: {currentLesson.videoDuration || currentLesson.duration}
                  </span>
                </div>

                <div className="relative z-10 my-auto text-center max-w-xl mx-auto space-y-3">
                  <button
                    onClick={() =>
                      onShowToast(`Memutar video pembelajaran: ${currentLesson.title}`)
                    }
                    className="w-16 h-16 rounded-full bg-[#087A4B] hover:bg-[#0B8F5A] text-white inline-flex items-center justify-center shadow-xl border-2 border-[#F4C430] transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </button>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {currentLesson.title}
                  </h2>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-white/15">
                  <span>Instruktur: {activeCourse.instructorName}</span>
                  <span>Kualitas: 1080p Full HD · Audio Jernih</span>
                </div>
              </div>

              {/* Lesson Summary & Downloadable PDF Handout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                <div>
                  <h4 className="text-xs font-bold text-[#172026] dark:text-white">
                    Handout & Kertas Kerja Modul: {currentLesson.pdfFileName || 'Modul_Pelatihan_AKP2I.pdf'}
                  </h4>
                  <p className="text-xs text-[#66757F] mt-0.5">
                    Unduh slide presentasi PDF dan kertas kerja simulasi Excel untuk latihan mandiri.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      onShowToast(`Mengunduh materi ${currentLesson.pdfFileName || 'Modul_AKP2I.pdf'}...`)
                    }
                    className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#087A4B]" />
                    <span>Unduh PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!completedLessonIds.includes(currentLesson.id)) {
                        setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
                        onShowToast('Modul ditandai selesai!');
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#087A4B] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {completedLessonIds.includes(currentLesson.id)
                        ? 'Sudah Selesai'
                        : 'Tandai Selesai'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#172026] dark:text-white">
                  Ringkasan Pokok Bahasan
                </h3>
                <p className="text-sm text-[#66757F] dark:text-slate-300 leading-relaxed">
                  {currentLesson.summary}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#087A4B] dark:text-[#34D399] font-semibold">
                  {currentLesson.keyTopics.map((topic, i) => (
                    <span key={i}>
                      ✓ {topic}
                      {i < currentLesson.keyTopics.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prev / Next Navigation */}
              <div className="pt-4 border-t border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Modul Sebelumnya</span>
                </button>
                <button
                  onClick={() => {
                    if (activeLessonIndex < lessons.length - 1) {
                      setActiveLessonIndex((i) => i + 1);
                    } else {
                      setLmsTab('ujian');
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-[#087A4B] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {activeLessonIndex < lessons.length - 1
                      ? 'Modul Selanjutnya'
                      : 'Lanjut ke Ujian Akhir CBT'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* INTERACTIVE CBT EXAM TAB */}
          {lmsTab === 'ujian' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#0E1518] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#F4C430]">
                    UJIAN KOMPETENSI BERBASIS KOMPUTER (CBT AKP2I)
                  </span>
                  <h3 className="text-base font-bold">
                    Evaluasi Akhir: {activeCourse.shortTitle}
                  </h3>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Batas Lulus (Passing Grade): 70 / 100
                </div>
              </div>

              <div className="space-y-5">
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] space-y-3"
                  >
                    <div className="text-xs font-bold text-[#087A4B] dark:text-[#34D399]">
                      Soal {qIdx + 1} dari {questions.length} · Topik: {q.moduleTag}
                    </div>
                    <p className="text-sm font-bold text-[#172026] dark:text-white leading-relaxed">
                      {q.question}
                    </p>
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = examAnswers[q.id] === oIdx;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-[#087A4B] bg-white dark:bg-[#151F24] font-bold text-[#172026] dark:text-white'
                                : 'border-[#D9E2DE] dark:border-[#243239] text-[#66757F] dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={isSelected}
                              onChange={() =>
                                setExamAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                              }
                              className="mt-0.5 accent-[#087A4B]"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    {examSubmitted && (
                      <div className="p-3 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-xs text-[#045A38] dark:text-[#34D399]">
                        <strong>Pembahasan Resmi AKP2I:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-3 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold cursor-pointer"
                >
                  Kumpulkan Jawaban Ujian & Lihat Nilai Akhir
                </button>
              </div>
            </div>
          )}

          {lmsTab === 'tugas' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                Tugas Studi Kasus Praktik Perpajakan
              </h3>
              <p className="text-xs text-[#66757F] dark:text-slate-300 leading-relaxed">
                Susunlah Kertas Kerja Rekonsiliasi Fiskal dan SPT Tahunan berdasarkan studi kasus PT Nusantara Niaga 2026, kemudian unggah file kertas kerja Anda di bawah ini.
              </p>
              <label className="p-6 rounded-lg border-2 border-dashed border-[#087A4B]/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#EAF7F0]/30">
                <Upload className="w-6 h-6 text-[#087A4B]" />
                <span className="text-xs font-bold text-[#087A4B] dark:text-[#34D399]">
                  Klik untuk Mengunggah Kertas Kerja Tugas (Excel / PDF)
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onShowToast(`Tugas studi kasus "${f.name}" berhasil dikumpulkan!`);
                  }}
                />
              </label>
            </div>
          )}

          {lmsTab === 'diskusi' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                Forum Diskusi Peserta & Instruktur BKP
              </h3>
              <div className="space-y-3">
                {discussions.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] space-y-2"
                  >
                    <div className="flex justify-between text-xs">
                      <strong className="text-[#172026] dark:text-white">{d.author}</strong>
                      <span className="text-[#66757F]">{d.time}</span>
                    </div>
                    <p className="text-xs text-[#172026] dark:text-slate-300">{d.text}</p>
                    {d.reply && (
                      <div className="p-3 rounded bg-white dark:bg-[#151F24] border-l-2 border-[#087A4B] text-xs text-[#087A4B] dark:text-[#34D399]">
                        {d.reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newComment.trim()) return;
                  setDiscussions([
                    ...discussions,
                    {
                      id: `d-${Date.now()}`,
                      author: 'R Ahmad Faizal Kamal',
                      role: 'Peserta',
                      time: 'Baru saja',
                      text: newComment,
                      reply: 'Tim Instruktur AKP2I telah menerima pertanyaan Anda.',
                    },
                  ]);
                  setNewComment('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis pertanyaan kasus pajak kepada instruktur..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer"
                >
                  Kirim Pertanyaan
                </button>
              </form>
            </div>
          )}

          {lmsTab === 'evaluasi' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                Evaluasi Penyelenggaraan & Klaim Sertifikat
              </h3>
              <p className="text-xs text-[#66757F] dark:text-slate-300">
                Terima kasih telah mengikuti program {activeCourse.title}. Sertifikat otomatis diterbitkan setelah Anda menyelesaikan Ujian Akhir CBT dengan nilai minimal 70.
              </p>
              <button
                onClick={() => setLmsTab('ujian')}
                className="px-4 py-2.5 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer"
              >
                Buka Halaman Ujian Akhir CBT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. JADWAL PELATIHAN & ZOOM CALENDAR VIEW (MONTH / WEEK / LIST)
   ============================================================================ */
interface ScheduleCalendarViewProps {
  schedules: ScheduleAgenda[];
  onShowToast: (msg: string) => void;
}

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  schedules,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'week' | 'month'>('list');
  const [activeZoomModal, setActiveZoomModal] = useState<ScheduleAgenda | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] uppercase">
            PESERTA · JADWAL INTERAKTIF
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
            Jadwal Zoom
          </h1>
          <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
            Pantau jadwal tatap muka daring (Zoom Video Conference) dan ujian CBT sesuai kalender akademik AKP2I.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          {/* Segmented Control: List / Week / Month */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]">
            {[
              { id: 'list', label: 'Tampilan List' },
              { id: 'week', label: 'Mingguan (Week)' },
              { id: 'month', label: 'Bulanan (Month)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === m.id
                    ? 'bg-[#087A4B] text-white'
                    : 'text-[#66757F] hover:text-[#172026] dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'month' ? (
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172026] dark:text-white">
              Oktober 2026 — Kalender Akademik AKP2I
            </h3>
            <span className="text-xs text-[#66757F]">Zona Waktu: WIB (UTC+7)</span>
          </div>
          {schedules.length === 0 && (
            <div className="p-3 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-xs text-[#66757F] text-center">
              Seluruh jadwal sesi kelas Zoom telah di-reset (0 jadwal aktif pada kalender).
            </div>
          )}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#66757F] pb-2 border-b border-[#D9E2DE] dark:border-[#243239]">
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
            <div>Min</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
              const daySchedules = schedules.filter((s) => s.date === dateStr);
              return (
                <div
                  key={day}
                  className={`min-h-[84px] p-2 rounded-lg border text-left ${
                    daySchedules.length > 0
                      ? 'border-[#087A4B] bg-[#EAF7F0]/50 dark:bg-[#087A4B]/20'
                      : 'border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7]/50 dark:bg-[#0E1518]/50'
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{day}</span>
                  {daySchedules.map((ds) => (
                    <button
                      key={ds.id}
                      onClick={() => setActiveZoomModal(ds)}
                      className="mt-1 block w-full text-left text-[10px] font-bold text-[#087A4B] dark:text-[#F4C430] truncate cursor-pointer hover:underline"
                    >
                      ● {ds.sessionTitle}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-[#087A4B] opacity-40" />
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                Belum Ada Jadwal Zoom
              </h3>
              <p className="text-xs text-[#66757F] dark:text-slate-400 max-w-md mx-auto">
                Jadwal sesi kelas tatap muka daring dan ujian CBT akan diumumkan oleh Sekretariat Diklat DPP AKP2I.
              </p>
            </div>
          ) : (
            schedules.map((sch) => (
              <div
                key={sch.id}
                className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#087A4B] dark:text-[#34D399]">
                      {sch.programTitle}
                    </span>
                    <span>·</span>
                    <StatusLabel status={sch.status} />
                  </div>
                  <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                    {sch.sessionTitle}
                  </h3>
                  <p className="text-xs text-[#66757F] dark:text-slate-300 tabular-nums">
                    {sch.displayDate} · Pukul {sch.time} · Instruktur: {sch.instructor}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveZoomModal(sch)}
                    className="px-4 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Video className="w-4 h-4" />
                    <span>Masuk Zoom Live</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Zoom Live Classroom Credentials Modal */}
      {activeZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0E1518] text-white flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4C430]">
                AKSES KELAS VIRTUAL ZOOM AKP2I
              </span>
              <button
                onClick={() => setActiveZoomModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                {activeZoomModal.sessionTitle}
              </h3>
              <div className="p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#66757F]">Jadwal:</span>
                  <strong className="font-mono">{activeZoomModal.displayDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66757F]">Meeting ID:</span>
                  <strong className="font-mono text-[#087A4B] dark:text-[#F4C430]">
                    {activeZoomModal.meetingId}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66757F]">Passcode:</span>
                  <strong className="font-mono">{activeZoomModal.passcode}</strong>
                </div>
              </div>
              <button
                onClick={() => {
                  onShowToast(
                    `Kehadiran tercatat! Menghubungkan ke ruang Zoom (${activeZoomModal.meetingId})...`
                  );
                  setActiveZoomModal(null);
                }}
                className="w-full py-2.5 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer"
              >
                Konfirmasi Kehadiran & Luncurkan Zoom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   6. HASIL UJIAN VIEW (MODELED ON KLC SCREENSHOT 1)
   ============================================================================ */
interface ExamResultsViewProps {
  examResults: ExamResult[];
  certificates: Certificate[];
  onViewCertificate: (cert: Certificate) => void;
  onBackDashboard: () => void;
  onDeleteMultipleExamResults?: (ids: string[]) => void;
}

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  examResults,
  certificates,
  onViewCertificate,
  onBackDashboard,
  onDeleteMultipleExamResults,
}) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(examResults[0]?.id || null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = examResults.filter((r) =>
    r.programTitle.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected =
    filtered.length > 0 && selectedIds.length === filtered.length;

  return (
    <div className="space-y-6">
      {/* Header matching KLC Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] tracking-wide uppercase">
            PESERTA
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
            Hasil Ujian
          </h1>
          <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
            Hasil ujian per kegiatan — centang kotak untuk menghapus data sekaligus, klik baris untuk melihat nilai tiap modul, dan unduh sertifikat.
          </p>
        </div>

        <button
          onClick={onBackDashboard}
          className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] text-xs font-bold text-[#172026] dark:text-white self-start cursor-pointer"
        >
          ← Dashboard
        </button>
      </div>

      {/* Search Input & Bulk Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kegiatan..."
            className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
            <span className="font-bold text-red-700 dark:text-red-400">
              {selectedIds.length} dipilih
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 rounded border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
            >
              Batal
            </button>
            {onDeleteMultipleExamResults && (
              <button
                type="button"
                onClick={() => {
                  onDeleteMultipleExamResults(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih ({selectedIds.length})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table matching KLC Screenshot 1 */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] dark:text-slate-300 uppercase tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? filtered.map((r) => r.id) : [])
                    }
                    className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                    title="Pilih semua data hasil ujian"
                  />
                </th>
                <th className="py-3.5 px-5">KEGIATAN</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5">TANGGAL</th>
                <th className="py-3.5 px-5 text-right">NILAI AKHIR</th>
                <th className="py-3.5 px-5 text-right">SERTIFIKAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#66757F]">
                    Belum ada hasil ujian yang tersedia.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => {
                  const cert = certificates.find((c) => c.id === res.certificateId);
                  const isExpanded = expandedId === res.id;
                  const isChecked = selectedIds.includes(res.id);
                  return (
                    <React.Fragment key={res.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : res.id)}
                        className={`hover:bg-[#F6F8F7] dark:hover:bg-[#0E1518]/60 transition-colors cursor-pointer ${
                          isChecked ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10' : ''
                        }`}
                      >
                        <td
                          className="py-4 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSelectedIds((prev) =>
                                prev.includes(res.id)
                                  ? prev.filter((id) => id !== res.id)
                                  : [...prev, res.id]
                              );
                            }}
                            className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-5 font-bold text-[#172026] dark:text-white">
                          {res.programTitle}
                          <span className="block text-[11px] font-normal text-[#66757F] mt-0.5">
                            Klik baris untuk melihat rincian nilai per mata ujian ({res.moduleScores.length} modul)
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <StatusLabel status={res.status} />
                        </td>
                        <td className="py-4 px-5 font-mono text-[#66757F] dark:text-slate-300 tabular-nums">
                          {res.examDate}
                        </td>
                        <td className="py-4 px-5 text-right font-mono font-extrabold text-sm text-[#172026] dark:text-white tabular-nums">
                          {res.status === 'Belum Ujian' ? '—' : res.totalScore.toFixed(1)}
                        </td>
                        <td
                          className="py-4 px-5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {res.status === 'Lulus' && cert ? (
                            <button
                              onClick={() => onViewCertificate(cert)}
                              className="px-3 py-1.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <Award className="w-3.5 h-3.5 text-[#F4C430]" />
                              <span>Lihat & Unduh Sertifikat</span>
                            </button>
                          ) : (
                            <span className="text-[#66757F]">Belum Tersedia</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#F6F8F7]/70 dark:bg-[#0E1518]/90">
                          <td colSpan={6} className="p-5">
                            <div className="text-xs font-bold text-[#087A4B] dark:text-[#34D399] mb-3">
                              Transkrip Nilai Per Modul — {res.programTitle}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {res.moduleScores.map((m, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] flex items-center justify-between"
                                >
                                  <span className="text-xs font-medium text-[#172026] dark:text-slate-200">
                                    {m.moduleName}
                                  </span>
                                  <span className="font-mono text-sm font-extrabold text-[#087A4B] dark:text-[#F4C430] tabular-nums ml-3">
                                    {m.score > 0 ? m.score : '—'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   7. SERTIFIKAT SAYA VIEW
   ============================================================================ */
interface MyCertificatesViewProps {
  certificates: Certificate[];
  onViewCertificateModal: (cert: Certificate) => void;
  onOpenPublicVerify: (certNumber: string) => void;
}

export const MyCertificatesView: React.FC<MyCertificatesViewProps> = ({
  certificates,
  onViewCertificateModal,
  onOpenPublicVerify,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] uppercase">
          PESERTA · SERTIFIKASI KOMPETENSI
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
          Sertifikat Kompetensi Saya
        </h1>
        <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
          Daftar sertifikat resmi AKP2I yang telah Anda peroleh lengkap dengan QR Code verifikasi keaslian.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <StatusLabel status={cert.status} />
                <span>·</span>
                <span className="font-mono font-bold text-[#087A4B] dark:text-[#F4C430]">
                  {cert.certificateNumber}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#172026] dark:text-white leading-snug">
                {cert.programTitle}
              </h3>
              <p className="text-xs text-[#66757F] dark:text-slate-300">
                Atas Nama: <strong>{cert.participantName}</strong> · Predikat: {cert.predicate}
              </p>
              <p className="text-xs text-[#66757F] dark:text-slate-400">
                Terbit: {cert.issueDate} · Berlaku: {cert.expiryDate}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onViewCertificateModal(cert)}
                  className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-[#F4C430]" />
                  <span>Lihat & Unduh PDF</span>
                </button>
                <button
                  onClick={() => onOpenPublicVerify(cert.certificateNumber)}
                  className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-bold hover:border-[#087A4B] cursor-pointer"
                >
                  Cek Halaman Verifikasi
                </button>
              </div>
            </div>

            <div className="shrink-0 self-center">
              <QrCodeMatrixSvg value={cert.certificateNumber} size={96} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
