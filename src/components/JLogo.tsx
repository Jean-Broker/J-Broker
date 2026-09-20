import React from 'react';

interface JLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'mark' | 'inline' | 'hero';
}

/**
 * J BROKER ASSISTANT Luxury Gold Emblem Logo
 * Features a refined architectural geometric gold monogram "J"
 * in a luxury deep dark & gold aesthetic.
 */
export const JLogo: React.FC<JLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'mark'
}) => {
  const pixelSizes = {
    sm: 36,
    md: 46,
    lg: 72,
    xl: 96
  };

  const dim = pixelSizes[size] || 46;

  // Single mark monogram (Default)
  const renderMark = () => (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: `${dim}px`, height: `${dim}px` }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(227,162,60,0.35)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Luxury Gold Gradient */}
          <linearGradient id="luxuryGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf1c9" />
            <stop offset="35%" stopColor="#e3a23c" />
            <stop offset="70%" stopColor="#c58624" />
            <stop offset="100%" stopColor="#87570d" />
          </linearGradient>

          {/* Dark Metallic Inner Background */}
          <linearGradient id="innerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1a14" />
            <stop offset="100%" stopColor="#0d0b09" />
          </linearGradient>

          {/* Gold Glow Filter */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield / Hexagonal Diamond */}
        <polygon
          points="50,4 92,26 92,74 50,96 8,74 8,26"
          fill="url(#innerBgGrad)"
          stroke="url(#luxuryGoldGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Subtle Contour */}
        <polygon
          points="50,11 85,29 85,71 50,89 15,71 15,29"
          fill="none"
          stroke="url(#luxuryGoldGrad)"
          strokeWidth="0.8"
          strokeOpacity="0.45"
          strokeLinejoin="round"
        />

        {/* Centerpiece "J" Monogram */}
        {/* Top Horizontal Crown Accent */}
        <rect
          x="38"
          y="24"
          width="26"
          height="5.5"
          rx="1.5"
          fill="url(#luxuryGoldGrad)"
        />

        {/* Main Vertical Stem */}
        <rect
          x="54"
          y="26"
          width="7"
          height="38"
          rx="1"
          fill="url(#luxuryGoldGrad)"
        />

        {/* Smooth Lower Curve */}
        <path
          d="M 61 60
             C 61 74, 38 78, 32 70
             C 28 65, 31 59, 36 59
             C 41 59, 43 64, 40 67
             C 43 69, 51 68, 54 62
             L 54 60
             Z"
          fill="url(#luxuryGoldGrad)"
        />

        {/* Small Diamond Accent on top-right */}
        <polygon
          points="68,26 71,29 68,32 65,29"
          fill="url(#luxuryGoldGrad)"
        />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return renderMark();
  }

  // Inline with Text
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {renderMark()}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-wider text-white uppercase font-sans">
              J BROKER ASSISTANT
            </span>
            <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-[#e3a23c] text-black shadow-sm">
              INSTALLMENTS
            </span>
          </div>
          <span className="text-[11px] text-[#9c9284] font-medium hidden sm:inline">
            منظومة خطط السداد والمشروعات العقارية الفاخرة
          </span>
        </div>
      </div>
    );
  }

  // Hero Centered Branding
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-4 select-none ${className}`}>
      {renderMark()}
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider text-white uppercase font-sans">
            J BROKER ASSISTANT
          </h1>
          <span className="text-xs uppercase font-black tracking-widest px-3 py-1 rounded-full bg-[#e3a23c] text-black shadow-[0_0_15px_rgba(227,162,60,0.4)]">
            INSTALLMENTS
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#e3a23c] font-medium tracking-wide">
          المنظومة السحابية المعتمدة لحسابات الأقساط والمشروعات العقارية
        </p>
      </div>
    </div>
  );
};
