import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Award,
  RotateCcw,
  ChevronRight,
  QrCode,
  FileCheck2,
  Building2,
  Phone,
  Mail,
  HelpCircle,
  Lock,
  UserPlus,
} from 'lucide-react';
import {
  Program,
  Registration,
  Certificate,
  ProgramCategory,
  ProgramStatus,
} from '../../types/akp2i';
import {
  ResilientImage,
  formatRupiah,
  StatusLabel,
  QrCodeMatrixSvg,
} from '../ui/ResilientImage';
import { ASSETS } from '../../data/mockDatabase';

interface HomeViewProps {
  programs: Program[];
  registrations: Registration[];
  onExploreClick: () => void;
  onRegisterNowClick: (program?: Program) => void;
  onViewProgramDetail: (program: Program) => void;
  onOpenVerifyCert: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  programs,
  registrations,
  onExploreClick,
  onRegisterNowClick,
  onViewProgramDetail,
  onOpenVerifyCert,
}) => {
  const featuredPrograms = programs.filter((p) => p.published).slice(0, 5);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0E1518] text-white border-b border-[#243239]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F4C430] tracking-wide">
              <span>PORTAL PENDIDIKAN & SERTIFIKASI RESMI AKP2I</span>
              <span aria-hidden="true">·</span>
              <span>TERINTEGRASI CORETAX 2026</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Tingkatkan Kompetensi Perpajakan Anda Bersama AKP2I
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Temukan pelatihan, bimbingan, dan program pengembangan kompetensi perpajakan yang dirancang untuk mendukung perjalanan profesional Anda.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-lg bg-[#087A4B] hover:bg-[#0B8F5A] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Jelajahi Pelatihan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRegisterNowClick(featuredPrograms[0])}
                className="px-6 py-3.5 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-sm font-extrabold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Daftar Sekarang</span>
              </button>
              <button
                onClick={onOpenVerifyCert}
                className="px-4 py-3.5 rounded-lg border border-white/20 hover:bg-white/5 text-slate-200 text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#F4C430]" />
                <span>Verifikasi Sertifikat</span>
              </button>
            </div>

            {/* Quantitative Proof Bar Adjacent to Hero Proposition */}
            <div className="pt-8 mt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                  18.450+
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Peserta & Praktisi Terlatih (2021–2026)
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F4C430] tabular-nums">
                  94,2%
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Tingkat Kelulusan Uji Kompetensi UKP
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                  125+
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Instruktur BKP & Pakar Perpajakan
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#34D399] tabular-nums">
                  14.920
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Sertifikat Digital Ber-QR Terbit
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Carrier */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-[#243239] bg-[#151F24] shadow-2xl">
              <div className="aspect-16/10 w-full relative">
                <ResilientImage
                  src={ASSETS.heroBanner}
                  alt="Pelatihan dan Sertifikasi Konsultan Pajak AKP2I"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1518] via-[#0E1518]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-[#0E1518]/90 border border-white/10">
                  <div className="text-xs font-semibold text-[#F4C430]">
                    Agenda Utama Oktober – Desember 2026
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    UKP Tingkat A, B, C · Bimbel USKP A & B · Brevet Pajak A/B/C + Coretax
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Pendaftaran terintegrasi, pembayaran via Bank/QRIS, akses LMS & sertifikat digital.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#34D399] tracking-wide mb-1">
              PROGRAM UNGGULAN AKP2I
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Program Pelatihan, Brevet & Sertifikasi Terpopuler
            </h2>
          </div>
          <button
            onClick={onExploreClick}
            className="text-sm font-bold text-[#087A4B] dark:text-[#34D399] hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <span>Lihat Semua Agenda Pelatihan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredPrograms.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-[#087A4B] opacity-50" />
            <h3 className="text-base font-bold text-[#172026] dark:text-white">
              Belum Ada Agenda Pelatihan
            </h3>
            <p className="text-xs text-[#66757F] dark:text-slate-400 max-w-md mx-auto">
              Seluruh data pelatihan baru saja di-reset. Program pelatihan dan uji kompetensi baru akan segera dibuka oleh Administrator AKP2I.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrograms.map((prog) => {
            const existingReg = registrations.find((r) => r.programId === prog.id);
            return (
              <div
                key={prog.id}
                className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div>
                  <div className="aspect-16/10 w-full relative overflow-hidden bg-[#0E1518]">
                    <ResilientImage
                      src={prog.bannerUrl}
                      alt={prog.title}
                      fallbackTitle={prog.shortTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white font-medium">
                      <span>{prog.category}</span>
                      <span className="font-mono font-bold text-[#F4C430] tabular-nums">
                        {formatRupiah(prog.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Unboxed clean metadata with typographic separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#66757F] dark:text-slate-400">
                      <StatusLabel status={prog.status} />
                      <span aria-hidden="true">·</span>
                      <span>{prog.method}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        Kuota {prog.enrolled}/{prog.quota}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#172026] dark:text-white leading-snug line-clamp-2">
                      {prog.title}
                    </h3>

                    <div className="space-y-1.5 pt-1 text-xs text-[#66757F] dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399] shrink-0" />
                        <span className="tabular-nums">
                          {prog.startDate} – {prog.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399] shrink-0" />
                        <span className="truncate">{prog.timeText}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399] shrink-0" />
                        <span className="truncate">{prog.locationDetail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between gap-2.5 bg-[#F6F8F7]/50 dark:bg-[#0E1518]/40">
                  <button
                    onClick={() => onViewProgramDetail(prog)}
                    className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] dark:border-[#243239] text-xs font-bold text-[#172026] dark:text-white hover:border-[#087A4B] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Lihat Detail
                  </button>
                  {existingReg ? (
                    <button
                      onClick={() => onViewProgramDetail(prog)}
                      className="px-3.5 py-2 rounded-lg bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      Status: {existingReg.status}
                    </button>
                  ) : (
                    <button
                      onClick={() => onRegisterNowClick(prog)}
                      className="px-4 py-2 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Daftar Sekarang
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </section>

      {/* WHY CHOOSE AKP2I - EDITORIAL NUMBERED CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold text-[#087A4B] dark:text-[#34D399] tracking-wide mb-1">
              STANDAR PENDIDIKAN PROFESIONAL AKP2I
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Mengapa Ribuan Praktisi & Konsultan Pajak Memilih AKP2I Learning Center?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 pb-6 border-b border-[#D9E2DE] dark:border-[#243239]">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                01. Kurikulum Terupdate UU HPP & Simulator Coretax DJP
              </h3>
              <p className="text-sm text-[#66757F] dark:text-slate-400 leading-relaxed">
                Seluruh silabus UKP, Bimbel USKP A/B, dan Brevet Pajak A/B/C disusun mengikuti regulasi perpajakan terbaru serta dilengkapi simulasi praktik langsung Sistem Inti Administrasi Perpajakan (Coretax).
              </p>
            </div>

            <div className="space-y-2 pb-6 border-b border-[#D9E2DE] dark:border-[#243239]">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                02. Pengajar Konsultan Pajak Bersertifikat (BKP) & Pakar Hukum Pajak
              </h3>
              <p className="text-sm text-[#66757F] dark:text-slate-400 leading-relaxed">
                Dibimbing langsung oleh anggota senior AKP2I pemegang sertifikat tingkat C, kuasa hukum Pengadilan Pajak, dan praktisi transfer pricing berpengalaman puluhan tahun.
              </p>
            </div>

            <div className="space-y-2 pb-6 md:pb-0 border-b md:border-b-0 border-[#D9E2DE] dark:border-[#243239]">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                03. Portal Pembelajaran & Ujian Terintegrasi Satu Pintu
              </h3>
              <p className="text-sm text-[#66757F] dark:text-slate-400 leading-relaxed">
                Mulai dari pendaftaran online, verifikasi dokumen, pembayaran QRIS/Bank, akses modul video & PDF, kelas interaktif Zoom, hingga ujian akhir CBT terpantau dalam satu dashboard.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#172026] dark:text-white">
                04. Sertifikat Kompetensi Resmi Ber-QR Code Terverifikasi Publik
              </h3>
              <p className="text-sm text-[#66757F] dark:text-slate-400 leading-relaxed">
                Setiap sertifikat kelulusan diterbitkan secara resmi oleh Dewan Pengurus Pusat AKP2I dan dilengkapi kode QR unik yang dapat diverifikasi keasliannya oleh perusahaan maupun klien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-gradient-to-r from-[#045A38] via-[#087A4B] to-[#0E1518] text-white p-8 sm:p-12 border border-[#0B8F5A]/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Siap Mengembangkan Kompetensi Perpajakan Anda?
            </h2>
            <p className="text-sm sm:text-base text-[#EAF7F0]/90">
              Pilih program UKP, Bimbel USKP, atau Brevet Pajak + Coretax sesuai kebutuhan karier Anda dan mulai belajar hari ini.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-sm font-extrabold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Lihat Semua Pelatihan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   AGENDA PELATIHAN VIEW (MODELED ON KLC AGENDA SERTIFIKASI SCREENSHOT)
   ============================================================================ */
interface AgendaCatalogViewProps {
  programs: Program[];
  registrations: Registration[];
  onViewDetail: (program: Program) => void;
  onRegisterClick: (program: Program) => void;
  onBackHome?: () => void;
  isInsidePortal?: boolean;
}

export const AgendaCatalogView: React.FC<AgendaCatalogViewProps> = ({
  programs,
  registrations,
  onViewDetail,
  onRegisterClick,
  onBackHome,
  isInsidePortal = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Program');
  const [selectedLocation, setSelectedLocation] = useState<string>('Semua Lokasi');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');

  const categories = [
    'Semua Program',
    'Uji Kompetensi Perpajakan',
    'Brevet Pajak',
    'Bimbel USKP',
    'Seminar',
    'Workshop',
    'Sertifikasi',
    'Pelatihan Teknis',
    'Program Lainnya',
  ];

  const locations = ['Semua Lokasi', 'Online', 'Jakarta', 'Bandung', 'Surabaya'];
  const statuses = ['Semua Status', 'Sedang Dibuka', 'Segera Dibuka', 'Penuh', 'Selesai'];

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (!p.published) return false;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.syllabus.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat =
        selectedCategory === 'Semua Program' ||
        p.category === selectedCategory ||
        (selectedCategory === 'Sertifikasi' && p.category === 'Uji Kompetensi Perpajakan');
      const matchesLoc =
        selectedLocation === 'Semua Lokasi' || p.location === selectedLocation;
      const matchesStatus =
        selectedStatus === 'Semua Status' || p.status === selectedStatus;
      return matchesSearch && matchesCat && matchesLoc && matchesStatus;
    });
  }, [programs, searchQuery, selectedCategory, selectedLocation, selectedStatus]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('Semua Program');
    setSelectedLocation('Semua Lokasi');
    setSelectedStatus('Semua Status');
  };

  return (
    <div className={isInsidePortal ? 'space-y-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6'}>
      {/* Breadcrumb & Header matching KLC Agenda Sertifikasi */}
      <div>
        {!isInsidePortal ? (
          <div className="flex items-center gap-2 text-xs text-[#66757F] dark:text-slate-400 mb-2">
            <button onClick={onBackHome} className="hover:text-[#087A4B] cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-[#172026] dark:text-white font-semibold">Agenda Pelatihan</span>
          </div>
        ) : (
          <p className="text-xs font-bold text-[#087A4B] dark:text-[#38BDF8] tracking-wide mb-1">
            PESERTA
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white tracking-tight">
          Agenda Pelatihan & Sertifikasi
        </h1>
        <p className="text-sm text-[#66757F] dark:text-slate-400 mt-1">
          Temukan pelatihan yang sedang dibuka, akan datang, atau telah selesai. Gunakan filter program, lokasi, dan status untuk mempercepat pencarian.
        </p>
      </div>

      {/* Filter Pencarian Box (KLC Style) */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-sm font-bold text-[#172026] dark:text-white">
            Filter Pencarian Program
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#66757F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pelatihan, topik KUP, Coretax..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#66757F] dark:text-slate-300 mb-1.5">
              Program
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#66757F] dark:text-slate-300 mb-1.5">
              Lokasi
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#66757F] dark:text-slate-300 mb-1.5">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full px-4 py-2.5 text-xs font-bold rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] text-[#172026] dark:text-white hover:border-[#087A4B] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Agenda Cards List (KLC Horizontal Card Layout + Banner Thumbnail) */}
      {filteredPrograms.length === 0 ? (
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-12 text-center space-y-3">
          <p className="text-base font-bold text-[#172026] dark:text-white">
            Tidak ada agenda pelatihan yang sesuai dengan filter Anda.
          </p>
          <p className="text-xs text-[#66757F] dark:text-slate-400">
            Coba ubah kata kunci pencarian atau tekan tombol Reset untuk menampilkan seluruh program AKP2I.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-[#087A4B] text-white text-xs font-bold cursor-pointer"
          >
            Tampilkan Semua Program
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrograms.map((prog) => {
            const reg = registrations.find((r) => r.programId === prog.id);
            const isAvailable =
              prog.status === 'Sedang Dibuka' || prog.status === 'Segera Dibuka';

            return (
              <div
                key={prog.id}
                className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-5 sm:p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between transition-colors hover:border-[#087A4B]/60"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full">
                  <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 border border-[#D9E2DE] dark:border-[#243239] bg-[#0E1518]">
                    <ResilientImage
                      src={prog.bannerUrl}
                      alt={prog.title}
                      fallbackTitle={prog.shortTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {/* Unboxed clean metadata kicker matching KLC + anti-slop rules */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-[#087A4B] dark:text-[#38BDF8]">
                        {prog.category}
                      </span>
                      <span aria-hidden="true" className="text-[#66757F]">·</span>
                      <StatusLabel status={prog.status} />
                      <span aria-hidden="true" className="text-[#66757F]">·</span>
                      <span className="font-mono text-[#66757F] dark:text-slate-400">
                        {prog.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#172026] dark:text-white leading-snug">
                      {prog.title}
                    </h3>

                    <p className="text-xs text-[#66757F] dark:text-slate-300">
                      {prog.startDate} – {prog.endDate} · {prog.timeText} — {prog.method}
                    </p>

                    <div className="pt-2 border-t border-[#D9E2DE]/60 dark:border-[#243239] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#66757F] dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399]" />
                        {prog.locationDetail}
                      </span>
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Users className="w-3.5 h-3.5 text-[#087A4B] dark:text-[#34D399]" />
                        Kuota: {prog.enrolled}/{prog.quota} Peserta
                      </span>
                      <span className="font-mono font-bold text-[#172026] dark:text-[#F4C430] tabular-nums">
                        Biaya: {formatRupiah(prog.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons matching KLC screenshot */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-[#D9E2DE] dark:border-[#243239]">
                  <button
                    onClick={() => onViewDetail(prog)}
                    className="px-4 py-2.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] hover:border-[#087A4B] text-xs font-bold text-[#172026] dark:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {reg ? (
                    <button
                      onClick={() => onViewDetail(prog)}
                      className="px-4 py-2.5 rounded-lg bg-slate-200/70 dark:bg-[#1E293B] text-xs font-bold text-[#172026] dark:text-slate-300 whitespace-nowrap cursor-pointer"
                    >
                      Status: {reg.status}
                    </button>
                  ) : isAvailable ? (
                    <button
                      onClick={() => onRegisterClick(prog)}
                      className="px-4 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>Daftar Sekarang</span>
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs font-semibold text-[#66757F] whitespace-nowrap">
                      {prog.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   DETAIL PELATIHAN VIEW
   ============================================================================ */
interface ProgramDetailViewProps {
  program: Program;
  existingRegistration?: Registration;
  onBack: () => void;
  onRegisterClick: (program: Program) => void;
  onOpenLmsCourse: (program: Program) => void;
}

export const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({
  program,
  existingRegistration,
  onBack,
  onRegisterClick,
  onOpenLmsCourse,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'materi' | 'jadwal' | 'fasilitas' | 'persyaratan' | 'faq'
  >('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#66757F] dark:text-slate-400">
          <button onClick={onBack} className="hover:text-[#087A4B] font-semibold cursor-pointer">
            ← Kembali ke Agenda Pelatihan
          </button>
          <span>/</span>
          <span>{program.category}</span>
          <span>/</span>
          <span className="text-[#172026] dark:text-white font-semibold truncate max-w-[240px]">
            {program.shortTitle}
          </span>
        </div>
      </div>

      {/* Course Header Banner Card */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 bg-[#0E1518] relative min-h-[260px]">
          <ResilientImage
            src={program.bannerUrl}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#087A4B] dark:text-[#34D399]">
                {program.category}
              </span>
              <span>·</span>
              <StatusLabel status={program.status} />
              <span>·</span>
              <span className="font-mono text-[#66757F]">Kode: {program.code}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white leading-tight">
              {program.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#66757F] dark:text-slate-300">
              Pengajar Utama: <strong className="text-[#172026] dark:text-white">{program.instructorName}</strong> ({program.instructorTitle})
            </p>

            {/* Key Course Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D9E2DE] dark:border-[#243239] text-xs">
              <div>
                <span className="text-[#66757F] block">Tanggal Pelaksanaan</span>
                <strong className="text-[#172026] dark:text-white tabular-nums">
                  {program.startDate} – {program.endDate}
                </strong>
              </div>
              <div>
                <span className="text-[#66757F] block">Waktu & Durasi</span>
                <strong className="text-[#172026] dark:text-white">{program.durationText}</strong>
              </div>
              <div>
                <span className="text-[#66757F] block">Metode & Lokasi</span>
                <strong className="text-[#172026] dark:text-white">{program.locationDetail}</strong>
              </div>
            </div>
          </div>

          {/* Price & Primary CTA Bar */}
          <div className="pt-5 border-t border-[#D9E2DE] dark:border-[#243239] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66757F] block">Biaya Investasi Program</span>
              <span className="text-2xl font-mono font-extrabold text-[#087A4B] dark:text-[#F4C430] tabular-nums">
                {formatRupiah(program.price)}
              </span>
              <span className="text-xs text-[#66757F] ml-2 tabular-nums">
                ({program.enrolled}/{program.quota} Peserta Terdaftar)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {existingRegistration ? (
                <>
                  <button
                    onClick={() => onOpenLmsCourse(program)}
                    className="px-5 py-3 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Masuk Kelas / Materi LMS</span>
                  </button>
                </>
              ) : program.status === 'Sedang Dibuka' || program.status === 'Segera Dibuka' ? (
                <button
                  onClick={() => onRegisterClick(program)}
                  className="px-6 py-3 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-sm font-extrabold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-bold text-[#66757F]">
                  Pendaftaran {program.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tiers Table for UKP A, B, C if applicable */}
      {program.subTiers && program.subTiers.length > 0 && (
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-4">
          <h2 className="text-base font-bold text-[#172026] dark:text-white">
            Pilihan Jenjang Tingkat Uji Kompetensi Perpajakan (UKP)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {program.subTiers.map((tier) => (
              <div
                key={tier.id}
                className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] flex flex-col justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-[#172026] dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-[#66757F] dark:text-slate-400 mt-1">
                    Jadwal: {tier.scheduleText}
                  </p>
                  <p className="text-xs text-[#66757F] dark:text-slate-400 mt-0.5 tabular-nums">
                    Kuota Terisi: {tier.enrolled}/{tier.quota} Peserta
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D9E2DE] dark:border-[#243239] flex items-center justify-between">
                  <span className="text-sm font-mono font-extrabold text-[#087A4B] dark:text-[#F4C430] tabular-nums">
                    {formatRupiah(tier.price)}
                  </span>
                  <button
                    onClick={() => onRegisterClick(program)}
                    className="px-3 py-1.5 rounded-md bg-[#087A4B] hover:bg-[#045A38] text-white text-xs font-bold cursor-pointer"
                  >
                    Pilih Jenjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Course Navigation Tabs */}
      <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] px-4">
          {[
            { id: 'overview', label: 'Overview Program' },
            { id: 'materi', label: 'Materi & Kurikulum' },
            { id: 'jadwal', label: 'Jadwal Pelaksanaan' },
            { id: 'fasilitas', label: 'Fasilitas Peserta' },
            { id: 'persyaratan', label: 'Persyaratan' },
            { id: 'faq', label: 'FAQ' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'border-[#087A4B] text-[#087A4B] dark:border-[#F4C430] dark:text-[#F4C430]'
                  : 'border-transparent text-[#66757F] hover:text-[#172026] dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-[#172026] dark:text-white">
                Deskripsi & Tujuan Pembelajaran
              </h3>
              <p className="text-sm text-[#66757F] dark:text-slate-300 leading-relaxed">
                {program.overview}
              </p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                  <span className="text-xs font-bold text-[#087A4B] dark:text-[#34D399] block mb-1">
                    Standar Kompetensi AKP2I
                  </span>
                  <p className="text-xs text-[#66757F] dark:text-slate-400">
                    Kurikulum diselaraskan dengan Kerangka Kualifikasi Nasional Indonesia (KKNI) bidang Perpajakan dan regulasi UU HPP serta PMK terbaru.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239]">
                  <span className="text-xs font-bold text-[#087A4B] dark:text-[#34D399] block mb-1">
                    Evaluasi & Sertifikasi Terintegrasi
                  </span>
                  <p className="text-xs text-[#66757F] dark:text-slate-400">
                    Setiap peserta akan mengikuti evaluasi akhir berbasis komputer (CBT) dan berhak atas Sertifikat Resmi ber-QR Code verifikasi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materi' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#172026] dark:text-white">
                Pokok Bahasan & Materi Pelatihan
              </h3>
              <div className="divide-y divide-[#D9E2DE] dark:divide-[#243239] border border-[#D9E2DE] dark:border-[#243239] rounded-lg">
                {program.syllabus.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-3.5">
                    <span className="font-mono text-xs font-bold text-[#087A4B] dark:text-[#F4C430] pt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="text-sm font-medium text-[#172026] dark:text-slate-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'jadwal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#172026] dark:text-white">
                Rincian Jadwal & Metode Pelaksanaan
              </h3>
              <div className="p-5 rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] space-y-2 text-sm">
                <p>
                  <strong>Periode Pelaksanaan:</strong> {program.startDate} s.d. {program.endDate}
                </p>
                <p>
                  <strong>Jam Sesi:</strong> {program.timeText}
                </p>
                <p>
                  <strong>Metode Pembelajaran:</strong> {program.method} ({program.locationDetail})
                </p>
                <p className="text-xs text-[#66757F] pt-2">
                  Tautan Zoom Meeting dan akses penuh modul LMS akan terbuka otomatis setelah pendaftaran Anda berstatus Terverifikasi.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fasilitas' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#172026] dark:text-white">
                Fasilitas yang Diperoleh Peserta
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.facilities.map((fac, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518] flex items-center gap-2.5 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#087A4B] dark:text-[#34D399] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'persyaratan' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#172026] dark:text-white">
                Persyaratan Administrasi & Teknis Peserta
              </h3>
              <ul className="space-y-2.5 text-sm text-[#172026] dark:text-slate-300">
                {program.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#087A4B] dark:text-[#F4C430] mt-0.5">
                      {i + 1}.
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#172026] dark:text-white">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h3>
              {program.faqs.length === 0 ? (
                <p className="text-sm text-[#66757F]">
                  Hubungi Sekretariat Pendidikan AKP2I melalui menu Bantuan untuk informasi lebih lanjut.
                </p>
              ) : (
                <div className="space-y-3">
                  {program.faqs.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-[#D9E2DE] dark:border-[#243239] bg-[#F6F8F7] dark:bg-[#0E1518]"
                    >
                      <h4 className="text-sm font-bold text-[#172026] dark:text-white mb-1">
                        {f.q}
                      </h4>
                      <p className="text-xs text-[#66757F] dark:text-slate-300 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   PUBLIC CERTIFICATE VERIFICATION VIEW
   ============================================================================ */
interface PublicCertificateVerifyViewProps {
  certificates: Certificate[];
  initialCertNumber?: string;
  onViewCertModal: (cert: Certificate) => void;
}

export const PublicCertificateVerifyView: React.FC<PublicCertificateVerifyViewProps> = ({
  certificates,
  initialCertNumber = '',
  onViewCertModal,
}) => {
  const [certInput, setCertInput] = useState(initialCertNumber || '');
  const [searchedCode, setSearchedCode] = useState(initialCertNumber || '');
  const [remoteCert, setRemoteCert] = useState<Certificate | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const localMatch = certificates.find(
    (c) => c.certificateNumber.toLowerCase() === searchedCode.trim().toLowerCase()
  );
  const matchedCert = localMatch || remoteCert;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = certInput.trim();
    if (!code) return;
    setSearchedCode(code);
    setRemoteCert(null);
    const inLocal = certificates.find(
      (c) => c.certificateNumber.toLowerCase() === code.toLowerCase()
    );
    if (!inLocal) {
      setIsSearching(true);
      try {
        const { getCertificateByCodeFromFirestore } = await import('../../firebase');
        const found = await getCertificateByCodeFromFirestore(code);
        setRemoteCert(found);
      } catch {
        setRemoteCert(null);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#087A4B] dark:text-[#34D399]">
          <ShieldCheck className="w-4 h-4" />
          <span>SISTEM VERIFIKASI SERTIFIKAT PUBLIK AKP2I</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172026] dark:text-white">
          Verifikasi Keaslian Sertifikat AKP2I
        </h1>
        <p className="text-sm text-[#66757F] dark:text-slate-400 max-w-xl mx-auto">
          Masukkan Nomor Sertifikat atau pindai QR Code yang tertera pada lembar sertifikat untuk memvalidasi data kelulusan peserta secara real-time.
        </p>
      </div>

      {/* Verification Input Box */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            placeholder="Contoh: SERT-AKP2I-2026-0891"
            className="flex-1 px-4 py-3 text-sm font-mono rounded-lg bg-[#F6F8F7] dark:bg-[#0E1518] border border-[#D9E2DE] dark:border-[#243239] text-[#172026] dark:text-white focus:outline-none focus:border-[#087A4B]"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#087A4B] hover:bg-[#045A38] text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>Verifikasi Sekarang</span>
          </button>
        </div>

        {/* Quick Sample Certificates (only shown if certificates exist) */}
        {certificates.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#66757F]">
            <span>Sertifikat Terbit Terbaru:</span>
            {certificates.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCertInput(c.certificateNumber);
                  setSearchedCode(c.certificateNumber);
                }}
                className="font-mono font-semibold text-[#087A4B] dark:text-[#F4C430] hover:underline cursor-pointer"
              >
                {c.certificateNumber}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Verification Result Card */}
      {isSearching && (
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-8 text-center text-xs font-bold text-[#66757F]">
          Memverifikasi keaslian sertifikat pada database pusat AKP2I...
        </div>
      )}

      {!isSearching && searchedCode && (
        <div className="rounded-xl border border-[#D9E2DE] dark:border-[#243239] bg-white dark:bg-[#151F24] p-6 sm:p-8">
          {matchedCert ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D9E2DE] dark:border-[#243239]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#EAF7F0] dark:bg-[#087A4B]/20 text-[#087A4B] dark:text-[#34D399] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#087A4B] dark:text-[#34D399]">
                      SERTIFIKAT TERVERIFIKASI & VALID
                    </span>
                    <h3 className="text-lg font-extrabold text-[#172026] dark:text-white font-mono">
                      {matchedCert.certificateNumber}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => onViewCertModal(matchedCert)}
                  className="px-4 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#e5b625] text-[#172026] text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  Lihat Salinan Sertifikat Resmi
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-[#66757F] block">Nama Pemegang Sertifikat</span>
                  <strong className="text-base text-[#172026] dark:text-white">
                    {matchedCert.participantName}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-[#66757F] block">Status Sertifikat</span>
                  <StatusLabel status={matchedCert.status} />
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-[#66757F] block">Nama Program Pelatihan / Ujian</span>
                  <strong className="text-[#172026] dark:text-white">
                    {matchedCert.programTitle}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-[#66757F] block">Tanggal Diterbitkan</span>
                  <strong className="text-[#172026] dark:text-white">{matchedCert.issueDate}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#66757F] block">Masa Berlaku</span>
                  <strong className="text-[#172026] dark:text-white">{matchedCert.expiryDate}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#66757F] block">Predikat Kelulusan</span>
                  <strong className="text-[#087A4B] dark:text-[#34D399]">{matchedCert.predicate}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#66757F] block">Diterbitkan & Disahkan Oleh</span>
                  <strong className="text-[#172026] dark:text-white">
                    {matchedCert.signatoryName} (DPP AKP2I)
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <p className="text-base font-bold text-red-600 dark:text-red-400">
                Nomor Sertifikat "{searchedCode}" Tidak Ditemukan
              </p>
              <p className="text-xs text-[#66757F] dark:text-slate-400">
                Pastikan penulisan nomor sertifikat sudah benar sesuai dokumen asli yang diterbitkan oleh AKP2I.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
