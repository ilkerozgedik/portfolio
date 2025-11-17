import { Folder, Power, Settings, User as UserIcon } from "lucide-react";
import type React from "react";
import { APPS, DESKTOP_APPS } from "../constants";
import { useBSOD } from "../contexts/bsod-context";

type StartMenuProps = {
  onClose: () => void;
  onAppClick: (appId: string) => void;
  isMobile?: boolean;
};

const StartMenu: React.FC<StartMenuProps> = ({
  onClose,
  onAppClick,
  isMobile = false,
}) => {
  const { showBSOD } = useBSOD();

  const handleSystemAction = (action: string) => {
    // Handle system actions here
    console.log(`System action: ${action}`);

    if (action === "shutdown") {
      showBSOD();
    }

    onClose();
  };

  return (
    <div
      className={`${isMobile ? "fixed inset-x-3 bottom-24 z-50 max-h-[65vh] overflow-y-auto rounded-3xl p-4 shadow-2xl" : "absolute bottom-14 left-0 z-50 w-72 rounded-lg p-2 shadow-2xl"} border border-border/20 bg-gradient-to-br from-card/95 to-card/80 ring-1 ring-primary/10 backdrop-blur-xl`}
      style={{
        animation: "fadeInUp 0.2s ease-out",
      }}
    >
      <style>
        {`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            `}
      </style>
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="border-border/10 border-b px-2 py-1 font-semibold text-primary text-sm">
            Uygulamalar
          </h3>
          <div
            className={`grid gap-2 ${isMobile ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {APPS.filter((app) => !DESKTOP_APPS.includes(app.id)).map((app) => {
              const Icon = app.icon;
              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-xl border border-transparent bg-card/40 p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted/30 ${isMobile ? "min-h-[4.5rem]" : ""}`}
                  key={app.id}
                  onClick={() => {
                    onAppClick(app.id);
                    onClose();
                  }}
                  type="button"
                >
                  <Icon className="h-6 w-6 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {app.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="border-border/10 border-b px-2 py-1 font-semibold text-primary text-sm">
            Sistem
          </h3>
          <div
            className={`grid gap-2 ${isMobile ? "grid-cols-2" : "grid-cols-1"}`}
          >
            <button
              className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-card/40 p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted/30"
              onClick={() => handleSystemAction("settings")}
              type="button"
            >
              <Settings className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-foreground">Ayarlar</span>
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-card/40 p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted/30"
              onClick={() => handleSystemAction("files")}
              type="button"
            >
              <Folder className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-foreground">Dosyalar</span>
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-card/40 p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted/30"
              onClick={() => handleSystemAction("profile")}
              type="button"
            >
              <UserIcon className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-foreground">Profil</span>
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-destructive/10 p-3 text-left text-destructive transition-all duration-200 hover:bg-destructive/20"
              onClick={() => handleSystemAction("shutdown")}
              type="button"
            >
              <Power className="h-6 w-6 text-destructive" />
              <span className="font-medium text-destructive">Kapat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
