import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  User,
  Heart,
  Code,
  Terminal,
  Download,
  Globe
} from 'lucide-react';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// --- Types ---
type Language = 'en' | 'fr';

interface ResumeProps {
  lang: Language;
}

// --- Data & Translations ---
const resumeData = {
  fr: {
    titles: {
      main: "Mon Curriculum Vitae",
      subtitle: "Un aperçu de mon parcours académique et professionnel.",
      download: "Télécharger PDF",
      languages: "Langues",
      softSkills: "Atouts",
      software: "Logiciels",
      experience: "Expériences Professionnelles",
      education: "Diplômes et Formations",
      programming: "Langages de Programmation",
      interests: "Centres d'intérêt"
    },
    profile: {
      role: "Étudiant Développeur d'application",
      location: "Nantes / Montpellier, France",
    },
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "Courant" }
    ],
    softSkills: ["Curiosité intellectuelle", "Sens de l'écoute", "Adaptation", "Créativité"],
    software: [
      { name: "VSCode", detail: "Configuration avancée" },
      { name: "GIMP", detail: "Création graphique" },
      { name: "Office", detail: "Excel, Word, PowerPoint" },
      { name: "Godot", detail: "Game Engine" }
    ],
    experience: [
      {
        role: "Développeur Stagiaire - Fullstack",
        company: "Synergie",
        location: "Orvault, France",
        period: "Avril 2026 - Juillet 2026",
        description: "Recherche de solution et développement d'une application Microsoft Teams Tab reliant une base de données clients interne à RingCentral. Création de l'intégration via API pour afficher les fiches clients dans Teams lors d'appels entrants, et réalisation d'un script AutoHotkey pour automatiser le déploiement sur les postes utilisateurs."
      },
      {
        role: "Développeur Stagiaire - Fullstack",
        company: "Synergie",
        location: "Orvault, France",
        period: "Juin 2025 - Août 2025",
        description: "Développement d'une solution (React Admin / WhatsApp API) pour la branche Care afin d'accélérer le placement des intérimaires. Co-construction avec deux agences pilotes pour automatiser les contacts, réduisant ainsi la perte de contrats face à la concurrence sur les missions urgentes."
      },
      {
        role: "Assistant Juridique",
        company: "Synergie",
        location: "Orvault, France",
        period: "Juillet 2024 - Août 2024",
        description: "Assistant au sein de l'équipe juridique de Synergie Orvault. Traitement et gestion des tickets concernant les intérimaires, nécessitant rigueur et confidentialité."
      },
      {
        role: "Administrateur Note de Frais",
        company: "Synergie",
        location: "Orvault, France",
        period: "Juillet 2023 - Août 2023",
        description: "Chargé de vérifier et de corriger si nécessaire les notes de frais des employés. Utilisation intensive d'Excel et des outils internes de comptabilité."
      }
    ],
    education: [
      {
        role: "Master Informatique - Développement Logiciel (Bac +5)",
        company: "IRIS",
        location: "Montpellier, France",
        period: "2026 - 2028 (À venir)",
        description: "Formation d'Expert en Informatique et Développement Logiciel réalisée en alternance. Focus sur l'architecture logicielle, le management de projet agile et les technologies full-stack avancées."
      },
      {
        role: "BUT Informatique (3ème année)",
        company: "IUT Lannion",
        location: "Lannion, France",
        period: "Depuis Octobre 2023",
        description: "Parcours Réalisation d'applications : conception, développement, validation."
      },
      {
        role: "Baccalauréat Général",
        company: "Blanche de Castille",
        location: "Nantes, France",
        period: "Obtenu en Juillet 2023",
        description: "Spécialités : Mathématiques et NSI (Numérique et Sciences Informatiques)."
      }
    ],
    skillLevels: {
      advanced: "Avancé",
      intermediate: "Intermédiaire",
      beginner: "Débutant"
    },
    interests: <>Passionné par la <strong>programmation</strong> et le développement de jeux vidéo (Godot). Pratique de l'<strong>Origami</strong> (art du pliage de papier) demandant patience et précision. Intérêt pour la <strong>création graphique</strong> et le design UI.</>
  },
  en: {
    titles: {
      main: "My Resume",
      subtitle: "An overview of my academic and professional journey.",
      download: "Download PDF",
      languages: "Languages",
      softSkills: "Soft Skills",
      software: "Software",
      experience: "Professional Experience",
      education: "Education",
      programming: "Programming Languages",
      interests: "Interests"
    },
    profile: {
      role: "Student Developer",
      location: "Nantes / Montpellier, France",
    },
    languages: [
      { name: "French", level: "Native" },
      { name: "English", level: "Fluent" }
    ],
    softSkills: ["Intellectual Curiosity", "Active Listening", "Adaptability", "Creativity"],
    software: [
      { name: "VSCode", detail: "Advanced Configuration" },
      { name: "GIMP", detail: "Graphic Creation" },
      { name: "Office", detail: "Excel, Word, PowerPoint" },
      { name: "Godot", detail: "Game Engine" }
    ],
    experience: [
      {
        role: "Software Developer Intern",
        company: "Synergie",
        location: "Orvault, France",
        period: "April 2026 - July 2026",
        description: "Architected and developed a Microsoft Teams Tab application integrating an internal client database with RingCentral. Designed the solution to display client data in Teams during incoming calls using existing APIs, and created an AutoHotkey script for automated deployment across user workstations."
      },
      {
        role: "Intern Developer",
        company: "Synergie",
        location: "Orvault, France",
        period: "June 2025 - Aug 2025",
        description: "Developed a solution (React Admin / WhatsApp API) for the Care branch to accelerate temporary worker placement. Co-constructed with two pilot agencies to automate contacts, reducing contract loss against competitors on urgent missions."
      },
      {
        role: "Legal Assistant",
        company: "Synergie",
        location: "Orvault, France",
        period: "July 2024 - Aug 2024",
        description: "Assistant within the Synergie Orvault legal team. Processing and managing tickets regarding temporary workers, requiring rigor and confidentiality."
      },
      {
        role: "Expense Report Administrator",
        company: "Synergie",
        location: "Orvault, France",
        period: "July 2023 - Aug 2023",
        description: "In charge of verifying and correcting employee expense reports. Intensive use of Excel and internal accounting tools."
      }
    ],
    education: [
      {
        role: "Master's Degree in Software Development (Bac +5)",
        company: "IRIS",
        location: "Montpellier, France",
        period: "2026 - 2028 (Upcoming)",
        description: "Expert in Computer Science and Software Development program via an apprenticeship. Focus on software architecture, agile project management, and advanced full-stack technologies."
      },
      {
        role: "BUT Computer Science (3rd Year)",
        company: "IUT Lannion",
        location: "Lannion, France",
        period: "Since October 2023",
        description: "Application Development Track: design, development, validation."
      },
      {
        role: "General Baccalaureate",
        company: "Blanche de Castille",
        location: "Nantes, France",
        period: "Obtained July 2023",
        description: "Specialties: Mathematics and CS (Computer Science)."
      }
    ],
    skillLevels: {
      advanced: "Advanced",
      intermediate: "Intermediate",
      beginner: "Beginner"
    },
    interests: <>Passionate about <strong>programming</strong> and video game development (Godot). I practice <strong>Origami</strong> (paper folding art) requiring patience and precision. Interest in <strong>graphic creation</strong> and UI design.</>
  }
};

// --- Helper Components ---

const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
  // Reduced margin-bottom for print
  <div className="flex items-center gap-3 mb-6 print:mb-3 website-font">
    <div className="p-2 rounded-lg bg-primary/10 text-primary print:p-1">
      <Icon size={20} className="print:w-4 print:h-4" />
    </div>
    <h3 className="text-xl font-bold uppercase tracking-wide text-foreground print:text-lg">
      {title}
    </h3>
  </div>
);

const TimelineItem = ({ 
  role, company, period, location, description 
}: { 
  role: string, company: string, period: string, location: string, description?: string 
}) => (
  <div className="relative pl-8 pb-8 print:pb-4 border-l-2 border-muted last:pb-0 last:border-l-0">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-card print:w-3 print:h-3 print:-left-[7px]"></div>
    
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
      <h4 className="text-lg font-bold text-card-foreground print:text-base">{role}</h4>
      <span className="text-sm font-medium text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md print:text-xs">
        {period}
      </span>
    </div>
    
    <div className="text-sm text-muted-foreground font-semibold mb-2 print:text-xs print:mb-1">
      {company} • {location}
    </div>
    
    {description && (
      <p className="text-sm text-muted-foreground leading-relaxed print:text-xs print:leading-snug">
        {description}
      </p>
    )}
  </div>
);

const SkillBar = ({ label, level, width }: { label: string, level?: string, width?: number}) => (
  <div className="mb-3 print:mb-1">
    
    <div className="flex justify-between mb-1 print:mb-0">
      <span className="text-sm font-medium text-card-foreground print:text-xs">{label}</span>
      {level && <span className="text-xs text-muted-foreground print:text-[10px]">{level}</span>}
    </div>
    
    <div className="w-full bg-muted rounded-full h-2 print:h-1.5">
      <div className="bg-primary h-2 print:h-1.5 rounded-full opacity-80" style={{ width: width ? `${width}%` : '50%'}}></div>
    </div>
  </div>
);

// --- Main Component ---

export default function Resume({ lang = 'en' }: ResumeProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleDownload = useReactToPrint({
    contentRef: componentRef, // Updated for newer versions
    documentTitle: 'CV_Paul-Elouan_Guyard-Lecerf',
  });

  const content = resumeData[lang];

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 print:py-0 print:px-0">
      
      <button 
        onClick={handleDownload}
        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 mb-8"
      >
        <Download size={18} />
        PDF
      </button>

      {/* CV Paper Container */}
      <div 
        id="resume"
        ref={componentRef} 
        className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border grid grid-cols-1 lg:grid-cols-12 min-h-[1000px] print:min-h-0 print:shadow-none print:rounded-none print:border-none"
      >
        
        {/* --- LEFT COLUMN (Sidebar) --- */}
        <div className="lg:col-span-4 bg-muted/30 p-8 border-r border-border print:p-6">
          
          {/* Profile Header */}
          <div className="text-center lg:text-left mb-10 print:mb-6">
            <img
              src="/images/assets/pfp.avif"
              alt="Paul-Elouan Guyard-Lecerf"
              className="w-32 h-32 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-6 border-4 border-card shadow-md flex items-center justify-center print:w-24 print:h-24 print:mb-4"
            />
            <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-2 print:text-2xl">
              Paul-Elouan <br/>
              <span className="text-primary">Guyard-Lecerf</span>
            </h1>
            <p className="text-lg font-medium text-muted-foreground print:text-base">
              {content.profile.role}
            </p>
          </div>

          <div className="space-y-8 print:space-y-6">
            {/* Contact Info */}
            <div className="space-y-4 text-sm print:space-y-2 print:text-xs">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={16} className="text-primary min-w-[16px]" />
                <a href="mailto:paulelouan.guyardlecerf@proton.me" className="hover:text-primary transition-colors break-all">
                  paulelouan.guyardlecerf@proton.me
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={16} className="text-primary min-w-[16px]" />
                <span>{content.profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone size={16} className="text-primary min-w-[16px]" />
                <span>+33 6 64 96 77 67</span>
              </div>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <Globe size={16} className="text-primary min-w-[16px]"/>
                <span>qtqwill.dev</span>
              </div>
            </div>

            <hr className="border-border" />

            {/* Languages */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2">
                <User size={18} className="text-primary" /> {content.titles.languages}
              </h3>
              <div className="space-y-3 print:space-y-2">
                {content.languages.map((l, i) => (
                  <div key={i} className="flex justify-between w-full">
                    <span className="text-muted-foreground print:text-xs">{l.name}</span>
                    <span className="font-semibold text-foreground print:text-xs">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2">
                <Heart size={18} className="text-primary" /> {content.titles.softSkills}
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.softSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground print:px-2 print:py-0.5 print:text-[10px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Logiciels */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2">
                <Terminal size={18} className="text-primary" /> {content.titles.software}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground print:text-xs print:space-y-1">
                {content.software.map((sw, i) => (
                  <li key={i}><strong className="text-foreground">{sw.name}</strong> : {sw.detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Main Content) --- */}
        <div className="lg:col-span-8 p-8 md:p-12 space-y-12 bg-card print:p-6 print:space-y-6">
          
          {/* Experience Section */}
          <div>
            <SectionTitle icon={Briefcase} title={content.titles.experience} />
            <div className="space-y-2 print:space-y-2">
              {content.experience.map((job, index) => (
                <TimelineItem 
                  key={index}
                  role={job.role}
                  company={job.company}
                  location={job.location}
                  period={job.period}
                  description={job.description}
                />
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <SectionTitle icon={GraduationCap} title={content.titles.education} />
            <div className="space-y-2 print:space-y-2">
              {content.education.map((edu, index) => (
                <TimelineItem 
                  key={index}
                  role={edu.role}
                  company={edu.company}
                  location={edu.location}
                  period={edu.period}
                  description={edu.description}
                />
              ))}
            </div>
          </div>

          {/* Coding Skills Section */}
          <div>
            <SectionTitle icon={Code} title={content.titles.programming} />
            
            {/* Added 'print:grid-cols-1' and 'print:gap-2' */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-2">
              
              <div>
                <SkillBar label="C / Java" level={content.skillLevels.advanced} width={75} />
                <SkillBar label="Python" level={content.skillLevels.advanced} width={85}/>
                <SkillBar label="PostgreSQL" level={content.skillLevels.advanced} width={80} />
                <SkillBar label="Bash / Linux" level={content.skillLevels.advanced} width={90} />
              </div>
              <div>
                <SkillBar label="JavaScript / React" level={content.skillLevels.intermediate} width={70} />
                <SkillBar label="Prisma / MongoDB" level={content.skillLevels.beginner} width={35} />
                <SkillBar label="HTML / CSS" level={content.skillLevels.advanced} width={65} />
                <SkillBar label="PHP" level={content.skillLevels.intermediate} width={55} />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border print:p-4 print:bg-gray-50">
            <h3 className="font-bold text-foreground mb-3 print:mb-1 print:text-sm">{content.titles.interests}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed print:text-xs">
              {content.interests}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}