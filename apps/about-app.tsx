import { Mail, Zap } from "lucide-react";
import type React from "react";

const AboutApp: React.FC = () => {
  const bio =
    "Elektrik Elektronik Mühendisi olarak hem yazılım geliştirme hem de elektrik motorları testlerinde deneyim sahibiyim. Full-stack geliştirme, test otomasyonu ve DevOps alanlarında projeler yürütürken; elektrik motorlarında izolasyon, direnç, hipot-surge, ısı ve mekanik testlerinde de aktif görev aldım.";

  return (
    <div className="h-full rounded-xl bg-card/60 p-4 text-card-foreground shadow-black/5 shadow-inner sm:p-6">
      <div className="mb-6 border-border border-b pb-4 text-center">
        <h1 className="mb-3 font-bold text-[clamp(1.5rem,3vw,2.25rem)] text-primary">
          Hakkımda
        </h1>
        <h2 className="font-semibold text-foreground text-lg uppercase tracking-wide">
          İLKER ÖZGEDİK
        </h2>
        <div className="mt-2 space-y-1 text-muted-foreground text-sm">
          <span className="flex flex-wrap items-center justify-center gap-2">
            <Zap size={14} /> Elektrik Elektronik Mühendisi
          </span>
          <span className="flex flex-wrap items-center justify-center gap-2">
            <Mail size={14} /> ilkerozgedik@gmail.com
          </span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <img
            alt="My Avatar"
            className="mx-auto h-24 w-24 flex-shrink-0 rounded-full border-2 border-primary object-cover shadow-lg shadow-primary/20 sm:h-28 sm:w-28 md:mx-0 md:h-32 md:w-32"
            height={96}
            src="https://picsum.photos/seed/avatar/150/150"
            width={96}
          />
          <div className="flex-grow">
            <p className="whitespace-pre-wrap text-sm leading-relaxed md:text-base">
              {bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
