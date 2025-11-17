import type React from "react";

type DesktopIconProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
};

const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    className="group flex min-w-[4.5rem] max-w-[9rem] flex-col items-center gap-2 rounded-xl p-3 text-foreground/90 transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 sm:min-w-[5.5rem]"
    onClick={onClick}
    type="button"
  >
    <Icon className="text-primary-foreground drop-shadow-xl transition-transform duration-200 [height:clamp(3.5rem,8vw,5rem)] [width:clamp(3.5rem,8vw,5rem)] group-hover:scale-105" />
    <span className="w-full truncate text-center font-medium text-[clamp(0.75rem,2vw,0.95rem)] tracking-tight drop-shadow-lg">
      {label}
    </span>
  </button>
);

export default DesktopIcon;
