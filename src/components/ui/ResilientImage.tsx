import React, { useState } from 'react';
import { ShieldCheck, BookOpen, Award } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#045A38] via-[#087A4B] to-[#0E1518] text-white p-6 text-center select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6 text-[#F4C430]" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-[#EAF7F0] line-clamp-2 max-w-[220px]">
          {fallbackTitle || alt || 'Program Pendidikan Resmi AKP2I'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};

export const Akp2iLogoMark: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <span className="inline-flex items-center gap-2.5 font-extrabold tracking-tight text-[#172026] dark:text-white select-none">
      <span className="w-8 h-8 rounded-lg bg-[#087A4B] text-white inline-flex items-center justify-center font-mono text-xs font-bold border border-[#0B8F5A] shadow-xs shrink-0">
        AKP2I
      </span>
      {!compact && (
        <span className="text-base sm:text-lg font-extrabold tracking-tight whitespace-nowrap">
          AKP2I Learning Center
        </span>
      )}
    </span>
  );
};

export const QrCodeMatrixSvg: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 112,
}) => {
  // Deterministic visual QR matrix based on value string
  const seed = value.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  const cells = 11;
  const isCorner = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cells} ${cells}`}
      className="bg-white p-2 rounded-lg border border-[#D9E2DE]"
      aria-label={`QR Code ${value}`}
    >
      {Array.from({ length: cells }).map((_, r) =>
        Array.from({ length: cells }).map((__, c) => {
          const filled =
            isCorner(r, c) || ((seed + r * 17 + c * 31 + r * c) % 3 === 0 && !(r === 5 && c === 5));
          return filled ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={0.92} height={0.92} fill="#0E1518" rx={0.12} />
          ) : null;
        })
      )}
      <rect x={4.5} y={4.5} width={2} height={2} fill="#087A4B" rx={0.3} />
    </svg>
  );
};

export const formatRupiah = (amount: number, allowFreeText = false): string => {
  if (amount === 0 || !amount || Number.isNaN(amount)) {
    return allowFreeText ? 'Gratis' : 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const StatusLabel: React.FC<{
  status: string;
  variant?: 'green' | 'yellow' | 'blue' | 'red' | 'gray';
}> = ({ status, variant }) => {
  let resolved = variant;
  if (!resolved) {
    const s = status.toLowerCase();
    if (
      s.includes('terverifikasi') ||
      s.includes('lulus') ||
      s.includes('dibuka') ||
      s.includes('terdaftar') ||
      s.includes('valid') ||
      s.includes('aktif')
    ) {
      resolved = 'green';
    } else if (
      s.includes('menunggu') ||
      s.includes('segera') ||
      s.includes('diproses') ||
      s.includes('belum')
    ) {
      resolved = 'yellow';
    } else if (s.includes('berlangsung') || s.includes('terjadwal')) {
      resolved = 'blue';
    } else if (s.includes('ditolak') || s.includes('dibatalkan') || s.includes('tidak lulus') || s.includes('penuh') || s.includes('dicabut')) {
      resolved = 'red';
    } else {
      resolved = 'gray';
    }
  }

  const colorClasses = {
    green: 'text-[#087A4B] dark:text-[#34D399]',
    yellow: 'text-[#B45309] dark:text-[#F4C430]',
    blue: 'text-[#0284C7] dark:text-[#38BDF8]',
    red: 'text-[#DC2626] dark:text-[#F87171]',
    gray: 'text-[#66757F] dark:text-[#94A3B8]',
  }[resolved];

  const dotClasses = {
    green: 'bg-[#087A4B] dark:bg-[#34D399]',
    yellow: 'bg-[#D97706] dark:bg-[#F4C430]',
    blue: 'bg-[#0284C7] dark:bg-[#38BDF8]',
    red: 'bg-[#DC2626] dark:bg-[#F87171]',
    gray: 'bg-[#66757F] dark:bg-[#94A3B8]',
  }[resolved];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses}`} />
      <span>{status}</span>
    </span>
  );
};
