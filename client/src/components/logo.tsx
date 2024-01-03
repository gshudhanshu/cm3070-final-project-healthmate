import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const Logo = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cn(
        'flex text-xl font-bold text-slate-800 dark:text-slate-100',
        className
      )}
    >
      <svg
        width='26'
        height='26'
        viewBox='0 0 26 26'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        className='text-primary'
      >
        <rect x='9' width='8' height='26' rx='3' />
        <rect y='9' width='26' height='8' rx='3' />
      </svg>

      <span className='ml-2 text-inherit'>Health Mate</span>
    </div>
  )
}

export default Logo
