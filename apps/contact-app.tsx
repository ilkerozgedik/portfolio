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
    <div className="flex h-full flex-col bg-background p-4 font-mono text-card-foreground text-sm">
      <div className="mb-4 flex items-center">
        <span className="font-semibold text-primary">kullanici@portfolyo</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-primary">~</span>
        <span className="text-muted-foreground">$</span>
        <span className="ml-2 animate-pulse text-foreground">
          ./bana-ulasin
        </span>
      </div>
      <div className="flex-grow space-y-3">
        {contactInfo.map((item) => (
          <div className="flex items-start" key={item.label}>
            <div className="flex w-28 items-center">
              <item.icon className="mr-2 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{item.label}:</span>
            </div>
            <div className="flex flex-1 items-center">
              <a
                className="break-all text-primary transition-colors duration-200 hover:underline"
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.value}
              </a>
              <button
                className="ml-3 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => copyToClipboard(item.value, item.label)}
                type="button"
              >
                {copied === item.label ? (
                  <span className="text-primary text-xs">Kopyalandı!</span>
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center text-muted-foreground">
        <span className="font-semibold text-primary">kullanici@portfolyo</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-primary">~</span>
        <span className="text-muted-foreground">$</span>
        <span className="ml-2 animate-pulse">|</span>
      </div>
    </div>
  );
};

export default ContactApp;
