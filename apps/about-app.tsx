import { Mail, Zap } from "lucide-react";
import type React from "react";

const AboutApp: React.FC = () => {
  const bio =
    "Elektrik Elektronik Mühendisi olarak hem yazılım geliştirme hem de elektrik motorları testlerinde deneyim sahibiyim. Full-stack geliştirme, test otomasyonu ve DevOps alanlarında projeler yürütürken; elektrik motorlarında izolasyon, direnç, hipot-surge, ısı ve mekanik testlerinde de aktif görev aldım.";

  return (
    <div className="h-full rounded-md bg-card/50 p-4 text-card-foreground">
      <div className="mb-6 border-border border-b pb-4 text-center">
        <h1 className="mb-4 font-bold text-2xl text-primary">Hakkımda</h1>
        <h2 className="font-bold text-foreground text-lg">İLKER ÖZGEDİK</h2>
        <div className="mt-2 space-y-1">
          <span className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Zap size={14} /> Elektrik Elektronik Mühendisi
          </span>
          <span className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Mail size={14} /> ilkerozgedik@gmail.com
          </span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            alt="My Avatar"
            className="h-24 w-24 flex-shrink-0 rounded-full border-2 border-primary object-cover shadow-lg shadow-primary/20 md:h-32 md:w-32"
            height={96}
            src="https://picsum.photos/seed/avatar/150/150"
            width={96}
          />
          <div className="flex-grow">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{bio}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutApp;
