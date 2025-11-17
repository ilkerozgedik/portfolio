import { Award, Calculator, FileText, Mail, Star, User } from "lucide-react";
import AboutApp from "./apps/about-app";
import CalculatorApp from "./apps/calculator-app";
import CertificatesApp from "./apps/certificates-app";
import ContactApp from "./apps/contact-app";
import NotepadApp from "./apps/notepad-app";
import ResumeApp from "./apps/resume-app";
import SkillsApp from "./apps/skills-app";
import NotepadIcon from "./components/notepad-icon";
import type { AppConfig } from "./types";

export const APPS: AppConfig[] = [
  {
    id: "about",
    title: "Hakkımda",
    icon: User,
    component: AboutApp,
    defaultSize: { width: 600, height: 750 },
  },
  {
    id: "resume",
    title: "Özgeçmiş",
    icon: FileText,
    component: ResumeApp,
    defaultSize: { width: 600, height: 750 },
  },
  {
    id: "skills",
    title: "Yetenekler",
    icon: Star,
    component: SkillsApp,
    defaultSize: { width: 600, height: 750 },
  },
  {
    id: "certificates",
    title: "Sertifikalar",
    icon: Award,
    component: CertificatesApp,
    defaultSize: { width: 600, height: 750 },
  },
  {
    id: "contact",
    title: "İletişim",
    icon: Mail,
    component: ContactApp,
    defaultSize: { width: 600, height: 500 },
  },
  {
    id: "calculator",
    title: "Hesap Makinesi",
    icon: Calculator,
    component: CalculatorApp,
    defaultSize: { width: 300, height: 450 },
  },
  {
    id: "notepad",
    title: "Not Defteri",
    icon: NotepadIcon,
    component: NotepadApp,
    defaultSize: { width: 500, height: 400 },
  },
];

export const DESKTOP_APPS = [
  "about",
  "resume",
  "skills",
  "certificates",
  "contact",
];
