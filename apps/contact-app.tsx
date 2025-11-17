import { Copy, Github, Linkedin, Mail } from "lucide-react";
import type React from "react";
import { useState } from "react";

const ContactApp: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "E-posta",
      value: "ilkerozgedik@gmail.com",
      href: "mailto:ilkerozgedik@gmail.com",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/ilkerozgedik",
      href: "https://github.com/ilkerozgedik",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/ilkerozgedik",
      href: "https://linkedin.com/in/ilkerozgedik",
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl bg-background/80 p-4 font-mono text-card-foreground text-sm shadow-black/10 shadow-inner sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
        <span className="font-semibold text-primary">kullanici@portfolyo</span>
        <span>:</span>
        <span className="text-primary">~</span>
        <span>$</span>
        <span className="animate-pulse text-foreground">./bana-ulasin</span>
      </div>
      <div className="flex-grow space-y-4">
        {contactInfo.map((item) => (
          <div
            className="flex flex-col gap-3 rounded-2xl border border-border/30 bg-card/40 p-4 shadow-black/5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            key={item.label}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-wide sm:text-sm">
                {item.label}
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <a
                className="break-words text-primary underline-offset-4 hover:underline"
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.value}
              </a>
              <button
                className="inline-flex items-center gap-2 self-start rounded-full border border-primary/40 px-3 py-1 text-muted-foreground text-xs uppercase tracking-wide transition-colors hover:border-primary hover:text-foreground"
                onClick={() => copyToClipboard(item.value, item.label)}
                type="button"
              >
                {copied === item.label ? (
                  <span className="text-primary text-xs">Kopyalandı!</span>
                ) : (
                  <>
                    <Copy size={14} />
                    Kopyala
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2 text-muted-foreground">
        <span className="font-semibold text-primary">kullanici@portfolyo</span>
        <span>:</span>
        <span className="text-primary">~</span>
        <span>$</span>
        <span className="ml-1 animate-pulse">|</span>
      </div>
    </div>
  );
};

export default ContactApp;
