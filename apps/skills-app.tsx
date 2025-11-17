import { Star } from "lucide-react";
import type React from "react";

const technicalSkills = [
  "Otomasyon",
  "Elektrik Motorları",
  "PLC Programlama",
  "SCADA Sistemleri",
  "Endüstriyel Otomasyon",
  "Elektrik Devre Tasarımı",
  "Yazılım",
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "CI/CD",
  "Bulut Bilişim",
  "Veri Analizi",
];

const personalSkills = [
  "Ekip Çalışması",
  "Analitik Düşünme",
  "Problem Çözme",
  "İletişim",
  "Zaman Yönetimi",
  "Liderlik",
  "Yaratıcılık",
  "Uyum Sağlama",
  "Motivasyon",
  "Öğrenmeye Açıklık",
];

const languages = ["Türkçe", "İngilizce"];

const SkillsApp: React.FC = () => (
  <div className="h-full overflow-y-auto rounded-xl bg-card/60 p-4 text-card-foreground sm:p-6">
    <div className="mb-6 border-border border-b pb-6 text-center">
      <h1 className="mb-2 font-bold text-[clamp(2rem,4vw,2.75rem)] text-foreground">
        YETENEKLER
      </h1>
      <p className="text-base text-primary sm:text-lg">
        İlker Özgedik - Profesyonel Yetenekler
      </p>
    </div>
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 flex items-center gap-3 font-semibold text-primary text-xl">
          <Star size={24} />
          Profesyonel Yetenekler
        </h2>
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/15 bg-background/50 p-4 shadow-black/5 shadow-inner">
            <h3 className="mb-3 font-semibold text-foreground text-lg">
              Teknik Yetenekler
            </h3>
            <div className="mb-5 flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <span
                  className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-wide sm:text-sm"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
            <h3 className="mb-3 font-semibold text-foreground text-lg">
              Kişisel Yetenekler
            </h3>
            <div className="mb-5 flex flex-wrap gap-2">
              {personalSkills.map((skill) => (
                <span
                  className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-wide sm:text-sm"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
            <h3 className="mb-3 font-semibold text-foreground text-lg">
              Diller
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  className="rounded-full bg-secondary px-3 py-1 font-semibold text-secondary-foreground text-xs uppercase tracking-wide sm:text-sm"
                  key={lang}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default SkillsApp;
