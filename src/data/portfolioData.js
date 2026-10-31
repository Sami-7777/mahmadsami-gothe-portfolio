// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Mahmadsami Gothe",
  brandName: "Mahmadsami Gothe",
  role: "AI Engineer with Python Full Stack Developer",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "mahmadsami007@gmail.com",
  phone: "+91 7019833662",
  availability: "Open to full-time roles & internships",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/Sami-7777",
  linkedin: "https://www.linkedin.com/in/mahmadsami-gothe-6a830330b/",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro: "I build practical software solutions using Python, AI, and full-stack development to solve real-world problems.",
  statusLines: [
    "Building with Python & React",
    "Practicing DSA and problem-solving",
    "Exploring AI and machine learning",
  ],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Building intelligent software that solves problems.",
  paragraph:
    "I'm a CSE student focused on Python full-stack development and AI who enjoys building projects that solve real-world problems and improving problem-solving skills through DSA. Currently, I'm developing software and preparing for engineering opportunities through the placement training program at TAP Academy.",
  stats: [
    { value: 2, suffix: "", label: "Projects built" },
    { value: 200, suffix: "+", label: "Programming problems solved" },
    { value: 6, suffix: "+", label: "Months of AI & full-stack experience" },
  ],
};

export const skillGroups = [
  { title: "Programming", items: ["Python", "SQL", "JavaScript"] },
  { title: "Frontend", items: ["HTML", "CSS", "React"] },
  { title: "Backend", items: ["Django", "FastAPI"] },
  { title: "Tools", items: ["Git", "GitHub", "VS Code"] },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Aranyani — Ecosystem Collapse Early Warning System",
    description:
      "An early warning system that analyzes Sentinel-2 satellite data, fire hotspots, and ecological indicators using machine learning to detect and predict forest degradation.",
    tags: ["Sentinel-2", "FastAPI", "XGBoost", "React"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/Sami-7777/Aranyani",
  },
  {
    id: "project-2",
    number: "02",
    title: "AI-Based Cyberattack Detection System",
    description:
      "Detects malicious URLs, suspicious IPs, phishing, malware, and DDoS attacks using machine learning.",
    tags: ["Python", "FastAPI", "Scikit-learn", "Redis"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/Sami-7777/Cyber-Attack-Detection-System",
  },
];

export const experience = [
  {
    period: "2026 — Now",
    role: "AI Engineer & Python Full Stack Intern",
    org: "TAP Academy",
    description:
      "Hands-on internship working with Python, SQL, React, Django, and FastAPI while developing full-stack and AI applications.",
  },
  {
    period: "2023 — 2027",
    role: "B-Tech in Computer Science and Business Systems",
    org: "Visvesvaraya Technological University, Belagavi",
    description:
      "Studying programming, databases, operating systems, and computer networks.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's build something.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
