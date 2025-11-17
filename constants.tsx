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
    defaultSize: { width: 640, height: 720 },
    minSize: { width: 320, height: 420 },
  },
  {
    id: "resume",
    title: "Özgeçmiş",
    icon: FileText,
    component: ResumeApp,
    defaultSize: { width: 640, height: 720 },
    minSize: { width: 320, height: 420 },
  },
  {
    id: "skills",
    title: "Yetenekler",
    icon: Star,
    component: SkillsApp,
    defaultSize: { width: 640, height: 720 },
    minSize: { width: 320, height: 420 },
  },
  {
    id: "certificates",
    title: "Sertifikalar",
    icon: Award,
    component: CertificatesApp,
    defaultSize: { width: 640, height: 720 },
    minSize: { width: 320, height: 420 },
  },
  {
    id: "contact",
    title: "İletişim",
    icon: Mail,
    component: ContactApp,
    defaultSize: { width: 560, height: 520 },
    minSize: { width: 320, height: 380 },
  },
  {
    id: "calculator",
    title: "Hesap Makinesi",
    icon: Calculator,
    component: CalculatorApp,
    defaultSize: { width: 320, height: 460 },
    minSize: { width: 260, height: 320 },
  },
  {
    id: "notepad",
    title: "Not Defteri",
    icon: NotepadIcon,
    component: NotepadApp,
    defaultSize: { width: 520, height: 420 },
    minSize: { width: 320, height: 360 },
  },
];

export const DESKTOP_APPS = [
  "about",
  "resume",
  "skills",
  "certificates",
  "contact",
];
