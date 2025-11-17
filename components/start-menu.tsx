import { Folder, Power, Settings, User as UserIcon } from "lucide-react";
import type React from "react";
import { APPS, DESKTOP_APPS } from "../constants";
import { useBSOD } from "../contexts/bsod-context";

type StartMenuProps = {
  onClose: () => void;
  onAppClick: (appId: string) => void;
};

const StartMenu: React.FC<StartMenuProps> = ({ onClose, onAppClick }) => {
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
      className="absolute bottom-14 left-0 z-50 w-72 rounded-lg border border-border/20 bg-gradient-to-br from-card/95 to-card/80 p-2 shadow-2xl ring-1 ring-primary/10 backdrop-blur-lg"
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
      <div className="flex flex-col gap-1">
        <div>
          <h3 className="border-border/10 border-b px-2 py-1 font-semibold text-primary text-sm">
            Uygulamalar
          </h3>
          {APPS.filter((app) => !DESKTOP_APPS.includes(app.id)).map((app) => {
            const Icon = app.icon;
            return (
              <button
                className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-all duration-200 hover:bg-muted/30 hover:text-muted-foreground"
                key={app.id}
                onClick={() => {
                  onAppClick(app.id);
                  onClose();
                }}
                type="button"
              >
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium text-foreground">{app.title}</span>
              </button>
            );
          })}
        </div>
        <div>
          <h3 className="border-border/10 border-b px-2 py-1 font-semibold text-primary text-sm">
            Sistem
          </h3>
          <button
            className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-all duration-200 hover:bg-muted/30 hover:text-muted-foreground"
            onClick={() => handleSystemAction("settings")}
            type="button"
          >
            <Settings className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium text-foreground">Ayarlar</span>
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-all duration-200 hover:bg-muted/30 hover:text-muted-foreground"
            onClick={() => handleSystemAction("files")}
            type="button"
          >
            <Folder className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium text-foreground">Dosyalar</span>
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-all duration-200 hover:bg-muted/30 hover:text-muted-foreground"
            onClick={() => handleSystemAction("profile")}
            type="button"
          >
            <UserIcon className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium text-foreground">Profil</span>
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => handleSystemAction("shutdown")}
            type="button"
          >
            <Power className="h-6 w-6 text-destructive" />
            <span className="font-medium text-destructive">Kapat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
