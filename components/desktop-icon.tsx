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
    className="flex w-64 cursor-pointer flex-col items-center gap-1 rounded-md p-2 backdrop-blur-sm transition-all duration-200 hover:bg-muted/30 hover:text-muted-foreground"
    onClick={onClick}
    type="button"
  >
    <Icon className="h-24 w-24 text-primary-foreground drop-shadow-lg" />
    <span className="w-full truncate text-center text-foreground text-sm drop-shadow-lg">
      {label}
    </span>
  </button>
);

export default DesktopIcon;
