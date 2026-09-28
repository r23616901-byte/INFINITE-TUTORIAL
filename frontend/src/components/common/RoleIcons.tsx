import React from 'react';

/**
 * High-definition 3D illustrated icons matching the exact role card designs:
 * 1. Parent: Graduate Scholar with mortarboard cap, gold tassel, and purple academic gown
 * 2. Teacher: Educator with blonde hair, glasses, red blazer, chalkboard & books
 * 3. Admin: 3D glossy blue security shield with silver metallic beveled border
 */

export const ParentRoleIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 72,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-md ${className}`}
  >
    <defs>
      <linearGradient id="parentSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
      <linearGradient id="parentCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#312E81" />
        <stop offset="100%" stopColor="#1E1B4B" />
      </linearGradient>
      <linearGradient id="parentRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4338CA" />
        <stop offset="50%" stopColor="#3730A3" />
        <stop offset="100%" stopColor="#312E81" />
      </linearGradient>
      <linearGradient id="goldTassel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    {/* Academic Gown / Robe */}
    <path
      d="M26 62 C34 54 66 54 74 62 L82 86 C82 90 78 92 72 92 L28 92 C22 92 18 90 18 86 Z"
      fill="url(#parentRobeGrad)"
    />
    {/* Robe Collar / Gold Trim */}
    <path
      d="M38 60 L50 78 L62 60 C58 66 42 66 38 60 Z"
      fill="url(#goldTassel)"
    />
    <path
      d="M45 74 L50 82 L55 74 L50 70 Z"
      fill="#F59E0B"
    />

    {/* Neck */}
    <rect x="44" y="47" width="12" height="12" rx="4" fill="url(#parentSkinGrad)" />

    {/* Head */}
    <ellipse cx="50" cy="38" rx="16" ry="17" fill="url(#parentSkinGrad)" />
    {/* Ears */}
    <circle cx="34" cy="39" r="4" fill="url(#parentSkinGrad)" />
    <circle cx="66" cy="39" r="4" fill="url(#parentSkinGrad)" />

    {/* Hair */}
    <path
      d="M36 32 C36 24 64 24 64 32 C60 30 40 30 36 32 Z"
      fill="#78350F"
    />

    {/* Eyes */}
    <ellipse cx="44" cy="38" rx="2" ry="2.8" fill="#1E293B" />
    <ellipse cx="56" cy="38" rx="2" ry="2.8" fill="#1E293B" />
    <circle cx="44.8" cy="37.2" r="0.8" fill="#FFFFFF" />
    <circle cx="56.8" cy="37.2" r="0.8" fill="#FFFFFF" />

    {/* Cheeks */}
    <circle cx="40" cy="42" r="2.5" fill="#F43F5E" opacity="0.3" />
    <circle cx="60" cy="42" r="2.5" fill="#F43F5E" opacity="0.3" />

    {/* Friendly Smile */}
    <path
      d="M45 43 Q50 48 55 43"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Mortarboard Cap Skull-cap Base */}
    <ellipse cx="50" cy="24" rx="15" ry="6" fill="#1E1B4B" />

    {/* Mortarboard Diamond Top */}
    <polygon
      points="50,11 76,20 50,29 24,20"
      fill="url(#parentCapGrad)"
      stroke="#4338CA"
      strokeWidth="1.2"
    />

    {/* Cap Button */}
    <circle cx="50" cy="20" r="2.5" fill="#F59E0B" />

    {/* Tassel cord & fringed tassel */}
    <path
      d="M50 20 Q65 21 68 31"
      stroke="url(#goldTassel)"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="65" y="31" width="6" height="9" rx="2" fill="url(#goldTassel)" />
    <circle cx="68" cy="31" r="2" fill="#D97706" />
  </svg>
);

export const TeacherRoleIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 72,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-md ${className}`}
  >
    <defs>
      <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E6548" />
        <stop offset="100%" stopColor="#144632" />
      </linearGradient>
      <linearGradient id="blazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="teacherSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEDD5" />
        <stop offset="100%" stopColor="#FED7AA" />
      </linearGradient>
    </defs>

    {/* Green Chalkboard Background */}
    <rect x="18" y="14" width="64" height="42" rx="5" fill="#A16207" />
    <rect x="21" y="17" width="58" height="36" rx="3" fill="url(#boardGrad)" />
    {/* Chalk equations on board */}
    <path
      d="M24 23 L28 29 M28 23 L24 29 M32 26 H36"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />
    <circle cx="73" cy="24" r="2.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />

    {/* Teacher Torso / Blazer */}
    <path
      d="M28 66 C35 58 65 58 72 66 L78 92 C78 94 74 96 68 96 L32 96 C26 96 22 94 22 92 Z"
      fill="url(#blazerGrad)"
    />

    {/* White Blouse V-neck */}
    <polygon points="50,56 43,72 57,72" fill="#FFFFFF" />

    {/* Neck */}
    <rect x="44" y="48" width="12" height="10" rx="3" fill="url(#teacherSkin)" />

    {/* Hair Back */}
    <path
      d="M32 36 C30 52 40 58 40 58 L60 58 C60 58 70 52 68 36 Z"
      fill="url(#hairGrad)"
    />

    {/* Head */}
    <ellipse cx="50" cy="38" rx="15" ry="16" fill="url(#teacherSkin)" />
    {/* Ears */}
    <circle cx="35" cy="39" r="3.5" fill="url(#teacherSkin)" />
    <circle cx="65" cy="39" r="3.5" fill="url(#teacherSkin)" />

    {/* Blonde Hair Front & Waves */}
    <path
      d="M34 32 C34 20 66 20 66 32 C62 26 54 26 50 28 C46 26 38 26 34 32 Z"
      fill="url(#hairGrad)"
    />
    <path
      d="M34 32 C32 38 31 46 36 50 C36 44 38 38 40 34 Z"
      fill="url(#hairGrad)"
    />
    <path
      d="M66 32 C68 38 69 46 64 50 C64 44 62 38 60 34 Z"
      fill="url(#hairGrad)"
    />

    {/* Eyeglasses Frame */}
    <rect x="37" y="34" width="10" height="8" rx="2.5" stroke="#374151" strokeWidth="1.8" fill="none" />
    <rect x="53" y="34" width="10" height="8" rx="2.5" stroke="#374151" strokeWidth="1.8" fill="none" />
    <line x1="47" y1="38" x2="53" y2="38" stroke="#374151" strokeWidth="1.8" />

    {/* Eyes */}
    <circle cx="42" cy="38" r="1.8" fill="#1E293B" />
    <circle cx="58" cy="38" r="1.8" fill="#1E293B" />

    {/* Smile */}
    <path
      d="M45 45 Q50 50 55 45"
      stroke="#BE123C"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Books Stack being held */}
    <rect x="42" y="68" width="22" height="6" rx="1.5" fill="#8B5CF6" />
    <rect x="40" y="74" width="25" height="6" rx="1.5" fill="#F59E0B" />
    <rect x="41" y="80" width="24" height="6" rx="1.5" fill="#3B82F6" />
    {/* Book Pages edges */}
    <rect x="60" y="69" width="3" height="4" fill="#FFFFFF" opacity="0.8" />
    <rect x="61" y="75" width="3" height="4" fill="#FFFFFF" opacity="0.8" />
    <rect x="61" y="81" width="3" height="4" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

export const AdminRoleIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 72,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-md ${className}`}
  >
    <defs>
      {/* Silver Metallic Bevel Outer Gradient */}
      <linearGradient id="silverRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CBD5E1" />
        <stop offset="35%" stopColor="#F1F5F9" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>

      {/* Vibrant Glossy Blue Shield Core */}
      <linearGradient id="blueCore" x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="40%" stopColor="#0EA5E9" />
        <stop offset="75%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>

      {/* Top Gloss Highlight */}
      <linearGradient id="shieldGloss" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      {/* Shadow */}
      <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2563EB" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Outer Silver Beveled Shield Rim */}
    <path
      d="M50 10 C68 18 84 18 84 34 C84 60 58 78 50 88 C42 78 16 60 16 34 C16 18 32 18 50 10 Z"
      fill="url(#silverRim)"
      filter="url(#shieldShadow)"
    />

    {/* Inner Shield Rim Line */}
    <path
      d="M50 14 C66 21 79 21 79 35 C79 58 56 74 50 83 C44 74 21 58 21 35 C21 21 34 21 50 14 Z"
      fill="#64748B"
    />

    {/* Vibrant Blue Core */}
    <path
      d="M50 16 C64 23 76 23 76 36 C76 56 55 71 50 80 C45 71 24 56 24 36 C24 23 36 23 50 16 Z"
      fill="url(#blueCore)"
    />

    {/* 3D Glossy Light Curve on Top Half */}
    <path
      d="M50 18 C62 24 73 24 73 36 C73 48 60 58 50 62 C40 58 27 48 27 36 C27 24 38 24 50 18 Z"
      fill="url(#shieldGloss)"
    />

    {/* Center Subtle Emblem / Reflection */}
    <path
      d="M50 20 L50 78 C52 75 72 61 72 36 C72 25 61 24 50 20 Z"
      fill="#FFFFFF"
      fillOpacity="0.08"
    />
  </svg>
);
