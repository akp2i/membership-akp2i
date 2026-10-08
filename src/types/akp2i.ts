export type UserRole =
  | 'Peserta'
  | 'Admin Pelatihan'
  | 'Verifikator'
  | 'Instruktur'
  | 'Admin Sertifikasi'
  | 'Super Admin';

export type ProgramCategory =
  | 'Uji Kompetensi Perpajakan'
  | 'Brevet Pajak'
  | 'Bimbel USKP'
  | 'Seminar'
  | 'Workshop'
  | 'Sertifikasi'
  | 'Pelatihan Teknis'
  | 'Program Lainnya';

export type ProgramStatus =
  | 'Sedang Dibuka'
  | 'Segera Dibuka'
  | 'Penuh'
  | 'Selesai'
  | 'Ditutup';

export type RegistrationStatus =
  | 'Menunggu Pembayaran'
  | 'Menunggu Verifikasi'
  | 'Terverifikasi'
  | 'Terdaftar'
  | 'Pelatihan Berlangsung'
  | 'Selesai'
  | 'Dibatalkan';

export type PaymentStatus =
  | 'Belum Dibayar'
  | 'Menunggu Verifikasi'
  | 'Pembayaran Terverifikasi'
  | 'Pembayaran Ditolak';

export interface DocumentItem {
  id: string;
  type: 'KTP' | 'NPWP' | 'Pas Foto' | 'Ijazah' | 'Dokumen Lainnya' | (string & {});
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Terverifikasi' | 'Menunggu Verifikasi' | 'Perlu Revisi';
  note?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  nik: string;
  npwp: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  educationLevel: string;
  institution: string;
  major: string;
  occupation: string;
  position: string;
  isVerified: boolean;
  dukcapilMatch?: boolean;
  verificationStatus?: 'Belum Lengkap' | 'Menunggu Verifikasi Admin' | 'Terverifikasi' | 'Perlu Revisi';
  profileSubmittedAt?: string;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  documents: DocumentItem[];
}

export const REQUIRED_PROFILE_DOC_TYPES = ['KTP', 'NPWP', 'Pas Foto', 'Ijazah'] as const;

export function validateProfileData(p: UserProfile): { isValid: boolean; error?: string; missingField?: string } {
  const fieldsToCheck: { key: keyof UserProfile; label: string; minLen?: number }[] = [
    { key: 'fullName', label: 'Nama Lengkap', minLen: 6 },
    { key: 'nik', label: 'NIK (Nomor Induk Kependudukan)', minLen: 16 },
    { key: 'npwp', label: 'NPWP', minLen: 15 },
    { key: 'birthPlace', label: 'Tempat Lahir', minLen: 6 },
    { key: 'birthDate', label: 'Tanggal Lahir', minLen: 6 },
    { key: 'email', label: 'Alamat Email', minLen: 6 },
    { key: 'phone', label: 'Nomor WhatsApp / Telepon', minLen: 10 },
    { key: 'province', label: 'Provinsi Domisili', minLen: 6 },
    { key: 'city', label: 'Kota / Kabupaten Domisili', minLen: 6 },
    { key: 'address', label: 'Alamat Lengkap KTP', minLen: 6 },
    { key: 'educationLevel', label: 'Jenjang Pendidikan Terakhir', minLen: 6 },
    { key: 'institution', label: 'Institusi / Universitas', minLen: 6 },
    { key: 'major', label: 'Fakultas / Program Studi', minLen: 6 },
    { key: 'occupation', label: 'Bidang Pekerjaan / Profesi', minLen: 6 },
    { key: 'position', label: 'Jabatan / Posisi Kerja', minLen: 6 },
  ];

  for (const f of fieldsToCheck) {
    const val = (p[f.key] as string) || '';
    const trimmed = val.trim();
    const requiredMin = f.minLen || 6;

    if (!trimmed) {
      return {
        isValid: false,
        missingField: f.label,
        error: `Field "${f.label}" wajib diisi dan tidak boleh kosong.`,
      };
    }

    if (trimmed.length < requiredMin) {
      return {
        isValid: false,
        missingField: f.label,
        error: `Field "${f.label}" tidak boleh hanya 1–5 karakter. Minimal ${requiredMin} karakter (saat ini ${trimmed.length} karakter).`,
      };
    }
  }

  if (!p.gender || (p.gender !== 'Laki-laki' && p.gender !== 'Perempuan')) {
    return {
      isValid: false,
      missingField: 'Jenis Kelamin',
      error: 'Jenis Kelamin wajib dipilih (Laki-laki atau Perempuan).',
    };
  }

  if (!p.avatarUrl || !p.avatarUrl.trim()) {
    return {
      isValid: false,
      missingField: 'Foto Profil',
      error: 'Foto Profil wajib diunggah sebelum submit profil.',
    };
  }

  // Check that all 4 required documents are uploaded
  for (const docType of REQUIRED_PROFILE_DOC_TYPES) {
    const hasDoc = p.documents?.some(
      (d) =>
        d.type.toLowerCase() === docType.toLowerCase() &&
        d.fileName &&
        d.fileName !== 'Belum ada file diunggah'
    );
    if (!hasDoc) {
      return {
        isValid: false,
        missingField: `Dokumen ${docType}`,
        error: `Dokumen persyaratan "${docType}" wajib diunggah. Seluruh dokumen (KTP, NPWP, Pas Foto, dan Ijazah) harus lengkap.`,
      };
    }
  }

  return { isValid: true };
}

export interface ProgramSubTier {
  id: string;
  name: string;
  scheduleText: string;
  price: number;
  quota: number;
  enrolled: number;
}

export interface LessonItem {
  id: string;
  moduleNumber: number;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'quiz' | 'assignment';
  videoDuration?: string;
  pdfFileName?: string;
  summary: string;
  keyTopics: string[];
  completed?: boolean;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  moduleTag: string;
}

export interface Program {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  category: ProgramCategory;
  status: ProgramStatus;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  timeText: string;
  durationText: string;
  method: 'Online Zoom' | 'Tatap Muka (Offline)' | 'Hybrid';
  location: 'Online' | 'Jakarta' | 'Bandung' | 'Surabaya' | 'Yogyakarta';
  locationDetail: string;
  price: number;
  quota: number;
  enrolled: number;
  featured: boolean;
  published: boolean;
  instructorName: string;
  instructorTitle: string;
  overview: string;
  syllabus: string[];
  facilities: string[];
  requirements: string[];
  faqs: { q: string; a: string }[];
  subTiers?: ProgramSubTier[];
  lessons: LessonItem[];
  examQuestions: ExamQuestion[];
}

export interface Registration {
  id: string;
  regNumber: string;
  programId: string;
  programTitle: string;
  subTierName?: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  registeredAt: string;
  trainingDateText: string;
  amount: number;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentProofFileName?: string;
  paymentProofSize?: string;
  paymentProofUploadedAt?: string;
  paymentRejectionReason?: string;
  stepIndex: number; // 1 to 8 corresponding to the 8-step stepper
  customAnswers?: Record<string, string>;
  documentsSubmitted: DocumentItem[];
}

export type FormModuleTarget =
  | 'registration'
  | 'finance'
  | 'programs'
  | 'payments'
  | 'participants'
  | 'certificates'
  | 'payment-methods'
  | 'schedules';

export interface RegistrationField {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'file';
  required: boolean;
  visible: boolean;
  targetModule?: FormModuleTarget | string;
  section?: 'identitas' | 'pendidikan' | 'dokumen' | 'tambahan' | string;
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

export interface ScheduleAgenda {
  id: string;
  programId: string;
  programTitle: string;
  sessionTitle: string;
  date: string; // YYYY-MM-DD
  displayDate: string;
  time: string;
  instructor: string;
  zoomLink: string;
  meetingId: string;
  passcode: string;
  status: 'Segera Dimulai' | 'Sedang Berlangsung' | 'Terjadwal' | 'Selesai';
}

export interface ExamResult {
  id: string;
  programId: string;
  programTitle: string;
  participantId: string;
  participantName: string;
  examDate: string;
  status: 'Lulus' | 'Tidak Lulus' | 'Diproses' | 'Belum Ujian';
  totalScore: number;
  passingScore: number;
  moduleScores: { moduleName: string; score: number }[];
  certificateId?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  participantId: string;
  participantName: string;
  programId: string;
  programTitle: string;
  issueDate: string;
  expiryDate: string;
  predicate: string;
  status: 'Valid & Aktif' | 'Dicabut';
  qrVerificationCode: string;
  signatoryName: string;
  signatoryTitle: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'registration' | 'payment' | 'schedule' | 'exam' | 'certificate';
  read: boolean;
  targetView?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  channel: 'Web Portal' | 'WhatsApp API Gateway' | 'System Security';
}

export interface AdminAccountItem {
  id: string;
  fullName: string;
  email: string;
  role: 'Super Admin' | 'Admin Pelatihan' | 'Verifikator' | 'Instruktur' | 'Admin Sertifikasi';
  password?: string;
  permissions?: string[];
  createdAt: string;
  isPrimarySuperAdmin?: boolean;
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  type: 'bank_transfer' | 'qris';
  bankName?: string;
  accountNumber?: string;
  accountHolder: string;
  qrisImageUrl?: string;
  qrisFileName?: string;
  instructions?: string;
  isActive: boolean;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'Honor Instruktur & Pemateri'
  | 'Sewa Zoom & Platform LMS'
  | 'Sewa Venue & Ruang Kelas'
  | 'Modul & Materi Cetak'
  | 'Konsumsi & Logistik'
  | 'Sertifikasi & Blangko'
  | 'Operasional & Administrasi';

export interface ExpenseItem {
  id: string;
  code: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  programId?: string;
  programTitle?: string;
  amount: number;
  picName: string;
  receiptNumber?: string;
  status: 'Lunas / Terbayar' | 'Menunggu Pembayaran' | 'Ditolak';
  notes?: string;
}


