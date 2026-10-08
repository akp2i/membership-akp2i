# Security Specification — AKP2I Learning Center

## 1. Data Invariants
1. **Identity Integrity**: Every user document in `/users/{userId}` and `/users/{userId}/private/{docId}` MUST have `uid == request.auth.uid` and `userId == request.auth.uid` upon creation by a regular user.
2. **PII Split Collection Isolation**: Sensitive PII (`email`, `phone`, `nik`, `npwp`, `address`, etc.) is stored exclusively in `/users/{userId}/private/info` and is strictly readable only by `isOwner(userId)` or `isAdmin()`.
3. **Privilege Escalation Prevention**: Non-admin users creating `/users/{userId}` can ONLY set `role == 'Peserta'` and `isVerified == false`. Only `isAdmin()` can assign elevated roles (`Super Admin`, `Admin Pelatihan`, `Verifikator`, `Instruktur`) or write to `/admins/{adminId}`.
4. **Bootstrapped Real Admin**: `isAdmin()` requires `request.auth != null && request.auth.token.email_verified == true` and either `(request.auth.token.email == 'contact.akp2i@gmail.com')` or `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
5. **Registration Ownership & Terminal State Locking**: A registration in `/registrations/{registrationId}` can only be created where `participantId == request.auth.uid`. Once `status == 'Selesai'` or `status == 'Dibatalkan'`, non-admin updates are blocked.
6. **Temporal Integrity**: `createdAt` and `updatedAt` fields MUST equal `request.time` on write, and `createdAt` is immutable on update.

## 2. The "Dirty Dozen" Payloads
1. **Payload 1 (Self-Assigned Admin Role)**: User creates `/users/u1` with `{ uid: "u1", fullName: "Attacker", role: "Super Admin", isVerified: true }` -> `PERMISSION_DENIED`.
2. **Payload 2 (Shadow Field Injection on User)**: User creates `/users/u1` with extra key `{ ..., isAdmin: true }` -> `PERMISSION_DENIED`.
3. **Payload 3 (Unverified Email Admin Spoof)**: User with `email: "contact.akp2i@gmail.com"` but `email_verified: false` attempts to write to `/admins/u1` -> `PERMISSION_DENIED`.
4. **Payload 4 (Cross-User PII Read)**: Authenticated user `u2` attempts `get(/users/u1/private/info)` -> `PERMISSION_DENIED`.
5. **Payload 5 (ID Poisoning / Oversized String)**: User attempts to create `/registrations/reg1` with a 10,000-character `programTitle` -> `PERMISSION_DENIED`.
6. **Payload 6 (Identity Spoofing on Registration)**: User `u1` creates `/registrations/reg1` with `participantId: "u2"` -> `PERMISSION_DENIED`.
7. **Payload 7 (Payment Self-Verification Bypass)**: Participant `u1` updates `/registrations/reg1` setting `paymentStatus: "Pembayaran Terverifikasi"` -> `PERMISSION_DENIED`.
8. **Payload 8 (Terminal Registration Mutation)**: Participant `u1` updates `/registrations/reg1` when `existing().status == "Selesai"` -> `PERMISSION_DENIED`.
9. **Payload 9 (Fake Timestamp Injection)**: User creates `/users/u1` with `createdAt` set to a past timestamp instead of `request.time` -> `PERMISSION_DENIED`.
10. **Payload 10 (Immutable Field Tampering)**: User updates `/registrations/reg1` changing `createdAt` or `participantId` -> `PERMISSION_DENIED`.
11. **Payload 11 (Unauthorized Certificate Forgery)**: Non-admin user attempts to create `/certificates/cert1` -> `PERMISSION_DENIED`.
12. **Payload 12 (Blanket Registration Scraping)**: Non-admin user attempts `list` on `/registrations` without filtering `resource.data.participantId == request.auth.uid` -> `PERMISSION_DENIED`.
