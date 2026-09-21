import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  inverted?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  inverted = false,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon recreation matching uploaded ILMHUB emblem */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md flex items-center justify-center p-1.5 flex-shrink-0 transition-transform duration-200 hover:scale-105`}
        style={{ backgroundColor: '#0D6EFD' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Arch */}
          <path
            d="M20 70 V46 C20 29.4315 33.4315 16 50 16 C66.5685 16 80 29.4315 80 46 V70"
            stroke="white"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Central Golden Diamond Star */}
          <path
            d="M50 33 L53.5 43.5 L64 47 L53.5 50.5 L50 61 L46.5 50.5 L36 47 L46.5 43.5 Z"
            fill="#FBBF24"
            className="filter drop-shadow-sm"
          />

          {/* Base Open Book */}
          <path
            d="M22 75 C32 75 42 78 50 82 C58 78 68 75 78 75 C82 75 82 82 78 82 C68 82 58 85 50 90 C42 85 32 82 22 82 C18 82 18 75 22 75 Z"
            fill="white"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight leading-none ${textSizes[size]} ${inverted ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
            <span className="text-blue-600 dark:text-blue-400">ILMHUB</span>{' '}
            <span>ENGLISH</span>
          </div>
          <div className={`font-semibold tracking-wider uppercase text-blue-500/90 dark:text-blue-400/90 mt-0.5 ${subtitleSizes[size]}`}>
            by KHUMOYUN
          </div>
        </div>
      )}
    </div>
  );
};
