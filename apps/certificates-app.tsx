import { Star } from "lucide-react";
import type React from "react";

const CertificatesApp: React.FC = () => (
  <div className="h-full overflow-y-auto rounded-xl bg-card/60 p-4 text-card-foreground sm:p-6">
    <div className="mb-6 border-border border-b pb-6 text-center">
      <h1 className="mb-2 font-bold text-[clamp(2rem,4vw,2.75rem)] text-foreground">
        SERTİFİKALAR
      </h1>
      <p className="text-base text-primary sm:text-lg">
        İlker Özgedik - Profesyonel Sertifikalar
      </p>
    </div>

    <div className="space-y-8">
      <section>
        <h2 className="mb-4 flex items-center gap-3 font-semibold text-primary text-xl">
          <Star size={24} />
          Alınan Sertifikalar
        </h2>
        <div className="space-y-6">
          {[
            {
              title: "Dil Sertifikaları",
              items: [{ name: "İngilizce C1", org: "İngiliz Kültür" }],
            },
            {
              title: "Teknik Sertifikalar",
              items: [{ name: "PLC", org: "BELTEK" }],
            },
            {
              title: "Yazılım Sertifikaları",
              items: [
                { name: "Microsoft Excel", org: "BTK Akademi" },
                { name: "İleri Seviye Python", org: "BTK Akademi" },
              ],
            },
          ].map((section) => (
            <div
              className="rounded-2xl border border-primary/15 bg-background/50 p-4 shadow-black/5 shadow-inner"
              key={section.title}
            >
              <h3 className="mb-4 font-semibold text-foreground text-lg">
                {section.title}
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                {section.items.map((item) => (
                  <li
                    className="flex flex-col gap-1 rounded-xl bg-card/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                    key={item.name}
                  >
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-primary text-xs uppercase tracking-wide sm:text-sm">
                      {item.org}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default CertificatesApp;
