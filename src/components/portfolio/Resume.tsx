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
  Globe,
  Github,
  Linkedin,
  FolderGit2,
  Star,
  Sparkles
} from 'lucide-react';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// --- Types ---
type Language = 'en' | 'fr';

interface ResumeProps {
  lang: Language;
}

// --- Helper Components ---
const KeywordTag = ({ text }: { text: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full transition-colors inline-block print:px-2 print:py-0.5 print:text-[10px]";
  const colorClasses = "bg-primary text-primary-foreground shadow-sm";

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      #{text}
    </span>
  );
};

const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-3 mb-6 print:mb-3 website-font">
    <div className="p-2 rounded-lg bg-primary/10 text-primary print:p-1.5 flex-shrink-0">
      <Icon className="w-5 h-5 print:w-4 print:h-4" />
    </div>
    <h3 className="text-xl font-bold uppercase tracking-wide text-foreground print:text-sm">
      {title}
    </h3>
  </div>
);

const TimelineItem = ({ 
  role, company, period, location, description, tags 
}: { 
  role: string, company: string, period: string, location?: string, description?: string, tags?: string[]
}) => (
  <div className="relative pl-8 pb-8 print:pl-6 print:pb-4 border-l-2 border-muted last:pb-0 last:border-l-0">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-card print:w-3 print:h-3 print:-left-[7px] print:border-2"></div>
    
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 print:mb-0.5">
      <h4 className="text-lg font-bold text-card-foreground print:text-sm">{role}</h4>
      <span className="text-sm font-medium text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md print:text-[11px] print:px-1.5 print:py-0.5 whitespace-nowrap">
        {period}
      </span>
    </div>
    
    <div className="text-sm text-muted-foreground font-semibold mb-2 print:text-xs print:mb-1.5">
      {company} {location && `• ${location}`}
    </div>
    
    {description && (
      <p className="text-sm text-muted-foreground leading-relaxed print:text-xs print:leading-snug print:mb-2 mb-3">
        {description}
      </p>
    )}

    {tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mt-1 print:mt-0">
        {tags.map((tag, idx) => (
          <KeywordTag key={idx} text={tag} />
        ))}
      </div>
    )}
  </div>
);

const SkillBar = ({ label, level, width }: { label: string, level?: string, width?: number}) => (
  <div className="mb-3 print:mb-2">
    <div className="flex justify-between mb-1 print:mb-0.5">
      <span className="text-sm font-medium text-card-foreground print:text-xs">{label}</span>
      {level && <span className="text-xs text-muted-foreground print:text-[10px]">{level}</span>}
    </div>
    <div className="w-full bg-muted rounded-full h-2 print:h-1.5">
      <div className="bg-primary h-2 print:h-1.5 rounded-full opacity-80" style={{ width: width ? `${width}%` : '50%'}}></div>
    </div>
  </div>
);

// --- Data & Translations ---
const resumeData = {
  fr: {
    titles: {
      main: "Mon Curriculum Vitae",
      subtitle: "Un aperçu de mon parcours académique et professionnel.",
      download: "Télécharger PDF",
      summary: "Profil & Objectif",
      languages: "Langues",
      softSkills: "Atouts",
      software: "Logiciels",
      experience: "Expériences Professionnelles",
      projects: "Projets Récents",
      education: "Diplômes et Formations",
      programming: "Langages de Programmation",
      interests: "Centres d'intérêt"
    },
    profile: {
      role: "Ingénieur Logiciel & Intégration API - Alternance",
      location: "Nantes / Montpellier, France",
    },
    summary: "Étudiant en Master Informatique (spécialité Développement Logiciel), je recherche activement une alternance pour consolider mon expertise technique. Fort de mes expériences de développeur full-stack chez Synergie où j'ai conçu et déployé des applications métier (React, Node.js, intégrations API) à grande échelle, je suis immédiatement opérationnel pour créer des solutions logicielles robustes répondant directement à vos enjeux d'entreprise.",
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "Courant" }
    ],
    softSkills: ["Curiosité intellectuelle", "Sens de l'écoute", "Adaptation", "Créativité", "Travail d'Équipe"],
    software: [
      { name: "VSCode", detail: "Configuration avancée" },
      { name: "GIMP", detail: "Création graphique" },
      { name: "Office", detail: "Excel, Word, PowerPoint" },
      { name: "Godot", detail: "Game Engine" }
    ],
    experience: [
      {
        role: "Ingénieur Logiciel d'Intégration API",
        company: "Synergie",
        location: "Orvault, France",
        period: "Avril 2026 - Juillet 2026",
        description: "Recherche de solution et développement d'une application Microsoft Teams Tab reliant une base de données clients interne à RingCentral. Création de l'intégration via API pour afficher les fiches clients dans Teams lors d'appels entrants, et réalisation d'un script AutoHotkey pour automatiser le déploiement sur les postes utilisateurs.",
        tags: ["API", "Microsoft Teams", "RingCentral", "AutoHotkey", "Intégration"]
      },
      {
        role: "Développeur Fullstack React & Node.js",
        company: "Synergie",
        location: "Orvault, France",
        period: "Juin 2025 - Août 2025",
        description: "Développement d'une solution (React Admin / WhatsApp API) pour la branche Care afin d'accélérer le placement des intérimaires. Co-construction avec deux agences pilotes pour automatiser les contacts, réduisant ainsi la perte de contrats face à la concurrence sur les missions urgentes.",
        tags: ["React Admin", "Node.js", "WhatsApp API", "Fullstack", "Automatisation"]
      }
    ],
    projects: [
      {
        name: "Crux - Écosystème VTT Modulaire",
        period: "2026",
        description: "Développement de Crux, un écosystème modulaire de Table de Jeu Virtuelle (VTT) pour jeux de rôle. Transition d'une application éphémère vers une plateforme persistante intégrant des comptes utilisateurs sécurisés et une synchronisation de base de données. Implémentation de widgets modulaires (moteur de lancer de dés multi-systèmes, tirages de Tarot personnalisables), de générateurs de contenu (PNJ, quêtes), et d'un client de bureau premium doté d'un moteur de base de connaissances type Obsidian avec vue graphique.",
        tags: ["VTT", "Modulaire", "Base de Données", "Client de Bureau", "Comptes Utilisateurs"]
      },
      {
        name: "Super Tic-Tac-Toe & IA Algorithmique",
        period: "Fin 2023 - Début 2024",
        description: "Conception d'un moteur de jeu performant en C pour un Morpion récursif jouable dans le terminal. Implémentation d'une Intelligence Artificielle à 3 niveaux de difficulté (RNG, blocage stratégique, équilibrage dynamique). Création d'une interface en ASCII Art optimisée pour la lisibilité et gestion du code source et des versions via GitHub.",
        tags: ["Optimiser", "Langage C", "Algorithmique", "Intelligence Artificielle", "Git/GitHub"]
      }
    ],
    education: [
      {
        role: "Master Informatique - Développement Logiciel (Bac +5)",
        company: "IRIS",
        location: "Montpellier, France",
        period: "Septembre 2026 - Septembre 2028",
        description: "Formation d'Expert en Informatique et Développement Logiciel réalisée en alternance. Focus sur l'architecture logicielle, le management de projet agile et les technologies full-stack avancées.",
        tags: ["Architecture Logicielle", "Management de Projet", "Agile", "Technologies Full-stack"]
      },
      {
        role: "BUT Informatique (3ème année)",
        company: "IUT Lannion",
        location: "Lannion, France",
        period: "Septembre 2023 - Août 2026",
        description: "Parcours Réalisation d'applications : conception, développement, validation.",
        tags: ["Conception", "Développement", "Validation", "Algorithmique"]
      },
      {
        role: "Baccalauréat Général",
        company: "Blanche de Castille",
        location: "Nantes, France",
        period: "Obtenu en Juillet 2023",
        description: "Spécialités : Mathématiques et NSI (Numérique et Sciences Informatiques).",
        tags: ["Mathématiques", "NSI", "Algorithmique"]
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
      summary: "Profile & Objective",
      languages: "Languages",
      softSkills: "Soft Skills",
      software: "Software",
      experience: "Professional Experience",
      projects: "Recent Projects",
      education: "Education",
      programming: "Programming Languages",
      interests: "Interests"
    },
    profile: {
      role: "Software & API Integration Engineer - Apprenticeship",
      location: "Nantes / Montpellier, France",
    },
    summary: "Master's student in Computer Science (Software Development specialization), I am actively seeking an apprenticeship to consolidate my technical expertise. Building on my experience as a full-stack developer at Synergie, where I designed and deployed large-scale business applications (React, Node.js, API integrations), I am immediately operational to build robust software solutions that directly address your business challenges.",
    languages: [
      { name: "French", level: "Native" },
      { name: "English", level: "Fluent" }
    ],
    softSkills: ["Intellectual Curiosity", "Active Listening", "Adaptability", "Creativity", "Teamwork"],
    software: [
      { name: "VSCode", detail: "Advanced Configuration" },
      { name: "GIMP", detail: "Graphic Creation" },
      { name: "Office", detail: "Excel, Word, PowerPoint" },
      { name: "Godot", detail: "Game Engine" }
    ],
    experience: [
      {
        role: "API Integration Software Engineer",
        company: "Synergie",
        location: "Orvault, France",
        period: "April 2026 - July 2026",
        description: "Architected and developed a Microsoft Teams Tab application integrating an internal client database with RingCentral. Designed the solution to display client data in Teams during incoming calls using existing APIs, and created an AutoHotkey script for automated deployment across user workstations.",
        tags: ["API", "Microsoft Teams", "RingCentral", "AutoHotkey", "Integration"]
      },
      {
        role: "Fullstack React & Node.js Developer",
        company: "Synergie",
        location: "Orvault, France",
        period: "June 2025 - Aug 2025",
        description: "Developed a solution (React Admin / WhatsApp API) for the Care branch to accelerate temporary worker placement. Co-constructed with two pilot agencies to automate contacts, reducing contract loss against competitors on urgent missions.",
        tags: ["React Admin", "Node.js", "WhatsApp API", "Fullstack", "Automation"]
      }
    ],
    projects: [
      {
        name: "Crux - Modular VTT Ecosystem",
        period: "2026",
        description: "Developed Crux, a modular Virtual Tabletop (VTT) ecosystem for role-playing games. Transitioned from an ephemeral app to a persistent platform featuring secure user accounts and database synchronization. Implemented modular UI widgets (multi-system dice roller, customizable Tarot draws), procedural content generators (NPCs, quests), and a premium desktop client with an Obsidian-style knowledge base and graph view.",
        tags: ["VTT", "Modular", "Database", "Desktop Client", "User Accounts"]
      },
      {
        name: "Super Tic-Tac-Toe & Algorithmic AI",
        period: "Late 2023 - Early 2024",
        description: "Designed a high-performance C game engine for a recursive terminal-based Tic-Tac-Toe. Implemented a 3-level Artificial Intelligence (RNG, strategic blocking, and dynamic balancing). Created an optimized ASCII Art interface for terminal readability and managed version control and source code via GitHub.",
        tags: ["Optimize", "C Language", "Algorithms", "Artificial Intelligence", "Git/GitHub"]
      }
    ],
    education: [
      {
        role: "Master's Degree in Software Development (Bac +5)",
        company: "IRIS",
        location: "Montpellier, France",
        period: "Sept 2026 - Sept 2028",
        description: "Expert in Computer Science and Software Development program via an apprenticeship. Focus on software architecture, agile project management, and advanced full-stack technologies.",
        tags: ["Software Architecture", "Project Management", "Agile", "Full-stack Technologies"]
      },
      {
        role: "BUT Computer Science (3rd Year)",
        company: "IUT Lannion",
        location: "Lannion, France",
        period: "Sept 2023 - Aug 2026",
        description: "Application Development Track: design, development, validation.",
        tags: ["Design", "Development", "Validation", "Algorithms"]
      },
      {
        role: "General Baccalaureate",
        company: "Blanche de Castille",
        location: "Nantes, France",
        period: "Obtained July 2023",
        description: "Specialties: Mathematics and CS (Computer Science).",
        tags: ["Mathematics", "Computer Science", "Algorithms"]
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

// --- Main Component ---
export default function Resume({ lang = 'en' }: ResumeProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleDownload = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: 'CV_Paul-Elouan_Guyard-Lecerf',
  });

  const content = resumeData[lang];

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 print:py-0 print:px-0">
      
      <button 
        onClick={handleDownload}
        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 mb-8"
      >
        <Download className="w-[18px] h-[18px]" />
        {content.titles.download}
      </button>

      {/* CV Paper Container */}
      <div 
        id="resume"
        ref={componentRef} 
        className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border grid grid-cols-1 lg:grid-cols-12 min-h-[1000px] print:min-h-0 print:shadow-none print:rounded-none print:border-none print:bg-white"
      >
        
        {/* --- LEFT COLUMN (Sidebar) --- */}
        <div className="lg:col-span-4 bg-muted/30 p-8 border-r border-border print:p-5 print:bg-gray-50/50">
          
          {/* Profile Header */}
          <div className="text-center lg:text-left mb-10 print:mb-6">
            <img
              src="/images/assets/pfp.avif"
              alt="Paul-Elouan Guyard-Lecerf"
              className="w-32 h-32 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-6 border-4 border-card shadow-md flex items-center justify-center print:w-24 print:h-24 print:mb-3 print:border-2 object-cover"
            />
            <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-2 print:text-2xl print:mb-1">
              Paul-Elouan <br/>
              <span className="text-primary">Guyard-Lecerf</span>
            </h1>
            <p className="text-lg font-medium text-muted-foreground print:text-sm leading-snug">
              {content.profile.role}
            </p>
          </div>

          <div className="space-y-8 print:space-y-5">
            {/* Contact Info */}
            <div className="space-y-4 text-sm print:space-y-2 print:text-xs">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="text-primary min-w-[16px] w-4 h-4 print:w-3.5 print:h-3.5" />
                <a href="mailto:paulelouan.guyardlecerf@proton.me" className="hover:text-primary transition-colors break-all">
                  paulelouan.guyardlecerf@proton.me
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="text-primary min-w-[16px] w-4 h-4 print:w-3.5 print:h-3.5" />
                <span>{content.profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="text-primary min-w-[16px] w-4 h-4 print:w-3.5 print:h-3.5" />
                <span>+33 6 64 96 77 67</span>
              </div>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <Globe className="text-primary min-w-[16px] w-4 h-4 print:w-3.5 print:h-3.5" />
                <a href="https://qtqwill.dev" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">qtqwill.dev</a>
              </div>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <Linkedin className="text-primary min-w-[16px] w-4 h-4 print:w-3.5 print:h-3.5" />
                <a href="https://www.linkedin.com/in/paul-elouan-guyard-lecerf-7666692a9" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">linkedin.com/in/paul-elouan-guyard-lecerf</a>
              </div>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <Github className="text-primary min-w-[16px] w-4 h-4 print:w-3.5 print:h-3.5" />
                <a href="https://github.com/quillingariane" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">github.com/quillingariane</a>
              </div>
            </div>

            <hr className="border-border print:my-3" />

            {/* Programming Languages */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2 print:text-sm">
                <Code className="text-primary w-[18px] h-[18px] print:w-4 print:h-4" /> {content.titles.programming}
              </h3>
              <div className="flex flex-col space-y-2 print:space-y-1.5">
                <SkillBar label="C / Java" level={content.skillLevels.advanced} width={75} />
                <SkillBar label="Python" level={content.skillLevels.advanced} width={85} />
                <SkillBar label="PostgreSQL" level={content.skillLevels.advanced} width={80} />
                <SkillBar label="Bash / Linux" level={content.skillLevels.advanced} width={90} />
                <SkillBar label="JavaScript / React" level={content.skillLevels.intermediate} width={70} />
                <SkillBar label="HTML / CSS" level={content.skillLevels.advanced} width={65} />
                <SkillBar label="PHP" level={content.skillLevels.intermediate} width={55} />
                <SkillBar label="Prisma / MongoDB" level={content.skillLevels.beginner} width={35} />
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2 print:text-sm">
                <User className="text-primary w-[18px] h-[18px] print:w-4 print:h-4" /> {content.titles.languages}
              </h3>
              <div className="space-y-3 print:space-y-1.5">
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
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2 print:text-sm">
                <Heart className="text-primary w-[18px] h-[18px] print:w-4 print:h-4" /> {content.titles.softSkills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {content.softSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground print:px-2 print:py-0.5 print:text-[10px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Logiciels */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2 print:text-sm">
                <Terminal className="text-primary w-[18px] h-[18px] print:w-4 print:h-4" /> {content.titles.software}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground print:text-xs print:space-y-1">
                {content.software.map((sw, i) => (
                  <li key={i}><strong className="text-foreground">{sw.name}</strong> : {sw.detail}</li>
                ))}
              </ul>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 print:mb-2 print:text-sm">
                <Sparkles className="text-primary w-[18px] h-[18px] print:w-4 print:h-4" /> {content.titles.interests}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed print:text-xs print:leading-tight">
                {content.interests}
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Main Content) --- */}
        <div className="lg:col-span-8 p-8 md:p-12 space-y-12 bg-card print:p-6 print:space-y-5">
          
          {/* Summary / Objective Section */}
          <div>
            <SectionTitle icon={Star} title={content.titles.summary} />
            <div className="bg-muted/30 rounded-2xl p-6 border border-border print:p-4 print:bg-gray-50/50 print:border-none">
              <p className="text-muted-foreground text-sm leading-relaxed print:text-xs print:leading-snug">
                {content.summary}
              </p>
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <SectionTitle icon={Briefcase} title={content.titles.experience} />
            <div className="space-y-2 print:space-y-1">
              {content.experience.map((job, index) => (
                <TimelineItem 
                  key={index} 
                  company={job.company} 
                  description={job.description} 
                  location={job.location} 
                  period={job.period} 
                  role={job.role} 
                  tags={job.tags} 
                />
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <SectionTitle icon={FolderGit2} title={content.titles.projects} />
            <div className="space-y-2 print:space-y-1">
              {content.projects.map((project, index) => (
                <TimelineItem 
                  key={index} 
                  company="Projet Personnel" 
                  description={project.description} 
                  period={project.period} 
                  role={project.name} 
                  tags={project.tags}
                />
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <SectionTitle icon={GraduationCap} title={content.titles.education} />
            <div className="space-y-2 print:space-y-1">
              {content.education.map((edu, index) => (
                <TimelineItem 
                  key={index} 
                  company={edu.company} 
                  description={edu.description} 
                  location={edu.location} 
                  period={edu.period} 
                  role={edu.role} 
                  tags={edu.tags} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}