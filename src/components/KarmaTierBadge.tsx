import React from 'react';
import { Crown, ShieldCheck, Zap, Sparkles, Award, Flame } from 'lucide-react';
import { getKarmaTier, KarmaTierName } from '../utils/karmaTier';

interface KarmaTierBadgeProps {
  karmaPoints?: number;
  tierName?: KarmaTierName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const KarmaTierBadge: React.FC<KarmaTierBadgeProps> = ({
  karmaPoints,
  tierName,
  size = 'xs',
  showIcon = true,
  className = '',
}) => {
  const tier = tierName ? getKarmaTier(tierName === 'Legend' ? 5000 : tierName === 'Grandmaster' ? 3000 : tierName === 'Archon' ? 1500 : tierName === 'Insider' ? 750 : tierName === 'Scout' ? 350 : 100) : getKarmaTier(karmaPoints ?? 0);

  const renderIcon = () => {
    if (!showIcon) return null;

    const iconSizeClass = size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4';

    switch (tier.name) {
      case 'Legend':
        return <Crown className={`${iconSizeClass} text-yellow-300 fill-yellow-400/20 shrink-0`} />;
      case 'Grandmaster':
        return <Flame className={`${iconSizeClass} text-purple-300 shrink-0`} />;
      case 'Archon':
        return <ShieldCheck className={`${iconSizeClass} text-emerald-300 shrink-0`} />;
      case 'Insider':
        return <Award className={`${iconSizeClass} text-amber-300 shrink-0`} />;
      case 'Scout':
        return <Zap className={`${iconSizeClass} text-cyan-300 shrink-0`} />;
      case 'Novice':
      default:
        return <Sparkles className={`${iconSizeClass} text-zinc-400 shrink-0`} />;
    }
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] tracking-wide gap-1',
    sm: 'px-2 py-0.5 text-[11px] tracking-wide gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono uppercase border transition-all ${tier.badgeClass} ${sizeClasses} ${className}`}
      title={`${tier.name} Tier: ${tier.description}`}
    >
      {renderIcon()}
      <span>{tier.name}</span>
    </span>
  );
};
