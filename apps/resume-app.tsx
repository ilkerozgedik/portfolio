import { Briefcase, GraduationCap, Mail } from "lucide-react";
import type React from "react";

const ResumeApp: React.FC = () => (
  <div className="h-full overflow-y-auto rounded-xl bg-card/60 p-4 text-card-foreground sm:p-6">
    <div className="mb-6 border-border border-b pb-6 text-center">
      <h1 className="mb-2 font-bold text-[clamp(2rem,4vw,2.75rem)] text-foreground">
        İLKER ÖZGEDİK
      </h1>
      <p className="mb-4 text-base text-primary sm:text-lg">
        Elektrik Elektronik Mühendisi
      </p>
      <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>ilkerozgedik@gmail.com</span>
        </div>
      </div>
    </div>

    <div className="space-y-8">
      <section>
        <h2 className="mb-4 flex items-center gap-3 font-semibold text-primary text-xl">
          <Briefcase size={24} />
          Deneyim
        </h2>
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/10 bg-background/40 p-4 shadow-black/10 shadow-sm">
            <h3 className="font-semibold text-foreground text-lg">
              Freelance Yazılımcı
            </h3>
            <p className="mb-2 text-muted-foreground text-xs uppercase tracking-wide">
              2023 – Günümüz
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm leading-relaxed">
              <li>Next.js ile full-stack web uygulamaları geliştirdim.</li>
              <li>
                CI/CD süreçleri ve bulut ortamlarında deployment görevlerinde
                bulundum.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-primary/10 bg-background/40 p-4 shadow-black/10 shadow-sm">
            <h3 className="font-semibold text-foreground text-lg">
              Elektrik Elektronik Mühendisi Stajyeri
            </h3>
            <p className="text-muted-foreground text-sm">
              Şef Sarım San. ve Tic. Ltd. Şti.
            </p>
            <p className="mb-2 text-muted-foreground text-xs uppercase tracking-wide">
              Balıkesir | 2021 – 2022
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm leading-relaxed">
              <li>
                Elektrik motorları testleri (İzolasyon, Direnç, Hipot-Surge,
                Isı, Mekanik).
              </li>
              <li>Test sonuçlarının kaydedilmesi ve raporlanması.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-3 font-semibold text-primary text-xl">
          <GraduationCap size={24} />
          Eğitim
        </h2>
        <div className="rounded-xl border border-primary/10 bg-background/40 p-4 shadow-black/10 shadow-sm">
          <h3 className="font-semibold text-foreground text-lg">
            Gazi Üniversitesi
          </h3>
          <p className="text-muted-foreground text-sm">
            Elektrik Elektronik Mühendisliği
          </p>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            2016 – 2023
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default ResumeApp;
