import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const PlusBox = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-lg bg-primary p-4 text-xl font-bold text-slate-800 dark:text-slate-100",
        className,
      )}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <rect x="9" width="8" height="26" rx="2" />
        <rect y="9" width="26" height="8" rx="2" />
      </svg>
    </div>
  );
};

export default PlusBox;
