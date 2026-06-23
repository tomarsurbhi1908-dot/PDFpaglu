import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'h-8 w-8 rounded-[0.6rem]',
  md: 'h-10 w-10 rounded-2xl',
  lg: 'h-12 w-12 rounded-[1.25rem]',
};

export function BrandMark({ className, size = 'md' }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-glow ring-1 ring-indigo-500/20',
        sizeClass[size],
        className
      )}
    >
      <span className={cn("font-black tracking-tighter", {
        'text-sm': size === 'sm',
        'text-xl': size === 'md',
        'text-2xl': size === 'lg',
      })}>
        P
      </span>
    </div>
  );
}
