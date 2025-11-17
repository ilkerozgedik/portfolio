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
    className="flex w-full min-w-[5rem] max-w-[7rem] cursor-pointer flex-col items-center gap-1 rounded-md p-2 transition-all duration-200 hover:bg-muted/30 hover:text-muted-foreground sm:min-w-[6rem] sm:max-w-[9rem] lg:min-w-[7rem] lg:max-w-[10rem]"
    onClick={onClick}
    type="button"
  >
    <Icon className="h-16 w-16 text-primary-foreground drop-shadow-lg sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
    <span className="w-full truncate text-center text-foreground text-xs drop-shadow-lg sm:text-sm">
      {label}
    </span>
  </button>
);

export default DesktopIcon;
