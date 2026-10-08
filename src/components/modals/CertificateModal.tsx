import React from 'react';
import { X, Download, ShieldCheck, CheckCircle2, ExternalLink, Printer } from 'lucide-react';
import { Certificate } from '../../types/akp2i';
import { QrCodeMatrixSvg } from '../ui/ResilientImage';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
  onVerifyClick?: (certNumber: string) => void;
  onDownloadToast?: (msg: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  onVerifyClick,
  onDownloadToast,
}) => {
  if (!certificate) return null;

  const handleDownloadPdf = () => {
    const content = `
SERTIFIKAT KOMPETENSI & PELATIHAN PERPAJAKAN RESMI
ASOSIASI KONSULTAN PAJAK PUBLIK INDONESIA (AKP2I)
===============================================================
Nomor Sertifikat : ${certificate.certificateNumber}
Status Validasi  : ${certificate.status}
Diberikan Kepada : ${certificate.participantName}
Program Pelatihan: ${certificate.programTitle}
Predikat         : ${certificate.predicate}
Tanggal Terbit   : ${certificate.issueDate}
Masa Berlaku     : ${certificate.expiryDate}
Pejabat Penandatangan: ${certificate.signatoryName} (${certificate.signatoryTitle})
URL Verifikasi QR: ${certificate.qrVerificationCode}
===============================================================
Dokumen ini ditandatangani secara elektronik dan tercatat di Pangkalan Data AKP2I Learning Center.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.certificateNumber}_${certificate.participantName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    if (onDownloadToast) {
      onDownloadToast(`Sertifikat ${certificate.certificateNumber} berhasil diunduh.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#151F24] border border-[#D9E2DE] dark:border-[#243239] rounded-xl overflow-hidden shadow-2xl my-8">
        {/* Top Modal Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0E1518] text-white border-b border-[#243239]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#F4C430]" />
            <span className="text-sm font-semibold">
              Pratinjau Sertifikat Digital Resmi AKP2I · <span className="font-mono text-[#F4C430]">{certificate.certificateNumber}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onVerifyClick && (
              <button
                onClick={() => {
                  onClose();
                  onVerifyClick(certificate.certificateNumber);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#EAF7F0] bg-[#087A4B] hover:bg-[#045A38] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Uji Verifikasi Publik
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 text-xs font-bold text-[#172026] bg-[#F4C430] hover:bg-[#e5b625] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Certificate Canvas */}
        <div className="p-6 sm:p-10 bg-[#F6F8F7] dark:bg-[#0E1518]">
          <div className="relative bg-white text-[#172026] border-[6px] border-double border-[#087A4B] rounded-lg p-8 sm:p-12 shadow-sm">
            {/* Corner Gold Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#F4C430]" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#F4C430]" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#F4C430]" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#F4C430]" />

            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#087A4B] mb-2">
                <span>ASOSIASI KONSULTAN PAJAK PUBLIK INDONESIA (AKP2I)</span>
              </div>
              <p className="text-xs text-[#66757F] mb-6">
                PUSAT PENDIDIKAN, PELATIHAN & PENGEMBANGAN KOMPETENSI PERPAJAKAN NASIONAL
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#045A38] mb-1">
                SERTIFIKAT KOMPETENSI & KELULUSAN
              </h2>
              <p className="font-mono text-xs font-semibold text-[#66757F] mb-8">
                Nomor Registrasi Sertifikat: {certificate.certificateNumber}
              </p>

              <p className="text-xs text-[#66757F] mb-2">Dengan ini menyatakan bahwa:</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172026] border-b-2 border-[#F4C430] inline-block px-6 pb-2 mb-6">
                {certificate.participantName}
              </h3>

              <p className="text-sm text-[#172026] leading-relaxed mb-3">
                Telah mengikuti seluruh rangkaian pembelajaran, memenuhi standar kehadiran, dan dinyatakan{' '}
                <strong className="text-[#087A4B]">LULUS</strong> pada program:
              </p>

              <h4 className="text-lg sm:text-xl font-bold text-[#045A38] mb-3">
                {certificate.programTitle}
              </h4>

              <p className="text-xs font-semibold text-[#172026] mb-8">
                Predikat Kelulusan: <span className="text-[#087A4B]">{certificate.predicate}</span> · Masa Berlaku: {certificate.expiryDate}
              </p>
            </div>

            {/* Footer with QR Verification and Official Signatory */}
            <div className="mt-8 pt-6 border-t border-[#D9E2DE] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <QrCodeMatrixSvg value={certificate.certificateNumber} size={88} />
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#087A4B] mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terverifikasi secara Kriptografis</span>
                  </div>
                  <p className="text-[11px] text-[#66757F] max-w-[230px] leading-snug">
                    Pindai QR Code atau masukkan kode <span className="font-mono font-semibold text-[#172026]">{certificate.certificateNumber}</span> pada halaman Verifikasi Sertifikat AKP2I.
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <p className="text-xs text-[#66757F] mb-6">
                  Diterbitkan di Jakarta, {certificate.issueDate}
                </p>
                <div className="inline-block border-b border-[#172026] pb-1 mb-1">
                  <p className="text-sm font-bold text-[#172026]">{certificate.signatoryName}</p>
                </div>
                <p className="text-xs text-[#66757F]">{certificate.signatoryTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
