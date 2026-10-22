import React from 'react';

interface RankIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// 1. Shared Styling Logic
// 'font-black' gives that thick, gaming look.
// 'border-t border-white/20' adds a subtle 3D lighting effect at the top.
const baseStyles = "flex items-center justify-center font-black rounded-xl shadow-lg border-t border-white/20 select-none transition-transform hover:scale-105 duration-200";

const sizes = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-xl",
  lg: "w-16 h-16 text-2xl",
  xl: "w-24 h-24 text-4xl",
};

// 2. Individual Rank Components

export const RankS = ({ size = 'md', className = "" }: RankIconProps) => (
  <div className={`
    ${baseStyles} ${sizes[size]} ${className}
    bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-orange-500/40
  `}>
    S
  </div>
);

export const RankA = ({ size = 'md', className = "" }: RankIconProps) => (
  <div className={`
    ${baseStyles} ${sizes[size]} ${className}
	bg-gradient-to-br from-pink-400 to-purple-600 text-white shadow-violet-500/40 ring-2 ring-purple-400/30
  `}>
    A
  </div>
);

export const RankB = ({ size = 'md', className = "" }: RankIconProps) => (
  <div className={`
    ${baseStyles} ${sizes[size]} ${className}
    bg-gradient-to-br from-indigo-400 to-blue-500 text-white shadow-blue-500/40
  `}>
    B
  </div>
);

export const RankC = ({ size = 'md', className = "" }: RankIconProps) => (
  <div className={`
    ${baseStyles} ${sizes[size]} ${className}
    bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-500/40
  `}>
    C
  </div>
);

// 3. Helper Component (Dynamic)
// Dynamically renders the appropriate rank icon based on the rank string
export const RankBadge = ({ rank, size = 'md' }: { rank: string, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  switch (rank.toUpperCase()) {
    case 'S': return <RankS size={size} />;
    case 'A': return <RankA size={size} />;
    case 'B': return <RankB size={size} />;
    case 'C': return <RankC size={size} />;
    default: return <div className={`${baseStyles} ${sizes[size]} bg-slate-200 text-slate-400`}>?</div>;
  }
};