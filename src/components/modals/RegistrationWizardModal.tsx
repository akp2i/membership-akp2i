import React, { useState } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Trash2,
  CreditCard,
  QrCode,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  Program,
  UserProfile,
  RegistrationField,
  Registration,
  DocumentItem,
  PaymentMethodItem,
} from '../../types/akp2i';
import { formatRupiah, QrCodeMatrixSvg } from '../ui/ResilientImage';

interface RegistrationWizardModalProps {
  program: Program | null;
  userProfile: UserProfile;
  formFields: RegistrationField[];
  paymentMethods: PaymentMethodItem[];
  onClose: () => void;
  onSubmitRegistration: (newReg: Registration) => void;
}

export const RegistrationWizardModal: React.FC<RegistrationWizardModalProps> = ({
  program,
  userProfile,
  formFields,
  paymentMethods,
  onClose,
  onSubmitRegistration,
}) => {
  if (!program) return null;

  const activeMethods = paymentMethods.filter((m) => m.isActive);
  const defaultMethodName =
    activeMethods[0]?.name || paymentMethods[0]?.name || 'Transfer Bank Mandiri';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSubTierId, setSelectedSubTierId] = useState<string>(
    program.subTiers && program.subTiers.length > 0 ? program.subTiers[0].id : ''
  );

  // Dynamic form field state pre-populated from userProfile
  const [answers, setAnswers] = useState<Record<string, string>>({
    fullName: userProfile.fullName,
    nik: userProfile.nik,
    npwp: userProfile.npwp,
    email: userProfile.email,
    phone: userProfile.phone,
    gender: userProfile.gender,
    birthPlace: userProfile.birthPlace,
    birthDate: userProfile.birthDate,
    province: userProfile.province,
    city: userProfile.city,
    address: userProfile.address,
    educationLevel: userProfile.educationLevel,
    institution: userProfile.institution,
    occupation: userProfile.occupation,
    position: userProfile.position,
    akp2iMemberStatus: 'Umum / Calon Anggota',
  });

  // Document uploads state
  const [docs, setDocs] = useState<DocumentItem[]>(userProfile.documents);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>(defaultMethodName);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [hasPaidChecked, setHasPaidChecked] = useState(true);
  const [proofFile, setProofFile] = useState<{ name: string; size: string } | null>({
    name: `Bukti_Bayar_${program.code}_${userProfile.fullName.split(' ')[0]}.jpg`,
    size: '540 KB',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const activeSubTier = program.subTiers?.find((t) => t.id === selectedSubTierId);
  const effectivePrice = activeSubTier ? activeSubTier.price : program.price;
  const effectiveDateText = activeSubTier
    ? activeSubTier.scheduleText
    : `${program.startDate} – ${program.endDate}`;

  const visibleFields = formFields.filter(
    (f) => f.visible && (!f.targetModule || f.targetModule === 'registration')
  );

  const handleCopyAccount = (accNum: string, label: string) => {
    navigator.clipboard?.writeText(accNum);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleFileUploadChange = (
    docType: DocumentItem['type'],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran file maksimal adalah 5 MB.');
      return;
    }
    setFormError(null);
    setUploadingDocType(docType);
    setTimeout(() => {
      const sizeKb = Math.max(120, Math.round(file.size / 1024));
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        type: docType,
        fileName: file.name,
        fileSize: `${sizeKb} KB`,
        uploadedAt: 'Baru saja',
        status: 'Menunggu Verifikasi',
      };
      setDocs((prev) => [...prev.filter((d) => d.type !== docType), newDoc]);
      setUploadingDocType(null);
    }, 350);
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.max(150, Math.round(file.size / 1024));
    setProofFile({
      name: file.name,
      size: `${sizeKb} KB`,
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      for (const field of visibleFields) {
        if (field.required && (!answers[field.key] || answers[field.key].trim() === '')) {
          setFormError(`Mohon lengkapi field wajib: ${field.label}`);
          return;
        }
      }
      setFormError(null);
      setStep(2);
    } else if (step === 2) {
      // Dokumen persyaratan tidak menjadi syarat wajib pendaftaran
      setFormError(null);
      setStep(3);
    }
  };

  const handleFinalSubmit = (payLater = false) => {
    if (!payLater && (!hasPaidChecked || !proofFile)) {
      setFormError('Harap centang konfirmasi pembayaran dan unggah bukti pembayaran Anda.');
      return;
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000)
      .toString(16)
      .toUpperCase();
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      regNumber: `REG-20261008-${randomCode}`,
      programId: program.id,
      programTitle: activeSubTier
        ? `${program.shortTitle} — ${activeSubTier.name}`
        : program.title,
      subTierName: activeSubTier?.name,
      participantId: userProfile.id,
      participantName: answers.fullName || userProfile.fullName,
      participantEmail: answers.email || userProfile.email,
      participantPhone: answers.phone || userProfile.phone,
      registeredAt: '08 Okt 2026',
      trainingDateText: effectiveDateText,
      amount: effectivePrice,
      status: payLater ? 'Menunggu Pembayaran' : 'Menunggu Verifikasi',
      paymentStatus: payLater ? 'Belum Dibayar' : 'Menunggu Verifikasi',
      paymentMethod,
      paymentProofFileName: payLater ? undefined : proofFile?.name,
      paymentProofSize: payLater ? undefined : proofFile?.size,
      paymentProofUploadedAt: payLater ? undefined : '08 Okt 2026, Baru saja',
      stepIndex: payLater ? 2 : 3,
      customAnswers: answers,
      documentsSubmitted: docs,
    };

    onSubmitRegistration(newReg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] rounded-xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0E1518] text-white border-b border-[#243239] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#F4C430] font-semibold">
              Formulir Pendaftaran & Pembayaran Terintegrasi AKP2I
            </p>
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {program.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="px-6 py-3.5 bg-[#F6F8F7] dark:bg-[#0E1518] border-b border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#087A4B] dark:text-[#34D399]' : 'text-[#66757F]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#087A4B] text-white inline-flex items-center justify-center text-[11px] font-mono">
              1
            </span>
            <span>Identitas & Data Peserta</span>
          </div>
          <span className="text-[#66757F]">/</span>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#087A4B] dark:text-[#34D399]' : 'text-[#66757F]'}`}>
            <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-mono ${step >= 2 ? 'bg-[#087A4B] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              2
            </span>
            <span>Dokumen Persyaratan (Opsional)</span>
          </div>
          <span className="text-[#66757F]">/</span>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#087A4B] dark:text-[#34D399]' : 'text-[#66757F]'}`}>
            <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-mono ${step >= 3 ? 'bg-[#087A4B] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              3
            </span>
            <span>Pembayaran & Bukti Transfer</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {formError && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400">
              {formError}
            </div>
          )}

          {/* STEP 1: DYNAMIC FORM FIELDS */}
          {step === 1 && (
            <div className="space-y-5">
              {program.subTiers && program.subTiers.length > 0 && (
                <div className="p-4 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/15 border border-[#087A4B]/30">
                  <label className="block text-xs font-bold text-[#045A38] dark:text-[#34D399] mb-2">
                    Pilih Jenjang Tingkat Pelatihan / Ujian UKP *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {program.subTiers.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedSubTierId(tier.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          selectedSubTierId === tier.id
                            ? 'bg-white dark:bg-[#151F24] border-[#087A4B] ring-2 ring-[#087A4B]/20'
                            : 'bg-white/60 dark:bg-[#0E1518]/60 border-[#D9E2DE] dark:border-[#243239]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#172026] dark:text-white">
                          {tier.name}
                        </div>
                        <div className="text-[11px] text-[#66757F] dark:text-slate-400 mt-0.5">
                          {tier.scheduleText}
                        </div>
                        <div className="text-xs font-mono font-bold text-[#087A4B] dark:text-[#F4C430] mt-1.5">
                          {formatRupiah(tier.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleFields.map((field) => (
                  <div
                    key={field.id}
                    className={field.key === 'address' || field.key === 'fullName' ? 'sm:col-span-2' : ''}
                  >
                    <label className="block text-xs font-semibold text-[#172026] dark:text-slate-200 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={answers[field.key] || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'radio' ? (
                      <div className="flex items-center gap-4 pt-1 flex-wrap">
                        {field.options?.map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={field.key}
                              checked={answers[field.key] === opt}
                              onChange={() =>
                                setAnswers((prev) => ({ ...prev, [field.key]: opt }))
                              }
                              className="accent-[#087A4B]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center gap-4 pt-1 flex-wrap">
                        {field.options?.map((opt) => {
                          const currentVal = (answers[field.key] || '').split(', ').filter(Boolean);
                          const isChecked = currentVal.includes(opt);
                          return (
                            <label key={opt} className="inline-flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...currentVal, opt]
                                    : currentVal.filter((v: string) => v !== opt);
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [field.key]: updated.join(', '),
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
                        type={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                        value={answers[field.key] || ''}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD DOCUMENTS (OPSIONAL) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087A4B] dark:text-[#34D399] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#087A4B] dark:text-[#34D399]">
                      Dokumen Persyaratan Tidak Menjadi Syarat Wajib Pendaftaran
                    </h4>
                    <p className="text-xs text-[#66757F] dark:text-slate-300 mt-1 leading-relaxed">
                      Anda dapat langsung melanjutkan pendaftaran dan pembayaran sekarang tanpa perlu mengunggah dokumen. Dokumen persyaratan (KTP, NPWP, Pas Foto, Ijazah) bersifat <strong>opsional</strong> dan dapat dilengkapi kapan saja nanti melalui menu <strong>Profil Saya</strong>.
                    </p>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-[#087A4B] shrink-0 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['KTP', 'NPWP', 'Pas Foto', 'Ijazah'] as DocumentItem['type'][]).map((docType) => {
                  const existing = docs.find((d) => d.type === docType);
                  const isUploading = uploadingDocType === docType;
                  return (
                    <div
                      key={docType}
                      className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#0E1518] flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#172026] dark:text-white">
                              Dokumen {docType}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-[#66757F]">
                              Opsional
                            </span>
                          </div>
                          {existing ? (
                            <div className="mt-1">
                              <p className="text-xs font-mono text-[#087A4B] dark:text-[#34D399] truncate max-w-[200px]">
                                {existing.fileName}
                              </p>
                              <p className="text-[11px] text-[#66757F]">
                                {existing.fileSize} · {existing.status}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-[#66757F] mt-1">Belum diunggah (bisa menyusul)</p>
                          )}
                        </div>
                        {existing && (
                          <button
                            type="button"
                            onClick={() => setDocs((prev) => prev.filter((d) => d.type !== docType))}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Hapus dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {isUploading ? (
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#087A4B] h-full w-3/4 animate-pulse" />
                        </div>
                      ) : (
                        <label className="mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#087A4B]/50 hover:bg-[#EAF7F0] dark:hover:bg-[#087A4B]/10 text-xs font-semibold text-[#087A4B] dark:text-[#34D399] cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{existing ? 'Ganti File' : 'Pilih atau Tarik File'}</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileUploadChange(docType, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & PROOF UPLOAD */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Total Summary Banner */}
              <div className="p-4 rounded-lg bg-[#0E1518] text-white border border-[#243239] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400">Ringkasan Biaya Pendaftaran</span>
                  <h4 className="text-sm font-bold text-white">
                    {activeSubTier ? `${program.shortTitle} (${activeSubTier.name})` : program.title}
                  </h4>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Tagihan</span>
                  <span className="text-xl font-mono font-extrabold text-[#F4C430] tabular-nums">
                    {formatRupiah(effectivePrice)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#172026] dark:text-slate-200 mb-2">
                  Pilih Metode Pembayaran Resmi AKP2I
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(activeMethods.length > 0 ? activeMethods : paymentMethods).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.name)}
                      className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        paymentMethod === m.name
                          ? 'border-[#087A4B] bg-[#EAF7F0]/60 dark:bg-[#087A4B]/20 text-[#172026] dark:text-white'
                          : 'border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] text-[#66757F]'
                      }`}
                    >
                      {m.type === 'qris' ? (
                        <QrCode className="w-5 h-5 text-[#087A4B] dark:text-[#F4C430] shrink-0" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-[#087A4B] dark:text-[#F4C430] shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-bold block">{m.name}</span>
                        <span className="text-[10px] text-[#66757F] block">
                          {m.type === 'qris' ? 'Scan QRIS Instan' : m.bankName || 'Transfer Bank'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Bank Account / QRIS Details */}
              {(() => {
                const selectedMethod =
                  paymentMethods.find((m) => m.name === paymentMethod) ||
                  activeMethods[0] ||
                  paymentMethods[0];

                if (!selectedMethod) return null;

                if (selectedMethod.type !== 'qris') {
                  return (
                    <div className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-[#66757F] block">
                          {selectedMethod.bankName || selectedMethod.name}
                        </span>
                        <p className="text-lg font-mono font-extrabold text-[#172026] dark:text-white mt-0.5 tabular-nums">
                          {selectedMethod.accountNumber || '-'}
                        </p>
                        <p className="text-xs font-semibold text-[#087A4B] dark:text-[#34D399] mt-0.5">
                          a.n. {selectedMethod.accountHolder}
                        </p>
                        {selectedMethod.instructions && (
                          <p className="text-[11px] text-[#66757F] mt-1">
                            {selectedMethod.instructions}
                          </p>
                        )}
                      </div>
                      {selectedMethod.accountNumber && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyAccount(
                              selectedMethod.accountNumber!.replace(/[^0-9]/g, ''),
                              selectedMethod.name
                            )
                          }
                          className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] text-xs font-bold text-[#172026] dark:text-white inline-flex items-center gap-1.5 hover:border-[#087A4B] transition-colors self-start sm:self-center cursor-pointer"
                        >
                          {copiedBank === selectedMethod.name ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#087A4B]" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin No. Rekening</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="p-5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] flex flex-col sm:flex-row items-center gap-6">
                    {selectedMethod.qrisImageUrl ? (
                      <div className="p-2 bg-white rounded-xl border border-[#D9E2DE] shadow-sm shrink-0">
                        <img
                          src={selectedMethod.qrisImageUrl}
                          alt={selectedMethod.name}
                          className="w-36 h-36 object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <QrCodeMatrixSvg
                        value={`QRIS-AKP2I-${program.code}-${effectivePrice}`}
                        size={132}
                      />
                    )}
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="text-xs font-bold text-[#087A4B] dark:text-[#F4C430]">
                        {selectedMethod.name} {selectedMethod.accountNumber ? `— ${selectedMethod.accountNumber}` : ''}
                      </div>
                      <h5 className="text-sm font-bold text-[#172026] dark:text-white">
                        {selectedMethod.accountHolder}
                      </h5>
                      <p className="text-xs text-[#66757F] dark:text-slate-400 leading-relaxed">
                        {selectedMethod.instructions ||
                          'Buka aplikasi Mobile Banking atau e-Wallet, pindai kode QRIS di samping, pastikan nominal sesuai tagihan, lalu simpan bukti transaksi.'}{' '}
                        Nominal tagihan:{' '}
                        <strong className="font-mono text-[#172026] dark:text-white">
                          {formatRupiah(effectivePrice)}
                        </strong>
                        .
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Upload Proof of Payment */}
              <div className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#0E1518] space-y-3">
                <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#172026] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPaidChecked}
                    onChange={(e) => setHasPaidChecked(e.target.checked)}
                    className="w-4 h-4 accent-[#087A4B] rounded"
                  />
                  <span>Saya sudah melakukan pembayaran sesuai nominal tagihan di atas</span>
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#D9E2DE] dark:border-[#243239]">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-[#087A4B]" />
                    <div>
                      <p className="text-xs font-bold text-[#172026] dark:text-white">
                        {proofFile ? proofFile.name : 'Unggah Bukti Pembayaran (JPG, PNG, PDF)'}
                      </p>
                      <p className="text-[11px] text-[#66757F]">
                        {proofFile ? `Ukuran: ${proofFile.size} · Siap dikirim` : 'Maksimal ukuran file 5 MB'}
                      </p>
                    </div>
                  </div>
                  <label className="px-3.5 py-2 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih File Bukti Bayar</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleProofFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F6F8F7] dark:bg-[#0E1518] border-t border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-bold text-[#172026] dark:text-white inline-flex items-center gap-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-semibold text-[#66757F] hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{step === 2 ? 'Lanjutkan ke Pembayaran (Lewati / Selesai Dokumen)' : 'Lanjutkan ke Tahap 2'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleFinalSubmit(true)}
                className="px-3.5 py-2.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-semibold text-[#66757F] dark:text-slate-300 hover:text-[#172026] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Simpan & Bayar Nanti
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim Bukti Pembayaran</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
