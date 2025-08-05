import "./styles.css";

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import createGlobe from "cobe";
import usePartySocket from "partysocket/react";

// The type of messages we'll be receiving from the server
import type { OutgoingMessage } from "../shared";
import type { LegacyRef } from "react";

function App() {
  // A reference to the canvas element where we'll render the globe
  const canvasRef = useRef<HTMLCanvasElement>();
  // The number of markers we're currently displaying
  const [counter, setCounter] = useState(0);
  // A map of marker IDs to their positions
  // Note that we use a ref because the globe's `onRender` callback
  // is called on every animation frame, and we don't want to re-render
  // the component on every frame.
  const positions = useRef<
    Map<
      string,
      {
        location: [number, number];
        size: number;
      }
    >
  >(new Map());

  // Connect to the PartyServer server
  const socket = usePartySocket({
    room: "default",
    party: "globe",
    onMessage(evt) {
      const message = JSON.parse(evt.data as string) as OutgoingMessage;
      if (message.type === "add-marker") {
        // Add the marker to our map
        positions.current.set(message.position.id, {
          location: [message.position.lat, message.position.lng],
          size: message.position.id === socket.id ? 0.1 : 0.05,
        });
        // Update the counter
        setCounter((c) => c + 1);
      } else {
        // Remove the marker from our map
        positions.current.delete(message.id);
        // Update the counter
        setCounter((c) => c - 1);
      }
    },
  });

  useEffect(() => {
    // The angle of rotation of the globe
    // We'll update this on every frame to make the globe spin
    let phi = 0;

    const globe = createGlobe(canvasRef.current as HTMLCanvasElement, {
      devicePixelRatio: 2,
      width: 500 * 2,
      height: 500 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.1, 0.1, 0.1],
      markers: [],
      opacity: 0.8,
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.

        // Get the current positions from our map
        state.markers = [...positions.current.values()];

        // Rotate the globe
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  const skills = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Cloudflare Workers", level: 75 },
    { name: "JavaScript", level: 90 },
    { name: "CSS/SCSS", level: 85 },
    { name: "Python", level: 70 },
    { name: "Docker", level: 65 },
  ];

  const projects = [
    {
      title: "Real-time Globe Visualization",
      description: "Interactive 3D globe showing live website visitors using Cloudflare Workers and Durable Objects.",
      tech: ["React", "TypeScript", "Cloudflare Workers", "WebSockets"],
      status: "Live",
    },
    {
      title: "Serverless API Platform",
      description: "High-performance API gateway built with edge computing for sub-50ms response times globally.",
      tech: ["Node.js", "Cloudflare Workers", "PostgreSQL", "Redis"],
      status: "In Development",
    },
    {
      title: "E-commerce Dashboard",
      description: "Modern analytics dashboard for e-commerce platforms with real-time data visualization.",
      tech: ["React", "D3.js", "Python", "FastAPI"],
      status: "Completed",
    },
  ];

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">TM</div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="wave">👋</span> Hi, I'm <span className="highlight">Tapan Meena</span>
            </h1>
            <p className="hero-subtitle">Full-Stack Developer & Cloud Architect</p>
            <p className="hero-description">
              I craft scalable web applications and real-time experiences using modern technologies. Passionate about serverless architecture, edge
              computing, and creating delightful user interfaces.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">
                View My Work
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="globe-container">
              <canvas ref={canvasRef as LegacyRef<HTMLCanvasElement>} className="globe-canvas" />
              <div className="globe-overlay">
                <div className="visitor-count">
                  <span className="count">{counter}</span>
                  <span className="label">{counter === 1 ? "visitor" : "visitors"} online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                With over 5 years of experience in full-stack development, I specialize in building high-performance web applications that scale. My
                expertise spans from crafting pixel-perfect user interfaces to designing robust backend architectures.
              </p>
              <p>
                I'm particularly passionate about modern web technologies, real-time applications, and the potential of edge computing to deliver
                lightning-fast user experiences globally. When I'm not coding, you'll find me exploring new technologies or contributing to
                open-source projects.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Client Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2 className="section-title">Skills & Expertise</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={skill.name} className="skill-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={project.title} className="project-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <span className={`project-status status-${project.status.toLowerCase().replace(" ", "-")}`}>{project.status}</span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="project-links">
                  <a href="#" className="project-link">
                    View Details
                  </a>
                  <a href="#" className="project-link">
                    Live Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Let's Work Together</h3>
              <p>
                I'm always interested in hearing about new opportunities, creative projects, or just having a chat about technology. Feel free to
                reach out!
              </p>
              <div className="contact-methods">
                <a href="mailto:tapanmeena1998@gmail.com" className="contact-method">
                  <span className="contact-icon">📧</span>
                  hello@tapanmeena.com
                </a>
                <a href="https://linkedin.com/in/tapanmeena" className="contact-method">
                  <span className="contact-icon">💼</span>
                  LinkedIn
                </a>
                <a href="https://github.com/tapanmeena" className="contact-method">
                  <span className="contact-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://twitter.com/tapanmeena3" className="contact-method">
                  <span className="contact-icon">🐦</span>
                  Twitter
                </a>
              </div>
            </div>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-logo">
                  <span className="logo-icon">🧠</span>
                  <span className="logo-text">TM</span>
                </div>
                <p className="footer-tagline">
                  Crafting digital experiences, one pixel at a time ✨
                </p>
              </div>
              
              <div className="footer-links">
                <div className="footer-section">
                  <h4>Quick Links</h4>
                  <a href="#home">Home</a>
                  <a href="#about">About</a>
                  <a href="#skills">Skills</a>
                  <a href="#projects">Projects</a>
                  <a href="#contact">Contact</a>
                </div>
                
                <div className="footer-section">
                  <h4>Connect</h4>
                  <a href="https://github.com/tapanmeena">GitHub</a>
                  <a href="https://linkedin.com/in/tapanmeena">LinkedIn</a>
                  <a href="https://twitter.com/tapanmeena3">Twitter</a>
                  <a href="mailto:tapanmeena1998@gmail.com">Email</a>
                </div>
                
                <div className="footer-section">
                  <h4>Fun Facts</h4>
                  <p className="fun-fact">🚀 Lines of code written: ∞</p>
                  <p className="fun-fact">☕ Coffee consumed: Dangerous levels</p>
                  <p className="fun-fact">🐛 Bugs created: "Features"</p>
                  <p className="fun-fact">💡 Ideas per minute: 42</p>
                </div>
              </div>
            </div>
            
            <div className="footer-divider"></div>
            
            <div className="footer-bottom">
              <div className="footer-copyright">
                <p>
                  &copy; 2025 Tapan Meena - The Digital Mastermind 🎭
                  <br />
                  <span className="tech-stack">
                    Powered by caffeine, curiosity & code
                  </span>
                </p>
              </div>
              
              <div className="footer-tech">
                <p className="tech-credits">
                  This globe shows real-time visitors from around the world 🌍
                  <br />
                  Built with{" "}
                  <a href="https://react.dev/">React</a>,{" "}
                  <a href="https://www.typescriptlang.org/">TypeScript</a>,{" "}
                  <a href="https://workers.cloudflare.com/">Cloudflare Workers</a>,{" "}
                  <a href="https://cobe.vercel.app/">Cobe</a> &{" "}
                  <a href="https://partykit.io/">PartyKit</a>
                </p>
              </div>
            </div>
            
            <div className="footer-easter-egg">
              <p>
                🎯 You found the footer! Here's a secret: I debug with console.log() and I'm not ashamed.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);
