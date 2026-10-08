import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Users,
  BookOpen,
  CreditCard,
  Award,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Download,
  Sliders,
  ShieldAlert,
  Send,
  FileSpreadsheet,
  Search,
  Edit3,
  Trash2,
  ShieldCheck,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  Upload,
  QrCode,
  Landmark,
  Receipt,
  DollarSign,
  Wallet,
  Coins,
  FileText,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Filter,
  Sparkles,
  Clock,
  CheckSquare,
  RotateCcw,
  Layers,
  Tag,
  Check,
  ListFilter,
  UserCheck,
  AlertCircle,
  FolderKanban,
} from 'lucide-react';
import {
  Program,
  Registration,
  RegistrationField,
  Certificate,
  AuditLogItem,
  UserRole,
  ProgramCategory,
  ProgramStatus,
  AdminAccountItem,
  PaymentMethodItem,
  ExpenseItem,
  ExpenseCategory,
  UserProfile,
  DocumentItem,
} from '../../types/akp2i';
import {
  formatRupiah,
  StatusLabel,
  QrCodeMatrixSvg,
  Akp2iLogoMark,
  ResilientImage,
} from '../ui/ResilientImage';
import { ASSETS } from '../../data/mockDatabase';

export interface AdminPermissionItem {
  id: string;
  module: string;
  label: string;
  desc: string;
}

export const ADMIN_PERMISSIONS_CATALOG: AdminPermissionItem[] = [
  {
    id: 'manage_finance',
    module: 'Manajemen Keuangan',
    label: 'Akses Keuangan & Kas',
    desc: 'Buku kas masuk/keluar, catat beban operasional, ekspor .xlsx laporan keuangan',
  },
  {
    id: 'manage_programs',
    module: 'Program Pelatihan',
    label: 'Manajemen Program & Silabus',
    desc: 'Tambah/ubah materi pelatihan, kelola kuota, publish/unpublish program',
  },
  {
    id: 'manage_participants',
    module: 'Data Peserta',
    label: 'Kelola Rekapitulasi Peserta',
    desc: 'Lihat profil NIK/NPWP peserta, ubah status pendaftaran, ekspor Excel',
  },
  {
    id: 'verify_payments',
    module: 'Verifikasi Pembayaran',
    label: 'Verifikasi Pembayaran & Kwitansi',
    desc: 'Approval bukti transfer, tolak pembayaran, terbitkan invoice & kwitansi resmi',
  },
  {
    id: 'manage_certificates',
    module: 'Sertifikat',
    label: 'Penerbitan Sertifikat Resmi',
    desc: 'Generate nomor SK sertifikasi AKP2I, tanda tangan digital & cetak piagam',
  },
  {
    id: 'manage_schedules',
    module: 'Jadwal Zoom',
    label: 'Manajemen Jadwal Zoom',
    desc: 'Kelola jadwal sesi tatap muka daring, tautan Zoom & passcode kelas virtual',
  },
  {
    id: 'manage_payment_methods',
    module: 'Metode Pembayaran',
    label: 'Kelola Rekening Bank & QRIS',
    desc: 'Konfigurasi rekening transfer bank & upload file gambar QRIS resmi',
  },
  {
    id: 'manage_form_builder',
    module: 'Dynamic Form Builder',
    label: 'Dynamic Form Builder',
    desc: 'Tambah custom field baru multi-modul & konfigurasi opsi pilihan dropdown/radio/checkbox',
  },
  {
    id: 'manage_admins',
    module: 'Pengaturan Admin',
    label: 'Kelola Akun & Hak Izin Admin',
    desc: 'Tambah akun admin, kelola peran dan matriks izin akses portal',
  },
];

export const ROLE_DEFAULT_PERMISSIONS: Record<AdminAccountItem['role'], string[]> = {
  'Super Admin': [
    'manage_finance',
    'manage_programs',
    'manage_participants',
    'verify_payments',
    'manage_certificates',
    'manage_schedules',
    'manage_payment_methods',
    'manage_form_builder',
    'manage_admins',
  ],
  'Admin Pelatihan': [
    'manage_programs',
    'manage_participants',
    'manage_schedules',
    'manage_certificates',
  ],
  'Verifikator': [
    'manage_finance',
    'verify_payments',
    'manage_participants',
  ],
  'Instruktur': [
    'manage_schedules',
    'manage_programs',
  ],
  'Admin Sertifikasi': [
    'manage_certificates',
    'manage_participants',
  ],
};

interface AdminViewsProps {
  activeSubView:
    | 'admin-dashboard'
    | 'admin-finance'
    | 'admin-programs'
    | 'admin-participants'
    | 'admin-payments'
    | 'admin-payment-methods'
    | 'admin-form-builder'
    | 'admin-certificates'
    | 'admin-reporting'
    | 'admin-users';
  currentRole: UserRole;
  programs: Program[];
  registrations: Registration[];
  formFields: RegistrationField[];
  certificates: Certificate[];
  auditLogs: AuditLogItem[];
  adminAccounts: AdminAccountItem[];
  paymentMethods: PaymentMethodItem[];
  expenses?: ExpenseItem[];
  onUpdatePrograms: (programs: Program[]) => void;
  onAddManualRegistration: (reg: Registration) => void;
  onUpdateRegistration: (reg: Registration) => void;
  onDeleteRegistration: (id: string) => void;
  onApprovePayment: (regId: string) => void;
  onRejectPayment: (regId: string, reason: string) => void;
  onAddPaymentMethod: (method: PaymentMethodItem) => void;
  onUpdatePaymentMethod: (method: PaymentMethodItem) => void;
  onDeletePaymentMethod: (id: string) => void;
  onUpdateFormFields: (fields: RegistrationField[]) => void;
  onGenerateCertificate: (cert: Certificate) => void;
  onRevokeCertificate: (certId: string) => void;
  onViewCertificateModal: (cert: Certificate) => void;
  onDispatchWhatsApp: (phone: string, message: string) => void;
  onAddAdminAccount: (account: AdminAccountItem) => void;
  onUpdateAdminAccount: (account: AdminAccountItem) => void;
  onDeleteAdminAccount: (id: string) => void;
  onAddExpense?: (expense: ExpenseItem) => void;
  onUpdateExpense?: (expense: ExpenseItem) => void;
  onDeleteExpense?: (id: string) => void;
  onDeleteMultiplePrograms?: (ids: string[]) => void;
  onDeleteMultipleRegistrations?: (ids: string[]) => void;
  onDeleteMultiplePaymentMethods?: (ids: string[]) => void;
  onDeleteMultipleAdminAccounts?: (ids: string[]) => void;
  onDeleteMultipleExpenses?: (ids: string[]) => void;
  onDeleteCertificate?: (certId: string) => void;
  onDeleteMultipleCertificates?: (certIds: string[]) => void;
  onResetParticipantsData?: () => void;
  onResetProgramsData?: () => void;
  onNavigateSubView?: (subView: any) => void;
  onShowToast: (msg: string) => void;
  registeredParticipants?: { profile: UserProfile; password?: string }[];
  onVerifyParticipantProfile?: (
    participantId: string,
    status: 'Terverifikasi' | 'Perlu Revisi',
    note?: string
  ) => void;
  onImportParticipants?: (
    newRegs: Registration[],
    newProfiles?: UserProfile[]
  ) => void;
}

export const AdminViews: React.FC<AdminViewsProps> = ({
  activeSubView,
  currentRole,
  programs,
  registrations,
  formFields,
  certificates,
  auditLogs,
  adminAccounts,
  paymentMethods,
  expenses = [],
  registeredParticipants = [],
  onVerifyParticipantProfile,
  onImportParticipants,
  onUpdatePrograms,
  onAddManualRegistration,
  onUpdateRegistration,
  onDeleteRegistration,
  onApprovePayment,
  onRejectPayment,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onDeletePaymentMethod,
  onUpdateFormFields,
  onGenerateCertificate,
  onRevokeCertificate,
  onViewCertificateModal,
  onDispatchWhatsApp,
  onAddAdminAccount,
  onUpdateAdminAccount,
  onDeleteAdminAccount,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onDeleteMultiplePrograms,
  onDeleteMultipleRegistrations,
  onDeleteMultiplePaymentMethods,
  onDeleteMultipleAdminAccounts,
  onDeleteMultipleExpenses,
  onDeleteCertificate,
  onDeleteMultipleCertificates,
  onResetParticipantsData,
  onResetProgramsData,
  onNavigateSubView,
  onShowToast,
}) => {
  // Permission check: Only Super Admin and Admin Pelatihan can Create/Update/Delete Programs & Manual Participants
  const canManagePrograms =
    currentRole === 'Super Admin' || currentRole === 'Admin Pelatihan';
  const canManageParticipants =
    currentRole === 'Super Admin' || currentRole === 'Admin Pelatihan';
  // Permission check: ONLY Super Admin can manage Payment Methods
  const canManagePaymentMethods = currentRole === 'Super Admin';

  // Checkbox selection states for bulk delete across all admin tables
  const [selectedProgIds, setSelectedProgIds] = useState<string[]>([]);
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);
  const [selectedPayIds, setSelectedPayIds] = useState<string[]>([]);
  const [selectedPmIds, setSelectedPmIds] = useState<string[]>([]);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);

  // Program CRUD modal state (Create & Edit)
  const [showProgModal, setShowProgModal] = useState(false);
  const [editingProgId, setEditingProgId] = useState<string | null>(null);
  const [deletingProg, setDeletingProg] = useState<Program | null>(null);

  const [progTitle, setProgTitle] = useState('');
  const [progShortTitle, setProgShortTitle] = useState('');
  const [progCode, setProgCode] = useState('');
  const [progCat, setProgCat] = useState<ProgramCategory>('Brevet Pajak');
  const [progStatus, setProgStatus] = useState<ProgramStatus>('Sedang Dibuka');
  const [progStartDate, setProgStartDate] = useState('15 Nov 2026');
  const [progEndDate, setProgEndDate] = useState('20 Des 2026');
  const [progTimeText, setProgTimeText] = useState('09.00 – 16.00 WIB');
  const [progDurationText, setProgDurationText] = useState('6 Pertemuan Intensif');
  const [progMethod, setProgMethod] = useState<Program['method']>('Online Zoom');
  const [progLocation, setProgLocation] = useState<Program['location']>('Online');
  const [progLocationDetail, setProgLocationDetail] = useState('Zoom Cloud Meeting AKP2I');
  const [progPrice, setProgPrice] = useState(2500000);
  const [progQuota, setProgQuota] = useState(100);
  const [progInstructorName, setProgInstructorName] = useState('Tim Pengajar Nasional AKP2I, BKP');
  const [progInstructorTitle, setProgInstructorTitle] = useState('Komite Pelatihan & Sertifikasi AKP2I');
  const [progOverview, setProgOverview] = useState('');
  const [progSyllabusText, setProgSyllabusText] = useState('');
  const [progFacilitiesText, setProgFacilitiesText] = useState('');
  const [progRequirementsText, setProgRequirementsText] = useState('');
  const [progFeatured, setProgFeatured] = useState(true);
  const [progPublished, setProgPublished] = useState(true);

  // Admin Account Management state
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [newAdminRole, setNewAdminRole] = useState<AdminAccountItem['role']>('Admin Pelatihan');
  const [newAdminPermissions, setNewAdminPermissions] = useState<string[]>(
    ROLE_DEFAULT_PERMISSIONS['Admin Pelatihan']
  );
  const [editingAdmin, setEditingAdmin] = useState<AdminAccountItem | null>(null);
  const [editAdminName, setEditAdminName] = useState('');
  const [editAdminRole, setEditAdminRole] = useState<AdminAccountItem['role']>('Admin Pelatihan');
  const [editAdminPassword, setEditAdminPassword] = useState('');
  const [editAdminPermissions, setEditAdminPermissions] = useState<string[]>([]);
  const [showEditAdminPassword, setShowEditAdminPassword] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminAccountItem | null>(null);
  const [revealedPasswordIds, setRevealedPasswordIds] = useState<string[]>([]);
  const [adminUsersTab, setAdminUsersTab] = useState<'accounts' | 'matrix'>('accounts');

  // Payment reject reason state
  const [rejectingRegId, setRejectingRegId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState(
    'Nominal bukti transfer tidak terbaca jelas. Mohon unggah ulang bukti transfer resmi bank.'
  );

  // Dynamic Form Builder states
  const [newFieldModule, setNewFieldModule] = useState<string>('registration');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<RegistrationField['type']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldOptionsList, setNewFieldOptionsList] = useState<string[]>(['Pilihan 1', 'Pilihan 2']);
  const [newOptionInput, setNewOptionInput] = useState('');
  const [formBuilderActiveModuleFilter, setFormBuilderActiveModuleFilter] = useState<string>('all');
  const [formBuilderSearch, setFormBuilderSearch] = useState('');
  const [editingFieldOptionsId, setEditingFieldOptionsId] = useState<string | null>(null);
  const [editingNewOptionInput, setEditingNewOptionInput] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  // Certificate generation state
  const [certRecipientName, setCertRecipientName] = useState('');
  const [certProgramId, setCertProgramId] = useState(programs[0]?.id || 'prog-ukp-2026');
  const [certPredicate, setCertPredicate] = useState('Sangat Memuaskan (Lulus Kompetensi)');

  // Participant filter & manual CRUD state
  const [partSearch, setPartSearch] = useState('');
  const [partSubTab, setPartSubTab] = useState<'registrations' | 'verification'>('registrations');
  const [profileSearch, setProfileSearch] = useState('');
  const [profileStatusFilter, setProfileStatusFilter] = useState<
    'all' | 'pending' | 'verified' | 'incomplete'
  >('all');
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [rejectingProfileId, setRejectingProfileId] = useState<string | null>(null);
  const [profileRejectReason, setProfileRejectReason] = useState(
    'Mohon periksa kembali kejelasan dokumen dan kelengkapan data pribadi Anda.'
  );
  const [previewingDoc, setPreviewingDoc] = useState<DocumentItem | null>(null);
  const [showPartModal, setShowPartModal] = useState(false);
  const [showResetParticipantsModal, setShowResetParticipantsModal] = useState(false);
  const [showResetProgramsModal, setShowResetProgramsModal] = useState(false);
  const [editingPartReg, setEditingPartReg] = useState<Registration | null>(null);
  const [deletingPartReg, setDeletingPartReg] = useState<Registration | null>(null);
  const [manualPartName, setManualPartName] = useState('');
  const [manualPartEmail, setManualPartEmail] = useState('');
  const [manualPartPhone, setManualPartPhone] = useState('');
  const [manualPartProgId, setManualPartProgId] = useState(programs[0]?.id || 'prog-ukp-2026');
  const [manualPartMethod, setManualPartMethod] = useState(
    paymentMethods[0]?.name || 'Transfer Bank Mandiri'
  );
  const [manualPartAmount, setManualPartAmount] = useState(programs[0]?.price || 1750000);
  const [manualPartStatusPreset, setManualPartStatusPreset] = useState<
    'verified' | 'pending_verify' | 'unpaid'
  >('verified');

  // Excel Participant Import states
  const [showImportParticipantsModal, setShowImportParticipantsModal] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [parsedImportRows, setParsedImportRows] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Payment Method CRUD state (Super Admin only)
  const [showPmModal, setShowPmModal] = useState(false);
  const [editingPm, setEditingPm] = useState<PaymentMethodItem | null>(null);
  const [deletingPm, setDeletingPm] = useState<PaymentMethodItem | null>(null);
  const [previewQrisPm, setPreviewQrisPm] = useState<PaymentMethodItem | null>(null);
  const [pmName, setPmName] = useState('');
  const [pmType, setPmType] = useState<'bank_transfer' | 'qris'>('bank_transfer');
  const [pmBankName, setPmBankName] = useState('');
  const [pmAccountNumber, setPmAccountNumber] = useState('');
  const [pmAccountHolder, setPmAccountHolder] = useState(
    'Perkumpulan Asosiasi Konsultan Pajak Publik Indonesia (AKP2I)'
  );
  const [pmQrisImageUrl, setPmQrisImageUrl] = useState<string>('');
  const [pmQrisFileName, setPmQrisFileName] = useState<string>('');
  const [pmInstructions, setPmInstructions] = useState('');
  const [pmIsActive, setPmIsActive] = useState(true);

  // Total KPIs
  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === 'Pembayaran Terverifikasi')
    .reduce((acc, r) => acc + r.amount, 0);
  const pendingPayments = registrations.filter(
    (r) => r.paymentStatus === 'Menunggu Verifikasi'
  );

  const handleExportXlsx = () => {
    const worksheetData = [
      [
        'No Registrasi',
        'Nama Lengkap Peserta',
        'Alamat Email',
        'Nomor WhatsApp',
        'Program Pelatihan',
        'Sub-Paket / Tier',
        'Tanggal Registrasi',
        'Jadwal Pelatihan',
        'Biaya Pelatihan (Rp)',
        'Status Pendaftaran',
        'Status Pembayaran',
        'Metode Pembayaran',
      ],
      ...registrations.map((r) => [
        r.regNumber,
        r.participantName,
        r.participantEmail,
        r.participantPhone,
        r.programTitle,
        r.subTierName || '-',
        r.registeredAt,
        r.trainingDateText,
        r.amount,
        r.status,
        r.paymentStatus,
        r.paymentMethod,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 20 }, // No Registrasi
      { wch: 28 }, // Nama Lengkap Peserta
      { wch: 30 }, // Alamat Email
      { wch: 18 }, // Nomor WhatsApp
      { wch: 36 }, // Program Pelatihan
      { wch: 20 }, // Sub-Paket / Tier
      { wch: 18 }, // Tanggal Registrasi
      { wch: 24 }, // Jadwal Pelatihan
      { wch: 20 }, // Biaya Pelatihan
      { wch: 22 }, // Status Pendaftaran
      { wch: 26 }, // Status Pembayaran
      { wch: 26 }, // Metode Pembayaran
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta AKP2I');

    try {
      XLSX.writeFile(workbook, 'Data_Peserta_Pelatihan_AKP2I_2026.xlsx');
    } catch {
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Data_Peserta_Pelatihan_AKP2I_2026.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    }

    onShowToast('File Excel (.xlsx) Data Peserta AKP2I berhasil diunduh.');
  };

  // 1. Download Template Format Impor Peserta AKP2I
  const handleDownloadImportTemplate = () => {
    const headers = [
      'Nama Lengkap *',
      'Email *',
      'Nomor WhatsApp *',
      'Kode atau Judul Program *',
      'Metode Pembayaran',
      'Status Pembayaran (Terverifikasi/Menunggu Verifikasi/Belum Dibayar)',
      'NIK KTP (16 Digit)',
      'NPWP',
      'Jenis Kelamin (Laki-laki/Perempuan)',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Provinsi Domisili',
      'Kota / Kabupaten',
      'Alamat Lengkap',
      'Pendidikan Terakhir',
      'Institusi / Kampus',
      'Program Studi',
      'Bidang Pekerjaan',
      'Jabatan',
    ];

    const sampleRow1 = [
      'Budi Santoso, S.E., Ak., BKP',
      'budi.santoso@contoh.com',
      '081234567890',
      programs[0]?.title || 'Ujian Komprehensif Perpajakan (UKP)',
      'Transfer Bank Mandiri',
      'Terverifikasi',
      '3171012304850001',
      '09.123.456.7-012.000',
      'Laki-laki',
      'Jakarta Pusat',
      '18 Mei 1985',
      'DKI Jakarta',
      'Jakarta Selatan',
      'Jl. Jend. Sudirman Kav 24, RT 02/RW 03',
      'S1 - Strata 1',
      'Universitas Indonesia',
      'Akuntansi Perpajakan',
      'Konsultan Pajak',
      'Senior Tax Partner',
    ];

    const sampleRow2 = [
      'Siti Rahmawati, S.Ak.',
      'siti.rahmawati@contoh.com',
      '081398765432',
      programs[1]?.title || programs[0]?.title || 'Brevet Pajak Terapan A & B',
      'QRIS Mandiri & BCA',
      'Menunggu Verifikasi',
      '3273016509920002',
      '12.345.678.9-421.000',
      'Perempuan',
      'Bandung',
      '22 September 1992',
      'Jawa Barat',
      'Bandung',
      'Jl. Dago Asri No. 15, Coblong',
      'S1 - Strata 1',
      'Universitas Padjadjaran',
      'Akuntansi',
      'Tax Specialist',
      'Tax Accounting Supervisor',
    ];

    const worksheetData = [headers, sampleRow1, sampleRow2];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    ws['!cols'] = [
      { wch: 30 }, // Nama Lengkap
      { wch: 28 }, // Email
      { wch: 20 }, // WhatsApp
      { wch: 38 }, // Program
      { wch: 24 }, // Metode Bayar
      { wch: 34 }, // Status Bayar
      { wch: 22 }, // NIK
      { wch: 24 }, // NPWP
      { wch: 18 }, // Gender
      { wch: 20 }, // Tempat Lahir
      { wch: 20 }, // Tgl Lahir
      { wch: 20 }, // Provinsi
      { wch: 22 }, // Kota
      { wch: 38 }, // Alamat
      { wch: 22 }, // Pendidikan
      { wch: 28 }, // Kampus
      { wch: 24 }, // Prodi
      { wch: 24 }, // Profesi
      { wch: 26 }, // Jabatan
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Format Impor Peserta');

    try {
      XLSX.writeFile(wb, 'Format_Impor_Peserta_AKP2I.xlsx');
    } catch {
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Format_Impor_Peserta_AKP2I.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    }
    onShowToast('Format template Excel (.xlsx) berhasil diunduh. Silakan isi dan unggah kembali.');
  };

  // 2. Handle File Selection and Parsing
  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rows || rows.length === 0) {
          onShowToast('Berkas Excel kosong atau tidak memiliki baris data.');
          setParsedImportRows([]);
          return;
        }

        const parsed = rows.map((r) => {
          const getVal = (candidates: string[]) => {
            for (const key of Object.keys(r)) {
              const cleanKey = key.trim().toLowerCase();
              for (const cand of candidates) {
                if (cleanKey.includes(cand.toLowerCase())) {
                  const val = String(r[key]).trim();
                  if (val) return val;
                }
              }
            }
            return '';
          };

          const fullName = getVal(['nama lengkap', 'nama', 'participant name']);
          const email = getVal(['email', 'surel']);
          const phone = getVal(['whatsapp', 'telepon', 'phone', 'hp']);
          const progQuery = getVal(['program', 'judul', 'kursus', 'diklat']);
          const paymentMethod =
            getVal(['metode']) || paymentMethods[0]?.name || 'Transfer Bank Mandiri';
          const statusRaw = getVal(['status bayar', 'status pembayaran', 'pembayaran']);
          const nik = getVal(['nik']);
          const npwp = getVal(['npwp']);
          const gender = getVal(['jenis kelamin', 'gender']);
          const birthPlace = getVal(['tempat lahir']);
          const birthDate = getVal(['tanggal lahir']);
          const province = getVal(['provinsi']);
          const city = getVal(['kota', 'kabupaten']);
          const address = getVal(['alamat']);
          const educationLevel = getVal(['pendidikan']);
          const institution = getVal(['institusi', 'kampus', 'universitas', 'sekolah']);
          const major = getVal(['program studi', 'prodi', 'jurusan', 'fakultas']);
          const occupation = getVal(['pekerjaan', 'profesi']);
          const position = getVal(['jabatan', 'posisi']);

          const matchedProg =
            programs.find(
              (p) =>
                p.id.toLowerCase() === progQuery.toLowerCase() ||
                p.title.toLowerCase().includes(progQuery.toLowerCase()) ||
                (p.code && p.code.toLowerCase() === progQuery.toLowerCase())
            ) || programs[0];

          let paymentStatus: Registration['paymentStatus'] = 'Pembayaran Terverifikasi';
          let regStatus: Registration['status'] = 'Terdaftar';
          let stepIndex = 5;

          const stLow = statusRaw.toLowerCase();
          if (stLow.includes('menunggu') || stLow.includes('pending')) {
            paymentStatus = 'Menunggu Verifikasi';
            regStatus = 'Menunggu Verifikasi';
            stepIndex = 3;
          } else if (stLow.includes('belum') || stLow.includes('unpaid')) {
            paymentStatus = 'Belum Dibayar';
            regStatus = 'Menunggu Pembayaran';
            stepIndex = 2;
          }

          const errors: string[] = [];
          if (!fullName || fullName.length < 3) errors.push('Nama minimal 3 karakter');
          if (!email || !email.includes('@')) errors.push('Email tidak valid');
          if (!phone || phone.length < 6) errors.push('Nomor WhatsApp wajib diisi');

          return {
            raw: r,
            isValid: errors.length === 0,
            error: errors.join(', '),
            fullName,
            email,
            phone,
            programId: matchedProg?.id || 'prog-ukp-2026',
            programTitle: matchedProg?.title || 'Program Pelatihan AKP2I',
            amount: matchedProg?.price || 1750000,
            paymentMethod,
            paymentStatus,
            status: regStatus,
            stepIndex,
            nik: nik || undefined,
            npwp: npwp || undefined,
            gender: gender || 'Laki-laki',
            birthPlace: birthPlace || undefined,
            birthDate: birthDate || undefined,
            province: province || undefined,
            city: city || undefined,
            address: address || undefined,
            educationLevel: educationLevel || 'S1 - Strata 1',
            institution: institution || undefined,
            major: major || undefined,
            occupation: occupation || undefined,
            position: position || undefined,
          };
        });

        setParsedImportRows(parsed);
      } catch (err: any) {
        onShowToast(`Gagal membaca berkas Excel: ${err?.message || 'Format tidak valid'}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 3. Confirm and Save Imported Participants
  const handleConfirmImport = () => {
    const validRows = parsedImportRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      onShowToast('Tidak ada baris data peserta yang valid untuk diimpor.');
      return;
    }

    setIsImporting(true);
    const newRegs: Registration[] = [];
    const newProfiles: UserProfile[] = [];

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    for (const row of validRows) {
      const randomCode = Math.floor(100000 + Math.random() * 900000)
        .toString(16)
        .toUpperCase();
      const uniquePartId = `usr-import-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const reg: Registration = {
        id: `reg-import-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        regNumber: `REG-20261008-${randomCode}`,
        programId: row.programId,
        programTitle: row.programTitle,
        participantId: uniquePartId,
        participantName: row.fullName,
        participantEmail: row.email,
        participantPhone: row.phone,
        registeredAt: nowStr,
        trainingDateText: 'Batch Mendatang',
        amount: row.amount,
        status: row.status,
        paymentStatus: row.paymentStatus,
        paymentMethod: row.paymentMethod,
        paymentProofFileName:
          row.paymentStatus === 'Pembayaran Terverifikasi' ? 'Impor_Excel_Admin.xlsx' : undefined,
        paymentProofSize:
          row.paymentStatus === 'Pembayaran Terverifikasi' ? 'Excel Batch' : undefined,
        paymentProofUploadedAt:
          row.paymentStatus === 'Pembayaran Terverifikasi' ? 'Diimpor oleh Admin' : undefined,
        stepIndex: row.stepIndex,
        documentsSubmitted: [],
      };

      const prof: UserProfile = {
        id: uniquePartId,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        role: 'Peserta',
        avatarUrl:
          row.gender === 'Perempuan'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        nik: row.nik || '-',
        npwp: row.npwp || '-',
        gender: (row.gender as any) || 'Laki-laki',
        birthPlace: row.birthPlace || '-',
        birthDate: row.birthDate || '-',
        province: row.province || '-',
        city: row.city || '-',
        address: row.address || '-',
        educationLevel: row.educationLevel || 'S1 - Strata 1',
        institution: row.institution || '-',
        major: row.major || '-',
        occupation: row.occupation || '-',
        position: row.position || '-',
        isVerified: row.paymentStatus === 'Pembayaran Terverifikasi',
        verificationStatus:
          row.paymentStatus === 'Pembayaran Terverifikasi'
            ? 'Terverifikasi'
            : 'Menunggu Verifikasi Admin',
        documents: [
          {
            id: `doc-ktp-${Date.now()}`,
            type: 'KTP',
            fileName: 'Belum ada file diunggah',
            fileSize: '0 KB',
            uploadedAt: 'Menunggu Berkas',
            status: 'Menunggu Verifikasi',
          },
          {
            id: `doc-npwp-${Date.now()}`,
            type: 'NPWP',
            fileName: 'Belum ada file diunggah',
            fileSize: '0 KB',
            uploadedAt: 'Menunggu Berkas',
            status: 'Menunggu Verifikasi',
          },
          {
            id: `doc-foto-${Date.now()}`,
            type: 'Pas Foto',
            fileName: 'Belum ada file diunggah',
            fileSize: '0 KB',
            uploadedAt: 'Menunggu Berkas',
            status: 'Menunggu Verifikasi',
          },
          {
            id: `doc-ijazah-${Date.now()}`,
            type: 'Ijazah',
            fileName: 'Belum ada file diunggah',
            fileSize: '0 KB',
            uploadedAt: 'Menunggu Berkas',
            status: 'Menunggu Verifikasi',
          },
        ],
      };

      newRegs.push(reg);
      newProfiles.push(prof);
    }

    if (onImportParticipants) {
      onImportParticipants(newRegs, newProfiles);
    } else {
      newRegs.forEach((r) => onAddManualRegistration(r));
    }

    setIsImporting(false);
    setShowImportParticipantsModal(false);
    setParsedImportRows([]);
    setImportFileName('');
    onShowToast(`Berhasil mengimpor ${validRows.length} data peserta dari berkas Excel!`);
  };

  // Manajemen Keuangan States & Handlers
  const [financeTab, setFinanceTab] = useState<
    'inflow' | 'outflow' | 'programs' | 'payment-methods'
  >('inflow');
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeStatusFilter, setFinanceStatusFilter] = useState('Semua');
  const [financeProgramFilter, setFinanceProgramFilter] = useState('Semua');
  const [financeMethodFilter, setFinanceMethodFilter] = useState('Semua');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('Semua');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [selectedFinanceRegIds, setSelectedFinanceRegIds] = useState<string[]>([]);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);

  // Expense Modal state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseItem | null>(null);
  const [expDate, setExpDate] = useState('08 Okt 2026');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>(
    'Honor Instruktur & Pemateri'
  );
  const [expDesc, setExpDesc] = useState('');
  const [expProgramId, setExpProgramId] = useState(programs[0]?.id || '');
  const [expAmount, setExpAmount] = useState<number>(5000000);
  const [expPic, setExpPic] = useState('Bendahara DPP AKP2I');
  const [expReceiptNo, setExpReceiptNo] = useState('');
  const [expStatus, setExpStatus] = useState<
    'Lunas / Terbayar' | 'Menunggu Pembayaran' | 'Ditolak'
  >('Lunas / Terbayar');
  const [expNotes, setExpNotes] = useState('');

  // Official Receipt Modal state
  const [receiptModalReg, setReceiptModalReg] = useState<Registration | null>(null);

  // Helper Angka ke Terbilang Bahasa Indonesia
  const angkaKeTerbilang = (angka: number): string => {
    if (angka === 0) return 'Nol Rupiah';
    const satuan = [
      '',
      'Satu',
      'Dua',
      'Tiga',
      'Empat',
      'Lima',
      'Enam',
      'Tujuh',
      'Delapan',
      'Sembilan',
      'Sepuluh',
      'Sebelas',
    ];
    function hitung(n: number): string {
      if (n < 12) return satuan[n];
      if (n < 20) return hitung(n - 10) + ' Belas';
      if (n < 100) return hitung(Math.floor(n / 10)) + ' Puluh ' + hitung(n % 10);
      if (n < 200) return 'Seratus ' + hitung(n - 100);
      if (n < 1000) return hitung(Math.floor(n / 100)) + ' Ratus ' + hitung(n % 100);
      if (n < 2000) return 'Seribu ' + hitung(n - 1000);
      if (n < 1000000) return hitung(Math.floor(n / 1000)) + ' Ribu ' + hitung(n % 1000);
      if (n < 1000000000)
        return hitung(Math.floor(n / 1000000)) + ' Juta ' + hitung(n % 1000000);
      if (n < 1000000000000)
        return (
          hitung(Math.floor(n / 1000000000)) + ' Miliar ' + hitung(n % 1000000000)
        );
      return (
        hitung(Math.floor(n / 1000000000000)) +
        ' Triliun ' +
        hitung(n % 1000000000000)
      );
    }
    return hitung(angka).replace(/\s+/g, ' ').trim() + ' Rupiah';
  };

  const openAddExpenseModal = () => {
    setEditingExpense(null);
    setExpDate(
      new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    );
    setExpCategory('Honor Instruktur & Pemateri');
    setExpDesc('');
    setExpProgramId(programs[0]?.id || '');
    setExpAmount(5000000);
    setExpPic('Bendahara DPP AKP2I');
    setExpReceiptNo(`BKK-AKP2I/2026/${Math.floor(100 + Math.random() * 899)}`);
    setExpStatus('Lunas / Terbayar');
    setExpNotes('');
    setShowExpenseModal(true);
  };

  const openEditExpenseModal = (item: ExpenseItem) => {
    setEditingExpense(item);
    setExpDate(item.date);
    setExpCategory(item.category);
    setExpDesc(item.description);
    setExpProgramId(item.programId || '');
    setExpAmount(item.amount);
    setExpPic(item.picName);
    setExpReceiptNo(item.receiptNumber || '');
    setExpStatus(item.status);
    setExpNotes(item.notes || '');
    setShowExpenseModal(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc.trim()) {
      onShowToast('Mohon masukkan deskripsi atau uraian pengeluaran.');
      return;
    }
    const matchedProg = programs.find((p) => p.id === expProgramId);
    if (editingExpense) {
      if (onUpdateExpense) {
        onUpdateExpense({
          ...editingExpense,
          date: expDate,
          category: expCategory,
          description: expDesc.trim(),
          programId: expProgramId || undefined,
          programTitle: matchedProg?.title,
          amount: Number(expAmount) || 0,
          picName: expPic.trim() || 'Bendahara DPP AKP2I',
          receiptNumber: expReceiptNo.trim(),
          status: expStatus,
          notes: expNotes.trim(),
        });
      }
    } else {
      if (onAddExpense) {
        const newCode = `BKK-AKP2I/2026/${Math.floor(100 + Math.random() * 899)}`;
        onAddExpense({
          id: `exp-${Date.now()}`,
          code: expReceiptNo.trim() || newCode,
          date: expDate,
          category: expCategory,
          description: expDesc.trim(),
          programId: expProgramId || undefined,
          programTitle: matchedProg?.title,
          amount: Number(expAmount) || 0,
          picName: expPic.trim() || 'Bendahara DPP AKP2I',
          receiptNumber: expReceiptNo.trim() || newCode,
          status: expStatus,
          notes: expNotes.trim(),
        });
      }
    }
    setShowExpenseModal(false);
  };

  const handleExportFinanceXlsx = () => {
    const inflowData = [
      [
        'No Invoice / Registrasi',
        'Tanggal Registrasi',
        'Nama Peserta',
        'Email Peserta',
        'Nomor WhatsApp',
        'Program Pelatihan',
        'Metode Pembayaran',
        'Nominal Masuk (Rp)',
        'Status Pembayaran',
        'Status Pendaftaran',
      ],
      ...registrations.map((r) => [
        r.regNumber,
        r.registeredAt,
        r.participantName,
        r.participantEmail,
        r.participantPhone,
        r.programTitle,
        r.paymentMethod,
        r.amount,
        r.paymentStatus,
        r.status,
      ]),
    ];
    const wsInflow = XLSX.utils.aoa_to_sheet(inflowData);
    wsInflow['!cols'] = [
      { wch: 22 },
      { wch: 18 },
      { wch: 28 },
      { wch: 30 },
      { wch: 18 },
      { wch: 36 },
      { wch: 26 },
      { wch: 20 },
      { wch: 26 },
      { wch: 22 },
    ];

    const outflowData = [
      [
        'No Bukti Kas Keluar',
        'Tanggal Pengeluaran',
        'Kategori Beban',
        'Uraian Pengeluaran',
        'Program Terkait',
        'Nominal Biaya (Rp)',
        'Penanggung Jawab (PIC)',
        'No Kwitansi / Nota',
        'Status Beban',
        'Catatan',
      ],
      ...expenses.map((e) => [
        e.code,
        e.date,
        e.category,
        e.description,
        e.programTitle || 'Umum / Operasional',
        e.amount,
        e.picName,
        e.receiptNumber || '-',
        e.status,
        e.notes || '-',
      ]),
    ];
    const wsOutflow = XLSX.utils.aoa_to_sheet(outflowData);
    wsOutflow['!cols'] = [
      { wch: 24 },
      { wch: 18 },
      { wch: 30 },
      { wch: 40 },
      { wch: 36 },
      { wch: 20 },
      { wch: 24 },
      { wch: 22 },
      { wch: 22 },
      { wch: 30 },
    ];

    const totalExp = expenses
      .filter((e) => e.status === 'Lunas / Terbayar')
      .reduce((sum, e) => sum + e.amount, 0);

    const summaryData = [
      ['LAPORAN KEUANGAN & MANAJEMEN ARUS KAS DPP AKP2I', ''],
      ['Tahun Anggaran:', '2026'],
      ['Waktu Cetak:', new Date().toLocaleString('id-ID')],
      ['', ''],
      ['KOMPONEN KEUANGAN', 'NOMINAL (RP)'],
      ['Total Pemasukan Peserta Terverifikasi', totalRevenue],
      ['Akumulasi Saldo Kas Masuk Berjalan', totalRevenue],
      [
        'Total Piutang (Menunggu Verifikasi & Belum Bayar)',
        registrations
          .filter((r) => r.paymentStatus !== 'Pembayaran Terverifikasi')
          .reduce((s, r) => s + r.amount, 0),
      ],
      ['Total Beban Pengeluaran Terbayar', totalExp],
      [
        'Total Beban Pengeluaran Menunggu Pembayaran',
        expenses
          .filter((e) => e.status === 'Menunggu Pembayaran')
          .reduce((s, e) => s + e.amount, 0),
      ],
      ['SURPLUS / SALDO KAS BERSIH OPERASIONAL', totalRevenue - totalExp],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 45 }, { wch: 25 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsSummary, 'Ringkasan Laba & Kas');
    XLSX.utils.book_append_sheet(workbook, wsInflow, 'Penerimaan Kas (Inflow)');
    XLSX.utils.book_append_sheet(workbook, wsOutflow, 'Pengeluaran Kas (Outflow)');

    try {
      XLSX.writeFile(workbook, 'Laporan_Keuangan_Arus_Kas_AKP2I_2026.xlsx');
    } catch {
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Laporan_Keuangan_Arus_Kas_AKP2I_2026.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    }

    onShowToast('Laporan Keuangan Excel (.xlsx) 3 Sheet berhasil diunduh.');
  };

  /* --------------------------------------------------------------------------
     1. ADMIN DASHBOARD & ANALYTICS
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-dashboard' || activeSubView === 'admin-reporting') {
    const monthsOrder = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
    const monthlyStats = monthsOrder.map((month) => {
      const regsInMonth = registrations.filter(
        (r) =>
          r.paymentStatus === 'Pembayaran Terverifikasi' &&
          (r.registeredAt.toLowerCase().includes(month.toLowerCase()) ||
            (month === 'Agu' && r.registeredAt.toLowerCase().includes('aug')))
      );
      const revInMillions = Number(
        (regsInMonth.reduce((sum, r) => sum + r.amount, 0) / 1000000).toFixed(1)
      );
      return {
        month,
        peserta: regsInMonth.length,
        revenue: revInMillions,
      };
    });
    const maxMonthlyRevenue = Math.max(...monthlyStats.map((m) => m.revenue), 10);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
              PANEL ORGANIZER · PERAN AKTIF: {currentRole.toUpperCase()}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
              {activeSubView === 'admin-reporting'
                ? 'Laporan Eksekutif & Analitik Pendapatan AKP2I'
                : 'Dashboard Manajemen Pelatihan AKP2I'}
            </h1>
            <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1">
              Ringkasan real-time pendaftaran peserta, verifikasi pembayaran, tingkat kelulusan, dan penerbitan sertifikat.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => onNavigateSubView && onNavigateSubView('admin-finance')}
              className="px-4 py-2.5 rounded-lg border border-[#087A4B] bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] hover:bg-[#087A4B] hover:text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              title="Buka Manajemen Keuangan & Manajemen Arus Kas AKP2I"
            >
              <Landmark className="w-4 h-4" />
              <span>Buka Manajemen Keuangan</span>
            </button>
            <button
              onClick={handleExportXlsx}
              className="px-4 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Laporan Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 8 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24]">
            <span className="text-[11px] font-bold text-[#66757F] uppercase">TOTAL PENDAFTARAN PESERTA</span>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white mt-1 tabular-nums">
              {registrations.length} Peserta
            </div>
            <span className="text-xs text-[#087A4B] dark:text-[#34D399] font-semibold">
              Tersinkronisasi Database Firestore
            </span>
          </div>

          <div className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24]">
            <span className="text-[11px] font-bold text-[#66757F] uppercase">TOTAL PROGRAM PELATIHAN</span>
            <div className="text-2xl font-mono font-extrabold text-[#172026] dark:text-white mt-1 tabular-nums">
              {programs.length} Program
            </div>
            <span className="text-xs text-[#66757F]">
              {programs.filter((p) => p.status === 'Sedang Dibuka').length} Program Sedang Dibuka
            </span>
          </div>

          <div className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24]">
            <span className="text-[11px] font-bold text-[#66757F] uppercase">MENUNGGU VERIFIKASI BAYAR</span>
            <div className="text-2xl font-mono font-extrabold text-[#B45309] dark:text-[#F4C430] mt-1 tabular-nums">
              {pendingPayments.length} Transaksi
            </div>
            <span className="text-xs text-[#66757F]">Perlu tindakan Verifikator</span>
          </div>

          <div
            onClick={() => onNavigateSubView && onNavigateSubView('admin-finance')}
            className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] hover:border-[#087A4B] dark:hover:border-[#34D399] transition-all cursor-pointer group shadow-xs"
            title="Klik untuk membuka Manajemen Keuangan & Arus Kas Lengkap"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#66757F] uppercase">PENDAPATAN TERVERIFIKASI</span>
              <span className="text-[10px] font-bold text-[#087A4B] dark:text-[#34D399] group-hover:underline inline-flex items-center gap-0.5">
                Manajemen Keuangan <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-mono font-extrabold text-[#087A4B] dark:text-[#34D399] mt-1 tabular-nums">
              {formatRupiah(totalRevenue)}
            </div>
            <span className="text-xs text-[#66757F]">Kuartal Berjalan 2026 · Realisasi Kas Masuk</span>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172026] dark:text-white">
                Grafik Pertumbuhan Peserta & Pendapatan Bulanan (Juta Rupiah)
              </h3>
              <span className="text-xs font-mono text-[#087A4B] dark:text-[#34D399]">
                Mei – Oktober 2026
              </span>
            </div>

            <div className="grid grid-cols-6 gap-3 items-end h-52 pt-6 px-2 border-b border-[#D9E2DE] dark:border-[#243239]">
              {monthlyStats.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-[#087A4B] dark:text-[#F4C430] tabular-nums">
                    Rp{m.revenue}Jt
                  </span>
                  <div
                    className="w-full max-w-[42px] rounded-t-md bg-gradient-to-t from-[#045A38] to-[#0B8F5A] transition-all"
                    style={{
                      height:
                        m.revenue > 0
                          ? `${Math.max(8, Math.round((m.revenue / maxMonthlyRevenue) * 100))}%`
                          : '4px',
                    }}
                  />
                  <span className="text-xs font-bold text-[#66757F] pb-2">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#172026] dark:text-white">
              Distribusi Peserta per Program Populer
            </h3>
            <div className="space-y-3.5">
              {programs.slice(0, 5).map((p) => {
                const pct = Math.min(100, Math.round((p.enrolled / p.quota) * 100));
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#172026] dark:text-slate-200 truncate max-w-[230px]">
                        {p.shortTitle}
                      </span>
                      <span className="font-mono font-bold text-[#087A4B] dark:text-[#34D399] tabular-nums">
                        {p.enrolled}/{p.quota} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-[#087A4B]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Audit Log & WhatsApp Notification Gateway */}
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D9E2DE] dark:border-[#243239] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#172026] dark:text-white">
                Audit Log Keamanan & Integrasi WhatsApp Notification Gateway
              </h3>
              <p className="text-xs text-[#66757F]">
                Pencatatan otomatis setiap perubahan status verifikasi dan pengiriman pesan WhatsApp ke peserta.
              </p>
            </div>
            <button
              onClick={() =>
                onDispatchWhatsApp(
                  '0811582583',
                  'Reminder AKP2I: Sesi Kelas Zoom Bimbel USKP A akan dimulai besok pukul 19.00 WIB.'
                )
              }
              className="px-3.5 py-2 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer self-start"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Test Reminder WhatsApp</span>
            </button>
          </div>
          <div className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#087A4B] dark:text-[#34D399]">
                    [{log.channel}] {log.actor} ({log.role})
                  </span>
                  <p className="text-[#172026] dark:text-slate-200">{log.action}</p>
                </div>
                <span className="font-mono text-[11px] text-[#66757F] shrink-0 tabular-nums">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     1B. FINANCIAL MANAGEMENT MODULE (MANAJEMEN KEUANGAN & MANAJEMEN ARUS KAS)
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-finance') {
    const totalIncome = totalRevenue;
    const pendingReceivables = registrations
      .filter((r) => r.paymentStatus !== 'Pembayaran Terverifikasi')
      .reduce((sum, r) => sum + r.amount, 0);
    const paidExpenses = expenses
      .filter((e) => e.status === 'Lunas / Terbayar')
      .reduce((sum, e) => sum + e.amount, 0);
    const pendingExpenses = expenses
      .filter((e) => e.status === 'Menunggu Pembayaran')
      .reduce((sum, e) => sum + e.amount, 0);
    const netSurplus = totalIncome - paidExpenses;
    const verifiedCount = registrations.filter(
      (r) => r.paymentStatus === 'Pembayaran Terverifikasi'
    ).length;
    const arpu = verifiedCount > 0 ? Math.round(totalRevenue / verifiedCount) : 0;

    // Filtered Inflow (Peserta)
    const filteredInflow = registrations.filter((r) => {
      const matchSearch =
        r.participantName.toLowerCase().includes(financeSearch.toLowerCase()) ||
        r.participantEmail.toLowerCase().includes(financeSearch.toLowerCase()) ||
        r.regNumber.toLowerCase().includes(financeSearch.toLowerCase()) ||
        r.programTitle.toLowerCase().includes(financeSearch.toLowerCase());
      const matchStatus =
        financeStatusFilter === 'Semua' || r.paymentStatus === financeStatusFilter;
      const matchProgram =
        financeProgramFilter === 'Semua' || r.programId === financeProgramFilter;
      const matchMethod =
        financeMethodFilter === 'Semua' || r.paymentMethod === financeMethodFilter;
      return matchSearch && matchStatus && matchProgram && matchMethod;
    });

    const filteredInflowTotal = filteredInflow.reduce((acc, r) => acc + r.amount, 0);

    // Filtered Outflow (Expenses)
    const filteredOutflow = expenses.filter((e) => {
      const matchSearch =
        e.description.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.code.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.picName.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        (e.receiptNumber &&
          e.receiptNumber.toLowerCase().includes(expenseSearch.toLowerCase()));
      const matchCat =
        expenseCategoryFilter === 'Semua' || e.category === expenseCategoryFilter;
      return matchSearch && matchCat;
    });

    const filteredOutflowTotal = filteredOutflow.reduce((acc, e) => acc + e.amount, 0);

    return (
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase tracking-wider">
                PANEL ORGANIZER & KEUANGAN · PERAN AKTIF: {currentRole.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]">
                MANAJEMEN RESMI KEUANGAN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Landmark className="w-7 h-7 text-[#087A4B] dark:text-[#F4C430]" />
              <span>Manajemen Keuangan & Arus Kas AKP2I</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-400 mt-1 max-w-4xl">
              Pembukuan komprehensif pemasukan pelatihan, penerbitan kwitansi resmi ber-stempel digital, pencatatan beban operasional pelatihan (narasumber, sewa venue, platform LMS), dan laporan keuangan multi-sheet Excel (.xlsx).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={openAddExpenseModal}
              className="px-4 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pengeluaran Operasional</span>
            </button>
            <button
              onClick={handleExportFinanceXlsx}
              className="px-4 py-2.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] hover:bg-[#EAF7F0] dark:hover:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              title="Unduh Laporan Keuangan Lengkap ke Excel (.xlsx) dengan 3 Sheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Laporan Keuangan (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 5 Financial Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Kas Masuk */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] shadow-xs">
            <div className="flex items-center justify-between text-[#087A4B] dark:text-[#34D399] mb-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66757F]">
                TOTAL KAS MASUK
              </span>
              <ArrowDownRight className="w-4 h-4 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#087A4B] dark:text-[#34D399] tabular-nums mt-0.5">
              {formatRupiah(totalIncome)}
            </div>
            <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-1">
              {verifiedCount} transaksi lunas · Akumulasi kas
            </p>
          </div>

          {/* Card 2: Piutang / Pending */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] shadow-xs">
            <div className="flex items-center justify-between text-[#B45309] dark:text-[#F4C430] mb-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66757F]">
                PIUTANG / BELUM LUNAS
              </span>
              <Clock className="w-4 h-4 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#B45309] dark:text-[#F4C430] tabular-nums mt-0.5">
              {formatRupiah(pendingReceivables)}
            </div>
            <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-1">
              {registrations.filter((r) => r.paymentStatus !== 'Pembayaran Terverifikasi').length} pendaftaran dalam proses
            </p>
          </div>

          {/* Card 3: Pengeluaran Operasional */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] shadow-xs">
            <div className="flex items-center justify-between text-red-600 dark:text-red-400 mb-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66757F]">
                BEBAN PENGELUARAN
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-red-600 dark:text-red-400 tabular-nums mt-0.5">
              {formatRupiah(paidExpenses)}
            </div>
            <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-1">
              Honor narasumber, sewa venue, & platform
            </p>
          </div>

          {/* Card 4: Saldo Kas Bersih / Net Margin */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#087A4B]/40 dark:border-[#087A4B]/50 bg-gradient-to-br from-[#EAF7F0]/40 to-white dark:from-[#087A4B]/10 dark:to-[#151F24] shadow-xs">
            <div className="flex items-center justify-between text-[#087A4B] dark:text-[#34D399] mb-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#087A4B] dark:text-[#34D399]">
                SALDO KAS BERSIH (NET)
              </span>
              <Sparkles className="w-4 h-4 shrink-0 text-[#F4C430]" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#087A4B] dark:text-[#34D399] tabular-nums mt-0.5">
              {formatRupiah(netSurplus)}
            </div>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                netSurplus > 0
                  ? 'bg-[#087A4B] text-white'
                  : netSurplus < 0
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-[#66757F] dark:text-slate-300'
              }`}
            >
              {netSurplus > 0
                ? 'Surplus Operasional Sehat'
                : netSurplus < 0
                ? 'Defisit Operasional'
                : 'Saldo Kas Bersih Seimbang (Rp 0)'}
            </span>
          </div>

          {/* Card 5: Rata-rata Kontribusi Transaksi (ARPU) */}
          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] shadow-xs">
            <div className="flex items-center justify-between text-[#172026] dark:text-white mb-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66757F]">
                RERATA NILAI TRANSAKSI
              </span>
              <Coins className="w-4 h-4 shrink-0 text-[#F4C430]" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#172026] dark:text-white tabular-nums mt-0.5">
              {formatRupiah(arpu)}
            </div>
            <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-1">
              Rata-rata per peserta pelatihan
            </p>
          </div>
        </div>

        {/* Financial Sub-Navigation Tabs */}
        <div className="flex border-b border-[#D9E2DE] dark:border-[#243239] gap-2 overflow-x-auto">
          {[
            {
              id: 'inflow',
              label: 'Jurnal Kas Masuk & Pembayaran Peserta',
              icon: ArrowDownRight,
              count: registrations.length,
            },
            {
              id: 'outflow',
              label: 'Buku Pengeluaran & Beban Operasional',
              icon: ArrowUpRight,
              count: expenses.length,
            },
            {
              id: 'programs',
              label: 'Performa Pendapatan per Program Pelatihan',
              icon: BookOpen,
              count: programs.length,
            },
            {
              id: 'payment-methods',
              label: 'Rekapitulasi Rekening Bank & Gateway',
              icon: Building2,
              count: paymentMethods.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFinanceTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold inline-flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                financeTab === tab.id
                  ? 'border-[#087A4B] text-[#087A4B] dark:border-[#F4C430] dark:text-[#F4C430]'
                  : 'border-transparent text-[#66757F] dark:text-slate-400 hover:text-[#172026] dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-[#66757F] dark:text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* --------------------------------------------------------------------
            TAB 1: JURNAL KAS MASUK (INFLOW) & PEMBAYARAN PESERTA
            -------------------------------------------------------------------- */}
        {financeTab === 'inflow' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="p-4 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66757F]" />
                  <input
                    type="text"
                    value={financeSearch}
                    onChange={(e) => setFinanceSearch(e.target.value)}
                    placeholder="Cari no invoice, nama peserta, email..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#66757F] font-semibold">Status:</span>
                  <select
                    value={financeStatusFilter}
                    onChange={(e) => setFinanceStatusFilter(e.target.value)}
                    className="px-2.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-bold cursor-pointer"
                  >
                    <option value="Semua">Semua Status Bayar</option>
                    <option value="Pembayaran Terverifikasi">Pembayaran Terverifikasi</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Belum Dibayar">Belum Dibayar</option>
                    <option value="Pembayaran Ditolak">Pembayaran Ditolak</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#66757F] font-semibold">Program:</span>
                  <select
                    value={financeProgramFilter}
                    onChange={(e) => setFinanceProgramFilter(e.target.value)}
                    className="px-2.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] max-w-[180px] truncate cursor-pointer"
                  >
                    <option value="Semua">Semua Program Pelatihan</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.shortTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#66757F] font-semibold">Metode:</span>
                  <select
                    value={financeMethodFilter}
                    onChange={(e) => setFinanceMethodFilter(e.target.value)}
                    className="px-2.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] cursor-pointer"
                  >
                    <option value="Semua">Semua Jalur Pembayaran</option>
                    {paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.name}>
                        {pm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono font-bold text-[#087A4B] dark:text-[#34D399] shrink-0">
                <span className="text-[#66757F] font-sans font-normal">Total Terfilter:</span>
                <span className="text-sm">{formatRupiah(filteredInflowTotal)}</span>
              </div>
            </div>

            {/* Bulk Action Bar for Inflow */}
            {selectedFinanceRegIds.length > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#087A4B]/10 border border-[#087A4B]/25 text-xs">
                <div className="flex items-center gap-2 text-[#087A4B] dark:text-[#34D399] font-bold">
                  <CheckSquare className="w-4 h-4 shrink-0" />
                  <span>{selectedFinanceRegIds.length} transaksi peserta dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      selectedFinanceRegIds.forEach((id) => onApprovePayment(id));
                      setSelectedFinanceRegIds([]);
                      onShowToast(`${selectedFinanceRegIds.length} pembayaran berhasil disetujui sekaligus.`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#087A4B] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>✓ Verifikasi Sekaligus</span>
                  </button>
                  <button
                    onClick={() => setSelectedFinanceRegIds([])}
                    className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Inflow Transactions Table */}
            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] text-[11px] font-extrabold text-[#66757F] uppercase tracking-wider">
                      <th className="py-3.5 px-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={
                            filteredInflow.length > 0 &&
                            selectedFinanceRegIds.length === filteredInflow.length
                          }
                          onChange={(e) =>
                            setSelectedFinanceRegIds(
                              e.target.checked ? filteredInflow.map((r) => r.id) : []
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                          title="Pilih semua transaksi"
                        />
                      </th>
                      <th className="py-3.5 px-4">NO. INVOICE / REGISTRASI</th>
                      <th className="py-3.5 px-4">TANGGAL</th>
                      <th className="py-3.5 px-4">NAMA PESERTA</th>
                      <th className="py-3.5 px-4">PROGRAM PELATIHAN</th>
                      <th className="py-3.5 px-4">JALUR PEMBAYARAN</th>
                      <th className="py-3.5 px-4 text-right">NOMINAL (RP)</th>
                      <th className="py-3.5 px-4">STATUS BAYAR</th>
                      <th className="py-3.5 px-4 text-right">AKSI KEUANGAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                    {filteredInflow.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-[#66757F]">
                          Tidak ada data transaksi pembayaran yang sesuai filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredInflow.map((reg) => (
                        <tr
                          key={reg.id}
                          className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                            selectedFinanceRegIds.includes(reg.id)
                              ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10'
                              : ''
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedFinanceRegIds.includes(reg.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedFinanceRegIds((prev) =>
                                  prev.includes(reg.id)
                                    ? prev.filter((id) => id !== reg.id)
                                    : [...prev, reg.id]
                                );
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#087A4B] dark:text-[#34D399]">
                            {reg.regNumber}
                          </td>
                          <td className="py-3.5 px-4 text-[#66757F] whitespace-nowrap">
                            {reg.registeredAt}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#172026] dark:text-white">
                              {reg.participantName}
                            </div>
                            <div className="text-[11px] text-[#66757F] dark:text-slate-400">
                              {reg.participantEmail}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-[220px]">
                            <div className="font-semibold text-[#172026] dark:text-slate-200 truncate">
                              {reg.programTitle}
                            </div>
                            {reg.subTierName && (
                              <span className="text-[10px] text-[#087A4B] dark:text-[#34D399]">
                                {reg.subTierName}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-[#172026] dark:text-slate-200">
                              {reg.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#172026] dark:text-white tabular-nums">
                            {formatRupiah(reg.amount)}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusLabel status={reg.paymentStatus} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setReceiptModalReg(reg)}
                                className="px-2.5 py-1 rounded bg-[#087A4B] hover:bg-[#045A38] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                title="Lihat & Cetak Kwitansi Resmi Pembayaran AKP2I"
                              >
                                <Receipt className="w-3 h-3" />
                                <span>Kwitansi Resmi</span>
                              </button>

                              {reg.paymentStatus === 'Menunggu Verifikasi' && (
                                <button
                                  onClick={() => {
                                    onApprovePayment(reg.id);
                                    onShowToast(`Pembayaran ${reg.participantName} berhasil diverifikasi.`);
                                  }}
                                  className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer"
                                  title="Verifikasi langsung pembayaran peserta"
                                >
                                  ✓ Verifikasi
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            TAB 2: BUKU PENGELUARAN & BEBAN OPERASIONAL (OUTFLOW)
            -------------------------------------------------------------------- */}
        {financeTab === 'outflow' && (
          <div className="space-y-4">
            {/* Filter & Action Bar for Outflow */}
            <div className="p-4 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66757F]" />
                  <input
                    type="text"
                    value={expenseSearch}
                    onChange={(e) => setExpenseSearch(e.target.value)}
                    placeholder="Cari uraian, nomor bukti, atau nama PIC..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#66757F] font-semibold">Kategori Biaya:</span>
                  <select
                    value={expenseCategoryFilter}
                    onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                    className="px-2.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-bold cursor-pointer"
                  >
                    <option value="Semua">Semua Kategori Biaya</option>
                    <option value="Honor Instruktur & Pemateri">Honor Instruktur & Pemateri</option>
                    <option value="Sewa Zoom & Platform LMS">Sewa Zoom & Platform LMS</option>
                    <option value="Sewa Venue & Ruang Kelas">Sewa Venue & Ruang Kelas</option>
                    <option value="Modul & Materi Cetak">Modul & Materi Cetak</option>
                    <option value="Konsumsi & Logistik">Konsumsi & Logistik</option>
                    <option value="Sertifikasi & Blangko">Sertifikasi & Blangko</option>
                    <option value="Operasional & Administrasi">Operasional & Administrasi</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-mono font-bold text-red-600 dark:text-red-400">
                  <span className="text-[#66757F] font-sans font-normal text-xs mr-1">
                    Total Beban Terfilter:
                  </span>
                  <span className="text-sm">{formatRupiah(filteredOutflowTotal)}</span>
                </div>
                <button
                  onClick={openAddExpenseModal}
                  className="px-3.5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Catat Pengeluaran</span>
                </button>
              </div>
            </div>

            {/* Bulk Action Bar for Expenses */}
            {selectedExpenseIds.length > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>{selectedExpenseIds.length} data pengeluaran dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onDeleteMultipleExpenses) {
                        onDeleteMultipleExpenses(selectedExpenseIds);
                      }
                      setSelectedExpenseIds([]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Hapus Pengeluaran Terpilih</span>
                  </button>
                  <button
                    onClick={() => setSelectedExpenseIds([])}
                    className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Expenses Table */}
            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] text-[11px] font-extrabold text-[#66757F] uppercase tracking-wider">
                      <th className="py-3.5 px-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={
                            filteredOutflow.length > 0 &&
                            selectedExpenseIds.length === filteredOutflow.length
                          }
                          onChange={(e) =>
                            setSelectedExpenseIds(
                              e.target.checked ? filteredOutflow.map((ex) => ex.id) : []
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                          title="Pilih semua pengeluaran"
                        />
                      </th>
                      <th className="py-3.5 px-4">NO. BUKTI KAS</th>
                      <th className="py-3.5 px-4">TANGGAL</th>
                      <th className="py-3.5 px-4">KATEGORI BIAYA</th>
                      <th className="py-3.5 px-4">URAIAN / DESKRIPSI KEGIATAN</th>
                      <th className="py-3.5 px-4">PROGRAM TERKAIT</th>
                      <th className="py-3.5 px-4 text-right">NOMINAL BIAYA (RP)</th>
                      <th className="py-3.5 px-4">PIC / PETUGAS</th>
                      <th className="py-3.5 px-4">STATUS BEBAN</th>
                      <th className="py-3.5 px-4 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                    {filteredOutflow.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-[#66757F]">
                          Belum ada data pengeluaran operasional yang dicatat. Klik "+ Catat Pengeluaran" untuk menambahkan.
                        </td>
                      </tr>
                    ) : (
                      filteredOutflow.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                            selectedExpenseIds.includes(item.id)
                              ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10'
                              : ''
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedExpenseIds.includes(item.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedExpenseIds((prev) =>
                                  prev.includes(item.id)
                                    ? prev.filter((id) => id !== item.id)
                                    : [...prev, item.id]
                                );
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                            {item.code}
                          </td>
                          <td className="py-3.5 px-4 text-[#66757F] whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-semibold text-[#172026] dark:text-white">
                              {item.description}
                            </div>
                            {item.notes && (
                              <p className="text-[11px] text-[#66757F] dark:text-slate-400 truncate">
                                Ket: {item.notes}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 max-w-[180px] text-[#66757F] truncate">
                            {item.programTitle || 'Umum & Operasional'}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-extrabold text-red-600 dark:text-red-400 tabular-nums">
                            {formatRupiah(item.amount)}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#172026] dark:text-slate-300">
                            {item.picName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                item.status === 'Lunas / Terbayar'
                                  ? 'bg-[#EAF7F0] text-[#087A4B] dark:bg-[#087A4B]/20 dark:text-[#34D399]'
                                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => openEditExpenseModal(item)}
                                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-[#087A4B] cursor-pointer"
                                title="Edit Pengeluaran"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingExpense(item)}
                                className="p-1.5 rounded hover:bg-red-500/15 text-red-600 cursor-pointer"
                                title="Hapus Pengeluaran"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            TAB 3: PERFORMA PENDAPATAN PER PROGRAM PELATIHAN
            -------------------------------------------------------------------- */}
        {financeTab === 'programs' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 shadow-xs">
              <h2 className="text-sm font-bold text-[#172026] dark:text-white mb-1">
                Analisis Realisasi Omset & Target Keuangan Tiap Program
              </h2>
              <p className="text-xs text-[#66757F] mb-4">
                Membandingkan target kapasitas kuota dengan pendapatan terverifikasi yang telah masuk ke kas bendahara AKP2I.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] text-[11px] font-extrabold text-[#66757F] uppercase tracking-wider">
                      <th className="py-3.5 px-4">PROGRAM PELATIHAN</th>
                      <th className="py-3.5 px-4">KATEGORI</th>
                      <th className="py-3.5 px-4 text-right">HARGA / TIKET</th>
                      <th className="py-3.5 px-4 text-center">KUOTA & TERDAFTAR</th>
                      <th className="py-3.5 px-4 text-center">PESERTA LUNAS</th>
                      <th className="py-3.5 px-4 text-right">REALISASI KAS (RP)</th>
                      <th className="py-3.5 px-4 text-right">POTENSI TOTAL (RP)</th>
                      <th className="py-3.5 px-4 w-40">CAPAIAN TARGET (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239]">
                    {programs.map((p) => {
                      const progRegs = registrations.filter((r) => r.programId === p.id);
                      const progVerified = progRegs.filter(
                        (r) => r.paymentStatus === 'Pembayaran Terverifikasi'
                      );
                      const realisasi = progVerified.reduce((s, r) => s + r.amount, 0);
                      const potensi = p.price * p.quota;
                      const pct = Math.min(
                        100,
                        potensi > 0 ? Math.round((realisasi / potensi) * 100) : 0
                      );

                      return (
                        <tr key={p.id} className="hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50">
                          <td className="py-3.5 px-4 font-bold text-[#172026] dark:text-white">
                            <div>{p.title}</div>
                            <span className="font-mono text-[10px] text-[#087A4B] dark:text-[#F4C430]">
                              {p.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-[#172026] dark:text-slate-300">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold">
                            {p.enrolled} / {p.quota}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-[#087A4B] dark:text-[#34D399]">
                            {progVerified.length} Peserta
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#087A4B] dark:text-[#34D399]">
                            {formatRupiah(realisasi)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#66757F]">
                            {formatRupiah(potensi)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-mono font-bold">
                                <span>{pct}%</span>
                                <span className={pct >= 75 ? 'text-[#087A4B]' : 'text-amber-600'}>
                                  {pct >= 100 ? 'Target Penuh' : pct >= 50 ? 'On-Track' : 'Optimasi'}
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-[#087A4B] transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------
            TAB 4: REKAPITULASI SALURAN BAYAR & REKENING KAS
            -------------------------------------------------------------------- */}
        {financeTab === 'payment-methods' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((pm) => {
                const matchedRegs = registrations.filter(
                  (r) =>
                    r.paymentMethod === pm.name &&
                    r.paymentStatus === 'Pembayaran Terverifikasi'
                );
                const methodTotal = matchedRegs.reduce((s, r) => s + r.amount, 0);

                return (
                  <div
                    key={pm.id}
                    className="p-5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {pm.type === 'qris' ? (
                          <QrCode className="w-5 h-5 text-[#087A4B] dark:text-[#F4C430]" />
                        ) : (
                          <Building2 className="w-5 h-5 text-[#087A4B] dark:text-[#34D399]" />
                        )}
                        <h3 className="font-bold text-sm text-[#172026] dark:text-white">
                          {pm.name}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]">
                        AKTIF
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[#66757F]">Nomor Rekening / NMID:</div>
                      <div className="font-mono font-extrabold text-sm text-[#172026] dark:text-white">
                        {pm.accountNumber || '-'}
                      </div>
                      <div className="text-[11px] text-[#66757F] truncate">
                        Atas Nama: {pm.accountHolder}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#66757F] block text-[11px]">Transaksi Lunas:</span>
                        <span className="font-bold text-[#172026] dark:text-white">
                          {matchedRegs.length} Transaksi
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#66757F] block text-[11px]">Total Masuk:</span>
                        <span className="font-mono font-extrabold text-[#087A4B] dark:text-[#34D399]">
                          {formatRupiah(methodTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL 1: KWITANSI RESMI PEMBAYARAN AKP2I (OFFICIAL TAX RECEIPT)
            ==================================================================== */}
        {receiptModalReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl bg-white text-[#172026] border border-[#D9E2DE] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
              {/* Kop Kwitansi Resmi */}
              <div className="flex items-center justify-between border-b-2 border-[#087A4B] pb-4">
                <div className="flex items-center gap-3">
                  <Akp2iLogoMark compact={true} />
                  <div>
                    <h2 className="text-base font-extrabold text-[#087A4B] leading-tight">
                      PERKUMPULAN ASOSIASI KONSULTAN PAJAK PUBLIK INDONESIA
                    </h2>
                    <p className="text-[11px] font-bold text-[#172026] tracking-wide">
                      AKP2I LEARNING CENTER · DEWAN PENGURUS PUSAT (DPP)
                    </p>
                    <p className="text-[10px] text-[#66757F]">
                      Keputusan Menkumham RI No. AHU-0000288.AH.01.07.Tahun 2020 · Gedung Perpajakan Lt. 8, Jakarta Pusat
                    </p>
                  </div>
                </div>
              </div>

              {/* Judul Kwitansi & Nomor Registrasi */}
              <div className="text-center space-y-1">
                <span className="inline-block px-3 py-1 rounded bg-[#EAF7F0] text-[#087A4B] font-extrabold text-xs uppercase tracking-wider">
                  KWITANSI PENERIMAAN PEMBAYARAN RESMI
                </span>
                <p className="font-mono font-bold text-xs text-[#66757F]">
                  Nomor: KW-AKP2I/2026/{receiptModalReg.regNumber}
                </p>
              </div>

              {/* Rincian Kwitansi Formal */}
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100">
                  <span className="col-span-4 font-bold text-[#66757F]">Telah Terima Dari</span>
                  <span className="col-span-8 font-extrabold text-sm text-[#172026]">
                    : {receiptModalReg.participantName}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-2.5 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <span className="col-span-4 font-bold text-amber-900">Uang Sejumlah</span>
                  <span className="col-span-8 font-serif italic font-bold text-amber-950 leading-relaxed">
                    : "{angkaKeTerbilang(receiptModalReg.amount)}"
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100">
                  <span className="col-span-4 font-bold text-[#66757F]">Untuk Pembayaran</span>
                  <span className="col-span-8 font-semibold text-[#172026] leading-relaxed">
                    : Biaya Pendaftaran {receiptModalReg.programTitle}
                    {receiptModalReg.subTierName && ` (${receiptModalReg.subTierName})`}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100">
                  <span className="col-span-4 font-bold text-[#66757F]">Jalur Pembayaran</span>
                  <span className="col-span-8 font-mono font-bold text-[#172026]">
                    : {receiptModalReg.paymentMethod} (Status: {receiptModalReg.paymentStatus})
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100">
                  <span className="col-span-4 font-bold text-[#66757F]">Jadwal Pelatihan</span>
                  <span className="col-span-8 font-semibold text-[#172026]">
                    : {receiptModalReg.trainingDateText || 'Sesuai Jadwal Penyelenggara'}
                  </span>
                </div>

                {/* Box Terbilang Angka Besar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="p-3.5 rounded-xl border-2 border-[#087A4B] bg-[#EAF7F0]/40 inline-flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#087A4B]">TERBILANG :</span>
                    <span className="text-xl font-mono font-extrabold text-[#087A4B] tabular-nums">
                      {formatRupiah(receiptModalReg.amount)}
                    </span>
                  </div>

                  {/* Stempel & Tanda Tangan Digital */}
                  <div className="text-right text-[11px] space-y-1">
                    <p className="text-[#66757F]">
                      Jakarta, {receiptModalReg.registeredAt || '08 Oktober 2026'}
                    </p>
                    <p className="font-bold text-[#172026]">Bendahara DPP AKP2I</p>
                    <div className="h-12 flex items-center justify-end">
                      <div className="px-2.5 py-1 rounded border border-[#087A4B] bg-white text-[10px] font-mono font-bold text-[#087A4B] shadow-2xs rotate-[-3deg]">
                        [ STEMPEL RESMI DPP AKP2I LUNAS ]
                      </div>
                    </div>
                    <p className="font-bold text-[#087A4B] underline">
                      Tim Administrasi & Keuangan Pusat
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    const text = `KWITANSI PEMBAYARAN AKP2I\nNo: KW-AKP2I/2026/${receiptModalReg.regNumber}\nPeserta: ${receiptModalReg.participantName}\nProgram: ${receiptModalReg.programTitle}\nNominal: ${formatRupiah(receiptModalReg.amount)}\nStatus: ${receiptModalReg.paymentStatus}`;
                    navigator.clipboard.writeText(text);
                    onShowToast('Data ringkasan kwitansi berhasil disalin ke clipboard.');
                  }}
                  className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] hover:bg-slate-100 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks Kwitansi</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Kwitansi / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiptModalReg(null)}
                    className="px-4 py-2 rounded-lg border border-[#D9E2DE] text-xs font-bold cursor-pointer hover:bg-gray-100"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL 2: CATAT / EDIT PENGELUARAN OPERASIONAL KAS
            ==================================================================== */}
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9E2DE] dark:border-[#243239]">
                <h3 className="text-base font-extrabold text-[#172026] dark:text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#087A4B] dark:text-[#F4C430]" />
                  <span>
                    {editingExpense
                      ? 'Edit Data Pengeluaran Kas'
                      : 'Catat Pengeluaran Kas Operasional Baru'}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="p-1 text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExpense} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Tanggal Pengeluaran *
                    </label>
                    <input
                      type="text"
                      required
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      placeholder="Contoh: 08 Okt 2026"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Kategori Beban Biaya *
                    </label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-bold"
                    >
                      <option value="Honor Instruktur & Pemateri">
                        Honor Instruktur & Pemateri
                      </option>
                      <option value="Sewa Zoom & Platform LMS">
                        Sewa Zoom & Platform LMS
                      </option>
                      <option value="Sewa Venue & Ruang Kelas">
                        Sewa Venue & Ruang Kelas
                      </option>
                      <option value="Modul & Materi Cetak">Modul & Materi Cetak</option>
                      <option value="Konsumsi & Logistik">Konsumsi & Logistik</option>
                      <option value="Sertifikasi & Blangko">Sertifikasi & Blangko</option>
                      <option value="Operasional & Administrasi">
                        Operasional & Administrasi
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Uraian / Deskripsi Pengeluaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="Contoh: Honorarium Pengajar USKP A Sesi 1 - 3"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Terkait Program Pelatihan (Opsional)
                    </label>
                    <select
                      value={expProgramId}
                      onChange={(e) => setExpProgramId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    >
                      <option value="">Umum / Tidak Terikat Program</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Nominal Pengeluaran (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50000}
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 font-mono font-bold rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      No. Bukti Kas / Kwitansi / Nota
                    </label>
                    <input
                      type="text"
                      value={expReceiptNo}
                      onChange={(e) => setExpReceiptNo(e.target.value)}
                      placeholder="Contoh: BKK-AKP2I/2026/012"
                      className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Penanggung Jawab (PIC) *
                    </label>
                    <input
                      type="text"
                      required
                      value={expPic}
                      onChange={(e) => setExpPic(e.target.value)}
                      placeholder="Nama PIC pengeluaran"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Status Beban Biaya *
                    </label>
                    <select
                      value={expStatus}
                      onChange={(e) => setExpStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-bold"
                    >
                      <option value="Lunas / Terbayar">Lunas / Terbayar</option>
                      <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                      <option value="Ditolak">Ditolak / Dibatalkan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#66757F] mb-1">
                      Catatan / Metode Pencairan
                    </label>
                    <input
                      type="text"
                      value={expNotes}
                      onChange={(e) => setExpNotes(e.target.value)}
                      placeholder="Contoh: Transfer Mandiri ke Rek. Pemateri"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>
                </div>

                {/* Dynamic Custom Fields from Form Builder for Manajemen Keuangan */}
                {formFields.filter((f) => f.targetModule === 'finance' && f.visible).length > 0 && (
                  <div className="p-3.5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#087A4B]/20 space-y-3">
                    <div className="flex items-center gap-1.5 text-[#087A4B] dark:text-[#34D399] font-bold text-xs">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Field Tambahan (Dynamic Form Builder — Manajemen Keuangan)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formFields
                        .filter((f) => f.targetModule === 'finance' && f.visible)
                        .map((fld) => (
                          <div key={fld.id} className={fld.type === 'textarea' ? 'sm:col-span-2' : ''}>
                            <label className="block font-bold text-[#66757F] mb-1">
                              {fld.label} {fld.required && <span className="text-red-500">*</span>}
                            </label>
                            {fld.type === 'select' ? (
                              <select
                                value={customFieldValues[fld.key] || ''}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              >
                                <option value="">Pilih opsi...</option>
                                {fld.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : fld.type === 'radio' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => (
                                  <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                    <input
                                      type="radio"
                                      name={fld.key}
                                      checked={customFieldValues[fld.key] === opt}
                                      onChange={() =>
                                        setCustomFieldValues((prev) => ({
                                          ...prev,
                                          [fld.key]: opt,
                                        }))
                                      }
                                      className="accent-[#087A4B]"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : fld.type === 'checkbox' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => {
                                  const currentVals = (customFieldValues[fld.key] || '')
                                    .split(', ')
                                    .filter(Boolean);
                                  const isChecked = currentVals.includes(opt);
                                  return (
                                    <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const updated = e.target.checked
                                            ? [...currentVals, opt]
                                            : currentVals.filter((v: string) => v !== opt);
                                          setCustomFieldValues((prev) => ({
                                            ...prev,
                                            [fld.key]: updated.join(', '),
                                          }));
                                        }}
                                        className="accent-[#087A4B] rounded"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : fld.type === 'textarea' ? (
                              <textarea
                                value={customFieldValues[fld.key] || ''}
                                placeholder={fld.placeholder || `Masukkan ${fld.label}`}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                rows={2}
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            ) : (
                              <input
                                type={fld.type === 'number' ? 'number' : fld.type === 'date' ? 'date' : 'text'}
                                value={customFieldValues[fld.key] || ''}
                                placeholder={fld.placeholder || `Masukkan ${fld.label}`}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                  <button
                    type="button"
                    onClick={() => setShowExpenseModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold cursor-pointer"
                  >
                    {editingExpense ? 'Simpan Perubahan' : 'Simpan Pengeluaran Kas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL 3: HAPUS PENGELUARAN CONFIRMATION
            ==================================================================== */}
        {deletingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <h3 className="text-base font-extrabold text-red-600 dark:text-red-400">
                Hapus Pengeluaran Kas
              </h3>
              <p className="text-[#66757F] dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pengeluaran kas{' '}
                <strong className="text-[#172026] dark:text-white">
                  "{deletingExpense.description}" ({formatRupiah(deletingExpense.amount)})
                </strong>
                ?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingExpense(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteExpense) {
                      onDeleteExpense(deletingExpense.id);
                    }
                    setDeletingExpense(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                >
                  Ya, Hapus Pengeluaran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     2. PROGRAM MANAGEMENT VIEW (FULL CRUD FOR SUPER ADMIN & ADMIN PELATIHAN)
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-programs') {
    const openCreateModal = () => {
      if (!canManagePrograms) {
        onShowToast('Akses ditolak: Hanya Super Admin dan Admin Pelatihan yang dapat menambah program.');
        return;
      }
      setEditingProgId(null);
      setProgTitle('');
      setProgShortTitle('');
      setProgCode(`AKP2I-PRG-${Math.floor(100 + Math.random() * 900)}`);
      setProgCat('Brevet Pajak');
      setProgStatus('Sedang Dibuka');
      setProgStartDate('15 Nov 2026');
      setProgEndDate('20 Des 2026');
      setProgTimeText('09.00 – 16.00 WIB');
      setProgDurationText('6 Pertemuan Intensif');
      setProgMethod('Online Zoom');
      setProgLocation('Online');
      setProgLocationDetail('Zoom Cloud Meeting AKP2I');
      setProgPrice(2500000);
      setProgQuota(100);
      setProgInstructorName('Tim Pengajar Nasional AKP2I, BKP');
      setProgInstructorTitle('Komite Pelatihan & Sertifikasi AKP2I');
      setProgOverview('Program pengembangan kompetensi profesional perpajakan resmi AKP2I.');
      setProgSyllabusText(
        'Ketentuan Umum & Tata Cara Perpajakan (KUP)\nStudi Kasus Perhitungan & Pelaporan SPT Coretax'
      );
      setProgFacilitiesText(
        'E-Sertifikat Ber-QR Code Resmi AKP2I\nModul Materi Digital PDF & Rekaman Kelas'
      );
      setProgRequirementsText('Warga Negara Indonesia dengan KTP & NPWP Valid');
      setProgFeatured(true);
      setProgPublished(true);
      setShowProgModal(true);
    };

    const openEditModal = (prog: Program) => {
      if (!canManagePrograms) {
        onShowToast('Akses ditolak: Hanya Super Admin dan Admin Pelatihan yang dapat mengubah program.');
        return;
      }
      setEditingProgId(prog.id);
      setProgTitle(prog.title);
      setProgShortTitle(prog.shortTitle);
      setProgCode(prog.code);
      setProgCat(prog.category);
      setProgStatus(prog.status);
      setProgStartDate(prog.startDate);
      setProgEndDate(prog.endDate);
      setProgTimeText(prog.timeText);
      setProgDurationText(prog.durationText);
      setProgMethod(prog.method);
      setProgLocation(prog.location);
      setProgLocationDetail(prog.locationDetail);
      setProgPrice(prog.price);
      setProgQuota(prog.quota);
      setProgInstructorName(prog.instructorName);
      setProgInstructorTitle(prog.instructorTitle);
      setProgOverview(prog.overview);
      setProgSyllabusText(prog.syllabus.join('\n'));
      setProgFacilitiesText(prog.facilities.join('\n'));
      setProgRequirementsText(prog.requirements.join('\n'));
      setProgFeatured(prog.featured);
      setProgPublished(prog.published);
      setShowProgModal(true);
    };

    const handleSaveProgram = (e: React.FormEvent) => {
      e.preventDefault();
      if (!canManagePrograms) return;
      if (!progTitle.trim()) return;

      const parsedSyllabus = progSyllabusText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedFacilities = progFacilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedRequirements = progRequirementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingProgId) {
        const updatedList = programs.map((item) =>
          item.id === editingProgId
            ? {
                ...item,
                title: progTitle.trim(),
                shortTitle: progShortTitle.trim() || progTitle.trim().slice(0, 36),
                code: progCode.trim() || item.code,
                category: progCat,
                status: progStatus,
                startDate: progStartDate.trim(),
                endDate: progEndDate.trim(),
                timeText: progTimeText.trim(),
                durationText: progDurationText.trim(),
                method: progMethod,
                location: progLocation,
                locationDetail: progLocationDetail.trim(),
                price: Number(progPrice) || 0,
                quota: Number(progQuota) || 1,
                instructorName: progInstructorName.trim(),
                instructorTitle: progInstructorTitle.trim(),
                overview: progOverview.trim(),
                syllabus: parsedSyllabus.length > 0 ? parsedSyllabus : item.syllabus,
                facilities: parsedFacilities.length > 0 ? parsedFacilities : item.facilities,
                requirements:
                  parsedRequirements.length > 0 ? parsedRequirements : item.requirements,
                featured: progFeatured,
                published: progPublished,
              }
            : item
        );
        onUpdatePrograms(updatedList);
        setShowProgModal(false);
        setEditingProgId(null);
        onShowToast(`Program "${progTitle.trim()}" berhasil diperbarui!`);
      } else {
        const created: Program = {
          id: `prog-${Date.now()}`,
          code: progCode.trim() || `AKP2I-NEW-${Math.floor(100 + Math.random() * 900)}`,
          title: progTitle.trim(),
          shortTitle: progShortTitle.trim() || progTitle.trim().slice(0, 36),
          category: progCat,
          status: progStatus,
          bannerUrl:
            progCat === 'Uji Kompetensi Perpajakan'
              ? ASSETS.ukpPoster
              : progCat === 'Bimbel USKP'
              ? ASSETS.uskpBanner
              : ASSETS.brevetBanner,
          startDate: progStartDate.trim(),
          endDate: progEndDate.trim(),
          timeText: progTimeText.trim(),
          durationText: progDurationText.trim(),
          method: progMethod,
          location: progLocation,
          locationDetail: progLocationDetail.trim(),
          price: Number(progPrice) || 0,
          quota: Number(progQuota) || 1,
          enrolled: 0,
          featured: progFeatured,
          published: progPublished,
          instructorName: progInstructorName.trim(),
          instructorTitle: progInstructorTitle.trim(),
          overview: progOverview.trim(),
          syllabus:
            parsedSyllabus.length > 0
              ? parsedSyllabus
              : ['Materi Inti Perpajakan & Studi Kasus Komprehensif'],
          facilities:
            parsedFacilities.length > 0
              ? parsedFacilities
              : ['E-Sertifikat Ber-QR Code', 'Modul Digital PDF & Rekaman Kelas'],
          requirements:
            parsedRequirements.length > 0 ? parsedRequirements : ['KTP & NPWP Valid'],
          faqs: [],
          lessons: [],
          examQuestions: [],
        };
        onUpdatePrograms([created, ...programs]);
        setShowProgModal(false);
        onShowToast(`Program "${created.title}" berhasil dibuat & dipublikasikan!`);
      }
    };

    const handleConfirmDeleteProgram = () => {
      if (!canManagePrograms || !deletingProg) return;
      const title = deletingProg.title;
      onUpdatePrograms(programs.filter((p) => p.id !== deletingProg.id));
      setDeletingProg(null);
      onShowToast(`Program "${title}" telah dihapus secara permanen.`);
    };

    const handleDuplicate = (prog: Program) => {
      if (!canManagePrograms) {
        onShowToast('Hanya Super Admin dan Admin Pelatihan yang dapat menduplikasi program.');
        return;
      }
      const copy: Program = {
        ...prog,
        id: `prog-copy-${Date.now()}`,
        code: `${prog.code}-BATCH2`,
        title: `${prog.title} (Batch Berikutnya)`,
        enrolled: 0,
      };
      onUpdatePrograms([copy, ...programs]);
      onShowToast(`Program "${prog.shortTitle}" berhasil diduplikasi.`);
    };

    const handleTogglePublish = (progId: string) => {
      if (!canManagePrograms) {
        onShowToast('Hanya Super Admin dan Admin Pelatihan yang dapat mengubah status publikasi.');
        return;
      }
      onUpdatePrograms(
        programs.map((p) => (p.id === progId ? { ...p, published: !p.published } : p))
      );
      onShowToast('Status publikasi program diperbarui.');
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
              ADMIN PANEL · MANAJEMEN PROGRAM (CRUD)
            </p>
            <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
              Manajemen Program Pelatihan & Sertifikasi
            </h1>
            <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
              Tambah program baru, ubah detail kurikulum/jadwal/biaya, duplikasi batch, atau hapus program (Hak Akses: Super Admin & Admin Pelatihan).
            </p>
          </div>
          {canManagePrograms ? (
            <div className="flex flex-wrap items-center gap-2">
              {programs.length > 0 && onResetProgramsData && (
                <button
                  type="button"
                  onClick={() => setShowResetProgramsModal(true)}
                  className="px-3.5 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Reset Seluruh Data Program Pelatihan"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Data Pelatihan</span>
                </button>
              )}
              <button
                onClick={openCreateModal}
                className="px-4 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 self-start cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Program Baru</span>
              </button>
            </div>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-[#F4C430] text-xs font-bold">
              Mode Baca Saja (Hanya Super Admin & Admin Pelatihan yang dapat mengubah/menghapus)
            </span>
          )}
        </div>

        {/* Bulk Action Bar for Programs */}
        {selectedProgIds.length > 0 && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>{selectedProgIds.length} program pelatihan dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedProgIds([])}
                className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
              >
                Batal Pilihan
              </button>
              {canManagePrograms && (
                <button
                  type="button"
                  onClick={() => {
                    const count = selectedProgIds.length;
                    if (onDeleteMultiplePrograms) {
                      onDeleteMultiplePrograms(selectedProgIds);
                    } else {
                      onUpdatePrograms(programs.filter((p) => !selectedProgIds.includes(p.id)));
                      onShowToast(`${count} program pelatihan berhasil dihapus sekaligus.`);
                    }
                    setSelectedProgIds([]);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Sekaligus ({selectedProgIds.length})</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={programs.length > 0 && selectedProgIds.length === programs.length}
                      onChange={(e) =>
                        setSelectedProgIds(e.target.checked ? programs.map((p) => p.id) : [])
                      }
                      className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                      title="Pilih semua program"
                    />
                  </th>
                  <th className="py-3.5 px-4">PROGRAM & KODE</th>
                  <th className="py-3.5 px-4">KATEGORI</th>
                  <th className="py-3.5 px-4">JADWAL & LOKASI</th>
                  <th className="py-3.5 px-4 text-right">BIAYA</th>
                  <th className="py-3.5 px-4 text-right">KUOTA</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">AKSI CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                {programs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 px-4 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <BookOpen className="w-10 h-10 mx-auto text-[#087A4B] opacity-50" />
                        <h4 className="text-sm font-bold text-[#172026] dark:text-white">
                          Belum Ada Program Pelatihan Terdaftar (0 Program)
                        </h4>
                        <p className="text-xs text-[#66757F] dark:text-slate-400">
                          Data program pelatihan saat ini kosong. Anda dapat menambahkan program baru menggunakan tombol di bawah.
                        </p>
                        {canManagePrograms && (
                          <div className="flex items-center justify-center gap-2.5 pt-2">
                            <button
                              type="button"
                              onClick={openCreateModal}
                              className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Buat Program Baru</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  programs.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                      selectedProgIds.includes(p.id) ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10' : ''
                    }`}
                  >
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProgIds.includes(p.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedProgIds((prev) =>
                            prev.includes(p.id)
                              ? prev.filter((id) => id !== p.id)
                              : [...prev, p.id]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#172026] dark:text-white max-w-xs">
                        {p.title}
                      </div>
                      <span className="font-mono text-[11px] text-[#66757F]">
                        {p.code} · {p.published ? 'Published' : 'Draft/Hidden'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#66757F] dark:text-slate-300">{p.category}</td>
                    <td className="py-4 px-4 text-[#66757F] dark:text-slate-300">
                      {p.startDate} – {p.endDate} ({p.location})
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-[#087A4B] dark:text-[#F4C430] tabular-nums">
                      {formatRupiah(p.price)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      {p.enrolled}/{p.quota}
                    </td>
                    <td className="py-4 px-4">
                      <StatusLabel status={p.status} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      {canManagePrograms ? (
                        <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => openEditModal(p)}
                            className="px-2.5 py-1.5 rounded bg-[#087A4B] hover:bg-[#045A38] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            title="Ubah Detail Program"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Ubah</span>
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="px-2.5 py-1.5 rounded border border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Duplikasi Program"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Duplikat</span>
                          </button>
                          <button
                            onClick={() => handleTogglePublish(p.id)}
                            className="px-2.5 py-1.5 rounded bg-[#087A4B]/15 text-[#087A4B] dark:text-[#34D399] text-[11px] font-bold cursor-pointer"
                          >
                            {p.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => setDeletingProg(p)}
                            className="px-2.5 py-1.5 rounded bg-red-600/15 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Hapus Program"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#66757F]">Hanya Baca</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Program Modal */}
        {showProgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <form
              onSubmit={handleSaveProgram}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                  {editingProgId
                    ? 'Ubah Data Program Pelatihan & Sertifikasi AKP2I'
                    : 'Tambah Program Pelatihan AKP2I Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowProgModal(false);
                    setEditingProgId(null);
                  }}
                  className="text-xs font-bold text-[#66757F] hover:text-white cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 text-xs">
                <div className="sm:col-span-8">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nama Lengkap Program Pelatihan *
                  </label>
                  <input
                    type="text"
                    required
                    value={progTitle}
                    onChange={(e) => setProgTitle(e.target.value)}
                    placeholder="Contoh: Pelatihan Brevet Pajak A & B Terpadu + Coretax"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Kode Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={progCode}
                    onChange={(e) => setProgCode(e.target.value)}
                    className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nama Singkat Program
                  </label>
                  <input
                    type="text"
                    value={progShortTitle}
                    onChange={(e) => setProgShortTitle(e.target.value)}
                    placeholder="Contoh: Brevet Pajak A & B"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Kategori Program
                  </label>
                  <select
                    value={progCat}
                    onChange={(e) => setProgCat(e.target.value as ProgramCategory)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    <option value="Uji Kompetensi Perpajakan">Uji Kompetensi Perpajakan</option>
                    <option value="Brevet Pajak">Brevet Pajak</option>
                    <option value="Bimbel USKP">Bimbel USKP</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Sertifikasi">Sertifikasi</option>
                    <option value="Pelatihan Teknis">Pelatihan Teknis</option>
                    <option value="Program Lainnya">Program Lainnya</option>
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={progStatus}
                    onChange={(e) => setProgStatus(e.target.value as ProgramStatus)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    <option value="Sedang Dibuka">Sedang Dibuka</option>
                    <option value="Segera Dibuka">Segera Dibuka</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditutup">Ditutup</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="text"
                    value={progStartDate}
                    onChange={(e) => setProgStartDate(e.target.value)}
                    placeholder="24 Okt 2026"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="text"
                    value={progEndDate}
                    onChange={(e) => setProgEndDate(e.target.value)}
                    placeholder="31 Okt 2026"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={progTimeText}
                    onChange={(e) => setProgTimeText(e.target.value)}
                    placeholder="08.30 – 16.30 WIB"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={progDurationText}
                    onChange={(e) => setProgDurationText(e.target.value)}
                    placeholder="6 Hari Intensif"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Metode Pelatihan
                  </label>
                  <select
                    value={progMethod}
                    onChange={(e) => setProgMethod(e.target.value as Program['method'])}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    <option value="Online Zoom">Online Zoom</option>
                    <option value="Tatap Muka (Offline)">Tatap Muka (Offline)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Kota / Lokasi
                  </label>
                  <select
                    value={progLocation}
                    onChange={(e) => setProgLocation(e.target.value as Program['location'])}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    <option value="Online">Online</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Biaya Pendaftaran (Rp)
                  </label>
                  <input
                    type="number"
                    value={progPrice}
                    onChange={(e) => setProgPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Kuota Peserta
                  </label>
                  <input
                    type="number"
                    value={progQuota}
                    onChange={(e) => setProgQuota(Number(e.target.value))}
                    className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nama Instruktur / Narasumber
                  </label>
                  <input
                    type="text"
                    value={progInstructorName}
                    onChange={(e) => setProgInstructorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Jabatan / Kualifikasi Instruktur
                  </label>
                  <input
                    type="text"
                    value={progInstructorTitle}
                    onChange={(e) => setProgInstructorTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Deskripsi / Overview Program
                  </label>
                  <textarea
                    rows={2}
                    value={progOverview}
                    onChange={(e) => setProgOverview(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Materi / Silabus (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={progSyllabusText}
                    onChange={(e) => setProgSyllabusText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Fasilitas (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={progFacilitiesText}
                    onChange={(e) => setProgFacilitiesText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Persyaratan (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={progRequirementsText}
                    onChange={(e) => setProgRequirementsText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-12 flex flex-wrap items-center gap-6 pt-1">
                  <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={progPublished}
                      onChange={(e) => setProgPublished(e.target.checked)}
                      className="accent-[#087A4B]"
                    />
                    <span>Tampilkan di Katalog Publik (Published)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={progFeatured}
                      onChange={(e) => setProgFeatured(e.target.checked)}
                      className="accent-[#087A4B]"
                    />
                    <span>Tampilkan di Program Unggulan Beranda</span>
                  </label>
                </div>

                {/* Dynamic Custom Fields from Form Builder for Modul Program */}
                {formFields.filter((f) => f.targetModule === 'programs' && f.visible).length > 0 && (
                  <div className="p-3.5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#087A4B]/20 space-y-3">
                    <div className="flex items-center gap-1.5 text-[#087A4B] dark:text-[#34D399] font-bold text-xs">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Field Tambahan (Dynamic Form Builder — Modul Program)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formFields
                        .filter((f) => f.targetModule === 'programs' && f.visible)
                        .map((fld) => (
                          <div key={fld.id} className={fld.type === 'textarea' ? 'sm:col-span-2' : ''}>
                            <label className="block font-bold text-[#66757F] mb-1">
                              {fld.label} {fld.required && <span className="text-red-500">*</span>}
                            </label>
                            {fld.type === 'select' ? (
                              <select
                                value={customFieldValues[fld.key] || ''}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              >
                                <option value="">Pilih opsi...</option>
                                {fld.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : fld.type === 'radio' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => (
                                  <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                    <input
                                      type="radio"
                                      name={fld.key}
                                      checked={customFieldValues[fld.key] === opt}
                                      onChange={() =>
                                        setCustomFieldValues((prev) => ({
                                          ...prev,
                                          [fld.key]: opt,
                                        }))
                                      }
                                      className="accent-[#087A4B]"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : fld.type === 'checkbox' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => {
                                  const currentVals = (customFieldValues[fld.key] || '')
                                    .split(', ')
                                    .filter(Boolean);
                                  const isChecked = currentVals.includes(opt);
                                  return (
                                    <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const updated = e.target.checked
                                            ? [...currentVals, opt]
                                            : currentVals.filter((v: string) => v !== opt);
                                          setCustomFieldValues((prev) => ({
                                            ...prev,
                                            [fld.key]: updated.join(', '),
                                          }));
                                        }}
                                        className="accent-[#087A4B] rounded"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : fld.type === 'textarea' ? (
                              <textarea
                                value={customFieldValues[fld.key] || ''}
                                placeholder={fld.placeholder || `Masukkan ${fld.label}`}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                rows={2}
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            ) : (
                              <input
                                type={fld.type === 'number' ? 'number' : fld.type === 'date' ? 'date' : 'text'}
                                value={customFieldValues[fld.key] || ''}
                                placeholder={fld.placeholder || `Masukkan ${fld.label}`}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => {
                    setShowProgModal(false);
                    setEditingProgId(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold cursor-pointer"
                >
                  {editingProgId ? 'Simpan Perubahan Program' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <Trash2 className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-extrabold">Konfirmasi Hapus Program</h3>
              </div>
              <p className="text-xs text-[#66757F] dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus program{' '}
                <strong className="text-[#172026] dark:text-white">
                  {deletingProg.title}
                </strong>{' '}
                ({deletingProg.code}) dari sistem? Tindakan ini hanya diizinkan bagi Super Admin dan Admin Pelatihan.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProg(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteProgram}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  Ya, Hapus Program
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Reset Data Pelatihan Confirmation */}
        {showResetProgramsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-red-200 dark:border-red-900/50 p-6 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-900/40 shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                    Reset Semua Data Pelatihan
                  </h3>
                  <p className="text-[11px] text-[#66757F] dark:text-slate-400">
                    Pengosongan seluruh data kurikulum & program diklat
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2 text-[#66757F] dark:text-slate-300 leading-relaxed">
                <p className="font-bold text-red-700 dark:text-red-300">
                  Perhatian:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Seluruh data program pelatihan akan dikosongkan (0 program).</li>
                  <li>Katalog publik akan menampilkan status pelatihan kosong hingga program baru dibuat.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetProgramsModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold text-[#172026] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetProgramsData) onResetProgramsData();
                    setShowResetProgramsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ya, Reset Data Pelatihan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     2B. ADMIN ACCOUNT MANAGEMENT VIEW (TAMBAH & KELOLA AKUN ADMIN LAINNYA)
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-users') {
    const isSuperAdmin = currentRole === 'Super Admin';

    const handleCreateAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isSuperAdmin) {
        onShowToast('Hanya Super Admin yang dapat menambahkan akun Admin baru.');
        return;
      }
      if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
        onShowToast('Harap lengkapi Nama, Email, dan Password untuk akun Admin baru.');
        return;
      }
      const cleanEmail = newAdminEmail.trim().toLowerCase();
      if (adminAccounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
        onShowToast(`Akun Admin dengan email ${cleanEmail} sudah terdaftar.`);
        return;
      }

      const activePerms =
        newAdminPermissions.length > 0
          ? newAdminPermissions
          : ROLE_DEFAULT_PERMISSIONS[newAdminRole] || [];

      const created: AdminAccountItem = {
        id: `adm-${Date.now()}`,
        fullName: newAdminName.trim(),
        email: cleanEmail,
        role: newAdminRole,
        password: newAdminPassword.trim(),
        permissions: activePerms,
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };
      onAddAdminAccount(created);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminRole('Admin Pelatihan');
      setNewAdminPermissions(ROLE_DEFAULT_PERMISSIONS['Admin Pelatihan']);
      onShowToast(`Akun ${created.fullName} (${created.role}) berhasil ditambahkan dengan ${activePerms.length} izin modul.`);
    };

    const handleSaveEditAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingAdmin) return;
      const updated: AdminAccountItem = {
        ...editingAdmin,
        fullName: editAdminName.trim() || editingAdmin.fullName,
        role: editingAdmin.isPrimarySuperAdmin ? 'Super Admin' : editAdminRole,
        password: editAdminPassword.trim() ? editAdminPassword.trim() : editingAdmin.password,
        permissions: editingAdmin.isPrimarySuperAdmin
          ? ROLE_DEFAULT_PERMISSIONS['Super Admin']
          : editAdminPermissions.length > 0
          ? editAdminPermissions
          : ROLE_DEFAULT_PERMISSIONS[editAdminRole],
      };
      onUpdateAdminAccount(updated);
      setEditingAdmin(null);
      setEditAdminPassword('');
      onShowToast(`Akun Admin ${updated.fullName} berhasil diperbarui.`);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
              ADMIN PANEL · PENGATURAN AKUN ADMINISTRATOR
            </p>
            <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
              Manajemen Akun Admin & Hak Akses Portal
            </h1>
            <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
              Kelola akun administrator, tentukan peran dan matriks izin akses per-modul, serta pastikan keamanan kredensial login terenkripsi.
            </p>
          </div>
        </div>

        {/* View Mode Tabs: Daftar Akun Admin vs Manajemen Peran & Izin */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
          <button
            type="button"
            onClick={() => setAdminUsersTab('accounts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              adminUsersTab === 'accounts'
                ? 'bg-[#087A4B] text-white shadow-xs'
                : 'bg-[#F6F8F7] dark:bg-[#1A2429] text-[#66757F] dark:text-slate-300 hover:text-[#172026] dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Akun Admin ({adminAccounts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminUsersTab('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              adminUsersTab === 'matrix'
                ? 'bg-[#087A4B] text-white shadow-xs'
                : 'bg-[#F6F8F7] dark:bg-[#1A2429] text-[#66757F] dark:text-slate-300 hover:text-[#172026] dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Manajemen Peran & Izin Admin</span>
          </button>
        </div>

        {adminUsersTab === 'accounts' ? (
          <>
            {/* Add New Admin Form with Granular Role & Permission Selection */}
            {isSuperAdmin && (
              <form
                onSubmit={handleCreateAdmin}
                className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#087A4B] dark:text-[#34D399]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>TAMBAH AKUN ADMIN BARU DENGAN PILIHAN PERAN & IZIN</span>
                  </div>
                  <span className="text-[11px] text-[#66757F] dark:text-slate-400">
                    {newAdminPermissions.length} dari {ADMIN_PERMISSIONS_CATALOG.length} izin modul terpilih
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end text-xs">
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-[#66757F] mb-1">
                      Nama Lengkap Admin *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="Nama lengkap & gelar"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-[#66757F] mb-1">
                      Alamat Email Login *
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@akp2i.or.id"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-[#66757F] mb-1">
                      Password Login *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewAdminPassword ? 'text' : 'password'}
                        required
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Min. 6 karakter"
                        className="w-full px-3.5 py-2 pr-9 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#66757F] hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
                        title={showNewAdminPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showNewAdminPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-[#66757F] mb-1">
                      Peran Admin *
                    </label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => {
                        const nextRole = e.target.value as AdminAccountItem['role'];
                        setNewAdminRole(nextRole);
                        setNewAdminPermissions(ROLE_DEFAULT_PERMISSIONS[nextRole] || []);
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-bold text-[#087A4B] dark:text-[#34D399]"
                    >
                      <option value="Admin Pelatihan">Admin Pelatihan (Akademik & Jadwal Zoom)</option>
                      <option value="Verifikator">Verifikator Keuangan (Kas & Kwitansi)</option>
                      <option value="Instruktur">Instruktur (Jadwal Zoom & Silabus)</option>
                      <option value="Admin Sertifikasi">Admin Sertifikasi (Penerbitan SK & Cetak Piagam)</option>
                      <option value="Super Admin">Super Admin (Akses Penuh Semua Modul)</option>
                    </select>
                  </div>
                </div>

                {/* Granular Permission Checklist */}
                <div className="p-3.5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-[#172026] dark:text-white inline-flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399]" />
                        <span>Pilihan Izin Akses Modul untuk Admin Ini:</span>
                      </p>
                      <p className="text-[11px] text-[#66757F] dark:text-slate-400">
                        Pilihan izin otomatis disesuaikan berdasarkan Peran terpilih ({newAdminRole}), namun Anda dapat mencentang atau melepas izin sesuai kebutuhan khusus.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setNewAdminPermissions(ROLE_DEFAULT_PERMISSIONS[newAdminRole] || [])
                        }
                        className="px-2.5 py-1 rounded bg-white dark:bg-[#1A2429] border border-[#D9E2DE] dark:border-[#243239] text-[11px] font-semibold text-[#087A4B] dark:text-[#34D399] hover:bg-[#EAF7F0] cursor-pointer"
                      >
                        Reset Standar Peran
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNewAdminPermissions(ADMIN_PERMISSIONS_CATALOG.map((p) => p.id))
                        }
                        className="px-2.5 py-1 rounded bg-white dark:bg-[#1A2429] border border-[#D9E2DE] dark:border-[#243239] text-[11px] font-semibold text-[#66757F] hover:text-[#172026] cursor-pointer"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAdminPermissions([])}
                        className="px-2.5 py-1 rounded bg-white dark:bg-[#1A2429] border border-[#D9E2DE] dark:border-[#243239] text-[11px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {ADMIN_PERMISSIONS_CATALOG.map((perm) => {
                      const isChecked = newAdminPermissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#EAF7F0] dark:bg-[#087A4B]/15 border-[#087A4B] text-[#172026] dark:text-white shadow-xs'
                              : 'bg-white dark:bg-[#151F24] border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAdminPermissions((prev) => [...prev, perm.id]);
                              } else {
                                setNewAdminPermissions((prev) =>
                                  prev.filter((id) => id !== perm.id)
                                );
                              }
                            }}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[11px] leading-tight">
                                {perm.label}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#F6F8F7] dark:bg-[#1A2429] border border-[#D9E2DE] dark:border-[#243239] text-[#087A4B] dark:text-[#34D399]">
                                {perm.module}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#66757F] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {perm.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs text-xs"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Simpan & Tambah Akun Admin ({newAdminPermissions.length} Izin)</span>
                  </button>
                </div>
              </form>
            )}

            {/* Bulk Action Bar for Admin Accounts */}
            {selectedAdminIds.length > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>{selectedAdminIds.length} akun Admin dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAdminIds([])}
                    className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
                  >
                    Batal Pilihan
                  </button>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        const count = selectedAdminIds.length;
                        if (onDeleteMultipleAdminAccounts) {
                          onDeleteMultipleAdminAccounts(selectedAdminIds);
                        } else {
                          selectedAdminIds.forEach((id) => onDeleteAdminAccount(id));
                          onShowToast(`${count} akun Admin berhasil dihapus sekaligus.`);
                        }
                        setSelectedAdminIds([]);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Sekaligus ({selectedAdminIds.length})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Admin Accounts Table with Hidden / Encrypted Password Display */}
            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                      <th className="py-3.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            adminAccounts.filter((a) => !a.isPrimarySuperAdmin).length > 0 &&
                            selectedAdminIds.length ===
                              adminAccounts.filter((a) => !a.isPrimarySuperAdmin).length
                          }
                          onChange={(e) =>
                            setSelectedAdminIds(
                              e.target.checked
                                ? adminAccounts.filter((a) => !a.isPrimarySuperAdmin).map((a) => a.id)
                                : []
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                          title="Pilih semua admin non-utama"
                        />
                      </th>
                      <th className="py-3.5 px-4">NAMA ADMIN</th>
                      <th className="py-3.5 px-4">EMAIL LOGIN</th>
                      <th className="py-3.5 px-4">PERAN & JUMLAH IZIN</th>
                      <th className="py-3.5 px-4">PASSWORD LOGIN (TERENKRIPSI)</th>
                      <th className="py-3.5 px-4">TERDAFTAR</th>
                      <th className="py-3.5 px-4 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                    {adminAccounts.map((adm) => {
                      const isPasswordRevealed = revealedPasswordIds.includes(adm.id);
                      const currentPermsCount =
                        adm.permissions?.length ??
                        ROLE_DEFAULT_PERMISSIONS[adm.role]?.length ??
                        0;

                      return (
                        <tr
                          key={adm.id}
                          className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                            selectedAdminIds.includes(adm.id)
                              ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10'
                              : ''
                          }`}
                        >
                          <td className="py-4 px-3 text-center">
                            {!adm.isPrimarySuperAdmin ? (
                              <input
                                type="checkbox"
                                checked={selectedAdminIds.includes(adm.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedAdminIds((prev) =>
                                    prev.includes(adm.id)
                                      ? prev.filter((id) => id !== adm.id)
                                      : [...prev, adm.id]
                                  );
                                }}
                                className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                              />
                            ) : (
                              <span className="text-[10px] text-[#66757F] font-bold">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#172026] dark:text-white">
                            <div className="flex items-center gap-1.5">
                              <span>{adm.fullName}</span>
                              {adm.isPrimarySuperAdmin && (
                                <span className="px-2 py-0.5 rounded bg-[#F4C430]/20 text-[#087A4B] dark:text-[#F4C430] text-[10px] font-extrabold">
                                  UTAMA
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-[#087A4B] dark:text-[#34D399]">
                            {adm.email}
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="font-bold block text-[#172026] dark:text-white">
                                {adm.role}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]">
                                <KeyRound className="w-2.5 h-2.5" />
                                <span>{currentPermsCount} Izin Modul</span>
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            {/* Hidden / Encrypted Password View */}
                            {isPasswordRevealed ? (
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#087A4B] dark:text-[#34D399] font-bold">
                                  {adm.password || '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRevealedPasswordIds((prev) =>
                                      prev.filter((id) => id !== adm.id)
                                    )
                                  }
                                  className="p-1 rounded text-[#66757F] hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
                                  title="Sembunyikan / Kunci Password"
                                >
                                  <EyeOff className="w-3.5 h-3.5 text-[#087A4B]" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="tracking-widest text-[#66757F] dark:text-slate-400 select-none">
                                  ••••••••••••
                                </span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-[#66757F] border border-[#D9E2DE] dark:border-[#243239]">
                                  <Lock className="w-2.5 h-2.5 text-[#087A4B]" />
                                  <span>Terenkripsi</span>
                                </span>
                                {isSuperAdmin && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRevealedPasswordIds((prev) => [...prev, adm.id])
                                    }
                                    className="p-1 rounded text-[#66757F] hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
                                    title="Tampilkan password (Super Admin)"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-[#66757F]">{adm.createdAt}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingAdmin(adm);
                                  setEditAdminName(adm.fullName);
                                  setEditAdminRole(adm.role);
                                  setEditAdminPassword(adm.password || '');
                                  setEditAdminPermissions(
                                    adm.permissions && adm.permissions.length > 0
                                      ? adm.permissions
                                      : ROLE_DEFAULT_PERMISSIONS[adm.role] || []
                                  );
                                }}
                                className="px-2.5 py-1.5 rounded bg-[#087A4B] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <KeyRound className="w-3 h-3" />
                                <span>Ubah & Izin</span>
                              </button>
                              {!adm.isPrimarySuperAdmin && (
                                <button
                                  onClick={() => setDeletingAdmin(adm)}
                                  className="px-2.5 py-1.5 rounded bg-red-600/15 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Hapus</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Manajemen Peran & Matriks Izin (Role & Permission Matrix View) */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#EAF7F0] dark:bg-[#087A4B]/10 border border-[#087A4B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#087A4B] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-[#172026] dark:text-white">
                    Pusat Manajemen Peran & Izin Akses (RBAC AKP2I)
                  </h3>
                  <p className="text-[#66757F] dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    Sistem AKP2I menerapkan Role-Based Access Control (RBAC) dengan 5 peran hierarkis. Setiap peran memiliki paket izin standar (default), dan Super Admin dapat mengkustomisasi izin per-akun saat membuat atau mengedit akun admin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminUsersTab('accounts')}
                className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Admin Baru</span>
              </button>
            </div>

            {/* 5 Roles Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  role: 'Super Admin' as const,
                  title: 'Super Administrator',
                  desc: 'Akses penuh tanpa batas ke seluruh 9 modul sistem, manajemen keuangan, pendaftaran, sertifikasi, database akun, dan konfigurasi API.',
                  badge: 'Akses Penuh (Full Control)',
                  color: 'border-[#F4C430] bg-[#F4C430]/5',
                },
                {
                  role: 'Admin Pelatihan' as const,
                  title: 'Admin Pelatihan & Akademik',
                  desc: 'Mengelola kurikulum program pelatihan, rekapitulasi data peserta diklat, penetapan jadwal sesi tatap muka daring Zoom, dan penerbitan sertifikat.',
                  badge: 'Akademik & Jadwal Zoom',
                  color: 'border-[#087A4B] bg-[#087A4B]/5',
                },
                {
                  role: 'Verifikator' as const,
                  title: 'Verifikator Keuangan & Kas',
                  desc: 'Approval bukti transfer pembayaran peserta, penerbitan kwitansi/invoice resmi, pencatatan buku kas operasional, dan mutasi saldo.',
                  badge: 'Keuangan & Approval',
                  color: 'border-blue-500 bg-blue-500/5',
                },
                {
                  role: 'Instruktur' as const,
                  title: 'Instruktur & Pengajar BKP',
                  desc: 'Mengakses silabus modul pelatihan, materi bimbingan USKP / Brevet Pajak, serta tautan Zoom & passcode kelas tatap muka virtual.',
                  badge: 'Pengajar & Kelas Daring',
                  color: 'border-purple-500 bg-purple-500/5',
                },
                {
                  role: 'Admin Sertifikasi' as const,
                  title: 'Admin Sertifikasi & Piagam',
                  desc: 'Memproses nomor SK kelulusan peserta AKP2I, validasi nilai CBT, tanda tangan digital pengurus pusat, dan penerbitan piagam sertifikat.',
                  badge: 'Penerbitan SK & Cetak',
                  color: 'border-amber-500 bg-amber-500/5',
                },
              ].map((roleInfo) => {
                const perms = ROLE_DEFAULT_PERMISSIONS[roleInfo.role] || [];
                const assignedAdmins = adminAccounts.filter((a) => a.role === roleInfo.role);

                return (
                  <div
                    key={roleInfo.role}
                    className={`rounded-xl border p-4 space-y-3 bg-white dark:bg-[#151F24] ${roleInfo.color}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F6F8F7] dark:bg-[#1A2429] border border-[#D9E2DE] dark:border-[#243239] text-[#087A4B] dark:text-[#34D399]">
                          {roleInfo.badge}
                        </span>
                        <h4 className="font-extrabold text-[#172026] dark:text-white text-sm mt-1.5">
                          {roleInfo.title}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]">
                        {perms.length} Izin Modul
                      </span>
                    </div>

                    <p className="text-[11px] text-[#66757F] dark:text-slate-400 leading-relaxed">
                      {roleInfo.desc}
                    </p>

                    <div className="pt-2 border-t border-[#D9E2DE] dark:border-[#243239]/60">
                      <p className="text-[10px] font-bold text-[#66757F] uppercase tracking-wider mb-1.5">
                        Izin Akses Default:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {perms.map((pId) => {
                          const pObj = ADMIN_PERMISSIONS_CATALOG.find((cat) => cat.id === pId);
                          return (
                            <span
                              key={pId}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-[#1A2429] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-slate-300"
                            >
                              ✓ {pObj ? pObj.module : pId}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-[#66757F]">
                        {assignedAdmins.length} akun terdaftar
                      </span>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewAdminRole(roleInfo.role);
                            setNewAdminPermissions(ROLE_DEFAULT_PERMISSIONS[roleInfo.role] || []);
                            setAdminUsersTab('accounts');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-bold text-[#087A4B] dark:text-[#34D399] hover:underline cursor-pointer"
                        >
                          Gunakan Peran Ini →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comprehensive Matrix Table: Roles vs Permissions */}
            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
              <div className="p-4 border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429]">
                <h3 className="font-extrabold text-[#172026] dark:text-white text-sm">
                  Matriks Izin Akses Lengkap (Role Permission Matrix)
                </h3>
                <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-0.5">
                  Tabel pemetaan hak akses untuk setiap modul dalam sistem operasional AKP2I.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7]/60 dark:bg-[#1A2429]/60 text-[11px] font-extrabold text-[#66757F] uppercase">
                      <th className="py-3 px-4">MODUL & DESKRIPSI IZIN</th>
                      <th className="py-3 px-3 text-center">SUPER ADMIN</th>
                      <th className="py-3 px-3 text-center">ADMIN PELATIHAN</th>
                      <th className="py-3 px-3 text-center">VERIFIKATOR</th>
                      <th className="py-3 px-3 text-center">INSTRUKTUR</th>
                      <th className="py-3 px-3 text-center">ADMIN SERTIFIKASI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239]">
                    {ADMIN_PERMISSIONS_CATALOG.map((perm) => (
                      <tr
                        key={perm.id}
                        className="hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#172026] dark:text-white">
                              {perm.label}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]">
                              {perm.module}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#66757F] dark:text-slate-400 mt-0.5">
                            {perm.desc}
                          </p>
                        </td>
                        {(
                          [
                            'Super Admin',
                            'Admin Pelatihan',
                            'Verifikator',
                            'Instruktur',
                            'Admin Sertifikasi',
                          ] as AdminAccountItem['role'][]
                        ).map((r) => {
                          const hasIt = ROLE_DEFAULT_PERMISSIONS[r]?.includes(perm.id);
                          return (
                            <td key={r} className="py-3.5 px-3 text-center">
                              {hasIt ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] font-bold text-xs">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-[#66757F] dark:text-slate-600 font-bold">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin / Change Password & Customize Permissions Modal */}
        {editingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <form
              onSubmit={handleSaveEditAdmin}
              className="w-full max-w-lg rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#172026] dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#087A4B]" />
                  <span>Ubah Akun & Izin Akses Admin</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF7F0] text-[#087A4B]">
                  {editAdminPermissions.length} Izin Aktif
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#66757F] mb-1">Email Admin</label>
                <input
                  type="text"
                  disabled
                  value={editingAdmin.email}
                  className="w-full px-3.5 py-2 font-mono rounded-lg bg-slate-100 dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] opacity-75"
                />
              </div>

              <div>
                <label className="block font-bold text-[#66757F] mb-1">Nama Lengkap Admin *</label>
                <input
                  type="text"
                  required
                  value={editAdminName}
                  onChange={(e) => setEditAdminName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                />
              </div>

              {!editingAdmin.isPrimarySuperAdmin ? (
                <div>
                  <label className="block font-bold text-[#66757F] mb-1">Peran Admin *</label>
                  <select
                    value={editAdminRole}
                    onChange={(e) => {
                      const nextR = e.target.value as AdminAccountItem['role'];
                      setEditAdminRole(nextR);
                      setEditAdminPermissions(ROLE_DEFAULT_PERMISSIONS[nextR] || []);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-bold text-[#087A4B]"
                  >
                    <option value="Admin Pelatihan">Admin Pelatihan (Akademik & Jadwal Zoom)</option>
                    <option value="Verifikator">Verifikator Keuangan (Kas & Kwitansi)</option>
                    <option value="Instruktur">Instruktur (Jadwal Zoom & Silabus)</option>
                    <option value="Admin Sertifikasi">Admin Sertifikasi (Penerbitan SK & Cetak Piagam)</option>
                    <option value="Super Admin">Super Admin (Akses Penuh Semua Modul)</option>
                  </select>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-[#F4C430]/15 border border-[#F4C430]/40 text-[11px] font-bold text-[#172026] dark:text-white">
                  Akun ini adalah Super Administrator Utama sistem (seluruh 9 izin modul aktif permanen).
                </div>
              )}

              {/* Granular Permission Checklist in Edit Modal */}
              {!editingAdmin.isPrimarySuperAdmin && (
                <div className="space-y-2 pt-1 border-t border-[#D9E2DE] dark:border-[#243239]">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#172026] dark:text-white">
                      Kustomisasi Izin Akses Modul:
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditAdminPermissions(ROLE_DEFAULT_PERMISSIONS[editAdminRole] || [])
                      }
                      className="text-[11px] text-[#087A4B] dark:text-[#34D399] font-bold hover:underline cursor-pointer"
                    >
                      Reset Standar Peran
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-[#D9E2DE] dark:border-[#243239] rounded-lg">
                    {ADMIN_PERMISSIONS_CATALOG.map((perm) => {
                      const isChecked = editAdminPermissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`p-2 rounded border flex items-center gap-2 cursor-pointer text-[11px] ${
                            isChecked
                              ? 'bg-[#EAF7F0] dark:bg-[#087A4B]/20 border-[#087A4B] font-bold text-[#087A4B] dark:text-[#34D399]'
                              : 'bg-white dark:bg-[#1A2429] border-[#D9E2DE] dark:border-[#243239] text-[#66757F]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditAdminPermissions((prev) => [...prev, perm.id]);
                              } else {
                                setEditAdminPermissions((prev) =>
                                  prev.filter((id) => id !== perm.id)
                                );
                              }
                            }}
                            className="w-3.5 h-3.5 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                          />
                          <span className="truncate">{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#66757F] mb-1">
                  Password Login Baru (Opsional — kosongkan jika tidak ingin mengubah)
                </label>
                <div className="relative">
                  <input
                    type={showEditAdminPassword ? 'text' : 'password'}
                    value={editAdminPassword}
                    onChange={(e) => setEditAdminPassword(e.target.value)}
                    placeholder="Ketik password baru jika ingin mengubah"
                    className="w-full px-3.5 py-2 pr-9 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditAdminPassword(!showEditAdminPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#66757F] hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
                    title={showEditAdminPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showEditAdminPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#087A4B] text-white font-bold cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Admin Confirmation Modal */}
        {deletingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <h3 className="text-base font-extrabold text-red-600 dark:text-red-400">
                Hapus Akun Admin
              </h3>
              <p className="text-[#66757F] dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin mencabut akses Admin untuk{' '}
                <strong className="text-[#172026] dark:text-white">
                  {deletingAdmin.fullName} ({deletingAdmin.email})
                </strong>
                ?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingAdmin(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteAdminAccount(deletingAdmin.id);
                    setDeletingAdmin(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                >
                  Ya, Hapus Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     3. PARTICIPANT MANAGEMENT VIEW (MANUAL ADD/EDIT/DELETE FOR SUPER ADMIN & ADMIN PELATIHAN)
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-participants') {
    const filteredRegs = registrations.filter(
      (r) =>
        r.participantName.toLowerCase().includes(partSearch.toLowerCase()) ||
        r.regNumber.toLowerCase().includes(partSearch.toLowerCase()) ||
        r.programTitle.toLowerCase().includes(partSearch.toLowerCase()) ||
        r.participantEmail.toLowerCase().includes(partSearch.toLowerCase())
    );

    const allParticipantProfiles = registeredParticipants;
    const pendingProfilesCount = allParticipantProfiles.filter(
      (p) => p.profile.verificationStatus === 'Menunggu Verifikasi Admin'
    ).length;
    const verifiedProfilesCount = allParticipantProfiles.filter(
      (p) => p.profile.isVerified || p.profile.verificationStatus === 'Terverifikasi'
    ).length;
    const incompleteProfilesCount = allParticipantProfiles.filter(
      (p) =>
        p.profile.verificationStatus === 'Belum Lengkap' ||
        p.profile.verificationStatus === 'Perlu Revisi' ||
        (!p.profile.verificationStatus && !p.profile.isVerified)
    ).length;

    const filteredProfiles = allParticipantProfiles.filter((p) => {
      const q = profileSearch.toLowerCase();
      const matchSearch =
        p.profile.fullName.toLowerCase().includes(q) ||
        p.profile.email.toLowerCase().includes(q) ||
        (p.profile.nik && p.profile.nik.toLowerCase().includes(q)) ||
        (p.profile.phone && p.profile.phone.toLowerCase().includes(q));
      if (!matchSearch) return false;

      if (profileStatusFilter === 'pending') {
        return p.profile.verificationStatus === 'Menunggu Verifikasi Admin';
      }
      if (profileStatusFilter === 'verified') {
        return p.profile.isVerified || p.profile.verificationStatus === 'Terverifikasi';
      }
      if (profileStatusFilter === 'incomplete') {
        return (
          p.profile.verificationStatus === 'Belum Lengkap' ||
          p.profile.verificationStatus === 'Perlu Revisi' ||
          (!p.profile.verificationStatus && !p.profile.isVerified)
        );
      }
      return true;
    });

    const openAddParticipantModal = () => {
      if (!canManageParticipants) {
        onShowToast('Hanya Super Admin dan Admin Pelatihan yang dapat menambahkan peserta secara manual.');
        return;
      }
      if (programs.length === 0) {
        onShowToast('Belum ada program pelatihan yang tersedia. Harap buat program pelatihan terlebih dahulu di menu Manajemen Program.');
        return;
      }
      const firstProg = programs[0];
      setEditingPartReg(null);
      setManualPartName('');
      setManualPartEmail('');
      setManualPartPhone('');
      setManualPartProgId(firstProg?.id || '');
      setManualPartAmount(firstProg?.price || 1750000);
      setManualPartMethod(paymentMethods[0]?.name || 'Transfer Bank Mandiri');
      setManualPartStatusPreset('verified');
      setShowPartModal(true);
    };

    const openEditParticipantModal = (reg: Registration) => {
      if (!canManageParticipants) {
        onShowToast('Hanya Super Admin dan Admin Pelatihan yang dapat mengubah data peserta.');
        return;
      }
      setEditingPartReg(reg);
      setManualPartName(reg.participantName);
      setManualPartEmail(reg.participantEmail);
      setManualPartPhone(reg.participantPhone);
      setManualPartProgId(reg.programId);
      setManualPartAmount(reg.amount);
      setManualPartMethod(reg.paymentMethod);
      setManualPartStatusPreset(
        reg.paymentStatus === 'Pembayaran Terverifikasi'
          ? 'verified'
          : reg.paymentStatus === 'Menunggu Verifikasi'
          ? 'pending_verify'
          : 'unpaid'
      );
      setShowPartModal(true);
    };

    const handleSaveManualParticipant = (e: React.FormEvent) => {
      e.preventDefault();
      if (!canManageParticipants) return;
      if (!manualPartName.trim() || !manualPartEmail.trim() || !manualPartPhone.trim()) {
        onShowToast('Harap lengkapi Nama Lengkap, Email, dan Nomor WhatsApp peserta.');
        return;
      }

      const selectedProg = programs.find((p) => p.id === manualPartProgId) || programs[0];
      if (!selectedProg) {
        onShowToast('Belum ada program pelatihan yang tersedia. Harap tambahkan program terlebih dahulu di Manajemen Program.');
        return;
      }
      const statusMap = {
        verified: {
          status: 'Terdaftar' as Registration['status'],
          paymentStatus: 'Pembayaran Terverifikasi' as Registration['paymentStatus'],
          stepIndex: 5,
        },
        pending_verify: {
          status: 'Menunggu Verifikasi' as Registration['status'],
          paymentStatus: 'Menunggu Verifikasi' as Registration['paymentStatus'],
          stepIndex: 3,
        },
        unpaid: {
          status: 'Menunggu Pembayaran' as Registration['status'],
          paymentStatus: 'Belum Dibayar' as Registration['paymentStatus'],
          stepIndex: 2,
        },
      }[manualPartStatusPreset];

      if (editingPartReg) {
        const updated: Registration = {
          ...editingPartReg,
          participantName: manualPartName.trim(),
          participantEmail: manualPartEmail.trim(),
          participantPhone: manualPartPhone.trim(),
          programId: selectedProg.id,
          programTitle: selectedProg.title,
          trainingDateText: `${selectedProg.startDate} – ${selectedProg.endDate}`,
          paymentMethod: manualPartMethod,
          amount: Number(manualPartAmount) || 0,
          status: statusMap.status,
          paymentStatus: statusMap.paymentStatus,
          stepIndex: statusMap.stepIndex,
        };
        onUpdateRegistration(updated);
        setShowPartModal(false);
        setEditingPartReg(null);
      } else {
        const randomCode = Math.floor(100000 + Math.random() * 900000)
          .toString(16)
          .toUpperCase();
        const created: Registration = {
          id: `reg-manual-${Date.now()}`,
          regNumber: `REG-20261008-${randomCode}`,
          programId: selectedProg.id,
          programTitle: selectedProg.title,
          participantId: `usr-manual-${Date.now()}`,
          participantName: manualPartName.trim(),
          participantEmail: manualPartEmail.trim(),
          participantPhone: manualPartPhone.trim(),
          registeredAt: new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          trainingDateText: `${selectedProg.startDate} – ${selectedProg.endDate}`,
          amount: Number(manualPartAmount) || 0,
          status: statusMap.status,
          paymentStatus: statusMap.paymentStatus,
          paymentMethod: manualPartMethod,
          paymentProofFileName:
            manualPartStatusPreset !== 'unpaid' ? 'Terverifikasi_Manual_Admin.jpg' : undefined,
          paymentProofSize: manualPartStatusPreset !== 'unpaid' ? '320 KB' : undefined,
          paymentProofUploadedAt:
            manualPartStatusPreset !== 'unpaid' ? 'Diinput Manual oleh Admin' : undefined,
          stepIndex: statusMap.stepIndex,
          documentsSubmitted: [],
        };
        onAddManualRegistration(created);
        setShowPartModal(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-[#D9E2DE] dark:border-[#243239] gap-2 pb-0">
          <button
            type="button"
            onClick={() => setPartSubTab('registrations')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 -mb-[1px] ${
              partSubTab === 'registrations'
                ? 'border-[#087A4B] text-[#087A4B] dark:text-[#34D399] bg-white dark:bg-[#151F24] rounded-t-lg'
                : 'border-transparent text-[#66757F] hover:text-[#172026] dark:hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Pendaftaran Pelatihan ({filteredRegs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setPartSubTab('verification')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 -mb-[1px] ${
              partSubTab === 'verification'
                ? 'border-[#087A4B] text-[#087A4B] dark:text-[#34D399] bg-white dark:bg-[#151F24] rounded-t-lg'
                : 'border-transparent text-[#66757F] hover:text-[#172026] dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Verifikasi Profil & Dokumen Peserta</span>
            {pendingProfilesCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                {pendingProfilesCount} Menunggu
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-[#66757F]">
                {allParticipantProfiles.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PENDAFTARAN PELATIHAN */}
        {partSubTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
                  ADMIN PANEL · DATA PENDAFTARAN
                </p>
                <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
                  Data Pendaftaran & Input Manual
                </h1>
                <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
                  Tambahkan peserta secara manual (Hak Akses: Super Admin & Admin Pelatihan), kelola status pendaftaran, atau unduh data peserta dalam format Excel (.xlsx).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="text"
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  placeholder="Cari nama, email, no registrasi..."
                  className="px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                />
                {canManageParticipants && onResetParticipantsData && registrations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowResetParticipantsModal(true)}
                    className="px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
                    title="Reset Seluruh Data Peserta & Pendaftaran"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data Peserta</span>
                  </button>
                )}
                {canManageParticipants && (
                  <>
                    <button
                      type="button"
                      onClick={openAddParticipantModal}
                      className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Tambah Peserta Manual</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadImportTemplate}
                      className="px-3.5 py-2 rounded-lg border border-[#087A4B]/40 hover:border-[#087A4B] bg-emerald-50/70 dark:bg-emerald-950/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs transition-colors"
                      title="Unduh Format Template Excel Resmi (.xlsx) untuk Impor Peserta"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Format Impor Excel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setParsedImportRows([]);
                        setImportFileName('');
                        setShowImportParticipantsModal(true);
                      }}
                      className="px-3.5 py-2 rounded-lg border border-[#087A4B] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs transition-colors"
                      title="Impor Data Peserta dari Berkas Excel (.xlsx)"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Impor Peserta Excel</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleExportXlsx}
                  className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] hover:bg-[#EAF7F0] dark:hover:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs transition-colors"
                  title="Unduh Data Peserta ke Format Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export XLSX</span>
                </button>
              </div>
            </div>

            {/* Bulk Action Bar for Participants */}
            {selectedPartIds.length > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>{selectedPartIds.length} data peserta dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPartIds([])}
                    className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
                  >
                    Batal Pilihan
                  </button>
                  {canManageParticipants && (
                    <button
                      type="button"
                      onClick={() => {
                        const count = selectedPartIds.length;
                        if (onDeleteMultipleRegistrations) {
                          onDeleteMultipleRegistrations(selectedPartIds);
                        } else {
                          selectedPartIds.forEach((id) => onDeleteRegistration(id));
                          onShowToast(`${count} data peserta berhasil dihapus sekaligus.`);
                        }
                        setSelectedPartIds([]);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Sekaligus ({selectedPartIds.length})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                      <th className="py-3.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredRegs.length > 0 && selectedPartIds.length === filteredRegs.length
                          }
                          onChange={(e) =>
                            setSelectedPartIds(e.target.checked ? filteredRegs.map((r) => r.id) : [])
                          }
                          className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                          title="Pilih semua data peserta"
                        />
                      </th>
                      <th className="py-3.5 px-4">NO. REGISTRASI</th>
                      <th className="py-3.5 px-4">PESERTA & KONTAK</th>
                      <th className="py-3.5 px-4">PROGRAM DIIKUTI</th>
                      <th className="py-3.5 px-4">METODE & BIAYA</th>
                      <th className="py-3.5 px-4">STATUS</th>
                      <th className="py-3.5 px-4 text-right">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                    {filteredRegs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 px-4 text-center text-[#66757F]">
                          Belum ada data peserta terdaftar. Gunakan tombol <strong>+ Tambah Peserta Manual</strong> di kanan atas untuk menambahkan peserta baru.
                        </td>
                      </tr>
                    ) : (
                      filteredRegs.map((reg) => (
                        <tr
                          key={reg.id}
                          className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                            selectedPartIds.includes(reg.id) ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10' : ''
                          }`}
                        >
                          <td className="py-4 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedPartIds.includes(reg.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedPartIds((prev) =>
                                  prev.includes(reg.id)
                                    ? prev.filter((id) => id !== reg.id)
                                    : [...prev, reg.id]
                                );
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                            />
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-[#172026] dark:text-white">
                            {reg.regNumber}
                            <span className="block text-[10px] font-normal text-[#66757F]">
                              {reg.registeredAt}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#172026] dark:text-white">
                              {reg.participantName}
                            </div>
                            <div className="text-[11px] text-[#66757F]">
                              {reg.participantEmail} · {reg.participantPhone}
                            </div>
                          </td>
                          <td className="py-4 px-4 max-w-xs">
                            <div className="font-semibold text-[#172026] dark:text-slate-200">
                              {reg.programTitle}
                            </div>
                            <span className="text-[11px] text-[#66757F]">{reg.trainingDateText}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-mono font-bold text-[#087A4B] dark:text-[#F4C430]">
                              {formatRupiah(reg.amount)}
                            </div>
                            <span className="text-[11px] text-[#66757F]">{reg.paymentMethod}</span>
                          </td>
                          <td className="py-4 px-4">
                            <StatusLabel status={reg.status} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                              {reg.status !== 'Terdaftar' && (
                                <button
                                  onClick={() => onApprovePayment(reg.id)}
                                  className="px-2.5 py-1.5 rounded bg-[#087A4B] text-white text-[11px] font-bold cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}
                              {canManageParticipants && (
                                <>
                                  <button
                                    onClick={() => openEditParticipantModal(reg)}
                                    className="px-2.5 py-1.5 rounded border border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Ubah</span>
                                  </button>
                                  <button
                                    onClick={() => setDeletingPartReg(reg)}
                                    className="px-2.5 py-1.5 rounded bg-red-600/15 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Hapus</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIKASI PROFIL & DOKUMEN PESERTA */}
        {partSubTab === 'verification' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
                  ADMIN PANEL · VERIFIKASI PROFIL & DOKUMEN
                </p>
                <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
                  Verifikasi Berkas & Profil Peserta
                </h1>
                <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
                  Sesuai ketentuan, data profil dan 4 dokumen persyaratan yang disubmit peserta wajib ditinjau dan diverifikasi manual oleh Administrator.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  placeholder="Cari nama, email, NIK..."
                  className="px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] space-y-1">
                <span className="text-[11px] font-bold text-[#66757F] uppercase block">Total Akun Peserta</span>
                <p className="text-2xl font-extrabold text-[#172026] dark:text-white">{allParticipantProfiles.length}</p>
                <p className="text-[10px] text-[#66757F]">Terdaftar dalam sistem</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/20 space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase block">Menunggu Verifikasi</span>
                <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{pendingProfilesCount}</p>
                <p className="text-[10px] text-amber-700/80">Wajib ditinjau admin</p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-[#EAF7F0]/70 dark:bg-emerald-950/20 space-y-1">
                <span className="text-[11px] font-bold text-[#087A4B] dark:text-emerald-400 uppercase block">Profil Terverifikasi</span>
                <p className="text-2xl font-extrabold text-[#087A4B] dark:text-emerald-300">{verifiedProfilesCount}</p>
                <p className="text-[10px] text-[#087A4B]/80">Siap & aktif penuh</p>
              </div>
              <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-700/60 bg-rose-50/70 dark:bg-rose-950/20 space-y-1">
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-400 uppercase block">Belum Lengkap / Revisi</span>
                <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{incompleteProfilesCount}</p>
                <p className="text-[10px] text-rose-700/80">Menunggu peserta</p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#66757F] mr-1">Filter Status:</span>
              <button
                type="button"
                onClick={() => setProfileStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  profileStatusFilter === 'all'
                    ? 'bg-[#087A4B] text-white'
                    : 'bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#66757F]'
                }`}
              >
                Semua ({allParticipantProfiles.length})
              </button>
              <button
                type="button"
                onClick={() => setProfileStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  profileStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-amber-700 dark:text-amber-400'
                }`}
              >
                <span>⏳ Menunggu Verifikasi ({pendingProfilesCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  profileStatusFilter === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#087A4B]'
                }`}
              >
                ✓ Terverifikasi ({verifiedProfilesCount})
              </button>
              <button
                type="button"
                onClick={() => setProfileStatusFilter('incomplete')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  profileStatusFilter === 'incomplete'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-rose-600'
                }`}
              >
                ⚠️ Belum Lengkap / Revisi ({incompleteProfilesCount})
              </button>
            </div>

            {/* Profiles Table */}
            <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                      <th className="py-3.5 px-4">PESERTA</th>
                      <th className="py-3.5 px-4">NIK & NPWP</th>
                      <th className="py-3.5 px-4">KONTAK & DOMISILI</th>
                      <th className="py-3.5 px-4">PENDIDIKAN & PEKERJAAN</th>
                      <th className="py-3.5 px-4">BERKAS PERSYARATAN</th>
                      <th className="py-3.5 px-4">STATUS VERIFIKASI</th>
                      <th className="py-3.5 px-4 text-right">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 px-4 text-center text-[#66757F]">
                          Tidak ada profil peserta yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => {
                        const prof = p.profile;
                        const ktpDoc = prof.documents?.find((d) => d.type === 'KTP' && d.fileName && d.fileName !== 'Belum ada file diunggah');
                        const npwpDoc = prof.documents?.find((d) => d.type === 'NPWP' && d.fileName && d.fileName !== 'Belum ada file diunggah');
                        const fotoDoc = prof.documents?.find((d) => d.type === 'Pas Foto' && d.fileName && d.fileName !== 'Belum ada file diunggah');
                        const ijazahDoc = prof.documents?.find((d) => d.type === 'Ijazah' && d.fileName && d.fileName !== 'Belum ada file diunggah');
                        const uploadedDocsCount = [ktpDoc, npwpDoc, fotoDoc, ijazahDoc].filter(Boolean).length;
                        const isVerified = prof.isVerified || prof.verificationStatus === 'Terverifikasi';
                        const isPending = prof.verificationStatus === 'Menunggu Verifikasi Admin';
                        const isRevision = prof.verificationStatus === 'Perlu Revisi';

                        return (
                          <tr key={prof.id} className="hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#087A4B] shrink-0 bg-slate-100 dark:bg-slate-800">
                                  {prof.avatarUrl ? (
                                    <ResilientImage src={prof.avatarUrl} alt={prof.fullName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">
                                      {prof.fullName.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <strong className="text-sm text-[#172026] dark:text-white block truncate">
                                    {prof.fullName}
                                  </strong>
                                  <span className="text-[11px] text-[#66757F] block truncate">{prof.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-mono text-xs font-semibold text-[#172026] dark:text-white">
                                NIK: {prof.nik || '-'}
                              </div>
                              <div className="font-mono text-[11px] text-[#66757F]">
                                NPWP: {prof.npwp || '-'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-[#172026] dark:text-white">
                                {prof.phone || '-'}
                              </div>
                              <div className="text-[11px] text-[#66757F] truncate max-w-[180px]">
                                {prof.city ? `${prof.city}, ${prof.province}` : prof.province || '-'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-[#172026] dark:text-white">
                                {prof.educationLevel || '-'} · {prof.major || '-'}
                              </div>
                              <div className="text-[11px] text-[#66757F] truncate max-w-[180px]">
                                {prof.occupation || '-'} {prof.position ? `(${prof.position})` : ''}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ktpDoc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                  {ktpDoc ? '✓ KTP' : '✕ KTP'}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${npwpDoc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                  {npwpDoc ? '✓ NPWP' : '✕ NPWP'}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fotoDoc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                  {fotoDoc ? '✓ Foto' : '✕ Foto'}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ijazahDoc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                  {ijazahDoc ? '✓ Ijazah' : '✕ Ijazah'}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#66757F] block mt-1">
                                {uploadedDocsCount}/4 Berkas ({uploadedDocsCount === 4 ? 'Lengkap' : 'Belum Lengkap'})
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {isVerified ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#EAF7F0] text-[#087A4B] border border-[#087A4B]/30 inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>✓ Terverifikasi</span>
                                </span>
                              ) : isPending ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 animate-pulse" />
                                  <span>⏳ Menunggu Verifikasi</span>
                                </span>
                              ) : isRevision ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-300 inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>⚠️ Perlu Revisi</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-300 inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>⚠️ Belum Lengkap</span>
                                </span>
                              )}
                              {prof.profileSubmittedAt && (
                                <span className="block text-[10px] text-[#66757F] mt-0.5">
                                  Disubmit: {prof.profileSubmittedAt}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                                {!isVerified && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onVerifyParticipantProfile) {
                                          onVerifyParticipantProfile(prof.id, 'Terverifikasi');
                                        }
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                      title="Setujui & Verifikasi Berkas Profil"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Setujui</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRejectingProfileId(prof.id);
                                        setProfileRejectReason(
                                          'Mohon periksa kembali kejelasan berkas/dokumen dan kelengkapan data diri Anda.'
                                        );
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                      title="Minta Perbaikan / Revisi Berkas"
                                    >
                                      <AlertCircle className="w-3 h-3" />
                                      <span>Revisi</span>
                                    </button>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setViewingProfile(prof)}
                                  className="px-2.5 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  title="Lihat Detail Profil & Berkas"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Detail</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tambah / Ubah Peserta Manual (Super Admin & Admin Pelatihan) */}
        {showPartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <form
              onSubmit={handleSaveManualParticipant}
              className="w-full max-w-xl rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                  {editingPartReg
                    ? 'Ubah Data Pendaftaran Peserta'
                    : 'Tambah Peserta Pelatihan Secara Manual'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPartModal(false);
                    setEditingPartReg(null);
                  }}
                  className="text-xs font-bold text-[#66757F] hover:text-white cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nama Lengkap Peserta & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualPartName}
                    onChange={(e) => setManualPartName(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.E., Ak., BKP"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Alamat Email Peserta *
                  </label>
                  <input
                    type="email"
                    required
                    value={manualPartEmail}
                    onChange={(e) => setManualPartEmail(e.target.value)}
                    placeholder="peserta@email.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nomor HP / WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualPartPhone}
                    onChange={(e) => setManualPartPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Pilih Program Pelatihan *
                  </label>
                  <select
                    value={manualPartProgId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setManualPartProgId(pid);
                      const found = programs.find((p) => p.id === pid);
                      if (found) setManualPartAmount(found.price);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({formatRupiah(p.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Metode Pembayaran *
                  </label>
                  <select
                    value={manualPartMethod}
                    onChange={(e) => setManualPartMethod(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    {paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.name}>
                        {pm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nominal Biaya (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={manualPartAmount}
                    onChange={(e) => setManualPartAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Status Pendaftaran & Pembayaran *
                  </label>
                  <select
                    value={manualPartStatusPreset}
                    onChange={(e) => setManualPartStatusPreset(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    <option value="verified">
                      Langsung Terdaftar & Pembayaran Terverifikasi (Lunas)
                    </option>
                    <option value="pending_verify">Menunggu Verifikasi Pembayaran</option>
                    <option value="unpaid">Menunggu Pembayaran (Belum Dibayar)</option>
                  </select>
                </div>

                {/* Dynamic Custom Fields from Form Builder for Modul Peserta */}
                {formFields.filter((f) => f.targetModule === 'participants' && f.visible).length > 0 && (
                  <div className="sm:col-span-2 p-3.5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#087A4B]/20 space-y-3">
                    <div className="flex items-center gap-1.5 text-[#087A4B] dark:text-[#34D399] font-bold text-xs">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Field Tambahan (Dynamic Form Builder — Modul Peserta)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formFields
                        .filter((f) => f.targetModule === 'participants' && f.visible)
                        .map((fld) => (
                          <div key={fld.id} className={fld.type === 'textarea' ? 'sm:col-span-2' : ''}>
                            <label className="block font-bold text-[#66757F] mb-1">
                              {fld.label} {fld.required && <span className="text-red-500">*</span>}
                            </label>
                            {fld.type === 'select' ? (
                              <select
                                value={customFieldValues[fld.key] || ''}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              >
                                <option value="">Pilih opsi...</option>
                                {fld.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : fld.type === 'radio' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => (
                                  <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                    <input
                                      type="radio"
                                      name={fld.key}
                                      checked={customFieldValues[fld.key] === opt}
                                      onChange={() =>
                                        setCustomFieldValues((prev) => ({
                                          ...prev,
                                          [fld.key]: opt,
                                        }))
                                      }
                                      className="accent-[#087A4B]"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : fld.type === 'checkbox' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => {
                                  const currentVals = (customFieldValues[fld.key] || '')
                                    .split(', ')
                                    .filter(Boolean);
                                  const isChecked = currentVals.includes(opt);
                                  return (
                                    <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const updated = e.target.checked
                                            ? [...currentVals, opt]
                                            : currentVals.filter((v: string) => v !== opt);
                                          setCustomFieldValues((prev) => ({
                                            ...prev,
                                            [fld.key]: updated.join(', '),
                                          }));
                                        }}
                                        className="accent-[#087A4B] rounded"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : fld.type === 'textarea' ? (
                              <textarea
                                value={customFieldValues[fld.key] || ''}
                                placeholder={fld.placeholder || `Masukkan ${fld.label}`}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                rows={2}
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            ) : (
                              <input
                                type={fld.type === 'number' ? 'number' : fld.type === 'date' ? 'date' : 'text'}
                                value={customFieldValues[fld.key] || ''}
                                placeholder={fld.placeholder || `Masukkan ${fld.label}`}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => {
                    setShowPartModal(false);
                    setEditingPartReg(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold cursor-pointer"
                >
                  {editingPartReg ? 'Simpan Perubahan Peserta' : 'Simpan & Daftarkan Peserta'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Participant Confirmation Modal */}
        {deletingPartReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <h3 className="text-base font-extrabold text-red-600 dark:text-red-400">
                Hapus Data Peserta
              </h3>
              <p className="text-[#66757F] dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus pendaftaran peserta{' '}
                <strong className="text-[#172026] dark:text-white">
                  {deletingPartReg.participantName} ({deletingPartReg.regNumber})
                </strong>
                ?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPartReg(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRegistration(deletingPartReg.id);
                    setDeletingPartReg(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                >
                  Ya, Hapus Peserta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Reset Data Peserta Confirmation */}
        {showResetParticipantsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-red-200 dark:border-red-900/50 p-6 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-900/40 shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                    Reset Semua Data Peserta
                  </h3>
                  <p className="text-[11px] text-[#66757F] dark:text-slate-400">
                    Pengosongan seluruh data pendaftaran peserta diklat
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2 text-[#66757F] dark:text-slate-300 leading-relaxed">
                <p className="font-bold text-red-700 dark:text-red-300">
                  Perhatian:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Seluruh catatan pendaftaran peserta dan nomor registrasi akan dihapus bersih (0 peserta).</li>
                  <li>Data akun peserta lokal di-reset ke kondisi awal.</li>
                  <li>Laporan peserta dan mutasi verifikasi akan dimulai kembali dari nol.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetParticipantsModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold text-[#172026] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetParticipantsData) onResetParticipantsData();
                    setShowResetParticipantsModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ya, Reset Data Peserta</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Permintaan Revisi Profil Peserta */}
        {rejectingProfileId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Permintaan Revisi Profil Peserta</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRejectingProfileId(null)}
                  className="text-xs text-[#66757F] hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-[#66757F] dark:text-slate-300">
                Tuliskan catatan detail mengenai data profil atau dokumen yang perlu diperbaiki oleh peserta:
              </p>

              <div>
                <label className="block font-bold text-[#66757F] mb-1">
                  Catatan Revisi untuk Peserta *
                </label>
                <textarea
                  rows={3}
                  required
                  value={profileRejectReason}
                  onChange={(e) => setProfileRejectReason(e.target.value)}
                  placeholder="Contoh: Berkas KTP buram dan tidak terbaca. Harap unggah foto KTP asli yang jelas."
                  className="w-full px-3 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => setRejectingProfileId(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onVerifyParticipantProfile) {
                      onVerifyParticipantProfile(
                        rejectingProfileId,
                        'Perlu Revisi',
                        profileRejectReason.trim() || 'Mohon periksa kembali kejelasan dokumen dan kelengkapan data pribadi Anda.'
                      );
                    }
                    setRejectingProfileId(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Kirim Permintaan Revisi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Detail Profil & Berkas Dokumen Peserta */}
        {viewingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <div className="w-full max-w-3xl rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-5 shadow-2xl text-xs my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#087A4B] bg-slate-100 dark:bg-slate-800 shrink-0">
                    {viewingProfile.avatarUrl ? (
                      <ResilientImage
                        src={viewingProfile.avatarUrl}
                        alt={viewingProfile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">
                        {viewingProfile.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                      {viewingProfile.fullName}
                    </h3>
                    <p className="text-xs text-[#66757F]">{viewingProfile.email} · {viewingProfile.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingProfile(null)}
                  className="text-xs font-bold text-[#66757F] hover:text-white cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-3 rounded-lg border flex items-center justify-between gap-3 bg-[#F6F8F7] dark:bg-[#0E1518] border-[#D9E2DE] dark:border-[#243239]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#66757F]">Status Verifikasi:</span>
                  {viewingProfile.isVerified || viewingProfile.verificationStatus === 'Terverifikasi' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      ✓ Terverifikasi Resmi
                    </span>
                  ) : viewingProfile.verificationStatus === 'Menunggu Verifikasi Admin' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 animate-pulse">
                      ⏳ Menunggu Verifikasi Admin
                    </span>
                  ) : viewingProfile.verificationStatus === 'Perlu Revisi' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800">
                      ⚠️ Perlu Revisi
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                      ⚠️ Belum Lengkap
                    </span>
                  )}
                </div>
                {viewingProfile.profileSubmittedAt && (
                  <span className="text-[11px] text-[#66757F]">
                    Disubmit: {viewingProfile.profileSubmittedAt}
                  </span>
                )}
              </div>

              {viewingProfile.verificationNotes && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-200">
                  <strong className="block text-[11px] font-bold">Catatan Verifikasi / Revisi:</strong>
                  <p className="mt-0.5 text-xs">{viewingProfile.verificationNotes}</p>
                </div>
              )}

              {/* Data Identitas & Kontak */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#087A4B] uppercase tracking-wider text-[11px]">
                  1. Informasi Identitas & Domisili
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518]">
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">NIK KTP</span>
                    <strong className="font-mono">{viewingProfile.nik || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">NPWP</span>
                    <strong className="font-mono">{viewingProfile.npwp || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">JENIS KELAMIN</span>
                    <strong>{viewingProfile.gender || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">TEMPAT & TANGGAL LAHIR</span>
                    <strong>{viewingProfile.birthPlace || '-'}, {viewingProfile.birthDate || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">DOMISILI</span>
                    <strong>{viewingProfile.city ? `${viewingProfile.city}, ${viewingProfile.province}` : viewingProfile.province || '-'}</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-[10px] text-[#66757F] font-bold block">ALAMAT LENGKAP KTP</span>
                    <strong>{viewingProfile.address || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Pendidikan & Pekerjaan */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#087A4B] uppercase tracking-wider text-[11px]">
                  2. Riwayat Pendidikan & Karir
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518]">
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">PENDIDIKAN</span>
                    <strong>{viewingProfile.educationLevel || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">INSTITUSI / KAMPUS</span>
                    <strong>{viewingProfile.institution || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">PRODI / JURUSAN</span>
                    <strong>{viewingProfile.major || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66757F] font-bold block">PEKERJAAN & JABATAN</span>
                    <strong>{viewingProfile.occupation || '-'} {viewingProfile.position ? `(${viewingProfile.position})` : ''}</strong>
                  </div>
                </div>
              </div>

              {/* Berkas Persyaratan */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#087A4B] uppercase tracking-wider text-[11px]">
                  3. Berkas & Dokumen Persyaratan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['KTP', 'NPWP', 'Pas Foto', 'Ijazah'].map((docType) => {
                    const doc = viewingProfile.documents?.find((d) => d.type === docType);
                    const hasFile = Boolean(doc && doc.fileName && doc.fileName !== 'Belum ada file diunggah');

                    return (
                      <div
                        key={docType}
                        className="p-3 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-[#087A4B] shrink-0" />
                          <div className="min-w-0">
                            <strong className="block text-xs truncate">Dokumen {docType}</strong>
                            <span className="text-[11px] text-[#66757F] block truncate">
                              {hasFile ? `${doc?.fileName} (${doc?.fileSize})` : 'Belum diunggah'}
                            </span>
                          </div>
                        </div>
                        {hasFile && doc ? (
                          <button
                            type="button"
                            onClick={() => setPreviewingDoc(doc)}
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#087A4B] text-[11px] font-bold hover:border-[#087A4B] cursor-pointer shrink-0"
                          >
                            Lihat Berkas
                          </button>
                        ) : (
                          <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                            Kosong
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => setViewingProfile(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectingProfileId(viewingProfile.id);
                    setProfileRejectReason(
                      'Mohon periksa kembali kejelasan berkas/dokumen dan kelengkapan data diri Anda.'
                    );
                    setViewingProfile(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Minta Revisi</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onVerifyParticipantProfile) {
                      onVerifyParticipantProfile(viewingProfile.id, 'Terverifikasi');
                    }
                    setViewingProfile(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Setujui & Verifikasi Profil</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Preview Dokumen Berkas */}
        {previewingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <div className="flex items-center gap-2 text-[#087A4B] font-extrabold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Preview Dokumen Persyaratan: {previewingDoc.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewingDoc(null)}
                  className="text-xs text-[#66757F] hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 rounded-xl bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-[#087A4B] flex items-center justify-center mx-auto shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <strong className="text-sm text-[#172026] dark:text-white block">
                    {previewingDoc.fileName}
                  </strong>
                  <span className="text-xs text-[#66757F]">
                    Ukuran: {previewingDoc.fileSize} · Kategori: {previewingDoc.type} · Diunggah: {previewingDoc.uploadedAt}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold inline-block">
                  ✓ Berkas digital tersimpan resmi pada Cloud Storage AKP2I
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => setPreviewingDoc(null)}
                  className="px-4 py-2 rounded-lg bg-[#087A4B] text-white font-bold cursor-pointer"
                >
                  Tutup Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Impor Data Peserta dari File Excel */}
        {showImportParticipantsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <div className="w-full max-w-4xl rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-5 shadow-2xl text-xs my-8 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-[#087A4B] dark:text-[#34D399]">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                      Impor Data Peserta Pelatihan dari File Excel (.xlsx)
                    </h3>
                    <p className="text-[11px] text-[#66757F]">
                      Unggah berkas spreadsheet untuk menambahkan peserta dan akun profil secara massal
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImportParticipantsModal(false)}
                  className="text-xs font-bold text-[#66757F] hover:text-white cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              {/* Petunjuk & Download Template Box */}
              <div className="p-4 rounded-xl border border-emerald-300/70 dark:border-emerald-800/50 bg-[#EAF7F0]/70 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#087A4B] dark:text-emerald-300 text-xs">
                    Format Template Resmi AKP2I:
                  </h4>
                  <p className="text-[11px] text-[#087A4B]/90 dark:text-slate-300 leading-relaxed">
                    Pastikan kolom Nama Lengkap, Email, dan WhatsApp terisi. Anda dapat mengunduh format template resmi yang telah dilengkapi contoh pengisian data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadImportTemplate}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#151F24] border border-[#087A4B] text-[#087A4B] dark:text-[#34D399] font-bold text-xs hover:bg-[#087A4B] hover:text-white transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Format Excel (.xlsx)</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="p-6 rounded-xl border-2 border-dashed border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-center space-y-3 bg-[#F6F8F7] dark:bg-[#0E1518]/60 transition-colors">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#087A4B] dark:text-[#34D399] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <label className="inline-block px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold cursor-pointer shadow-xs">
                    <span>Pilih Berkas Excel (.xlsx / .xls)</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleExcelFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#66757F] mt-1.5">
                    {importFileName
                      ? `Berkas dipilih: ${importFileName}`
                      : 'Mendukung format .xlsx, .xls, dan .csv (Maksimal 10 MB)'}
                  </p>
                </div>
              </div>

              {/* Preview & Validation Results */}
              {parsedImportRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172026] dark:text-white">
                        Hasil Analisis Data Spreadsheet:
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-[#66757F]">
                        {parsedImportRows.length} Total Baris
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        {parsedImportRows.filter((r) => r.isValid).length} Siap Diimpor
                      </span>
                      {parsedImportRows.filter((r) => !r.isValid).length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                          {parsedImportRows.filter((r) => !r.isValid).length} Tidak Valid
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#D9E2DE] dark:border-[#243239] overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#F6F8F7] dark:bg-[#1A2429] border-b border-[#D9E2DE] dark:border-[#243239] text-[10px] uppercase font-bold text-[#66757F]">
                        <tr>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Nama Lengkap</th>
                          <th className="py-2 px-3">Email & WhatsApp</th>
                          <th className="py-2 px-3">Program Pelatihan</th>
                          <th className="py-2 px-3">Status Pembayaran</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239]">
                        {parsedImportRows.map((r, i) => (
                          <tr
                            key={i}
                            className={r.isValid ? 'hover:bg-[#F6F8F7]/50' : 'bg-rose-50/50 dark:bg-rose-950/20'}
                          >
                            <td className="py-2 px-3 whitespace-nowrap">
                              {r.isValid ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Valid</span>
                                </span>
                              ) : (
                                <span className="text-rose-600 font-bold flex items-center gap-1" title={r.error}>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>{r.error || 'Gagal'}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-semibold text-[#172026] dark:text-white">
                              {r.fullName || <span className="text-rose-500 font-bold">(Kosong)</span>}
                            </td>
                            <td className="py-2 px-3">
                              <div>{r.email || <span className="text-rose-500 font-bold">(Kosong)</span>}</div>
                              <div className="text-[10px] text-[#66757F]">{r.phone || '-'}</div>
                            </td>
                            <td className="py-2 px-3 text-[#172026] dark:text-slate-300">
                              {r.programTitle}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  r.paymentStatus === 'Pembayaran Terverifikasi'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {r.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => setShowImportParticipantsModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={
                    isImporting ||
                    parsedImportRows.filter((r) => r.isValid).length === 0
                  }
                  onClick={handleConfirmImport}
                  className="px-5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    {isImporting
                      ? 'Menyimpan ke Database...'
                      : `Konfirmasi & Simpan ${
                          parsedImportRows.filter((r) => r.isValid).length
                        } Peserta`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     3B. PAYMENT METHODS MODULE (CRUD EXCLUSIVELY BY SUPER ADMIN, QRIS JPG UPLOAD)
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-payment-methods') {
    const openCreatePmModal = () => {
      if (!canManagePaymentMethods) {
        onShowToast('Akses ditolak: Hanya Super Admin yang dapat menambah Metode Pembayaran.');
        return;
      }
      setEditingPm(null);
      setPmName('');
      setPmType('bank_transfer');
      setPmBankName('');
      setPmAccountNumber('');
      setPmAccountHolder('Perkumpulan Asosiasi Konsultan Pajak Publik Indonesia (AKP2I)');
      setPmQrisImageUrl('');
      setPmQrisFileName('');
      setPmInstructions('Transfer sesuai nominal tagihan dan unggah bukti pembayaran.');
      setPmIsActive(true);
      setShowPmModal(true);
    };

    const openEditPmModal = (pm: PaymentMethodItem) => {
      if (!canManagePaymentMethods) {
        onShowToast('Akses ditolak: Hanya Super Admin yang dapat mengubah Metode Pembayaran.');
        return;
      }
      setEditingPm(pm);
      setPmName(pm.name);
      setPmType(pm.type);
      setPmBankName(pm.bankName || '');
      setPmAccountNumber(pm.accountNumber || '');
      setPmAccountHolder(pm.accountHolder);
      setPmQrisImageUrl(pm.qrisImageUrl || '');
      setPmQrisFileName(pm.qrisFileName || '');
      setPmInstructions(pm.instructions || '');
      setPmIsActive(pm.isActive);
      setShowPmModal(true);
    };

    const handleQrisJpgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const isJpg =
        file.type === 'image/jpeg' ||
        file.name.toLowerCase().endsWith('.jpg') ||
        file.name.toLowerCase().endsWith('.jpeg');
      if (!isJpg) {
        onShowToast('Format file QRIS wajib berupa gambar .JPG / .JPEG.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('Ukuran file gambar QRIS maksimal 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPmQrisImageUrl(reader.result);
          setPmQrisFileName(file.name);
          onShowToast(`Gambar QRIS "${file.name}" (.JPG) berhasil dimuat.`);
        }
      };
      reader.readAsDataURL(file);
    };

    const handleSavePaymentMethod = (e: React.FormEvent) => {
      e.preventDefault();
      if (!canManagePaymentMethods) {
        onShowToast('Hanya Super Admin yang dapat mengelola Metode Pembayaran.');
        return;
      }
      if (!pmName.trim() || !pmAccountHolder.trim()) {
        onShowToast('Harap lengkapi Nama Metode Pembayaran dan Atas Nama / Merchant.');
        return;
      }
      if (pmType === 'qris' && !pmQrisImageUrl) {
        onShowToast('Untuk metode QRIS, silakan unggah file gambar QRIS format .JPG terlebih dahulu.');
        return;
      }

      const nowStr = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      if (editingPm) {
        const updated: PaymentMethodItem = {
          ...editingPm,
          name: pmName.trim(),
          type: pmType,
          bankName: pmType === 'bank_transfer' ? pmBankName.trim() : undefined,
          accountNumber: pmAccountNumber.trim(),
          accountHolder: pmAccountHolder.trim(),
          qrisImageUrl: pmType === 'qris' ? pmQrisImageUrl : undefined,
          qrisFileName: pmType === 'qris' ? pmQrisFileName : undefined,
          instructions: pmInstructions.trim(),
          isActive: pmIsActive,
          updatedAt: nowStr,
        };
        onUpdatePaymentMethod(updated);
        setShowPmModal(false);
        setEditingPm(null);
      } else {
        const created: PaymentMethodItem = {
          id: `pm-${Date.now()}`,
          name: pmName.trim(),
          type: pmType,
          bankName: pmType === 'bank_transfer' ? pmBankName.trim() : undefined,
          accountNumber: pmAccountNumber.trim(),
          accountHolder: pmAccountHolder.trim(),
          qrisImageUrl: pmType === 'qris' ? pmQrisImageUrl : undefined,
          qrisFileName: pmType === 'qris' ? pmQrisFileName : undefined,
          instructions: pmInstructions.trim(),
          isActive: pmIsActive,
          updatedAt: nowStr,
        };
        onAddPaymentMethod(created);
        setShowPmModal(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
              MANAJEMEN KEUANGAN · PENGATURAN METODE PEMBAYARAN (KHUSUS SUPER ADMIN)
            </p>
            <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
              Pengaturan Metode Pembayaran & Upload QRIS (.JPG)
            </h1>
            <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
              Tambah, ubah, atau hapus rekening Bank Transfer dan kode QRIS resmi AKP2I (format .JPG). Modul ini hanya dapat dikelola oleh Super Admin.
            </p>
          </div>
          {canManagePaymentMethods ? (
            <button
              onClick={openCreatePmModal}
              className="px-4 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 self-start cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Metode Pembayaran</span>
            </button>
          ) : (
            <span className="px-3.5 py-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-[#F4C430] text-xs font-bold">
              Akses Terbatas: Hanya Super Admin yang dapat mengelola Metode Pembayaran
            </span>
          )}
        </div>

        {/* Bulk Action Bar for Payment Methods */}
        {selectedPmIds.length > 0 && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>{selectedPmIds.length} metode pembayaran dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPmIds([])}
                className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
              >
                Batal Pilihan
              </button>
              {canManagePaymentMethods && (
                <button
                  type="button"
                  onClick={() => {
                    const count = selectedPmIds.length;
                    if (onDeleteMultiplePaymentMethods) {
                      onDeleteMultiplePaymentMethods(selectedPmIds);
                    } else {
                      selectedPmIds.forEach((id) => onDeletePaymentMethod(id));
                      onShowToast(`${count} metode pembayaran berhasil dihapus sekaligus.`);
                    }
                    setSelectedPmIds([]);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Sekaligus ({selectedPmIds.length})</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paymentMethods.length > 0 && selectedPmIds.length === paymentMethods.length
                      }
                      onChange={(e) =>
                        setSelectedPmIds(e.target.checked ? paymentMethods.map((m) => m.id) : [])
                      }
                      className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                      title="Pilih semua metode pembayaran"
                    />
                  </th>
                  <th className="py-3.5 px-4">METODE PEMBAYARAN</th>
                  <th className="py-3.5 px-4">TIPE</th>
                  <th className="py-3.5 px-4">NO. REKENING / GAMBAR QRIS (.JPG)</th>
                  <th className="py-3.5 px-4">ATAS NAMA / MERCHANT</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">AKSI SUPER ADMIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                {paymentMethods.map((pm) => (
                  <tr
                    key={pm.id}
                    className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                      selectedPmIds.includes(pm.id) ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10' : ''
                    }`}
                  >
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedPmIds.includes(pm.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedPmIds((prev) =>
                            prev.includes(pm.id) ? prev.filter((id) => id !== pm.id) : [...prev, pm.id]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#172026] dark:text-white">{pm.name}</div>
                      {pm.bankName && (
                        <span className="text-[11px] text-[#66757F]">{pm.bankName}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                          pm.type === 'qris'
                            ? 'bg-[#F4C430]/20 text-[#087A4B] dark:text-[#F4C430]'
                            : 'bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399]'
                        }`}
                      >
                        {pm.type === 'qris' ? (
                          <>
                            <QrCode className="w-3 h-3" />
                            <span>QRIS (.JPG)</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3 h-3" />
                            <span>Transfer Bank</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {pm.type === 'qris' ? (
                        <div className="flex items-center gap-3">
                          {pm.qrisImageUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewQrisPm(pm)}
                              className="group relative w-12 h-12 rounded-lg border border-[#D9E2DE] bg-white p-1 overflow-hidden shrink-0 cursor-pointer"
                              title="Klik untuk memperbesar gambar QRIS JPG"
                            >
                              <img
                                src={pm.qrisImageUrl}
                                alt={pm.name}
                                className="w-full h-full object-contain"
                              />
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-lg border border-dashed border-[#D9E2DE] flex items-center justify-center text-[10px] text-[#66757F]">
                              Default
                            </div>
                          )}
                          <div>
                            <div className="font-mono font-bold text-[#172026] dark:text-white">
                              {pm.accountNumber || 'QRIS Nasional'}
                            </div>
                            <span className="text-[11px] text-[#087A4B] dark:text-[#34D399]">
                              {pm.qrisFileName
                                ? `File: ${pm.qrisFileName}`
                                : 'Klik Ubah untuk upload gambar .JPG'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono font-extrabold text-sm text-[#172026] dark:text-white tabular-nums">
                          {pm.accountNumber || '-'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-semibold text-[#172026] dark:text-slate-200">
                        {pm.accountHolder}
                      </div>
                      {pm.instructions && (
                        <p className="text-[11px] text-[#66757F] line-clamp-1 mt-0.5">
                          {pm.instructions}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          pm.isActive
                            ? 'bg-emerald-500/15 text-[#087A4B] dark:text-[#34D399]'
                            : 'bg-slate-200 dark:bg-slate-800 text-[#66757F]'
                        }`}
                      >
                        {pm.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {canManagePaymentMethods ? (
                        <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => openEditPmModal(pm)}
                            className="px-2.5 py-1.5 rounded bg-[#087A4B] hover:bg-[#045A38] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Ubah</span>
                          </button>
                          <button
                            onClick={() =>
                              onUpdatePaymentMethod({ ...pm, isActive: !pm.isActive })
                            }
                            className="px-2.5 py-1.5 rounded border border-[#D9E2DE] dark:border-[#243239] text-[11px] font-semibold cursor-pointer"
                          >
                            {pm.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            onClick={() => setDeletingPm(pm)}
                            className="px-2.5 py-1.5 rounded bg-red-600/15 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#66757F]">Khusus Super Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah / Ubah Metode Pembayaran (Khusus Super Admin) */}
        {showPmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <form
              onSubmit={handleSavePaymentMethod}
              className="w-full max-w-xl rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#D9E2DE] dark:border-[#243239] pb-3">
                <h3 className="text-base font-extrabold text-[#172026] dark:text-white">
                  {editingPm
                    ? 'Ubah Metode Pembayaran Resmi AKP2I'
                    : 'Tambah Metode Pembayaran Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPmModal(false);
                    setEditingPm(null);
                  }}
                  className="text-xs font-bold text-[#66757F] hover:text-white cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Jenis Metode Pembayaran *
                  </label>
                  <select
                    value={pmType}
                    onChange={(e) => setPmType(e.target.value as 'bank_transfer' | 'qris')}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  >
                    <option value="bank_transfer">Transfer Bank</option>
                    <option value="qris">QRIS (Upload Gambar .JPG)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#66757F] mb-1">
                    Nama Metode Pembayaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={pmName}
                    onChange={(e) => setPmName(e.target.value)}
                    placeholder={
                      pmType === 'qris' ? 'Contoh: QRIS Resmi AKP2I' : 'Contoh: Transfer Bank BNI'
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                {pmType === 'bank_transfer' ? (
                  <>
                    <div>
                      <label className="block font-bold text-[#66757F] mb-1">
                        Nama Bank & Kantor Cabang *
                      </label>
                      <input
                        type="text"
                        required
                        value={pmBankName}
                        onChange={(e) => setPmBankName(e.target.value)}
                        placeholder="Contoh: Bank BNI (KCU Jakarta Pusat)"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#66757F] mb-1">
                        Nomor Rekening *
                      </label>
                      <input
                        type="text"
                        required
                        value={pmAccountNumber}
                        onChange={(e) => setPmAccountNumber(e.target.value)}
                        placeholder="Contoh: 088-219-4410"
                        className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#66757F] mb-1">
                        Nomor NMID / ID QRIS (Opsional)
                      </label>
                      <input
                        type="text"
                        value={pmAccountNumber}
                        onChange={(e) => setPmAccountNumber(e.target.value)}
                        placeholder="Contoh: NMID: ID2026091882910"
                        className="w-full px-3.5 py-2 font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                      />
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl border border-dashed border-[#087A4B] bg-[#EAF7F0]/50 dark:bg-[#087A4B]/10 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-extrabold text-[#087A4B] dark:text-[#34D399] block">
                            Upload Gambar Kode QRIS (Format .JPG / .JPEG) *
                          </span>
                          <span className="text-[11px] text-[#66757F]">
                            {pmQrisFileName
                              ? `File terpilih: ${pmQrisFileName}`
                              : 'Pilih file gambar QRIS resmi berformat .jpg atau .jpeg'}
                          </span>
                        </div>
                        <label className="px-3.5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer self-start">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih File QRIS (.JPG)</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,image/jpeg"
                            onChange={handleQrisJpgUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {pmQrisImageUrl && (
                        <div className="flex items-center gap-4 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                          <div className="p-2 bg-white rounded-lg border border-[#D9E2DE] shrink-0">
                            <img
                              src={pmQrisImageUrl}
                              alt="Preview QRIS JPG"
                              className="w-28 h-28 object-contain"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-[#172026] dark:text-white">
                              Pratinjau Gambar QRIS (.JPG) Aktif
                            </p>
                            <p className="text-[11px] text-[#66757F]">
                              Gambar QRIS ini akan ditampilkan kepada peserta saat memilih pembayaran QRIS pada formulir pendaftaran pelatihan.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Atas Nama Rekening / Nama Merchant QRIS *
                  </label>
                  <input
                    type="text"
                    required
                    value={pmAccountHolder}
                    onChange={(e) => setPmAccountHolder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#66757F] mb-1">
                    Instruksi / Catatan Pembayaran
                  </label>
                  <textarea
                    rows={2}
                    value={pmInstructions}
                    onChange={(e) => setPmInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pmIsActive}
                      onChange={(e) => setPmIsActive(e.target.checked)}
                      className="accent-[#087A4B]"
                    />
                    <span>Aktifkan metode pembayaran ini di Formulir Pendaftaran Peserta</span>
                  </label>
                </div>

                {/* Dynamic Custom Fields from Form Builder for Metode Pembayaran */}
                {formFields.filter((f) => f.targetModule === 'payment-methods' && f.visible).length > 0 && (
                  <div className="sm:col-span-2 p-3.5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#087A4B]/20 space-y-3">
                    <div className="flex items-center gap-1.5 text-[#087A4B] dark:text-[#34D399] font-bold text-xs">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Field Tambahan (Dynamic Form Builder — Metode Pembayaran)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formFields
                        .filter((f) => f.targetModule === 'payment-methods' && f.visible)
                        .map((fld) => (
                          <div key={fld.id} className={fld.type === 'textarea' ? 'sm:col-span-2' : ''}>
                            <label className="block font-bold text-[#66757F] mb-1">
                              {fld.label} {fld.required && <span className="text-red-500">*</span>}
                            </label>
                            {fld.type === 'select' ? (
                              <select
                                value={customFieldValues[fld.key] || ''}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              >
                                <option value="">Pilih opsi...</option>
                                {fld.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : fld.type === 'radio' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => (
                                  <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                    <input
                                      type="radio"
                                      name={fld.key}
                                      value={opt}
                                      checked={customFieldValues[fld.key] === opt}
                                      onChange={() =>
                                        setCustomFieldValues((prev) => ({
                                          ...prev,
                                          [fld.key]: opt,
                                        }))
                                      }
                                      className="accent-[#087A4B]"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : fld.type === 'checkbox' ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                {fld.options?.map((opt) => {
                                  const currentVals = (customFieldValues[fld.key] || '')
                                    .split(', ')
                                    .filter(Boolean);
                                  const isChecked = currentVals.includes(opt);
                                  return (
                                    <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const updated = e.target.checked
                                            ? [...currentVals, opt]
                                            : currentVals.filter((v: string) => v !== opt);
                                          setCustomFieldValues((prev) => ({
                                            ...prev,
                                            [fld.key]: updated.join(', '),
                                          }));
                                        }}
                                        className="accent-[#087A4B] rounded"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <input
                                type={fld.type === 'number' ? 'number' : 'text'}
                                value={customFieldValues[fld.key] || ''}
                                onChange={(e) =>
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: e.target.value,
                                  }))
                                }
                                placeholder={fld.placeholder || `Masukkan ${fld.label}...`}
                                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D9E2DE] dark:border-[#243239]">
                <button
                  type="button"
                  onClick={() => {
                    setShowPmModal(false);
                    setEditingPm(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white font-bold cursor-pointer"
                >
                  {editingPm ? 'Simpan Perubahan' : 'Simpan Metode Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Preview QRIS JPG */}
        {previewQrisPm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 text-center shadow-2xl">
              <h3 className="text-sm font-extrabold text-[#172026] dark:text-white">
                {previewQrisPm.name}
              </h3>
              <div className="p-3 bg-white rounded-xl border border-[#D9E2DE] inline-block mx-auto">
                <img
                  src={previewQrisPm.qrisImageUrl}
                  alt={previewQrisPm.name}
                  className="w-64 h-64 object-contain"
                />
              </div>
              <p className="text-xs font-bold text-[#087A4B] dark:text-[#34D399]">
                {previewQrisPm.accountHolder}
              </p>
              <button
                type="button"
                onClick={() => setPreviewQrisPm(null)}
                className="w-full py-2 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        )}

        {/* Delete Payment Method Confirmation Modal */}
        {deletingPm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4 shadow-2xl text-xs">
              <h3 className="text-base font-extrabold text-red-600 dark:text-red-400">
                Hapus Metode Pembayaran
              </h3>
              <p className="text-[#66757F] dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus metode pembayaran{' '}
                <strong className="text-[#172026] dark:text-white">
                  {deletingPm.name}
                </strong>
                ? Tindakan ini hanya dapat dilakukan oleh Super Admin.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPm(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeletePaymentMethod(deletingPm.id);
                    setDeletingPm(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                >
                  Ya, Hapus Metode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     4. PAYMENT VERIFICATION VIEW
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-payments') {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
            KEUANGAN & VERIFIKATOR · VERIFIKASI PEMBAYARAN
          </p>
          <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
            Verifikasi Bukti Pembayaran Peserta
          </h1>
          <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
            Periksa bukti transfer bank atau resi QRIS peserta. Ketika disetujui, status otomatis berubah menjadi Pembayaran Terverifikasi dan peserta mendapat akses kelas.
          </p>
        </div>

        {/* Bulk Action Bar for Payment Verification */}
        {selectedPayIds.length > 0 && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>{selectedPayIds.length} transaksi pembayaran dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPayIds([])}
                className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
              >
                Batal Pilihan
              </button>
              <button
                type="button"
                onClick={() => {
                  const count = selectedPayIds.length;
                  if (onDeleteMultipleRegistrations) {
                    onDeleteMultipleRegistrations(selectedPayIds);
                  } else {
                    selectedPayIds.forEach((id) => onDeleteRegistration(id));
                    onShowToast(`${count} data transaksi berhasil dihapus.`);
                  }
                  setSelectedPayIds([]);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Sekaligus ({selectedPayIds.length})</span>
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        registrations.length > 0 && selectedPayIds.length === registrations.length
                      }
                      onChange={(e) =>
                        setSelectedPayIds(e.target.checked ? registrations.map((r) => r.id) : [])
                      }
                      className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                      title="Pilih semua data transaksi"
                    />
                  </th>
                  <th className="py-3.5 px-4">PESERTA</th>
                  <th className="py-3.5 px-4">PROGRAM</th>
                  <th className="py-3.5 px-4 text-right">NOMINAL</th>
                  <th className="py-3.5 px-4">METODE</th>
                  <th className="py-3.5 px-4">BUKTI BAYAR</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">AKSI VERIFIKATOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
                {registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                      selectedPayIds.includes(reg.id) ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10' : ''
                    }`}
                  >
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedPayIds.includes(reg.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedPayIds((prev) =>
                            prev.includes(reg.id) ? prev.filter((id) => id !== reg.id) : [...prev, reg.id]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#172026] dark:text-white">
                        {reg.participantName}
                      </div>
                      <span className="font-mono text-[11px] text-[#66757F]">{reg.regNumber}</span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">{reg.programTitle}</td>
                    <td className="py-4 px-4 text-right font-mono font-extrabold text-[#087A4B] dark:text-[#F4C430] tabular-nums">
                      {formatRupiah(reg.amount)}
                    </td>
                    <td className="py-4 px-4">{reg.paymentMethod}</td>
                    <td className="py-4 px-4 font-mono text-[11px] text-[#087A4B] dark:text-[#38BDF8]">
                      {reg.paymentProofFileName || 'Belum diunggah'}
                    </td>
                    <td className="py-4 px-4">
                      <StatusLabel status={reg.paymentStatus} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onApprovePayment(reg.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-[11px] font-bold cursor-pointer"
                        >
                          ✓ Setujui
                        </button>
                        <button
                          onClick={() => setRejectingRegId(reg.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-600 dark:text-red-400 text-[11px] font-bold cursor-pointer"
                        >
                          × Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reject Payment Modal */}
        {rejectingRegId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] p-6 space-y-4">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                Tolak Bukti Pembayaran & Kirim Alasan Revisi
              </h3>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRejectingRegId(null)}
                  className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onRejectPayment(rejectingRegId, rejectReason);
                    setRejectingRegId(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  Konfirmasi Tolak Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     5. DYNAMIC FORM BUILDER VIEW (MULTI-MODUL DENGAN PILIHAN OPSI INTERAKTIF)
     -------------------------------------------------------------------------- */
  if (activeSubView === 'admin-form-builder') {
    const FORM_MODULES: {
      id: string;
      label: string;
      desc: string;
      badgeClass: string;
    }[] = [
      {
        id: 'registration',
        label: 'Formulir Pendaftaran Peserta',
        desc: 'Form registrasi pendaftaran & diklat oleh calon peserta',
        badgeClass:
          'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      },
      {
        id: 'finance',
        label: 'Manajemen Keuangan & Kas',
        desc: 'Pencatatan pengeluaran, bukti kas, & beban operasional',
        badgeClass:
          'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      },
      {
        id: 'programs',
        label: 'Manajemen Program & Diklat',
        desc: 'Formulir pembuatan & kustomisasi kurikulum program',
        badgeClass:
          'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      },
      {
        id: 'payments',
        label: 'Verifikasi Pembayaran',
        desc: 'Pencatatan verifikasi, rekening tujuan, & approval transfer',
        badgeClass:
          'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      },
      {
        id: 'participants',
        label: 'Manajemen Data Peserta',
        desc: 'Kelengkapan atribut profil & rekapitulasi peserta',
        badgeClass:
          'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
      },
      {
        id: 'certificates',
        label: 'Penerbitan Sertifikat',
        desc: 'Penerbitan nomor registrasi SK & spesifikasi sertifikat',
        badgeClass:
          'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      },
      {
        id: 'payment-methods',
        label: 'Metode Pembayaran',
        desc: 'Penambahan rekening bank & instruksi pembayaran gateway',
        badgeClass:
          'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
      },
      {
        id: 'schedules',
        label: 'Manajemen Jadwal Zoom',
        desc: 'Penetapan jadwal sesi instruktur & tautan Zoom',
        badgeClass:
          'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      },
    ];

    const isOptionType =
      newFieldType === 'select' || newFieldType === 'radio' || newFieldType === 'checkbox';

    const handleAddOption = () => {
      const trimmed = newOptionInput.trim();
      if (!trimmed) return;
      if (!newFieldOptionsList.includes(trimmed)) {
        setNewFieldOptionsList([...newFieldOptionsList, trimmed]);
      }
      setNewOptionInput('');
    };

    const handleRemoveOption = (index: number) => {
      setNewFieldOptionsList(newFieldOptionsList.filter((_, i) => i !== index));
    };

    const handleApplyPreset = (preset: string[]) => {
      setNewFieldOptionsList([...preset]);
    };

    const handleAddField = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newFieldLabel.trim()) return;

      let finalOptions: string[] | undefined = undefined;
      if (isOptionType) {
        let opts = [...newFieldOptionsList];
        if (newOptionInput.trim() && !opts.includes(newOptionInput.trim())) {
          opts.push(newOptionInput.trim());
        }
        if (opts.length === 0) {
          opts = ['Pilihan 1', 'Pilihan 2'];
        }
        finalOptions = opts;
      }

      const selectedModObj = FORM_MODULES.find((m) => m.id === newFieldModule);

      const newField: RegistrationField = {
        id: `fld-${Date.now()}`,
        key: `custom_${newFieldModule}_${Date.now()}`,
        label: newFieldLabel.trim(),
        type: newFieldType,
        required: newFieldRequired,
        visible: true,
        targetModule: newFieldModule,
        section: 'tambahan',
        options: finalOptions,
        placeholder: `Masukkan ${newFieldLabel.trim()}`,
      };

      onUpdateFormFields([...formFields, newField]);
      setNewFieldLabel('');
      setNewOptionInput('');
      setNewFieldOptionsList(['Pilihan 1', 'Pilihan 2']);
      onShowToast(
        `Field "${newField.label}" berhasil ditambahkan ke modul ${
          selectedModObj?.label || newFieldModule
        }!`
      );
    };

    const handleRemoveField = (id: string, label: string) => {
      if (confirm(`Apakah Anda yakin ingin menghapus field "${label}"?`)) {
        onUpdateFormFields(formFields.filter((f) => f.id !== id));
        onShowToast(`Field "${label}" berhasil dihapus.`);
      }
    };

    const handleAddFieldOptionInline = (fieldId: string) => {
      const trimmed = editingNewOptionInput.trim();
      if (!trimmed) return;
      onUpdateFormFields(
        formFields.map((f) => {
          if (f.id === fieldId) {
            const currentOpts = f.options || [];
            if (!currentOpts.includes(trimmed)) {
              return { ...f, options: [...currentOpts, trimmed] };
            }
          }
          return f;
        })
      );
      setEditingNewOptionInput('');
    };

    const handleRemoveFieldOptionInline = (fieldId: string, optIndex: number) => {
      onUpdateFormFields(
        formFields.map((f) => {
          if (f.id === fieldId && f.options) {
            return {
              ...f,
              options: f.options.filter((_, i) => i !== optIndex),
            };
          }
          return f;
        })
      );
    };

    const filteredFields = formFields.filter((fld) => {
      const targetMod = fld.targetModule || 'registration';
      const matchesModule =
        formBuilderActiveModuleFilter === 'all' || targetMod === formBuilderActiveModuleFilter;
      const matchesSearch =
        fld.label.toLowerCase().includes(formBuilderSearch.toLowerCase()) ||
        targetMod.toLowerCase().includes(formBuilderSearch.toLowerCase()) ||
        fld.type.toLowerCase().includes(formBuilderSearch.toLowerCase());
      return matchesModule && matchesSearch;
    });

    const getModuleMeta = (modId?: string) => {
      const resolved = modId || 'registration';
      return (
        FORM_MODULES.find((m) => m.id === resolved) || {
          id: resolved,
          label: resolved,
          desc: '',
          badgeClass:
            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        }
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>ADMIN PANEL · DYNAMIC FORM BUILDER</span>
            </p>
            <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white mt-1">
              Konfigurasi Formulir & Custom Field Multi-Modul
            </h1>
            <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1 max-w-3xl">
              Tambahkan field kustom baru ke semua modul sistem (Pendaftaran, Manajemen Keuangan, Program, Verifikasi Pembayaran, Peserta, Sertifikat, Metode Pembayaran, atau Jadwal). Lengkap dengan konfigurasi pilihan opsi untuk Dropdown, Radio Button, dan Checkbox.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] font-mono text-xs font-bold">
              Total {formFields.length} Field
            </span>
          </div>
        </div>

        {/* Add Custom Field Form Bar */}
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE] dark:border-[#243239] mb-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#087A4B] dark:text-[#34D399]" />
              <h2 className="text-sm font-extrabold text-[#172026] dark:text-white">
                Tambah Field Kustom Baru
              </h2>
            </div>
            <span className="text-[11px] text-[#66757F] dark:text-slate-400">
              Field baru akan otomatis aktif di modul tujuan yang dipilih
            </span>
          </div>

          <form onSubmit={handleAddField} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
              {/* Target Modul Dropdown */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-[#172026] dark:text-slate-200 mb-1 flex items-center justify-between">
                  <span>Tujuan Modul *</span>
                  <span className="text-[10px] text-[#087A4B] font-normal">Semua modul didukung</span>
                </label>
                <select
                  value={newFieldModule}
                  onChange={(e) => setNewFieldModule(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-semibold text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                >
                  {FORM_MODULES.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#66757F] dark:text-slate-400 mt-1">
                  {FORM_MODULES.find((m) => m.id === newFieldModule)?.desc}
                </p>
              </div>

              {/* Label Field */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-[#172026] dark:text-slate-200 mb-1">
                  Label Field Baru *
                </label>
                <input
                  type="text"
                  required
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Contoh: Pusat Biaya / No. KTA / Ukuran Rompi"
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                />
              </div>

              {/* Tipe Input */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172026] dark:text-slate-200 mb-1">
                  Tipe Input *
                </label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] font-semibold text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                >
                  <option value="text">Text Input (Singkat)</option>
                  <option value="textarea">Textarea (Panjang)</option>
                  <option value="number">Number / Angka</option>
                  <option value="select">Dropdown Select</option>
                  <option value="radio">Radio Button</option>
                  <option value="checkbox">Checkbox (Multi)</option>
                  <option value="date">Tanggal (Date)</option>
                  <option value="file">Upload File</option>
                </select>
              </div>

              {/* Required & Submit */}
              <div className="sm:col-span-2 flex flex-col justify-end gap-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="accent-[#087A4B] rounded"
                  />
                  <span>Wajib Diisi</span>
                </label>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-[#087A4B] hover:bg-[#06613b] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Field</span>
                </button>
              </div>
            </div>

            {/* OPTIONS CONFIGURATION BUILDER FOR SELECT, RADIO, & CHECKBOX */}
            {isOptionType && (
              <div className="p-4 rounded-xl bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#087A4B]/30 dark:border-[#087A4B]/40 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E2DE] dark:border-[#243239]">
                  <div className="flex items-center gap-2 text-[#087A4B] dark:text-[#34D399] font-extrabold text-xs">
                    <ListFilter className="w-4 h-4" />
                    <span>
                      Konfigurasi Pilihan Opsi ({newFieldType === 'select' ? 'Dropdown Select' : newFieldType === 'radio' ? 'Radio Button' : 'Checkbox'})
                    </span>
                  </div>
                  <span className="text-[11px] text-[#66757F] dark:text-slate-400">
                    {newFieldOptionsList.length} opsi pilihan terkonfigurasi
                  </span>
                </div>

                {/* Option Badges List */}
                <div>
                  <label className="block text-[11px] font-bold text-[#66757F] dark:text-slate-400 mb-1.5">
                    Daftar Pilihan Aktif:
                  </label>
                  <div className="flex flex-wrap items-center gap-2 min-h-8">
                    {newFieldOptionsList.length === 0 ? (
                      <span className="text-xs text-red-500 italic">
                        Belum ada opsi pilihan. Mohon tambahkan minimal 1 opsi.
                      </span>
                    ) : (
                      newFieldOptionsList.map((opt, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] border border-[#087A4B]/30 shadow-2xs"
                        >
                          <span className="text-[10px] opacity-60">#{idx + 1}</span>
                          <span>{opt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[#66757F] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-extrabold cursor-pointer transition-colors"
                            title="Hapus opsi ini"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Input Add New Option */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newOptionInput}
                      onChange={(e) => setNewOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                      placeholder="Ketik nama opsi baru di sini, lalu tekan Enter atau klik [Tambah Opsi]..."
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#06613b] text-white text-xs font-bold cursor-pointer transition-colors inline-flex items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi</span>
                  </button>
                </div>

                {/* Instant Preset Buttons */}
                <div className="pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                  <p className="text-[10px] font-bold text-[#66757F] dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Preset Pilihan Cepat (Klik untuk menerapkan instan):
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { label: 'Ya / Tidak', values: ['Ya', 'Tidak'] },
                      { label: 'Laki-laki / Perempuan', values: ['Laki-laki', 'Perempuan'] },
                      {
                        label: 'Tingkat Kemahiran (Dasar / Menengah / Lanjutan)',
                        values: ['Tingkat Dasar (Pemula)', 'Tingkat Menengah', 'Tingkat Lanjutan (Spesialis)'],
                      },
                      {
                        label: 'Ukuran Pakaian (S – XXL)',
                        values: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                      },
                      {
                        label: 'Prioritas (Rendah / Sedang / Tinggi)',
                        values: ['Rendah', 'Sedang', 'Tinggi / Urgent'],
                      },
                      {
                        label: 'Format Sertifikat (Digital / Fisik / Keduanya)',
                        values: ['Digital E-Certificate', 'Cetak Piagam Hardcopy', 'Keduanya (Digital + Piagam)'],
                      },
                      {
                        label: 'Status Kelulusan (Lulus / Ujian Ulang / Gugur)',
                        values: ['Lulus Kompetensi', 'Ujian Ulang (Remedial)', 'Gugur / Belum Memenuhi Syarat'],
                      },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(preset.values)}
                        className="px-2.5 py-1 rounded text-[11px] font-medium bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-slate-300 hover:border-[#087A4B] hover:text-[#087A4B] cursor-pointer transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Module Filter Tabs & Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                type="button"
                onClick={() => setFormBuilderActiveModuleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  formBuilderActiveModuleFilter === 'all'
                    ? 'bg-[#087A4B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white'
                }`}
              >
                Semua Modul ({formFields.length})
              </button>
              {FORM_MODULES.map((mod) => {
                const count = formFields.filter(
                  (f) => (f.targetModule || 'registration') === mod.id
                ).length;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setFormBuilderActiveModuleFilter(mod.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      formBuilderActiveModuleFilter === mod.id
                        ? 'bg-[#087A4B] text-white shadow-xs'
                        : 'bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white'
                    }`}
                  >
                    {mod.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#66757F]" />
              <input
                type="text"
                value={formBuilderSearch}
                onChange={(e) => setFormBuilderSearch(e.target.value)}
                placeholder="Cari label / modul..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
              />
            </div>
          </div>
        </div>

        {/* Field List Editor */}
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F6F8F7] dark:bg-[#0E1518] border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#172026] dark:text-white">
              Daftar Field Terdaftar ({filteredFields.length} field ditemukan)
            </span>
            <span className="text-[11px] text-[#66757F] dark:text-slate-400">
              Ubah label langsung, atur opsi pilihan, status wajib, atau tampilkan/sembunyikan
            </span>
          </div>

          <div className="divide-y divide-[#D9E2DE] dark:divide-[#243239]">
            {filteredFields.length === 0 ? (
              <div className="p-8 text-center text-[#66757F] dark:text-slate-400 space-y-2">
                <Sliders className="w-8 h-8 mx-auto text-[#087A4B] opacity-50" />
                <p className="text-xs font-semibold">
                  Tidak ada field yang cocok dengan filter atau kata kunci pencarian.
                </p>
              </div>
            ) : (
              filteredFields.map((fld) => {
                const modMeta = getModuleMeta(fld.targetModule);
                const hasOptions =
                  fld.type === 'select' || fld.type === 'radio' || fld.type === 'checkbox';

                return (
                  <div
                    key={fld.id}
                    className="p-4 flex flex-col gap-3.5 hover:bg-slate-50/50 dark:hover:bg-[#11191d] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Module Tag & Label Editor */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
                        {/* Module Tag & Selector */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${modMeta.badgeClass}`}
                          >
                            Modul: {modMeta.label}
                          </span>
                          <select
                            value={fld.targetModule || 'registration'}
                            onChange={(e) =>
                              onUpdateFormFields(
                                formFields.map((item) =>
                                  item.id === fld.id
                                    ? { ...item, targetModule: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="px-2 py-0.5 text-[10px] rounded bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] cursor-pointer"
                            title="Pindah field ke modul lain"
                          >
                            {FORM_MODULES.map((m) => (
                              <option key={m.id} value={m.id}>
                                Pindah ke: {m.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Label input */}
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={fld.label}
                            onChange={(e) =>
                              onUpdateFormFields(
                                formFields.map((item) =>
                                  item.id === fld.id ? { ...item, label: e.target.value } : item
                                )
                              )
                            }
                            className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                          />
                          <span className="font-mono text-[11px] text-[#66757F] shrink-0 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
                            Tipe: {fld.type}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions (Required, Visibility, Delete) */}
                      <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateFormFields(
                              formFields.map((item) =>
                                item.id === fld.id ? { ...item, required: !item.required } : item
                              )
                            )
                          }
                          className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                            fld.required
                              ? 'bg-amber-500/15 text-amber-600 dark:text-[#F4C430] border border-amber-300 dark:border-amber-800/40'
                              : 'bg-slate-200 dark:bg-slate-800 text-[#66757F]'
                          }`}
                        >
                          {fld.required ? 'Wajib (*)' : 'Opsional'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateFormFields(
                              formFields.map((item) =>
                                item.id === fld.id ? { ...item, visible: !item.visible } : item
                              )
                            )
                          }
                          className={`px-3 py-1 rounded font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                            fld.visible
                              ? 'bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] border border-[#087A4B]/30'
                              : 'bg-red-500/15 text-red-500 border border-red-200 dark:border-red-800/40'
                          }`}
                        >
                          {fld.visible ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Tampil</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Disembunyikan</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveField(fld.id, fld.label)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 cursor-pointer transition-colors"
                          title="Hapus field ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Options Preview & Inline Editor for Dropdown, Radio, Checkbox */}
                    {hasOptions && (
                      <div className="pl-3 sm:pl-4 py-2 border-l-2 border-[#087A4B]/40 bg-[#F6F8F7]/50 dark:bg-[#0E1518]/50 rounded-r-lg space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#087A4B] dark:text-[#34D399] flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Pilihan Opsi ({fld.options?.length || 0}):</span>
                          </span>
                          <span className="text-[10px] text-[#66757F]">
                            Klik tanda × untuk menghapus opsi, atau tambahkan opsi di sebelah kanan
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {fld.options && fld.options.length > 0 ? (
                            fld.options.map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-slate-200"
                              >
                                <span>{opt}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFieldOptionInline(fld.id, oIdx)}
                                  className="text-gray-400 hover:text-red-500 font-bold cursor-pointer ml-0.5"
                                  title="Hapus pilihan ini"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-amber-600 italic">
                              Belum ada opsi yang ditentukan.
                            </span>
                          )}
                        </div>

                        {/* Inline Add Option Bar */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="+ Tambah pilihan opsi baru untuk field ini..."
                            value={editingFieldOptionsId === fld.id ? editingNewOptionInput : ''}
                            onFocus={() => {
                              setEditingFieldOptionsId(fld.id);
                            }}
                            onChange={(e) => {
                              setEditingFieldOptionsId(fld.id);
                              setEditingNewOptionInput(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFieldOptionInline(fld.id);
                              }
                            }}
                            className="flex-1 max-w-sm px-2.5 py-1 text-[11px] rounded bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddFieldOptionInline(fld.id)}
                            className="px-2.5 py-1 rounded bg-[#087A4B] text-white text-[11px] font-bold cursor-pointer hover:bg-[#06613b]"
                          >
                            + Tambah
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     6. CERTIFICATE MANAGEMENT VIEW
     -------------------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430] uppercase">
            ADMIN PANEL · MANAJEMEN SERTIFIKAT & QR CODE
          </p>
          <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
            Penerbitan & Validasi Sertifikat Digital AKP2I
          </h1>
          <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
            Terbitkan sertifikat resmi ber-QR Code ke database Firestore, ubah pejabat penandatangan, atau cabut sertifikat.
          </p>
        </div>
      </div>

      {/* Form Penerbitan Sertifikat Baru */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!certRecipientName.trim()) {
            onShowToast('Masukkan nama lengkap penerima sertifikat.');
            return;
          }
          const selectedProg = programs.find((p) => p.id === certProgramId) || programs[0];
          const matchedReg = registrations.find(
            (r) =>
              r.participantName.toLowerCase() === certRecipientName.trim().toLowerCase() &&
              r.programId === selectedProg.id
          );
          const code = `SERT-AKP2I-2026-${Math.floor(1000 + Math.random() * 8999)}`;
          const newCert: Certificate = {
            id: code,
            certificateNumber: code,
            participantId: matchedReg?.participantId || 'admin-issued',
            participantName: certRecipientName.trim(),
            programId: selectedProg.id,
            programTitle: selectedProg.title,
            issueDate: new Date().toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            expiryDate: 'Seumur Hidup (Kompetensi Terverifikasi)',
            predicate: certPredicate.trim() || 'Lulus Kompetensi Utama',
            status: 'Valid & Aktif',
            qrVerificationCode: `https://klc.akp2i.or.id/verify/${code}`,
            signatoryName: 'Drs. Suherman Wijaya, Ak., M.M., BKP',
            signatoryTitle: 'Ketua Umum Dewan Pengurus Pusat AKP2I',
          };
          onGenerateCertificate(newCert);
          setCertRecipientName('');
        }}
        className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end"
      >
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-[#66757F] mb-1">
            Nama Lengkap Penerima Sertifikat *
          </label>
          <input
            type="text"
            required
            value={certRecipientName}
            onChange={(e) => setCertRecipientName(e.target.value)}
            placeholder="Ketik nama peserta & gelar..."
            className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
          />
        </div>
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-[#66757F] mb-1">
            Program Pelatihan / Sertifikasi *
          </label>
          <select
            value={certProgramId}
            onChange={(e) => setCertProgramId(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.shortTitle}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-[#66757F] mb-1">
            Predikat Kelulusan
          </label>
          <input
            type="text"
            value={certPredicate}
            onChange={(e) => setCertPredicate(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
          />
        </div>
        {/* Dynamic Custom Fields from Form Builder for Modul Sertifikat */}
        {formFields.filter((f) => f.targetModule === 'certificates' && f.visible).length > 0 && (
          <div className="sm:col-span-12 p-3.5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#087A4B]/20 space-y-3">
            <div className="flex items-center gap-1.5 text-[#087A4B] dark:text-[#34D399] font-bold text-xs">
              <Sliders className="w-3.5 h-3.5" />
              <span>Field Tambahan (Dynamic Form Builder — Penerbitan Sertifikat)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {formFields
                .filter((f) => f.targetModule === 'certificates' && f.visible)
                .map((fld) => (
                  <div key={fld.id} className={fld.type === 'textarea' ? 'sm:col-span-3' : ''}>
                    <label className="block font-bold text-[#66757F] text-xs mb-1">
                      {fld.label} {fld.required && <span className="text-red-500">*</span>}
                    </label>
                    {fld.type === 'select' ? (
                      <select
                        value={customFieldValues[fld.key] || ''}
                        onChange={(e) =>
                          setCustomFieldValues((prev) => ({
                            ...prev,
                            [fld.key]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                      >
                        <option value="">Pilih opsi...</option>
                        {fld.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : fld.type === 'radio' ? (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {fld.options?.map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name={fld.key}
                              value={opt}
                              checked={customFieldValues[fld.key] === opt}
                              onChange={() =>
                                setCustomFieldValues((prev) => ({
                                  ...prev,
                                  [fld.key]: opt,
                                }))
                              }
                              className="accent-[#087A4B]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : fld.type === 'checkbox' ? (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {fld.options?.map((opt) => {
                          const currentVals = (customFieldValues[fld.key] || '')
                            .split(', ')
                            .filter(Boolean);
                          const isChecked = currentVals.includes(opt);
                          return (
                            <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...currentVals, opt]
                                    : currentVals.filter((v: string) => v !== opt);
                                  setCustomFieldValues((prev) => ({
                                    ...prev,
                                    [fld.key]: updated.join(', '),
                                  }));
                                }}
                                className="accent-[#087A4B] rounded"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type={fld.type === 'number' ? 'number' : 'text'}
                        value={customFieldValues[fld.key] || ''}
                        onChange={(e) =>
                          setCustomFieldValues((prev) => ({
                            ...prev,
                            [fld.key]: e.target.value,
                          }))
                        }
                        placeholder={fld.placeholder || `Masukkan ${fld.label}...`}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239]"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full py-2 px-3 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>Terbitkan</span>
          </button>
        </div>
      </form>

      {/* Bulk Action Bar for Certificates */}
      {selectedCertIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{selectedCertIds.length} sertifikat dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCertIds([])}
              className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] hover:text-[#172026] dark:hover:text-white cursor-pointer font-semibold"
            >
              Batal Pilihan
            </button>
            <button
              type="button"
              onClick={() => {
                const count = selectedCertIds.length;
                if (onDeleteMultipleCertificates) {
                  onDeleteMultipleCertificates(selectedCertIds);
                } else if (onDeleteCertificate) {
                  selectedCertIds.forEach((id) => onDeleteCertificate(id));
                  onShowToast(`${count} sertifikat berhasil dihapus sekaligus.`);
                }
                setSelectedCertIds([]);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Sekaligus ({selectedCertIds.length})</span>
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#1A2429] text-[11px] font-extrabold text-[#66757F] uppercase">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      certificates.length > 0 && selectedCertIds.length === certificates.length
                    }
                    onChange={(e) =>
                      setSelectedCertIds(e.target.checked ? certificates.map((c) => c.id) : [])
                    }
                    className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                    title="Pilih semua sertifikat"
                  />
                </th>
                <th className="py-3.5 px-4">NO. SERTIFIKAT</th>
                <th className="py-3.5 px-4">NAMA PESERTA</th>
                <th className="py-3.5 px-4">PROGRAM</th>
                <th className="py-3.5 px-4">TANGGAL TERBIT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2DE] dark:divide-[#243239] text-xs">
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className={`hover:bg-[#F6F8F7]/60 dark:hover:bg-[#0E1518]/50 ${
                    selectedCertIds.includes(cert.id) ? 'bg-[#EAF7F0]/40 dark:bg-[#087A4B]/10' : ''
                  }`}
                >
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCertIds.includes(cert.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedCertIds((prev) =>
                          prev.includes(cert.id)
                            ? prev.filter((id) => id !== cert.id)
                            : [...prev, cert.id]
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 accent-[#087A4B] cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-[#087A4B] dark:text-[#F4C430]">
                    {cert.certificateNumber}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#172026] dark:text-white">
                    {cert.participantName}
                  </td>
                  <td className="py-4 px-4 max-w-xs">{cert.programTitle}</td>
                  <td className="py-4 px-4">{cert.issueDate}</td>
                  <td className="py-4 px-4">
                    <StatusLabel status={cert.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onViewCertificateModal(cert)}
                        className="px-3 py-1.5 rounded bg-[#087A4B] text-white text-[11px] font-bold cursor-pointer"
                      >
                        Pratinjau & Unduh
                      </button>
                      <button
                        onClick={() => onRevokeCertificate(cert.id)}
                        className="px-2.5 py-1.5 rounded border border-[#D9E2DE] dark:border-[#243239] text-[11px] font-semibold cursor-pointer"
                      >
                        {cert.status === 'Valid & Aktif' ? 'Revoke' : 'Aktifkan'}
                      </button>
                      {onDeleteCertificate && (
                        <button
                          onClick={() => onDeleteCertificate(cert.id)}
                          className="p-1.5 rounded bg-red-600/15 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white text-[11px] font-bold cursor-pointer transition-colors"
                          title="Hapus Sertifikat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
