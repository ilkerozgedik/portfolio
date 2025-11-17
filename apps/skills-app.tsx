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
  <div className="h-full overflow-y-auto rounded-md bg-card/50 p-6 text-card-foreground">
    <div className="mb-6 border-border border-b pb-6 text-center">
      <h1 className="mb-2 font-bold text-4xl text-foreground">YETENEKLER</h1>
      <p className="text-lg text-primary">
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
          <div className="border-primary/30 border-l-4 pl-6">
            <h3 className="mb-3 font-bold text-foreground text-lg">
              Teknik Yetenekler
            </h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <span
                  className="rounded-full bg-primary/10 px-3 py-1 font-mono text-primary text-sm"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
            <h3 className="mb-3 font-bold text-foreground text-lg">
              Kişisel Yetenekler
            </h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {personalSkills.map((skill) => (
                <span
                  className="rounded-full bg-primary/10 px-3 py-1 font-mono text-primary text-sm"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
            <h3 className="mb-3 font-bold text-foreground text-lg">Diller</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  className="rounded-full bg-secondary px-3 py-1 font-mono text-secondary-foreground text-sm"
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
