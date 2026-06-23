import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'h-8 w-8 rounded-[0.6rem]',
  md: 'h-12 w-12 rounded-2xl',
  lg: 'h-16 w-16 rounded-[1.25rem]',
};

export function BrandMark({ className, size = 'md' }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative shrink-0 transition-transform duration-300 hover:scale-105',
        sizeClass[size],
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(500px) rotateX(15deg) rotateY(-15deg) rotateZ(5deg)',
      }}
    >
      <div 
        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-indigo-500 to-violet-600 ring-1 ring-white/20"
        style={{
          borderRadius: 'inherit',
          boxShadow: `
            2px 2px 0 #4c1d95,
            4px 4px 0 #4c1d95,
            6px 6px 0 #4c1d95,
            8px 8px 0 #2e1065,
            12px 12px 20px rgba(0,0,0,0.4),
            inset 0 2px 4px rgba(255,255,255,0.3)
          `,
          transform: 'translateZ(10px)',
        }}
      >
        <span 
          className={cn("font-black tracking-tighter text-white", {
            'text-sm': size === 'sm',
            'text-3xl': size === 'md',
            'text-4xl': size === 'lg',
          })}
          style={{
            textShadow: '1px 1px 0px #312e81, 2px 2px 0px #312e81, 3px 3px 4px rgba(0,0,0,0.5)',
            transform: 'translateZ(20px)',
          }}
        >
          P
        </span>
      </div>
    </div>
  );
}
