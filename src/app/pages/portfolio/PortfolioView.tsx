// src/app/pages/portfolio/PortfolioView.tsx
"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Moon, Sun, Terminal, Code2, Cpu, Database } from "lucide-react";
import Image from "next/image";
import pfp from "/pfp.avif";

// Data Import, for translations
import { projectsData } from '../../data/portfolio/projects.js';
import { translations } from '../../data/portfolio/translations.js';

// Components Import
import LanguageSwitch from "@/components/portfolio/LanguageSwitch";
import CodeBlock from "@/components/portfolio/CodeBlock";
import InfoCard from "@/components/portfolio/InfoCard";
import ProjectCard from "@/components/portfolio/ProjectCard";
import CVSection from "@/components/portfolio/CVSection";
import HomeButton from "@/components/homeButton";
import ProjectCarousel from "@/components/portfolio/ProjectCarousel";

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'fr'>('fr');

  const t = translations[lang];
  const currentProjects = projectsData[lang];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen font-sans bg-background selection:bg-primary selection:text-white">
      
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-border bg-background/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2 text-primary">
            <HomeButton />
            <span>DevPortfolio</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
            <a href="#skills" className="hidden md:block hover:text-primary transition-colors">{t.nav.skills}</a>
            <a href="#projects" className="hidden md:block hover:text-primary transition-colors">{t.nav.projects}</a>
            <a href="#resume" className="hidden md:block hover:text-primary transition-colors">{t.nav.resume}</a>
            
            {/* Language Switcher */}
            <LanguageSwitch 
              currentLang={lang} 
              toggleLang={() => setLang(l => l === 'en' ? 'fr' : 'en')} 
            />

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Main Info */}
        <div className="flex-1 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-muted text-primary text-sm font-semibold tracking-wide uppercase">
            {t.hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Paul-Elouan Guyard-Lecerf <br />
            <span className="text-primary">{t.hero.role}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            {t.hero.description}
          </p>

          <div className="flex gap-4 pt-2">
            <a href="#contact" className="px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-medium transition-all shadow-lg shadow-primary/20">
              {t.nav.contact}
            </a>
            <a href="https://github.com/ArianeGL" target="_blank" className="px-6 py-3 border border-border bg-card hover:bg-muted rounded-xl font-medium transition-colors flex items-center gap-2 text-card-foreground">
              <Github size={20} /> {t.nav.github}
            </a>
          </div>
        </div>

        {/* Code Snippet & Image */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-6 transform hover:scale-[1.02] transition-transform duration-500">
          <img
            src="/images/assets/pfp.avif"
            alt="Paul-Elouan Guyard-Lecerf"
            className="w-full h-auto rounded-xl shadow-lg object-cover"
          />
          <CodeBlock fileName="developerInfo.js">
            <p>
              <span className="text-purple-400">const</span> developer = <span className="text-yellow-300">{"{"}</span>
            </p>
            <p className="pl-4">
              name: <span className="text-green-400">"Paul-Elouan"</span>,
            </p>
            <p className="pl-4">
              role: <span className="text-green-400">"{t.hero.role}"</span>,
            </p>
            <p className="pl-4">
              skills: [
                <span className="text-green-400">"C"</span>,
                <span className="text-green-400">"React"</span>,
                <span className="text-green-400">"PostgreSQL"</span>
              ]
            </p>
            <p>
              <span className="text-yellow-300">{"}"}</span>;
            </p>
          </CodeBlock>
        </div>
      </header>

      {/* --- Skills Section --- */}
      <section id="skills" className="bg-gradient-to-b from-background to-muted/50 py-20 border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">{t.skills.title}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <InfoCard icon={Code2} title="Web" variant="slate">
              <ul className="space-y-2">
                <li>React / Tailwind CSS</li>
                <li>HTML / CSS / JS</li>
                <li>Python / PHP</li>
                <li>Node.js</li>
              </ul>
            </InfoCard>

            <InfoCard icon={Cpu} title="Programmation" variant="slate">
              <ul className="space-y-2">
                <li>C / Java</li>
                <li>Bash Scripting</li>
                <li>Git & GitHub</li>
                <li>Docker</li>
              </ul>
            </InfoCard>

            <InfoCard icon={Database} title={t.skills.db} variant="slate">
              <ul className="space-y-2">
                <li>PostgreSQL</li>
                <li>Prisma ORM</li>
                <li>MongoDB</li>
              </ul>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">{lang === 'en' ? "Projects & Experience" : "Projets & Expériences"}</h2>
        <div className="mt-8">
           <ProjectCarousel projects={currentProjects} lang={lang} />
        </div>
      </section>

      {/* --- Resume Section --- */}
      <section id="resume">
        <CVSection lang={lang} />
      </section>
      
      {/* --- Footer --- */}
      <footer id="contact" className="border-t border-border py-12 bg-card">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold mb-2">{t.footer.contact}</h4>
            <p className="text-muted-foreground">{t.footer.openToWork}</p>
          </div>
          
          <div className="flex gap-4">
            <a href="mailto:paulelouan.guyardlecerf@proton.me" className="p-3 rounded-full bg-muted text-foreground hover:bg-primary hover:text-white transition-colors">
              <Mail size={20} />
            </a>
            <a href="https://www.linkedin.com/in/paul-elouan-guyard-lecerf-7666692a9" className="p-3 rounded-full bg-muted text-foreground hover:bg-primary hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/ArianeGL" className="p-3 rounded-full bg-muted text-foreground hover:bg-primary hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        <div className="text-center mt-12 text-muted-foreground text-sm">
          © {new Date().getFullYear()} Paul-Elouan Guyard-Lecerf.
        </div>
      </footer>
    </div>
  );
}