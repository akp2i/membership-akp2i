import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { UserProfile, UserRole, Registration, Certificate } from './types/akp2i';
import { ASSETS } from './data/mockDatabase';

export const SUPER_ADMIN_EMAIL = 'contact.akp2i@gmail.com';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Sanitize string helper to enforcefirebase-blueprint.json maxLength constraints
function clampStr(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const s = (val ?? fallback).trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function sanitizeId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  return cleaned || 'doc-1';
}

const activeSyncPromises = new Map<string, Promise<UserProfile>>();

export async function syncAuthenticatedUser(
  fbUser: FirebaseUser,
  extraInit?: { fullName?: string; phone?: string }
): Promise<UserProfile> {
  const uid = sanitizeId(fbUser.uid);
  const existingPromise = activeSyncPromises.get(uid);
  if (existingPromise) {
    return existingPromise;
  }

  const syncTask = (async (): Promise<UserProfile> => {
    const email = clampStr(fbUser.email, 150, 'user@akp2i.or.id');
    const isBootstrappedSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    const userPublicRef = doc(db, 'users', uid);
    const userPrivateRef = doc(db, 'users', uid, 'private', 'info');
    const adminRef = doc(db, 'admins', uid);

    let publicSnap;
    try {
      publicSnap = await getDoc(userPublicRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }

    let assignedRole: UserRole = isBootstrappedSuperAdmin ? 'Super Admin' : 'Peserta';
    let isVerified = isBootstrappedSuperAdmin ? true : false;
    let fullName = clampStr(
      extraInit?.fullName ||
        fbUser.displayName ||
        (isBootstrappedSuperAdmin ? 'Administrator Utama AKP2I' : email.split('@')[0]),
      120,
      'Pengguna AKP2I'
    );
    if (fullName.length < 2) {
      fullName = 'Pengguna AKP2I';
    }

    // Check if user is in /admins/{uid}
    if (!isBootstrappedSuperAdmin) {
      try {
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          const adminData = adminSnap.data();
          if (adminData?.role) {
            assignedRole = adminData.role as UserRole;
            isVerified = true;
          }
        }
      } catch {
        // Non-admin read ignore
      }
    }

    // Step 1: Ensure /users/{uid} exists first (required before creating /users/{uid}/private/info due to Master Gate)
    if (!publicSnap || !publicSnap.exists()) {
      try {
        await setDoc(userPublicRef, {
          uid,
          fullName,
          role: assignedRole,
          isVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${uid}`);
      }
    } else {
      const pubData = publicSnap.data();
      fullName = pubData.fullName || fullName;
      assignedRole = isBootstrappedSuperAdmin
        ? 'Super Admin'
        : (pubData.role as UserRole) || 'Peserta';
      isVerified = isBootstrappedSuperAdmin ? true : Boolean(pubData.isVerified);

      if (isBootstrappedSuperAdmin && (pubData.role !== 'Super Admin' || !pubData.isVerified)) {
        try {
          await setDoc(userPublicRef, {
            uid,
            fullName: fullName.length >= 2 ? clampStr(fullName, 120) : 'Administrator Utama AKP2I',
            role: 'Super Admin',
            isVerified: true,
            createdAt: pubData.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
        }
      }
    }

    // Step 2: Ensure /users/{uid}/private/info exists (now /users/{uid} is guaranteed to exist)
    let privData: Record<string, any> = {};
    try {
      const privSnap = await getDoc(userPrivateRef);
      if (!privSnap.exists()) {
        const initialPrivate = {
          uid,
          email,
          phone: clampStr(extraInit?.phone, 30, isBootstrappedSuperAdmin ? '08112026001' : '-'),
          nik: isBootstrappedSuperAdmin ? '3171010101850001' : '-',
          npwp: isBootstrappedSuperAdmin ? '3171010101850001' : '-',
          gender: 'Laki-laki',
          birthPlace: isBootstrappedSuperAdmin ? 'Jakarta' : '-',
          birthDate: isBootstrappedSuperAdmin ? '01 Jan 1985' : '-',
          address: isBootstrappedSuperAdmin
            ? 'Sekretariat Pusat DPP AKP2I, Gedung Perpajakan Lt. 8, Jakarta Pusat'
            : '-',
          province: 'DKI Jakarta',
          city: 'Jakarta Pusat',
          educationLevel: isBootstrappedSuperAdmin
            ? 'Magister (S2) / Profesi Akuntan'
            : 'Diploma IV / Sarjana (S1)',
          institution: isBootstrappedSuperAdmin ? 'Dewan Pengurus Pusat AKP2I' : '-',
          major: isBootstrappedSuperAdmin ? 'Perpajakan & Kebijakan Fiskal' : '-',
          occupation: isBootstrappedSuperAdmin ? 'Super Administrator AKP2I' : 'Praktisi Perpajakan',
          position: isBootstrappedSuperAdmin ? 'Kepala Sekretariat & Sistem Sertifikasi' : '-',
          updatedAt: serverTimestamp(),
        };
        await setDoc(userPrivateRef, initialPrivate);
        privData = initialPrivate;
      } else {
        privData = privSnap.data();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}/private/info`);
    }

    // Step 3: Ensure /admins/{uid} exists for Super Admin
    if (isBootstrappedSuperAdmin) {
      try {
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
          await setDoc(adminRef, {
            uid,
            email,
            role: 'Super Admin',
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `admins/${uid}`);
      }
    }

    return {
      id: uid,
      fullName,
      email: privData.email || email,
      role: assignedRole,
      avatarUrl: fbUser.photoURL || ASSETS.avatar,
      nik: privData.nik || '-',
      npwp: privData.npwp || '-',
      gender: privData.gender === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
      birthPlace: privData.birthPlace || '-',
      birthDate: privData.birthDate || '-',
      phone: privData.phone || '-',
      address: privData.address || '-',
      province: privData.province || 'DKI Jakarta',
      city: privData.city || 'Jakarta Pusat',
      educationLevel: privData.educationLevel || 'Diploma IV / Sarjana (S1)',
      institution: privData.institution || '-',
      major: privData.major || '-',
      occupation: privData.occupation || '-',
      position: privData.position || '-',
      isVerified,
      dukcapilMatch: isVerified,
      documents: [],
    };
  })();

  activeSyncPromises.set(uid, syncTask);
  try {
    return await syncTask;
  } finally {
    activeSyncPromises.delete(uid);
  }
}

export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!auth.currentUser) return;
  const uid = sanitizeId(auth.currentUser.uid);
  const userPublicRef = doc(db, 'users', uid);
  const userPrivateRef = doc(db, 'users', uid, 'private', 'info');

  const safeName = clampStr(profile.fullName, 120, 'Pengguna AKP2I');

  try {
    await updateDoc(userPublicRef, {
      fullName: safeName.length >= 2 ? safeName : 'Pengguna AKP2I',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }

  try {
    await updateDoc(userPrivateRef, {
      phone: clampStr(profile.phone, 30, '-'),
      nik: clampStr(profile.nik, 32, '-'),
      npwp: clampStr(profile.npwp, 32, '-'),
      gender: profile.gender === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
      birthPlace: clampStr(profile.birthPlace, 100, '-'),
      birthDate: clampStr(profile.birthDate, 50, '-'),
      address: clampStr(profile.address, 300, '-'),
      province: clampStr(profile.province, 100, '-'),
      city: clampStr(profile.city, 100, '-'),
      educationLevel: clampStr(profile.educationLevel, 100, '-'),
      institution: clampStr(profile.institution, 150, '-'),
      major: clampStr(profile.major, 100, '-'),
      occupation: clampStr(profile.occupation, 120, '-'),
      position: clampStr(profile.position, 120, '-'),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}/private/info`);
  }
}

export async function createRegistrationInFirestore(reg: Registration): Promise<void> {
  if (!auth.currentUser) return;
  const safeId = sanitizeId(reg.id);
  const regRef = doc(db, 'registrations', safeId);

  const payload: Record<string, any> = {
    id: safeId,
    regNumber: clampStr(reg.regNumber, 64, 'REG-AKP2I'),
    programId: sanitizeId(reg.programId),
    programTitle: clampStr(reg.programTitle, 200, 'Program Pelatihan AKP2I'),
    participantId: sanitizeId(auth.currentUser.uid),
    participantName: clampStr(reg.participantName, 120, 'Peserta AKP2I'),
    participantEmail: clampStr(reg.participantEmail, 150, 'peserta@akp2i.or.id'),
    participantPhone: clampStr(reg.participantPhone, 30, '-'),
    registeredAt: clampStr(reg.registeredAt, 64, new Date().toLocaleDateString('id-ID')),
    trainingDateText: clampStr(reg.trainingDateText, 120, '-'),
    amount: Math.max(0, Number(reg.amount) || 0),
    status: reg.status,
    paymentStatus: reg.paymentStatus,
    paymentMethod: clampStr(reg.paymentMethod, 60, 'Transfer Bank'),
    stepIndex: Math.min(8, Math.max(1, Number(reg.stepIndex) || 2)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (reg.subTierName) {
    payload.subTierName = clampStr(reg.subTierName, 120);
  }
  if (reg.paymentProofFileName) {
    payload.paymentProofFileName = clampStr(reg.paymentProofFileName, 200);
  }
  if (reg.paymentProofSize) {
    payload.paymentProofSize = clampStr(reg.paymentProofSize, 40);
  }
  if (reg.paymentProofUploadedAt) {
    payload.paymentProofUploadedAt = clampStr(reg.paymentProofUploadedAt, 64);
  }

  try {
    await setDoc(regRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `registrations/${safeId}`);
  }
}

export async function uploadPaymentProofInFirestore(
  regId: string,
  fileName: string,
  fileSize = '480 KB',
  uploadedAt = 'Baru saja'
): Promise<void> {
  if (!auth.currentUser) return;
  const safeId = sanitizeId(regId);
  const regRef = doc(db, 'registrations', safeId);
  try {
    await updateDoc(regRef, {
      paymentProofFileName: clampStr(fileName, 200, 'bukti_pembayaran.jpg'),
      paymentProofSize: clampStr(fileSize, 40, '480 KB'),
      paymentProofUploadedAt: clampStr(uploadedAt, 64, 'Baru saja'),
      paymentStatus: 'Menunggu Verifikasi',
      status: 'Menunggu Verifikasi',
      stepIndex: 3,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `registrations/${safeId}`);
  }
}

export async function adminUpdateRegistrationInFirestore(
  regId: string,
  updates: {
    status: Registration['status'];
    paymentStatus: Registration['paymentStatus'];
    stepIndex: number;
    paymentRejectionReason?: string;
  }
): Promise<void> {
  if (!auth.currentUser) return;
  const safeId = sanitizeId(regId);
  const regRef = doc(db, 'registrations', safeId);
  const payload: Record<string, any> = {
    status: updates.status,
    paymentStatus: updates.paymentStatus,
    stepIndex: updates.stepIndex,
    updatedAt: serverTimestamp(),
  };
  if (updates.paymentRejectionReason !== undefined) {
    payload.paymentRejectionReason = clampStr(updates.paymentRejectionReason, 300);
  }
  try {
    await updateDoc(regRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `registrations/${safeId}`);
  }
}

export async function createCertificateInFirestore(cert: Certificate): Promise<void> {
  if (!auth.currentUser) return;
  const safeId = sanitizeId(cert.certificateNumber || cert.id);
  const certRef = doc(db, 'certificates', safeId);

  const payload = {
    id: safeId,
    certificateNumber: clampStr(cert.certificateNumber, 64, safeId),
    participantId: sanitizeId(cert.participantId),
    participantName: clampStr(cert.participantName, 120, 'Peserta AKP2I'),
    programId: sanitizeId(cert.programId),
    programTitle: clampStr(cert.programTitle, 200, 'Program Pelatihan AKP2I'),
    issueDate: clampStr(cert.issueDate, 64, '-'),
    expiryDate: clampStr(cert.expiryDate, 64, 'Seumur Hidup'),
    predicate: clampStr(cert.predicate, 100, 'Lulus Kompetensi'),
    status: cert.status === 'Dicabut' ? 'Dicabut' : 'Valid & Aktif',
    qrVerificationCode: clampStr(cert.qrVerificationCode, 200, safeId),
    signatoryName: clampStr(cert.signatoryName, 120, 'Ketua Umum DPP AKP2I'),
    signatoryTitle: clampStr(cert.signatoryTitle, 120, 'Dewan Pengurus Pusat AKP2I'),
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(certRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `certificates/${safeId}`);
  }
}

export async function getCertificateByCodeFromFirestore(
  certCode: string
): Promise<Certificate | null> {
  const safeId = sanitizeId(certCode.trim().toUpperCase());
  const certRef = doc(db, 'certificates', safeId);
  try {
    const snap = await getDoc(certRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: data.id,
      certificateNumber: data.certificateNumber,
      participantId: data.participantId,
      participantName: data.participantName,
      programId: data.programId,
      programTitle: data.programTitle,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate,
      predicate: data.predicate,
      status: data.status,
      qrVerificationCode: data.qrVerificationCode,
      signatoryName: data.signatoryName,
      signatoryTitle: data.signatoryTitle,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `certificates/${safeId}`);
  }
}

export {
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
};
