/**
 * Firestore Security Rules Test Suite for AKP2I Learning Center
 * Verifies all 12 "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Self-Assigned Super Admin Role on Profile Creation',
    operation: 'create',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'user_1',
      fullName: 'Attacker',
      role: 'Super Admin',
      isVerified: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Shadow Field Injection on User Profile',
    operation: 'create',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'user_1',
      fullName: 'Attacker',
      role: 'Peserta',
      isVerified: false,
      shadowAdminFlag: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Email Admin Spoof Attack',
    operation: 'create',
    path: '/admins/user_spoof',
    auth: { uid: 'user_spoof', email: 'contact.akp2i@gmail.com', email_verified: false },
    payload: {
      uid: 'user_spoof',
      email: 'contact.akp2i@gmail.com',
      role: 'Super Admin',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-User PII Read on Private Subcollection',
    operation: 'get',
    path: '/users/user_victim/private/info',
    auth: { uid: 'user_attacker', email: 'attacker@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Oversized String Resource Poisoning on Registration',
    operation: 'create',
    path: '/registrations/reg_1',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      id: 'reg_1',
      programTitle: 'A'.repeat(5000),
      participantId: 'user_1',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Identity Spoofing on Registration Creation',
    operation: 'create',
    path: '/registrations/reg_1',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      id: 'reg_1',
      participantId: 'other_user_id',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Participant Self-Approving Payment Status',
    operation: 'update',
    path: '/registrations/reg_1',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      paymentStatus: 'Pembayaran Terverifikasi',
      status: 'Terdaftar',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Mutating a Terminal Selesai Registration',
    operation: 'update',
    path: '/registrations/reg_completed',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      paymentProofFileName: 'new_file.jpg',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Forged Past Client Timestamp on Creation',
    operation: 'create',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      uid: 'user_1',
      fullName: 'Valid Name',
      role: 'Peserta',
      isVerified: false,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Tampering with Immutable createdAt Field on Update',
    operation: 'update',
    path: '/users/user_1',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      fullName: 'Updated Name',
      createdAt: '2026-10-08T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unauthorized Certificate Forgery by Regular Participant',
    operation: 'create',
    path: '/certificates/cert_forged',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: {
      id: 'cert_forged',
      certificateNumber: 'SERT-FAKE-001',
      participantId: 'user_1',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unfiltered List Query Scraping on Private Registrations',
    operation: 'list',
    path: '/registrations',
    auth: { uid: 'user_scraper', email: 'scraper@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
