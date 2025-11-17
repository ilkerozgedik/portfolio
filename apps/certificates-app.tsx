import { Star } from "lucide-react";
import type React from "react";

const CertificatesApp: React.FC = () => (
  <div className="h-full overflow-y-auto rounded-md bg-card/50 p-6 text-card-foreground">
    <div className="mb-6 border-border border-b pb-6 text-center">
      <h1 className="mb-2 font-bold text-4xl text-foreground">SERTİFİKALAR</h1>
      <p className="text-lg text-primary">
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
          <div className="border-primary/30 border-l-4 pl-6">
            <h3 className="mb-4 font-bold text-foreground text-lg">
              Dil Sertifikaları
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>İngilizce C1</span>
                <span className="text-primary text-sm">İngiliz Kültür</span>
              </li>
            </ul>
          </div>

          <div className="border-primary/30 border-l-4 pl-6">
            <h3 className="mb-4 font-bold text-foreground text-lg">
              Teknik Sertifikalar
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>PLC</span>
                <span className="text-primary text-sm">BELTEK</span>
              </li>
            </ul>
          </div>

          <div className="border-primary/30 border-l-4 pl-6">
            <h3 className="mb-4 font-bold text-foreground text-lg">
              Yazılım Sertifikaları
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>Microsoft Excel</span>
                <span className="text-primary text-sm">BTK Akademi</span>
              </li>
              <li className="flex items-center justify-between">
                <span>İleri Seviye Python</span>
                <span className="text-primary text-sm">BTK Akademi</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default CertificatesApp;
