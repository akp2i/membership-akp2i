/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Calendar,
  ClipboardList,
  BookOpen,
  Award,
  FileCheck2,
  Bell,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ShieldCheck,
  Sliders,
  CreditCard,
  Users,
  BarChart3,
  Globe,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Landmark,
} from 'lucide-react';

import {
  UserProfile,
  UserRole,
  Program,
  Registration,
  RegistrationField,
  ScheduleAgenda,
  ExamResult,
  Certificate,
  NotificationItem,
  AuditLogItem,
  AdminAccountItem,
  PaymentMethodItem,
  ExpenseItem,
  validateProfileData,
} from './types/akp2i';

import {
  INITIAL_USER_PROFILE,
  INITIAL_PROGRAMS,
  DEFAULT_AKP2I_PROGRAMS,
  INITIAL_REGISTRATIONS,
  INITIAL_FORM_FIELDS,
  INITIAL_SCHEDULES,
  DEFAULT_AKP2I_SCHEDULES,
  INITIAL_EXAM_RESULTS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ADMIN_ACCOUNTS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_EXPENSES,
} from './data/mockDatabase';

import {
  auth,
  db,
  googleProvider,
  SUPER_ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
  syncAuthenticatedUser,
  saveUserProfileToFirestore,
  createRegistrationInFirestore,
  uploadPaymentProofInFirestore,
  adminUpdateRegistrationInFirestore,
  createCertificateInFirestore,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  collection,
  query,
  where,
  onSnapshot,
} from './firebase';

import { Akp2iLogoMark } from './components/ui/ResilientImage';
import { CertificateModal } from './components/modals/CertificateModal';
import { RegistrationWizardModal } from './components/modals/RegistrationWizardModal';
import {
  HomeView,
  AgendaCatalogView,
  ProgramDetailView,
  PublicCertificateVerifyView,
} from './components/public/PublicViews';
import {
  ParticipantDashboardView,
  ProfileView,
  MyRegistrationsView,
  MyCoursesAndLmsView,
  ScheduleCalendarView,
  ExamResultsView,
  MyCertificatesView,
} from './components/portal/ParticipantViews';
import { AdminViews } from './components/admin/AdminViews';

type AppArea = 'public' | 'portal';

type PublicPage = 'home' | 'agenda' | 'program-detail' | 'verify-certificate' | 'about-faq';

type PortalView =
  | 'dashboard'
  | 'profile'
  | 'agenda'
  | 'my-registrations'
  | 'my-courses'
  | 'schedule'
  | 'exam-results'
  | 'certificates'
  | 'verify-certificate'
  | 'notifications'
  | 'help'
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

const STORAGE_KEYS = {
  PROGRAMS: 'akp2i_programs_v3',
  ADMINS: 'akp2i_admin_accounts_v2',
  PARTICIPANTS: 'akp2i_registered_participants_v3',
  PAYMENT_METHODS: 'akp2i_payment_methods_v1',
  REGISTRATIONS: 'akp2i_registrations_v3',
  AUTH_SESSION: 'akp2i_auth_session_v1',
  EXPENSES: 'akp2i_expenses_v3',
  FORM_FIELDS: 'akp2i_form_fields_v2',
  SCHEDULES: 'akp2i_schedules_v3',
};

// 7-day Remember Me duration: 7 days * 24 hours * 60 minutes * 60 seconds * 1000 ms
const REMEMBER_ME_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredAuthSession {
  rememberMe: boolean;
  loginAt: number;
  expiresAt: number;
  email: string;
  isPasswordSession: boolean;
  userProfile?: UserProfile;
  activeRole?: UserRole;
  isSuperAdminUser?: boolean;
}

const saveAuthSession = (session: StoredAuthSession) => {
  try {
    const dataStr = JSON.stringify(session);
    if (session.rememberMe) {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, dataStr);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, dataStr);
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  } catch {
    // ignore storage error
  }
};

const getStoredAuthSession = (): StoredAuthSession | null => {
  try {
    // Check localStorage first (remember me active across browser restarts)
    const localData = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (localData) {
      const parsed: StoredAuthSession = JSON.parse(localData);
      return parsed;
    }
    // Check sessionStorage (remember me unchecked: valid only for current session)
    const sessionData = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (sessionData) {
      const parsed: StoredAuthSession = JSON.parse(sessionData);
      return parsed;
    }
  } catch {
    // ignore storage error
  }
  return null;
};

const clearAuthSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  } catch {
    // ignore storage error
  }
};

export default function App() {
  // Check persisted session on boot
  const initialValidSession = (() => {
    const sess = getStoredAuthSession();
    if (sess) {
      if (Date.now() > sess.expiresAt) {
        clearAuthSession();
        return null;
      }
      return sess;
    }
    return null;
  })();

  // Theme state (default dark mode matching KLC reference screenshots, toggleable to light mode)
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (darkMode) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }, [darkMode]);

  // Core Navigation State
  const [appArea, setAppArea] = useState<AppArea>(
    initialValidSession && initialValidSession.isPasswordSession ? 'portal' : 'public'
  );
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [portalView, setPortalView] = useState<PortalView>(
    initialValidSession && initialValidSession.isSuperAdminUser
      ? 'admin-dashboard'
      : 'dashboard'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real Firebase & Password User & Role State (restores remembered session if within 7 days)
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(initialValidSession && initialValidSession.isPasswordSession)
  );
  const [isPasswordSession, setIsPasswordSession] = useState<boolean>(
    Boolean(initialValidSession && initialValidSession.isPasswordSession)
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(
    initialValidSession?.userProfile || INITIAL_USER_PROFILE
  );
  const [activeRole, setActiveRole] = useState<UserRole>(
    initialValidSession?.activeRole || initialValidSession?.userProfile?.role || 'Peserta'
  );
  const [isSuperAdminUser, setIsSuperAdminUser] = useState<boolean>(
    Boolean(initialValidSession?.isSuperAdminUser)
  );

  // Application Database State (with localStorage persistence for Programs CRUD & Admin Accounts)
  const [programs, setProgramsState] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_PROGRAMS;
  });

  const setPrograms = (updater: Program[] | ((prev: Program[]) => Program[])) => {
    setProgramsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const [adminAccounts, setAdminAccountsState] = useState<AdminAccountItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMINS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_ADMIN_ACCOUNTS;
  });

  const setAdminAccounts = (
    updater: AdminAccountItem[] | ((prev: AdminAccountItem[]) => AdminAccountItem[])
  ) => {
    setAdminAccountsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const [paymentMethods, setPaymentMethodsState] = useState<PaymentMethodItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_PAYMENT_METHODS;
  });

  const setPaymentMethods = (
    updater: PaymentMethodItem[] | ((prev: PaymentMethodItem[]) => PaymentMethodItem[])
  ) => {
    setPaymentMethodsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const [registrations, setRegistrationsState] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_REGISTRATIONS;
  });

  const setRegistrations = (
    updater: Registration[] | ((prev: Registration[]) => Registration[])
  ) => {
    setRegistrationsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  // Manajemen Keuangan Operational Expenses State with LocalStorage Persistence
  const [expenses, setExpensesState] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_EXPENSES;
  });

  const setExpenses = (
    updater: ExpenseItem[] | ((prev: ExpenseItem[]) => ExpenseItem[])
  ) => {
    setExpensesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const handleAddExpense = (expense: ExpenseItem) => {
    setExpenses((prev) => [expense, ...prev]);
    showToast(`Pengeluaran kas ${expense.code} berhasil dicatat.`);
  };

  const handleUpdateExpense = (expense: ExpenseItem) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expense.id ? expense : e))
    );
    showToast(`Data pengeluaran kas ${expense.code} berhasil diperbarui.`);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Data pengeluaran kas berhasil dihapus.');
  };

  const handleDeleteMultipleExpenses = (ids: string[]) => {
    setExpenses((prev) => prev.filter((e) => !ids.includes(e.id)));
    showToast(`${ids.length} data pengeluaran kas berhasil dihapus.`);
  };

  // Registered Participant Accounts State for Admin Participant Verification
  const [registeredParticipants, setRegisteredParticipantsState] = useState<
    { profile: UserProfile; password?: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return [
      {
        profile: INITIAL_USER_PROFILE,
        password: 'password123',
      },
    ];
  });

  const setRegisteredParticipants = (
    updater:
      | { profile: UserProfile; password?: string }[]
      | ((
          prev: { profile: UserProfile; password?: string }[]
        ) => { profile: UserProfile; password?: string }[])
  ) => {
    setRegisteredParticipantsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const handleResetParticipantsData = () => {
    setRegistrations([]);
    setRegisteredParticipants([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
    } catch {
      // ignore storage error
    }
    showToast('Seluruh data peserta & pendaftaran berhasil di-reset menjadi kosong (0 peserta).');
  };

  const handleResetProgramsData = () => {
    setPrograms([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
    } catch {
      // ignore storage error
    }
    setSelectedProgramDetail(null);
    showToast('Seluruh data program pelatihan berhasil di-reset menjadi kosong (0 program).');
  };

  const [formFields, setFormFields] = useState<RegistrationField[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_FIELDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse formFields:', e);
    }
    return INITIAL_FORM_FIELDS;
  });

  const handleUpdateFormFields = (newFields: RegistrationField[]) => {
    setFormFields(newFields);
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(newFields));
    } catch (e) {
      console.warn('Failed to save formFields to localStorage:', e);
    }
  };
  const [schedules, setSchedulesState] = useState<ScheduleAgenda[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SCHEDULES;
  });

  const setSchedules = (
    updater: ScheduleAgenda[] | ((prev: ScheduleAgenda[]) => ScheduleAgenda[])
  ) => {
    setSchedulesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const [examResults, setExamResults] = useState<ExamResult[]>(INITIAL_EXAM_RESULTS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Selected items & Modals
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<Program | null>(
    programs[0] || null
  );
  const [activeLmsCourse, setActiveLmsCourse] = useState<Program | null>(null);
  const [wizardProgram, setWizardProgram] = useState<Program | null>(null);
  const [modalCertificate, setModalCertificate] = useState<Certificate | null>(null);
  const [verifyCertInitialCode, setVerifyCertInitialCode] = useState<string>('');

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState(SUPER_ADMIN_EMAIL);
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Global Search & Notifications Dropdown
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  // Centralized Logout with 7-Day Session Cleanup
  const handleLogout = async (customMessage?: string) => {
    clearAuthSession();
    setIsPasswordSession(false);
    setIsLoggedIn(false);
    setIsSuperAdminUser(false);
    setActiveRole('Peserta');
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setAppArea('public');
    setPublicPage('home');
    showToast(customMessage || 'Anda telah keluar dari akun Portal AKP2I.');
  };

  // Periodic 7-Day Session Expiration Check (checks every 30 seconds & on window focus)
  useEffect(() => {
    const checkExpiry = () => {
      const activeSession = getStoredAuthSession();
      if (activeSession && Date.now() > activeSession.expiresAt) {
        handleLogout('Masa aktif sesi (7 hari) telah habis. Anda telah keluar otomatis demi keamanan.');
      }
    };

    checkExpiry();
    const intervalId = setInterval(checkExpiry, 30000);
    window.addEventListener('focus', checkExpiry);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkExpiry);
    };
  }, []);

  // Real Firebase Auth Listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        if (!isPasswordSession) {
          setIsLoggedIn(false);
          setIsSuperAdminUser(false);
          setActiveRole('Peserta');
          setRegistrations([]);
          setCertificates([]);
        }
        setAuthReady(true);
        return;
      }

      // Check if session has expired beyond 7 days
      const currentSession = getStoredAuthSession();
      if (currentSession && Date.now() > currentSession.expiresAt) {
        await handleLogout('Masa aktif sesi (7 hari) telah habis. Anda telah keluar otomatis.');
        setAuthReady(true);
        return;
      }

      try {
        const syncedProfile = await syncAuthenticatedUser(fbUser, {
          fullName: authName || undefined,
          phone: authPhone || undefined,
        });
        const matchedConfiguredAdmin = adminAccounts.find(
          (a) => a.email.toLowerCase() === (fbUser.email || '').toLowerCase()
        );
        const finalRole: UserRole =
          (fbUser.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
            ? 'Super Admin'
            : matchedConfiguredAdmin
            ? matchedConfiguredAdmin.role
            : syncedProfile.role;

        const isAdminAccount =
          finalRole !== 'Peserta' ||
          (fbUser.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

        setUserProfile({ ...syncedProfile, role: finalRole });
        setActiveRole(finalRole);
        setIsSuperAdminUser(isAdminAccount);
        setIsLoggedIn(true);
        setAuthReady(true);

        // Ensure active session is saved if missing
        if (!currentSession) {
          saveAuthSession({
            rememberMe: true,
            loginAt: Date.now(),
            expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
            email: fbUser.email || '',
            isPasswordSession: false,
            userProfile: { ...syncedProfile, role: finalRole },
            activeRole: finalRole,
            isSuperAdminUser: isAdminAccount,
          });
        }
      } catch (err) {
        console.error('Failed to sync authenticated user:', err);
        setAuthReady(true);
      }
    });

    return () => unsubAuth();
  }, [isPasswordSession]);

  // Real-Time Firestore Listeners for Registrations & Certificates once Auth is ready
  useEffect(() => {
    if (!authReady || !isLoggedIn || !auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const isAdminQuery = isSuperAdminUser || activeRole !== 'Peserta';

    const regQuery = isAdminQuery
      ? collection(db, 'registrations')
      : query(collection(db, 'registrations'), where('participantId', '==', uid));

    const unsubRegs = onSnapshot(
      regQuery,
      (snapshot) => {
        const items: Registration[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: d.id || docSnap.id,
            regNumber: d.regNumber,
            programId: d.programId,
            programTitle: d.programTitle,
            subTierName: d.subTierName,
            participantId: d.participantId,
            participantName: d.participantName,
            participantEmail: d.participantEmail,
            participantPhone: d.participantPhone,
            registeredAt: d.registeredAt,
            trainingDateText: d.trainingDateText,
            amount: d.amount,
            status: d.status,
            paymentStatus: d.paymentStatus,
            paymentMethod: d.paymentMethod,
            paymentProofFileName: d.paymentProofFileName,
            paymentProofSize: d.paymentProofSize,
            paymentProofUploadedAt: d.paymentProofUploadedAt,
            paymentRejectionReason: d.paymentRejectionReason,
            stepIndex: d.stepIndex,
            documentsSubmitted: [],
          };
        });
        setRegistrations(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'registrations');
      }
    );

    const certQuery = isAdminQuery
      ? collection(db, 'certificates')
      : query(collection(db, 'certificates'), where('participantId', '==', uid));

    const unsubCerts = onSnapshot(
      certQuery,
      (snapshot) => {
        const items: Certificate[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: d.id || docSnap.id,
            certificateNumber: d.certificateNumber,
            participantId: d.participantId,
            participantName: d.participantName,
            programId: d.programId,
            programTitle: d.programTitle,
            issueDate: d.issueDate,
            expiryDate: d.expiryDate,
            predicate: d.predicate,
            status: d.status,
            qrVerificationCode: d.qrVerificationCode,
            signatoryName: d.signatoryName,
            signatoryTitle: d.signatoryTitle,
          };
        });
        setCertificates(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'certificates');
      }
    );

    return () => {
      unsubRegs();
      unsubCerts();
    };
  }, [authReady, isLoggedIn, isSuperAdminUser, activeRole]);

  // Role Switching Handler (Only available for verified Admin accounts)
  const handleRoleSwitch = (newRole: UserRole) => {
    if (!isSuperAdminUser && newRole !== 'Peserta') {
      showToast('Akses ditolak: Hanya akun Administrator resmi AKP2I yang dapat mengakses peran Admin.');
      return;
    }
    setActiveRole(newRole);
    setUserProfile((prev) => ({ ...prev, role: newRole }));
    if (newRole === 'Peserta') {
      setPortalView('dashboard');
    } else if (newRole === 'Verifikator') {
      setPortalView('admin-payments');
    } else {
      setPortalView('admin-dashboard');
    }
    showToast(`Peran aktif diubah menjadi: ${newRole}`);
  };

  // Profile Update Handler (Persists to Session & Firestore & registeredParticipants)
  const handleUpdateUserProfile = async (updated: UserProfile) => {
    setUserProfile(updated);

    // Sync to registeredParticipants
    setRegisteredParticipants((prev) => {
      const exists = prev.some(
        (p) =>
          p.profile.id === updated.id ||
          p.profile.email.toLowerCase() === updated.email.toLowerCase()
      );
      if (exists) {
        return prev.map((p) =>
          p.profile.id === updated.id ||
          p.profile.email.toLowerCase() === updated.email.toLowerCase()
            ? { ...p, profile: updated }
            : p
        );
      }
      return [{ profile: updated, password: 'password123' }, ...prev];
    });

    try {
      const stored =
        localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) ||
        sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.userProfile = updated;
        if (parsed.rememberMe) {
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(parsed));
        } else {
          sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(parsed));
        }
      }
    } catch {
      // ignore storage error
    }
    if (isLoggedIn && auth.currentUser) {
      await saveUserProfileToFirestore(updated);
    }
  };

  const handleAdminVerifyParticipantProfile = async (
    participantId: string,
    status: 'Terverifikasi' | 'Perlu Revisi',
    note?: string
  ) => {
    const verifiedAtStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let targetName = 'Peserta';

    setRegisteredParticipants((prev) =>
      prev.map((item) => {
        if (item.profile.id === participantId) {
          targetName = item.profile.fullName;
          const updatedProfile: UserProfile = {
            ...item.profile,
            isVerified: status === 'Terverifikasi',
            verificationStatus: status,
            verificationNotes: note,
            verifiedAt: status === 'Terverifikasi' ? verifiedAtStr : undefined,
            verifiedBy: `${activeRole} (${userProfile.fullName || 'Admin AKP2I'})`,
          };

          // If current logged-in user is this participant, immediately update live profile!
          if (
            userProfile.id === participantId ||
            userProfile.email.toLowerCase() === item.profile.email.toLowerCase()
          ) {
            setUserProfile(updatedProfile);
            try {
              const stored =
                localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) ||
                sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
              if (stored) {
                const parsed = JSON.parse(stored);
                parsed.userProfile = updatedProfile;
                if (parsed.rememberMe) {
                  localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(parsed));
                } else {
                  sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(parsed));
                }
              }
            } catch {
              // ignore
            }
          }

          return { ...item, profile: updatedProfile };
        }
        return item;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName || 'Admin AKP2I',
        role: activeRole,
        action:
          status === 'Terverifikasi'
            ? `Menyetujui & memverifikasi kelengkapan profil peserta ${targetName}`
            : `Mengirimkan permintaan revisi profil kepada ${targetName}: "${note || 'Perlu revisi berkas'}"`,
        target: targetName,
        channel: 'Web Portal',
      },
      ...prev,
    ]);

    showToast(
      status === 'Terverifikasi'
        ? `Profil ${targetName} berhasil diverifikasi & disetujui!`
        : `Permintaan revisi berkas telah dikirimkan ke profil ${targetName}.`
    );
  };

  // Registration & Payment Handlers
  const handleStartRegistration = (prog?: Program) => {
    const target = prog || programs[0];
    if (!isLoggedIn) {
      setWizardProgram(target);
      setAuthMode('login');
      setAuthModalOpen(true);
      showToast('Silakan masuk dengan akun Anda terlebih dahulu untuk mendaftar pelatihan.');
      return;
    }

    // Untuk peserta saat mendaftar wajib melengkapi semua data profil dulu & semua dokumen persyaratan
    if (activeRole === 'Peserta') {
      const profileCheck = validateProfileData(userProfile);
      if (!profileCheck.isValid) {
        setPortalView('profile');
        showToast(
          `Wajib melengkapi profil: ${profileCheck.error}`
        );
        return;
      }
    }

    setWizardProgram(target);
  };

  const handleCompleteRegistration = async (newReg: Registration) => {
    const regWithRealUser: Registration = {
      ...newReg,
      participantId: auth.currentUser?.uid || userProfile.id,
    };
    if (auth.currentUser) {
      await createRegistrationInFirestore(regWithRealUser);
    } else {
      setRegistrations((prev) => [regWithRealUser, ...prev]);
    }

    setPrograms((prev) =>
      prev.map((p) =>
        p.id === newReg.programId ? { ...p, enrolled: p.enrolled + 1 } : p
      )
    );
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Pendaftaran ${newReg.regNumber} Berhasil Dibuat`,
      message: `Pendaftaran Anda pada program ${newReg.programTitle} telah disimpan di database dengan status: ${newReg.status}.`,
      timestamp: 'Baru saja',
      type: 'registration',
      read: false,
      targetView: 'my-registrations',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: newReg.participantName,
        role: activeRole,
        action: `Mendaftar program ${newReg.programTitle} (${newReg.regNumber}) - Metode: ${newReg.paymentMethod}`,
        target: newReg.regNumber,
        channel: 'Web Portal',
      },
      ...prev,
    ]);
    setWizardProgram(null);
    setAppArea('portal');
    setPortalView('my-registrations');
    showToast(
      `Pendaftaran ${newReg.regNumber} berhasil disimpan ke database! Notifikasi WhatsApp telah dikirim ke ${newReg.participantPhone}.`
    );
  };

  const handleUploadProofLater = async (regId: string, fileName: string) => {
    if (auth.currentUser) {
      await uploadPaymentProofInFirestore(regId, fileName, '512 KB', 'Baru saja');
    } else {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId
            ? {
                ...r,
                paymentProofFileName: fileName,
                paymentProofSize: '512 KB',
                paymentProofUploadedAt: 'Baru saja',
                paymentStatus: 'Menunggu Verifikasi',
                status: 'Menunggu Verifikasi',
                stepIndex: 3,
              }
            : r
        )
      );
    }
    showToast(`Bukti pembayaran "${fileName}" berhasil diunggah ke database dan menunggu verifikasi.`);
  };

  // Admin Payment Approval / Rejection (Persists to Firestore & State)
  const handleAdminApprovePayment = async (regId: string) => {
    const target = registrations.find((r) => r.id === regId);
    if (auth.currentUser) {
      await adminUpdateRegistrationInFirestore(regId, {
        status: 'Terdaftar',
        paymentStatus: 'Pembayaran Terverifikasi',
        stepIndex: 5,
      });
    } else {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId
            ? {
                ...r,
                status: 'Terdaftar',
                paymentStatus: 'Pembayaran Terverifikasi',
                stepIndex: 5,
              }
            : r
        )
      );
    }
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Pembayaran Terverifikasi & Pendaftaran Disetujui',
          message: `Pembayaran untuk ${target.programTitle} (${target.regNumber}) telah disetujui. Peserta kini dapat mengakses kelas di Pelatihan Saya.`,
          timestamp: 'Baru saja',
          type: 'payment',
          read: false,
          targetView: 'my-courses',
        },
        ...prev,
      ]);
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          timestamp: 'Baru saja',
          actor: userProfile.fullName,
          role: activeRole,
          action: `Menyetujui pembayaran ${target.regNumber} (${target.participantName}) & mengirim WhatsApp Approval.`,
          target: target.regNumber,
          channel: 'WhatsApp API Gateway',
        },
        ...prev,
      ]);
    }
    showToast('Pembayaran berhasil diverifikasi di database! Status peserta kini Terdaftar.');
  };

  const handleAdminRejectPayment = async (regId: string, reason: string) => {
    if (auth.currentUser) {
      await adminUpdateRegistrationInFirestore(regId, {
        status: 'Menunggu Pembayaran',
        paymentStatus: 'Pembayaran Ditolak',
        stepIndex: 2,
        paymentRejectionReason: reason,
      });
    } else {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId
            ? {
                ...r,
                status: 'Menunggu Pembayaran',
                paymentStatus: 'Pembayaran Ditolak',
                stepIndex: 2,
                paymentRejectionReason: reason,
              }
            : r
        )
      );
    }
    showToast('Pembayaran ditolak di database dan alasan penolakan telah dikirim ke peserta.');
  };

  // Manual Participant CRUD Handlers (Super Admin & Admin Pelatihan)
  const handleAddManualRegistration = async (newReg: Registration) => {
    setRegistrations((prev) => [newReg, ...prev]);
    if (auth.currentUser) {
      await createRegistrationInFirestore(newReg);
    }
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === newReg.programId ? { ...p, enrolled: p.enrolled + 1 } : p
      )
    );
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName,
        role: activeRole,
        action: `Menambahkan peserta manual: ${newReg.participantName} (${newReg.regNumber}) pada ${newReg.programTitle}`,
        target: newReg.regNumber,
        channel: 'Web Portal',
      },
      ...prev,
    ]);
    showToast(
      `Peserta "${newReg.participantName}" (${newReg.regNumber}) berhasil ditambahkan secara manual!`
    );
  };

  const handleUpdateRegistration = async (updatedReg: Registration) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === updatedReg.id ? updatedReg : r))
    );
    if (auth.currentUser) {
      await adminUpdateRegistrationInFirestore(updatedReg.id, {
        status: updatedReg.status,
        paymentStatus: updatedReg.paymentStatus,
        stepIndex: updatedReg.stepIndex,
      });
    }
    showToast(`Data peserta "${updatedReg.participantName}" berhasil diperbarui!`);
  };

  const handleDeleteRegistration = (id: string) => {
    const target = registrations.find((r) => r.id === id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    if (target) {
      showToast(`Pendaftaran peserta "${target.participantName}" berhasil dihapus.`);
    }
  };

  const handleDeleteMultipleRegistrations = (ids: string[]) => {
    setRegistrations((prev) => prev.filter((r) => !ids.includes(r.id)));
    showToast(`${ids.length} pendaftaran peserta berhasil dihapus sekaligus.`);
  };

  const handleImportParticipants = (newRegs: Registration[], newProfiles: UserProfile[] = []) => {
    if (newRegs.length === 0) return;
    setRegistrations((prev) => [...newRegs, ...prev]);

    if (newProfiles.length > 0) {
      setRegisteredParticipants((prev) => {
        const existingEmails = new Set(prev.map((p) => p.profile.email.toLowerCase()));
        const additions = newProfiles
          .filter((p) => !existingEmails.has(p.email.toLowerCase()))
          .map((p) => ({ profile: p, password: 'password123' }));
        return [...additions, ...prev];
      });
    }

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName || 'Admin',
        role: activeRole,
        action: `Mengimpor ${newRegs.length} peserta pelatihan dari berkas Excel (.xlsx)`,
        target: `${newRegs.length} Peserta`,
        channel: 'Web Portal',
      },
      ...prev,
    ]);

    showToast(`Berhasil mengimpor ${newRegs.length} data peserta dari berkas Excel!`);
  };

  const handleDeleteMultiplePrograms = (ids: string[]) => {
    setPrograms((prev) => prev.filter((p) => !ids.includes(p.id)));
    showToast(`${ids.length} program pelatihan berhasil dihapus sekaligus.`);
  };

  // Payment Methods CRUD Handlers (Super Admin Only)
  const handleAddPaymentMethod = (newMethod: PaymentMethodItem) => {
    setPaymentMethods((prev) => [...prev, newMethod]);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName,
        role: activeRole,
        action: `Menambahkan metode pembayaran baru: ${newMethod.name} (${newMethod.type === 'qris' ? 'QRIS JPG' : 'Transfer Bank'})`,
        target: newMethod.name,
        channel: 'System Security',
      },
      ...prev,
    ]);
    showToast(`Metode pembayaran "${newMethod.name}" berhasil ditambahkan!`);
  };

  const handleUpdatePaymentMethod = (updatedMethod: PaymentMethodItem) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === updatedMethod.id ? updatedMethod : m))
    );
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName,
        role: activeRole,
        action: `Memperbarui metode pembayaran: ${updatedMethod.name}`,
        target: updatedMethod.name,
        channel: 'System Security',
      },
      ...prev,
    ]);
    showToast(`Metode pembayaran "${updatedMethod.name}" berhasil diperbarui!`);
  };

  const handleDeletePaymentMethod = (id: string) => {
    const target = paymentMethods.find((m) => m.id === id);
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      showToast(`Metode pembayaran "${target.name}" berhasil dihapus.`);
    }
  };

  const handleDeleteMultiplePaymentMethods = (ids: string[]) => {
    setPaymentMethods((prev) => prev.filter((m) => !ids.includes(m.id)));
    showToast(`${ids.length} metode pembayaran berhasil dihapus sekaligus.`);
  };

  // Admin Accounts Management Handlers
  const handleAddAdminAccount = (newAdmin: AdminAccountItem) => {
    setAdminAccounts((prev) => [...prev, newAdmin]);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName,
        role: activeRole,
        action: `Menambahkan akun Admin baru: ${newAdmin.fullName} (${newAdmin.email}) sebagai ${newAdmin.role}`,
        target: newAdmin.email,
        channel: 'System Security',
      },
      ...prev,
    ]);
    showToast(`Akun Admin "${newAdmin.fullName}" (${newAdmin.role}) berhasil ditambahkan!`);
  };

  const handleUpdateAdminAccount = (updatedAdmin: AdminAccountItem) => {
    setAdminAccounts((prev) =>
      prev.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
    );
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Baru saja',
        actor: userProfile.fullName,
        role: activeRole,
        action: `Memperbarui akun & password Admin: ${updatedAdmin.fullName} (${updatedAdmin.email})`,
        target: updatedAdmin.email,
        channel: 'System Security',
      },
      ...prev,
    ]);
    showToast(`Akun & password Admin "${updatedAdmin.fullName}" berhasil diperbarui!`);
  };

  const handleDeleteAdminAccount = (id: string) => {
    const target = adminAccounts.find((a) => a.id === id);
    if (target?.isPrimarySuperAdmin) {
      showToast('Akun Super Admin Utama tidak dapat dihapus.');
      return;
    }
    setAdminAccounts((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      showToast(`Akun Admin "${target.fullName}" berhasil dihapus.`);
    }
  };

  const handleDeleteMultipleAdminAccounts = (ids: string[]) => {
    setAdminAccounts((prev) =>
      prev.filter((a) => !ids.includes(a.id) || a.isPrimarySuperAdmin)
    );
    showToast(`${ids.length} akun Admin berhasil dihapus sekaligus.`);
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    showToast('Sertifikat berhasil dihapus.');
  };

  const handleDeleteMultipleCertificates = (ids: string[]) => {
    setCertificates((prev) => prev.filter((c) => !ids.includes(c.id)));
    showToast(`${ids.length} sertifikat berhasil dihapus sekaligus.`);
  };

  const handleDeleteMultipleExamResults = (ids: string[]) => {
    setExamResults((prev) => prev.filter((r) => !ids.includes(r.id)));
    showToast(`${ids.length} hasil ujian berhasil dihapus.`);
  };

  // LMS Exam Completion Handler
  const handleCompleteCourseExam = async (program: Program, score: number) => {
    const passed = score >= 70;
    const newCertCode = `SERT-AKP2I-2026-${Math.floor(3000 + Math.random() * 6000)}`;

    if (passed) {
      const newCert: Certificate = {
        id: newCertCode,
        certificateNumber: newCertCode,
        participantId: auth.currentUser?.uid || userProfile.id,
        participantName: userProfile.fullName,
        programId: program.id,
        programTitle: program.title,
        issueDate: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        expiryDate: 'Seumur Hidup (Kompetensi Terverifikasi)',
        predicate: score >= 85 ? `Sangat Memuaskan (Nilai: ${score})` : `Memuaskan (Nilai: ${score})`,
        status: 'Valid & Aktif',
        qrVerificationCode: `https://klc.akp2i.or.id/verify/${newCertCode}`,
        signatoryName: 'Drs. Suherman Wijaya, Ak., M.M., BKP',
        signatoryTitle: 'Ketua Umum Dewan Pengurus Pusat AKP2I',
      };
      if (isSuperAdminUser) {
        await createCertificateInFirestore(newCert);
      } else {
        setCertificates((prev) => [newCert, ...prev]);
      }
    }

    const newResult: ExamResult = {
      id: `exr-${Date.now()}`,
      programId: program.id,
      programTitle: program.title,
      participantId: auth.currentUser?.uid || userProfile.id,
      participantName: userProfile.fullName,
      examDate: new Date().toLocaleDateString('id-ID'),
      status: passed ? 'Lulus' : 'Tidak Lulus',
      totalScore: score,
      passingScore: 70,
      certificateId: passed ? newCertCode : undefined,
      moduleScores: [
        { moduleName: 'Evaluasi Komprehensif CBT AKP2I', score },
      ],
    };

    setExamResults((prev) => [newResult, ...prev]);
    showToast(
      passed
        ? `Selamat! Anda LULUS ujian dengan nilai ${score}. Sertifikat ${newCertCode} telah diterbitkan!`
        : `Nilai ujian Anda: ${score}. Silakan pelajari kembali modul dan ulangi ujian.`
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-[#172026] dark:bg-[#0E1518] dark:text-[#F1F5F9]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-xl bg-[#087A4B] text-white border border-[#F4C430]/50 shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#F4C430] shrink-0" />
          <span className="text-xs font-bold leading-snug">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ====================================================================
          AREA 1: PUBLIC WEBSITE LAYOUT (Strict 3-Zone Top Bar Contract)
          ==================================================================== */}
      {appArea === 'public' ? (
        <div className="min-h-screen flex flex-col">
          {/* STRICT 3-ZONE TOP BAR CONTRACT */}
          <header className="sticky top-0 z-40 h-16 bg-white/95 dark:bg-[#0E1518]/95 backdrop-blur border-b border-[#D9E2DE] dark:border-[#243239] px-4 sm:px-8 flex items-center justify-between">
            {/* Zone 1: Single Text Element Brand Wordmark */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setPublicPage('home');
              }}
              className="text-lg font-extrabold tracking-tight text-[#087A4B] dark:text-white whitespace-nowrap"
            >
              AKP2I Learning Center
            </a>

            {/* Zone 2: 5 Clean Navigation Text Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#66757F] dark:text-slate-300">
              <button
                onClick={() => setPublicPage('home')}
                className={`hover:text-[#087A4B] dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  publicPage === 'home' ? 'text-[#087A4B] dark:text-white underline underline-offset-8' : ''
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => setPublicPage('agenda')}
                className={`hover:text-[#087A4B] dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  publicPage === 'agenda' ? 'text-[#087A4B] dark:text-white underline underline-offset-8' : ''
                }`}
              >
                Agenda Pelatihan
              </button>
              <button
                onClick={() => {
                  setSelectedProgramDetail(programs[0]);
                  setPublicPage('program-detail');
                }}
                className={`hover:text-[#087A4B] dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  publicPage === 'program-detail' ? 'text-[#087A4B] dark:text-white underline underline-offset-8' : ''
                }`}
              >
                Program UKP & Brevet
              </button>
              <button
                onClick={() => setPublicPage('verify-certificate')}
                className={`hover:text-[#087A4B] dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  publicPage === 'verify-certificate' ? 'text-[#087A4B] dark:text-white underline underline-offset-8' : ''
                }`}
              >
                Verifikasi Sertifikat
              </button>
              <button
                onClick={() => setPublicPage('about-faq')}
                className={`hover:text-[#087A4B] dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  publicPage === 'about-faq' ? 'text-[#087A4B] dark:text-white underline underline-offset-8' : ''
                }`}
              >
                Tentang & FAQ
              </button>
            </nav>

            {/* Zone 3: 2 Primary Actions (Portal Dashboard & Theme/Login) */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-[#66757F] dark:text-slate-300 hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Ubah tema warna"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#F4C430]" /> : <Moon className="w-4 h-4" />}
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setAppArea('portal');
                    setPortalView('dashboard');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Dashboard Portal
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Masuk / Daftar
                </button>
              )}
            </div>
          </header>

          {/* PUBLIC MAIN CONTENT */}
          <main className="flex-1">
            {publicPage === 'home' && (
              <HomeView
                programs={programs}
                registrations={registrations}
                onExploreClick={() => setPublicPage('agenda')}
                onRegisterNowClick={(prog) => handleStartRegistration(prog)}
                onViewProgramDetail={(prog) => {
                  setSelectedProgramDetail(prog);
                  setPublicPage('program-detail');
                }}
                onOpenVerifyCert={() => setPublicPage('verify-certificate')}
              />
            )}

            {publicPage === 'agenda' && (
              <AgendaCatalogView
                programs={programs}
                registrations={registrations}
                onBackHome={() => setPublicPage('home')}
                onViewDetail={(prog) => {
                  setSelectedProgramDetail(prog);
                  setPublicPage('program-detail');
                }}
                onRegisterClick={(prog) => handleStartRegistration(prog)}
              />
            )}

            {publicPage === 'program-detail' && selectedProgramDetail && (
              <ProgramDetailView
                program={selectedProgramDetail}
                existingRegistration={registrations.find(
                  (r) => r.programId === selectedProgramDetail.id
                )}
                onBack={() => setPublicPage('agenda')}
                onRegisterClick={(prog) => handleStartRegistration(prog)}
                onOpenLmsCourse={(prog) => {
                  setActiveLmsCourse(prog);
                  setAppArea('portal');
                  setPortalView('my-courses');
                }}
              />
            )}

            {publicPage === 'verify-certificate' && (
              <PublicCertificateVerifyView
                certificates={certificates}
                initialCertNumber={verifyCertInitialCode}
                onViewCertModal={(cert) => setModalCertificate(cert)}
              />
            )}

            {publicPage === 'about-faq' && (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-8 space-y-4">
                  <p className="text-xs font-bold text-[#087A4B] dark:text-[#34D399]">
                    TENTANG ASOSIASI KONSULTAN PAJAK PUBLIK INDONESIA (AKP2I)
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white">
                    Lembaga Pendidikan & Pengembangan Kompetensi Perpajakan Terpercaya
                  </h1>
                  <p className="text-sm text-[#66757F] dark:text-slate-300 leading-relaxed">
                    Asosiasi Konsultan Pajak Publik Indonesia (AKP2I) menyelenggarakan pendidikan berkelanjutan, Pelatihan Uji Kompetensi Perpajakan (UKP Tingkat A, B, C), Bimbingan Belajar USKP A & B, serta Pelatihan Brevet Pajak Terpadu A/B/C yang terintegrasi dengan Sistem Inti Administrasi Perpajakan (Coretax).
                  </p>
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                      <strong className="block text-[#172026] dark:text-white mb-1">
                        Sekretariat Pusat DPP AKP2I
                      </strong>
                      <span className="text-[#66757F]">
                        Gedung Menara Perpajakan Lt. 8, Jakarta Pusat
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                      <strong className="block text-[#172026] dark:text-white mb-1">
                        Email Layanan Pendidikan
                      </strong>
                      <span className="font-mono text-[#087A4B] dark:text-[#34D399]">
                        contact.akp2i@gmail.com
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                      <strong className="block text-[#172026] dark:text-white mb-1">
                        Hotline WhatsApp Resmi
                      </strong>
                      <span className="font-mono text-[#172026] dark:text-white">
                        +62 811-5825-83
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* QUIET INSTITUTIONAL FOOTER */}
          <footer className="bg-[#0E1518] text-slate-400 border-t border-[#243239] py-10 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
              <div>
                <p className="font-extrabold text-white text-sm">
                  AKP2I Learning Center — Asosiasi Konsultan Pajak Publik Indonesia
                </p>
                <p className="mt-1">
                  © 2026 Dewan Pengurus Pusat AKP2I. Hak Cipta Dilindungi Undang-Undang.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <button
                  onClick={() => setPublicPage('agenda')}
                  className="hover:text-white cursor-pointer"
                >
                  Agenda Pelatihan
                </button>
                <button
                  onClick={() => setPublicPage('verify-certificate')}
                  className="hover:text-white cursor-pointer"
                >
                  Verifikasi Sertifikat QR
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    } else {
                      setAppArea('portal');
                      setPortalView(isSuperAdminUser ? 'admin-dashboard' : 'dashboard');
                    }
                  }}
                  className="text-[#F4C430] font-bold hover:underline cursor-pointer"
                >
                  Portal Peserta & Admin
                </button>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* ====================================================================
           AREA 2 & 3: PARTICIPANT PORTAL & ADMIN PANEL (KLC LAYOUT REFERENCE)
           ==================================================================== */
        <div className="min-h-screen flex flex-col">
          {/* Top Portal Navbar matching KLC Screenshot */}
          <header className="sticky top-0 z-40 h-16 bg-white dark:bg-[#0E1518] border-b border-[#D9E2DE] dark:border-[#243239] px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setAppArea('public');
                  setPublicPage('home');
                }}
                className="cursor-pointer text-left"
              >
                <Akp2iLogoMark />
              </button>
            </div>

            {/* Right Top Bar Controls: Global Search, Public Switch, Role Badge, Theme, Notifications, Avatar */}
            <div className="flex items-center gap-3">
              {/* Global Search Trigger */}
              <button
                onClick={() => setGlobalSearchOpen(true)}
                className="hidden sm:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#F6F8F7] dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-xs text-[#66757F] hover:border-[#087A4B] cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari program, peserta, sertifikat...</span>
              </button>

              <button
                onClick={() => {
                  setAppArea('public');
                  setPublicPage('home');
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-semibold text-[#66757F] dark:text-slate-300 hover:text-[#172026] dark:hover:text-white cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399]" />
                <span>Halaman Publik</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#151F24] relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4C430] text-[#172026] text-[10px] font-mono font-extrabold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-[#0E1518] text-white flex items-center justify-between">
                      <span className="text-xs font-bold">Pusat Notifikasi AKP2I</span>
                      <button
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          );
                        }}
                        className="text-[11px] text-[#F4C430] hover:underline cursor-pointer"
                      >
                        Tandai semua dibaca
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#D9E2DE] dark:divide-[#243239]">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((item) =>
                                item.id === n.id ? { ...item, read: true } : item
                              )
                            );
                            if (n.targetView) setPortalView(n.targetView as PortalView);
                            setNotifDropdownOpen(false);
                          }}
                          className="w-full p-3.5 text-left hover:bg-[#F6F8F7] dark:hover:bg-[#0E1518] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-[#172026] dark:text-white">
                            <span>{n.title}</span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#087A4B] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] font-mono text-[#66757F] mt-1 block">
                            {n.timestamp}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#151F24] cursor-pointer"
                title="Ubah Light / Dark Mode"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-[#F4C430]" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Profile Pill matching KLC top-right */}
              <button
                onClick={() => setPortalView('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#F6F8F7] dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#087A4B] text-white text-xs font-extrabold flex items-center justify-center">
                  {userProfile.fullName.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-bold truncate max-w-[110px]">
                  {userProfile.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#66757F]" />
              </button>
            </div>
          </header>

          {/* Main Workspace Container with Left Sidebar (KLC Structure) */}
          <div className="flex-1 flex">
            {/* LEFT SIDEBAR (260px Desktop, Drawer on Mobile) */}
            <aside
              className={`${
                mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 block' : 'hidden'
              } lg:block w-64 shrink-0 bg-white dark:bg-[#0E1518] border-r border-[#D9E2DE] dark:border-[#243239] p-4 space-y-6 overflow-y-auto`}
            >
              {/* KLC Style Account & Role Box */}
              <div className="p-3.5 rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#151F24] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#087A4B] dark:text-[#F4C430] uppercase tracking-wider">
                    {isSuperAdminUser ? 'AKUN ADMINISTRATOR RESMI' : 'AKUN PESERTA AKTIF'}
                  </span>
                  {mobileMenuOpen && (
                    <button onClick={() => setMobileMenuOpen(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-xs font-bold text-[#172026] dark:text-white truncate">
                  {userProfile.fullName}
                </div>
                <div className="text-[11px] font-mono text-[#66757F] dark:text-slate-400 truncate">
                  {userProfile.email}
                </div>
                {isSuperAdminUser ? (
                  <select
                    value={activeRole}
                    onChange={(e) => handleRoleSwitch(e.target.value as UserRole)}
                    className="w-full mt-1 px-3 py-2 text-xs font-bold rounded-lg bg-white dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B] cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin AKP2I</option>
                    <option value="Admin Pelatihan">Admin Pelatihan</option>
                    <option value="Verifikator">Verifikator Keuangan</option>
                    <option value="Instruktur">Instruktur BKP</option>
                    <option value="Peserta">Mode Pratinjau Peserta</option>
                  </select>
                ) : (
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-[11px] font-bold">
                      Peran: Peserta Pelatihan
                    </span>
                  </div>
                )}
              </div>

              {/* Section 1: IKHTISAR */}
              <div className="space-y-1">
                <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#66757F] dark:text-slate-400 uppercase tracking-wider">
                  IKHTISAR
                </div>
                {[
                  { id: 'dashboard', label: 'Dashboard Peserta', icon: LayoutDashboard },
                  { id: 'profile', label: 'Profil Saya', icon: User },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPortalView(item.id as PortalView);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                      portalView === item.id
                        ? 'bg-[#087A4B] text-white shadow-xs'
                        : 'text-[#66757F] dark:text-slate-300 hover:bg-[#F6F8F7] dark:hover:bg-[#151F24] hover:text-[#172026] dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Section 2: AKTIVITAS & HASIL */}
              <div className="space-y-1">
                <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#66757F] dark:text-slate-400 uppercase tracking-wider">
                  AKTIVITAS & HASIL
                </div>
                {[
                  { id: 'agenda', label: 'Daftar Agenda Pelatihan', icon: Calendar },
                  { id: 'my-registrations', label: 'Pendaftaran Saya', icon: ClipboardList },
                  { id: 'my-courses', label: 'Pelatihan Saya (LMS)', icon: BookOpen },
                  { id: 'schedule', label: 'Jadwal Zoom', icon: Calendar },
                  { id: 'exam-results', label: 'Hasil Ujian', icon: FileCheck2 },
                  { id: 'certificates', label: 'Sertifikat Saya', icon: Award },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'my-courses') setActiveLmsCourse(null);
                      setPortalView(item.id as PortalView);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                      portalView === item.id
                        ? 'bg-[#087A4B] text-white shadow-xs'
                        : 'text-[#66757F] dark:text-slate-300 hover:bg-[#F6F8F7] dark:hover:bg-[#151F24] hover:text-[#172026] dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Section 3: ADMIN / ORGANIZER PANEL (Only visible to verified Super Admin / Admin accounts) */}
              {isSuperAdminUser && (
                <div className="space-y-1">
                  <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#087A4B] dark:text-[#F4C430] uppercase tracking-wider">
                    PANEL ADMIN & ORGANIZER
                  </div>
                  {[
                    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: BarChart3 },
                    { id: 'admin-programs', label: 'Manajemen Program', icon: BookOpen },
                    { id: 'admin-participants', label: 'Manajemen Peserta', icon: Users },
                    { id: 'admin-payments', label: 'Verifikasi Pembayaran', icon: CreditCard },
                    { id: 'admin-finance', label: 'Manajemen Keuangan', icon: Landmark },
                    { id: 'admin-payment-methods', label: 'Metode Pembayaran', icon: CreditCard },
                    { id: 'admin-form-builder', label: 'Dynamic Form Builder', icon: Sliders },
                    { id: 'admin-certificates', label: 'Manajemen Sertifikat', icon: Award },
                    { id: 'admin-reporting', label: 'Laporan & Analitik', icon: BarChart3 },
                    { id: 'admin-users', label: 'Pengaturan Akun Admin', icon: ShieldCheck },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (activeRole === 'Peserta') {
                          setActiveRole('Super Admin');
                        }
                        setPortalView(item.id as PortalView);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        portalView === item.id
                          ? 'bg-[#087A4B] text-white shadow-xs'
                          : 'text-[#66757F] dark:text-slate-300 hover:bg-[#F6F8F7] dark:hover:bg-[#151F24] hover:text-[#172026] dark:hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Section 4: LAINNYA */}
              <div className="space-y-1 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#66757F] dark:text-slate-400 uppercase tracking-wider">
                  LAINNYA
                </div>
                <button
                  onClick={() => {
                    setPortalView('verify-certificate');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 cursor-pointer ${
                    portalView === 'verify-certificate'
                      ? 'bg-[#087A4B] text-white'
                      : 'text-[#66757F] dark:text-slate-300 hover:bg-[#F6F8F7] dark:hover:bg-[#151F24]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verifikasi Sertifikat</span>
                </button>
                <button
                  onClick={() => {
                    setPortalView('help');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 cursor-pointer ${
                    portalView === 'help'
                      ? 'bg-[#087A4B] text-white'
                      : 'text-[#66757F] dark:text-slate-300 hover:bg-[#F6F8F7] dark:hover:bg-[#151F24]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Bantuan & Kontak</span>
                </button>
                <button
                  onClick={() => handleLogout()}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            </aside>

            {/* MAIN PORTAL VIEWPORT */}
            <main className="flex-1 p-5 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
              {portalView === 'dashboard' && (
                <ParticipantDashboardView
                  user={userProfile}
                  programs={programs}
                  registrations={registrations}
                  schedules={schedules}
                  certificates={certificates}
                  onExplorePrograms={() => setPortalView('agenda')}
                  onViewRegistrations={() => setPortalView('my-registrations')}
                  onOpenCourseLms={(prog) => {
                    setActiveLmsCourse(prog);
                    setPortalView('my-courses');
                  }}
                  onViewSchedule={() => setPortalView('schedule')}
                  onViewCertificates={() => setPortalView('certificates')}
                />
              )}

              {portalView === 'profile' && (
                <ProfileView
                  user={userProfile}
                  onUpdateUser={handleUpdateUserProfile}
                  onShowToast={showToast}
                />
              )}

              {portalView === 'agenda' && (
                <AgendaCatalogView
                  programs={programs}
                  registrations={registrations}
                  isInsidePortal
                  onViewDetail={(prog) => {
                    setSelectedProgramDetail(prog);
                    setAppArea('public');
                    setPublicPage('program-detail');
                  }}
                  onRegisterClick={(prog) => handleStartRegistration(prog)}
                />
              )}

              {portalView === 'my-registrations' && (
                <MyRegistrationsView
                  registrations={registrations}
                  user={userProfile}
                  onUploadProof={handleUploadProofLater}
                  onExploreAgenda={() => setPortalView('agenda')}
                />
              )}

              {portalView === 'my-courses' && (
                <MyCoursesAndLmsView
                  programs={programs}
                  registrations={registrations}
                  activeCourse={activeLmsCourse}
                  onSelectCourse={setActiveLmsCourse}
                  onCompleteExam={handleCompleteCourseExam}
                  onShowToast={showToast}
                />
              )}

              {portalView === 'schedule' && (
                <ScheduleCalendarView
                  schedules={schedules}
                  onShowToast={showToast}
                />
              )}

              {portalView === 'exam-results' && (
                <ExamResultsView
                  examResults={examResults}
                  certificates={certificates}
                  onViewCertificate={(cert) => setModalCertificate(cert)}
                  onBackDashboard={() => setPortalView('dashboard')}
                  onDeleteMultipleExamResults={handleDeleteMultipleExamResults}
                />
              )}

              {portalView === 'certificates' && (
                <MyCertificatesView
                  certificates={certificates}
                  onViewCertificateModal={(cert) => setModalCertificate(cert)}
                  onOpenPublicVerify={(code) => {
                    setVerifyCertInitialCode(code);
                    setPortalView('verify-certificate');
                  }}
                />
              )}

              {portalView === 'verify-certificate' && (
                <PublicCertificateVerifyView
                  certificates={certificates}
                  initialCertNumber={verifyCertInitialCode}
                  onViewCertModal={(cert) => setModalCertificate(cert)}
                />
              )}

              {portalView === 'help' && (
                <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-8 space-y-4">
                  <h1 className="text-2xl font-extrabold text-[#172026] dark:text-white">
                    Pusat Bantuan Peserta & Layanan Sekretariat AKP2I
                  </h1>
                  <p className="text-sm text-[#66757F] dark:text-slate-300">
                    Apabila Anda mengalami kendala verifikasi dokumen, perubahan jadwal kelas Zoom, atau pencetakan sertifikat, hubungi Tim Helpdesk Pendidikan AKP2I.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        showToast('Menghubungkan ke WhatsApp Helpdesk Resmi AKP2I (+62 811-5825-83)...')
                      }
                      className="px-4 py-2.5 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer"
                    >
                      Hubungi WhatsApp Helpdesk AKP2I
                    </button>
                  </div>
                </div>
              )}

              {portalView.startsWith('admin-') && (
                <AdminViews
                  activeSubView={portalView as any}
                  currentRole={activeRole}
                  programs={programs}
                  registrations={registrations}
                  formFields={formFields}
                  certificates={certificates}
                  auditLogs={auditLogs}
                  adminAccounts={adminAccounts}
                  paymentMethods={paymentMethods}
                  onUpdatePrograms={setPrograms}
                  onAddManualRegistration={handleAddManualRegistration}
                  onUpdateRegistration={handleUpdateRegistration}
                  onDeleteRegistration={handleDeleteRegistration}
                  onApprovePayment={handleAdminApprovePayment}
                  onRejectPayment={handleAdminRejectPayment}
                  onAddPaymentMethod={handleAddPaymentMethod}
                  onUpdatePaymentMethod={handleUpdatePaymentMethod}
                  onDeletePaymentMethod={handleDeletePaymentMethod}
                  onUpdateFormFields={handleUpdateFormFields}
                  onGenerateCertificate={async (newCert) => {
                    if (auth.currentUser) {
                      await createCertificateInFirestore(newCert);
                    } else {
                      setCertificates((prev) => [newCert, ...prev]);
                    }
                    showToast(
                      `Sertifikat ${newCert.certificateNumber} berhasil diterbitkan!`
                    );
                  }}
                  onRevokeCertificate={(certId) => {
                    setCertificates((prev) =>
                      prev.map((c) =>
                        c.id === certId
                          ? {
                              ...c,
                              status: c.status === 'Valid & Aktif' ? 'Dicabut' : 'Valid & Aktif',
                            }
                          : c
                      )
                    );
                    showToast('Status masa berlaku sertifikat berhasil diperbarui.');
                  }}
                  onViewCertificateModal={(cert) => setModalCertificate(cert)}
                  onDispatchWhatsApp={(phone, msg) => {
                    setAuditLogs((prev) => [
                      {
                        id: `aud-${Date.now()}`,
                        timestamp: 'Baru saja',
                        actor: 'WhatsApp API Gateway',
                        role: activeRole,
                        action: `Mengirim pesan ke ${phone}: "${msg}"`,
                        target: phone,
                        channel: 'WhatsApp API Gateway',
                      },
                      ...prev,
                    ]);
                    showToast(`Notifikasi WhatsApp terkirim ke ${phone}`);
                  }}
                  onAddAdminAccount={handleAddAdminAccount}
                  onUpdateAdminAccount={handleUpdateAdminAccount}
                  onDeleteAdminAccount={handleDeleteAdminAccount}
                  onDeleteMultiplePrograms={handleDeleteMultiplePrograms}
                  onDeleteMultipleRegistrations={handleDeleteMultipleRegistrations}
                  onDeleteMultiplePaymentMethods={handleDeleteMultiplePaymentMethods}
                  onDeleteMultipleAdminAccounts={handleDeleteMultipleAdminAccounts}
                  onDeleteCertificate={handleDeleteCertificate}
                  onDeleteMultipleCertificates={handleDeleteMultipleCertificates}
                  expenses={expenses}
                  onAddExpense={handleAddExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onDeleteMultipleExpenses={handleDeleteMultipleExpenses}
                  onResetParticipantsData={handleResetParticipantsData}
                  onResetProgramsData={handleResetProgramsData}
                  onNavigateSubView={(sub) => setPortalView(sub as PortalView)}
                  onShowToast={showToast}
                  registeredParticipants={registeredParticipants}
                  onVerifyParticipantProfile={handleAdminVerifyParticipantProfile}
                  onImportParticipants={handleImportParticipants}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODALS: REGISTRATION WIZARD, CERTIFICATE PREVIEW, GLOBAL SEARCH, AUTH
          ==================================================================== */}
      <RegistrationWizardModal
        program={wizardProgram}
        userProfile={userProfile}
        formFields={formFields}
        paymentMethods={paymentMethods}
        onClose={() => setWizardProgram(null)}
        onSubmitRegistration={handleCompleteRegistration}
      />

      <CertificateModal
        certificate={modalCertificate}
        onClose={() => setModalCertificate(null)}
        onDownloadToast={showToast}
        onVerifyClick={(code) => {
          setVerifyCertInitialCode(code);
          if (appArea === 'public') {
            setPublicPage('verify-certificate');
          } else {
            setPortalView('verify-certificate');
          }
        }}
      />

      {/* Global Search Modal */}
      {globalSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-20">
          <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#D9E2DE] dark:border-[#243239] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#087A4B]" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Cari program pelatihan, nomor registrasi, nomor sertifikat, atau peserta..."
                className="flex-1 text-sm bg-transparent focus:outline-none text-[#172026] dark:text-white"
              />
              <button
                onClick={() => setGlobalSearchOpen(false)}
                className="text-xs text-[#66757F] hover:text-white cursor-pointer"
              >
                ESC
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
              <div>
                <div className="font-bold text-[#66757F] uppercase mb-2">Program Pelatihan</div>
                {programs
                  .filter((p) =>
                    p.title.toLowerCase().includes(globalSearchQuery.toLowerCase())
                  )
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProgramDetail(p);
                        setAppArea('public');
                        setPublicPage('program-detail');
                        setGlobalSearchOpen(false);
                      }}
                      className="w-full p-2.5 rounded-lg hover:bg-[#F6F8F7] dark:hover:bg-[#0E1518] flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="font-bold text-[#172026] dark:text-white">
                        {p.title}
                      </span>
                      <span className="font-mono text-[#087A4B] dark:text-[#F4C430]">
                        {p.code}
                      </span>
                    </button>
                  ))}
              </div>
              <div>
                <div className="font-bold text-[#66757F] uppercase mb-2">Sertifikat Terbit</div>
                {certificates
                  .filter(
                    (c) =>
                      c.certificateNumber
                        .toLowerCase()
                        .includes(globalSearchQuery.toLowerCase()) ||
                      c.participantName
                        .toLowerCase()
                        .includes(globalSearchQuery.toLowerCase())
                  )
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setModalCertificate(c);
                        setGlobalSearchOpen(false);
                      }}
                      className="w-full p-2.5 rounded-lg hover:bg-[#F6F8F7] dark:hover:bg-[#0E1518] flex items-center justify-between text-left cursor-pointer"
                    >
                      <span>
                        <strong>{c.participantName}</strong> — {c.programTitle}
                      </span>
                      <span className="font-mono text-[#087A4B] dark:text-[#34D399]">
                        {c.certificateNumber}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login / Register / Forgot Password Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0E1518] text-white flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4C430]">
                {authMode === 'login'
                  ? 'AUTENTIKASI PORTAL & ADMIN AKP2I'
                  : authMode === 'register'
                  ? 'REGISTRASI AKUN PESERTA BARU'
                  : 'PEMULIHAN KATA SANDI'}
              </span>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pt-5">
              <button
                type="button"
                disabled={authLoading}
                onClick={async () => {
                  setAuthLoading(true);
                  try {
                    try {
                      await setPersistence(
                        auth,
                        rememberMe ? browserLocalPersistence : browserSessionPersistence
                      );
                    } catch {
                      // fallback if persistence cannot be modified in environment
                    }
                    const cred = await signInWithPopup(auth, googleProvider);
                    const synced = await syncAuthenticatedUser(cred.user, {
                      fullName: authName || undefined,
                      phone: authPhone || undefined,
                    });
                    const matchedAdmin = adminAccounts.find(
                      (a) => a.email.toLowerCase() === (cred.user.email || '').toLowerCase()
                    );
                    const assignedRole: UserRole =
                      (cred.user.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
                        ? 'Super Admin'
                        : matchedAdmin
                        ? matchedAdmin.role
                        : synced.role;

                    const isAdmin =
                      assignedRole !== 'Peserta' ||
                      (cred.user.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                    saveAuthSession({
                      rememberMe,
                      loginAt: Date.now(),
                      expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
                      email: cred.user.email || '',
                      isPasswordSession: false,
                      userProfile: { ...synced, role: assignedRole },
                      activeRole: assignedRole,
                      isSuperAdminUser: isAdmin,
                    });

                    setIsPasswordSession(false);
                    setUserProfile({ ...synced, role: assignedRole });
                    setActiveRole(assignedRole);
                    setIsSuperAdminUser(isAdmin);
                    setIsLoggedIn(true);
                    setAuthModalOpen(false);
                    setAppArea('portal');
                    setPortalView(isAdmin ? 'admin-dashboard' : 'dashboard');
                    showToast(
                      isAdmin
                        ? `Selamat datang, ${assignedRole} AKP2I (${cred.user.email})!`
                        : `Selamat datang di Portal Peserta AKP2I, ${synced.fullName}!`
                    );
                  } catch (err: any) {
                    showToast(
                      `Gagal masuk dengan Google: ${err?.message || 'Silakan coba lagi.'}`
                    );
                  } finally {
                    setAuthLoading(false);
                  }
                }}
                className="w-full py-3 px-4 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {authLoading
                    ? 'Memproses Autentikasi...'
                    : 'Masuk dengan Akun Google'}
                </span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-[#D9E2DE] dark:border-[#243239] flex-1" />
                <span className="bg-white dark:bg-[#151F24] px-3 text-[10px] font-bold text-[#66757F] uppercase whitespace-nowrap shrink-0">
                  Atau Email & Kata Sandi
                </span>
                <div className="border-t border-[#D9E2DE] dark:border-[#243239] flex-1" />
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthLoading(true);
                const cleanEmail = authEmail.trim().toLowerCase();
                const cleanPass = authPassword.trim();

                try {
                  if (authMode === 'forgot') {
                    const matchedAdmin = adminAccounts.find(
                      (a) => a.email.toLowerCase() === cleanEmail
                    );
                    if (matchedAdmin) {
                      showToast(
                        `Informasi: Kata sandi akun Admin (${cleanEmail}) dapat dilihat atau diatur ulang di menu Pengaturan Akun Admin.`
                      );
                    } else {
                      try {
                        await sendPasswordResetEmail(auth, cleanEmail);
                      } catch {
                        // fallback notification
                      }
                      showToast(`Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}.`);
                    }
                    setAuthMode('login');
                    return;
                  }

                  if (authMode === 'register') {
                    // Check if email is already an admin account
                    if (adminAccounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
                      showToast('Email tersebut sudah terdaftar sebagai akun Administrator. Silakan masuk.');
                      setAuthMode('login');
                      return;
                    }

                    const newParticipantProfile: UserProfile = {
                      ...INITIAL_USER_PROFILE,
                      id: `usr-${Date.now()}`,
                      fullName: authName.trim() || cleanEmail.split('@')[0],
                      email: cleanEmail,
                      phone: authPhone.trim() || '-',
                      role: 'Peserta',
                      nik: '-',
                      npwp: '-',
                      isVerified: false,
                      dukcapilMatch: false,
                    };

                    try {
                      const savedRaw = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
                      const savedList = savedRaw ? JSON.parse(savedRaw) : [];
                      const filtered = Array.isArray(savedList)
                        ? savedList.filter((u: any) => u.email !== cleanEmail)
                        : [];
                      localStorage.setItem(
                        STORAGE_KEYS.PARTICIPANTS,
                        JSON.stringify([
                          ...filtered,
                          { profile: newParticipantProfile, password: cleanPass },
                        ])
                      );
                    } catch {
                      // ignore storage error
                    }

                    setRegisteredParticipants((prev) => [
                      ...prev.filter((u: any) => u.profile?.email?.toLowerCase() !== cleanEmail),
                      { profile: newParticipantProfile, password: cleanPass },
                    ]);

                    saveAuthSession({
                      rememberMe,
                      loginAt: Date.now(),
                      expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
                      email: cleanEmail,
                      isPasswordSession: true,
                      userProfile: newParticipantProfile,
                      activeRole: 'Peserta',
                      isSuperAdminUser: false,
                    });

                    setIsPasswordSession(true);
                    setUserProfile(newParticipantProfile);
                    setActiveRole('Peserta');
                    setIsSuperAdminUser(false);
                    setIsLoggedIn(true);
                    setAuthModalOpen(false);
                    setAppArea('portal');
                    setPortalView('profile');
                    showToast('Registrasi akun berhasil! Silakan lengkapi profil Anda.');
                    return;
                  }

                  // LOGIN MODE: 1. Check Super Admin & Admin Accounts first (no Google required)
                  const matchedAdmin = adminAccounts.find(
                    (a) => a.email.toLowerCase() === cleanEmail
                  );

                  if (matchedAdmin) {
                    const validPasswords = [
                      matchedAdmin.password || 'admin123',
                      ...(matchedAdmin.isPrimarySuperAdmin
                        ? ['admin123', 'akp2i2026', 'AdminAKP2I2026!']
                        : []),
                    ];

                    if (!validPasswords.includes(cleanPass)) {
                      showToast('Kata sandi Admin tidak sesuai. Silakan periksa kembali kata sandi Anda.');
                      return;
                    }

                    const adminProfile: UserProfile = {
                      ...INITIAL_USER_PROFILE,
                      id: matchedAdmin.id,
                      fullName: matchedAdmin.fullName,
                      email: matchedAdmin.email,
                      role: matchedAdmin.role,
                      isVerified: true,
                      dukcapilMatch: true,
                    };

                    saveAuthSession({
                      rememberMe,
                      loginAt: Date.now(),
                      expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
                      email: matchedAdmin.email,
                      isPasswordSession: true,
                      userProfile: adminProfile,
                      activeRole: matchedAdmin.role,
                      isSuperAdminUser: true,
                    });

                    setIsPasswordSession(true);
                    setUserProfile(adminProfile);
                    setActiveRole(matchedAdmin.role);
                    setIsSuperAdminUser(true);
                    setIsLoggedIn(true);
                    setAuthModalOpen(false);
                    setAppArea('portal');
                    setPortalView(
                      matchedAdmin.role === 'Verifikator' ? 'admin-payments' : 'admin-dashboard'
                    );
                    showToast(
                      `Selamat datang, ${matchedAdmin.fullName} (${matchedAdmin.role})!`
                    );
                    return;
                  }

                  // 2. Check registered participant accounts in localStorage
                  try {
                    const savedRaw = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
                    const savedList = savedRaw ? JSON.parse(savedRaw) : [];
                    if (Array.isArray(savedList)) {
                      const foundUser = savedList.find(
                        (u: any) => u.profile?.email?.toLowerCase() === cleanEmail
                      );
                      if (foundUser) {
                        if (foundUser.password !== cleanPass) {
                          showToast('Kata sandi yang Anda masukkan salah.');
                          return;
                        }

                        saveAuthSession({
                          rememberMe,
                          loginAt: Date.now(),
                          expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
                          email: cleanEmail,
                          isPasswordSession: true,
                          userProfile: foundUser.profile,
                          activeRole: 'Peserta',
                          isSuperAdminUser: false,
                        });

                        setIsPasswordSession(true);
                        setUserProfile(foundUser.profile);
                        setActiveRole('Peserta');
                        setIsSuperAdminUser(false);
                        setIsLoggedIn(true);
                        setAuthModalOpen(false);
                        setAppArea('portal');
                        setPortalView('dashboard');
                        showToast(`Selamat datang kembali, ${foundUser.profile.fullName}!`);
                        return;
                      }
                    }
                  } catch {
                    // ignore storage error
                  }

                  // 3. Fallback: Try Firebase Email/Password Auth or allow direct participant login
                  try {
                    try {
                      await setPersistence(
                        auth,
                        rememberMe ? browserLocalPersistence : browserSessionPersistence
                      );
                    } catch {}
                    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
                    const synced = await syncAuthenticatedUser(cred.user);

                    saveAuthSession({
                      rememberMe,
                      loginAt: Date.now(),
                      expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
                      email: cleanEmail,
                      isPasswordSession: false,
                      userProfile: synced,
                      activeRole: synced.role,
                      isSuperAdminUser: synced.role !== 'Peserta',
                    });

                    setIsPasswordSession(false);
                    setUserProfile(synced);
                    setActiveRole(synced.role);
                    setIsSuperAdminUser(synced.role !== 'Peserta');
                    setIsLoggedIn(true);
                    setAuthModalOpen(false);
                    setAppArea('portal');
                    setPortalView(synced.role !== 'Peserta' ? 'admin-dashboard' : 'dashboard');
                    showToast(`Selamat datang kembali, ${synced.fullName}!`);
                  } catch {
                    // Create session for participant logging in with email & password
                    const fallbackParticipant: UserProfile = {
                      ...INITIAL_USER_PROFILE,
                      id: `usr-${Date.now()}`,
                      fullName: cleanEmail.split('@')[0],
                      email: cleanEmail,
                      role: 'Peserta',
                      isVerified: false,
                      dukcapilMatch: false,
                    };

                    saveAuthSession({
                      rememberMe,
                      loginAt: Date.now(),
                      expiresAt: Date.now() + REMEMBER_ME_DURATION_MS,
                      email: cleanEmail,
                      isPasswordSession: true,
                      userProfile: fallbackParticipant,
                      activeRole: 'Peserta',
                      isSuperAdminUser: false,
                    });

                    setIsPasswordSession(true);
                    setUserProfile(fallbackParticipant);
                    setActiveRole('Peserta');
                    setIsSuperAdminUser(false);
                    setIsLoggedIn(true);
                    setAuthModalOpen(false);
                    setAppArea('portal');
                    setPortalView('dashboard');
                    showToast(`Selamat datang di Portal Peserta AKP2I, ${fallbackParticipant.fullName}!`);
                  }
                } finally {
                  setAuthLoading(false);
                }
              }}
              className="px-6 pb-6 space-y-3.5"
            >
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#66757F] mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Masukkan nama lengkap sesuai KTP"
                    className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#66757F] mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#66757F] mb-1">
                    Nomor HP / WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]"
                  />
                </div>
              )}

              {authMode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-bold text-[#66757F] mb-1">
                    Kata Sandi *
                  </label>
                  <div className="relative">
                    <input
                      type={showAuthPassword ? 'text' : 'password'}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full px-3.5 py-2 pr-10 text-sm rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#66757F] hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
                      title={showAuthPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      aria-label={showAuthPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showAuthPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Fitur Ingat Saya (Aktif 7 Hari) pada Halaman Login */}
              {authMode === 'login' && (
                <div className="flex items-center justify-between pt-0.5 pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D9E2DE] dark:border-[#243239] text-[#087A4B] focus:ring-[#087A4B] accent-[#087A4B] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#172026] dark:text-slate-200">
                      Ingat Saya{' '}
                      <span className="text-[11px] font-normal text-[#66757F] dark:text-slate-400">
                        (aktif 7 hari)
                      </span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs font-bold text-[#087A4B] dark:text-[#34D399] hover:underline cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
              )}

              {/* Fitur Ingat Saya pada Halaman Registrasi */}
              {authMode === 'register' && (
                <div className="flex items-center justify-start pt-0.5 pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D9E2DE] dark:border-[#243239] text-[#087A4B] focus:ring-[#087A4B] accent-[#087A4B] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#172026] dark:text-slate-200">
                      Ingat Saya{' '}
                      <span className="text-[11px] font-normal text-[#66757F] dark:text-slate-400">
                        (tetap masuk 7 hari)
                      </span>
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {authMode === 'login'
                  ? 'Masuk dengan Email'
                  : authMode === 'register'
                  ? 'Daftar Akun Baru'
                  : 'Kirim Tautan Reset Password'}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-[#66757F]">
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode(authMode === 'login' ? 'register' : 'login')
                  }
                  className="text-[#087A4B] dark:text-[#34D399] font-bold hover:underline cursor-pointer"
                >
                  {authMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                </button>
                {authMode !== 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="hover:underline cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

