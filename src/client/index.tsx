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
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
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

  // Form handling functions
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate all fields
      const errors = {
        name: validateField('name', formData.name),
        email: validateField('email', formData.email),
        message: validateField('message', formData.message)
      };

      setFormErrors(errors);

      // Check if there are any errors
      if (Object.values(errors).some(error => error !== '')) {
        throw new Error('Please fix the validation errors');
      }

      // Create professional email template
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const emailBody = `Hello Tapan,

I found your portfolio website and would like to get in touch.

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

---
This message was sent from your portfolio contact form at tapanmeena.com

Best regards,
${formData.name}`;

      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:tapanmeena1998@gmail.com?subject=${subject}&body=${body}`;
      
      // Try to open email client
      window.open(mailtoLink, '_self');
      
      // Show success message after a short delay
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setFormErrors({ name: '', email: '', message: '' });
        setSubmitStatus('success');
        
        // Auto-clear success message after 10 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 10000);
      }, 1000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
      // Auto-clear error message after 8 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillCategories = [
    {
      category: "Cloud & Data Platforms",
      icon: "☁️",
      skills: [
        { name: "Azure Data Factory", level: 95 },
        { name: "Microsoft Fabric", level: 85 },
        { name: "Azure Databricks", level: 90 },
        { name: "Azure Blob Storage", level: 85 },
      ]
    },
    {
      category: "Analytics & BI",
      icon: "📊",
      skills: [
        { name: "Power BI", level: 95 },
        { name: "DAX", level: 85 },
        { name: "Power Platform", level: 80 },
      ]
    },
    {
      category: "Programming & Databases",
      icon: "💻",
      skills: [
        { name: "PySpark", level: 90 },
        { name: "Python", level: 85 },
        { name: "SQL Server", level: 90 },
        { name: "T-SQL", level: 90 },
      ]
    },
    {
      category: "Data Engineering",
      icon: "🔧",
      skills: [
        { name: "Delta Lake", level: 80 },
      ]
    }
  ];

  const projects = [
    {
      title: "Enterprise ETL Pipeline Platform",
      description: "Designed scalable ETL pipelines using Azure Data Factory, processing 100M+ records from REST APIs and databases into Azure Data Lake.",
      tech: ["Azure Data Factory", "Azure Databricks", "PySpark", "Azure SQL", "Delta Lake"],
      status: "Live",
    },
    {
      title: "Microsoft Fabric Analytics Solution",
      description: "Built unified data workflows with Lakehouse architecture, enabling Direct Lake integration with Power BI for real-time analytics.",
      tech: ["Microsoft Fabric", "Power BI", "OneLake", "Semantic Models", "Direct Lake"],
      status: "Live",
    },
    {
      title: "Power BI Enterprise Dashboards",
      description: "Developed 200+ Power BI dashboards with advanced DAX, RLS, and performance tuning for 5,000+ enterprise stakeholders.",
      tech: ["Power BI", "DAX", "Power Query", "RLS", "Custom Visuals"],
      status: "Completed",
    },
    {
      title: "Power Platform Automation Suite",
      description: "Automated business workflows using Power Automate and Power Apps, reducing manual processes by 60% and improving efficiency.",
      tech: ["Power Automate", "Power Apps", "SharePoint", "Teams", "Canvas Apps"],
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
            <p className="hero-subtitle">Senior Data Engineer & Analytics Specialist</p>
            <p className="hero-description">
              I design and build robust data platforms using Azure and Microsoft Fabric, creating scalable ETL pipelines that process millions of records daily. 
              Specialized in Power BI analytics, Azure Databricks, and delivering data-driven insights that empower business decisions across enterprise organizations.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">
                View My Data Projects
              </a>
              <a href="#contact" className="btn btn-secondary">
                Let's Connect
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
                With over 5 years of experience as a Senior Data Engineer at MAQ Software, I specialize in building and optimizing data platforms 
                using Azure and Microsoft Fabric. My expertise spans designing scalable ETL pipelines with Azure Data Factory, performing advanced 
                data transformations using Azure Databricks and PySpark, and creating enterprise-grade Power BI solutions.
              </p>
              <p>
                I'm passionate about the Microsoft ecosystem and have hands-on experience with the latest technologies including Microsoft Fabric's 
                Lakehouse architecture, Direct Lake integration, and Power Platform automation. My work directly impacts business decisions for 
                thousands of stakeholders through data-driven insights and automated workflows. I'm certified in Microsoft Fabric Analytics 
                Engineer (DP-600) and Data Engineer (DP-700) technologies.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Power BI Dashboards</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years at MAQ Software</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100M+</span>
                  <span className="stat-label">Records Processed Daily</span>
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
          <div className="skills-categories">
            {skillCategories.map((category, categoryIndex) => (
              <div key={category.category} className="skill-category" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h3 className="category-title">{category.category}</h3>
                </div>
                <div className="category-skills">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="skill-item" style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}>
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
                  tapanmeena1998@gmail.com
                </a>
                <a href="https://linkedin.com/in/tapanmeena" className="contact-method">
                  <span className="contact-icon">💼</span>
                  LinkedIn
                </a>
                <a href="https://github.com/tapanmeena" className="contact-method">
                  <span className="contact-icon">🐙</span>
                  GitHub
                </a>
                <a href="tel:+918050851286" className="contact-method">
                  <span className="contact-icon">�</span>
                  +91-8050851286
                </a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              {submitStatus === 'success' && (
                <div className="form-message success">
                  <span className="message-icon">✅</span>
                  Message sent successfully! Your email client should have opened with a pre-filled message. If not, you can email me directly at tapanmeena1998@gmail.com
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="form-message error">
                  <span className="message-icon">❌</span>
                  Please check all fields are filled correctly and try again. You can also reach me directly at tapanmeena1998@gmail.com
                </div>
              )}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  disabled={isSubmitting}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  disabled={isSubmitting}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className={formErrors.message ? 'error' : ''}
                  placeholder="Tell me about your project, question, or just say hello..."
                ></textarea>
                {formErrors.message && <span className="field-error">{formErrors.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
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
                  <a href="tel:+918050851286">Phone</a>
                  <a href="mailto:tapanmeena1998@gmail.com">Email</a>
                </div>
                
                <div className="footer-section">
                  <h4>Recent Achievements</h4>
                  <p className="fun-fact">🏆 Champion of the Quarter (Dec 2024)</p>
                  <p className="fun-fact">⭐ Rising Star Top 3 (Mar 2023)</p>
                  <p className="fun-fact">� 200+ Power BI Dashboards</p>
                  <p className="fun-fact">🎓 Microsoft Fabric Certified</p>
                </div>
              </div>
            </div>
            
            <div className="footer-divider"></div>
            
            <div className="footer-bottom">
              <div className="footer-copyright">
                <p>
                  &copy; 2025 Tapan Meena - Senior Data Engineer @ MAQ Software �
                  <br />
                  <span className="tech-stack">
                    IIT Dharwad Graduate | Microsoft Certified | 5+ Years Experience
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
                  <br />
                  Data Engineering powered by{" "}
                  <a href="https://azure.microsoft.com/en-us/products/data-factory">Azure Data Factory</a>,{" "}
                  <a href="https://azure.microsoft.com/en-us/products/databricks">Azure Databricks</a> &{" "}
                  <a href="https://www.microsoft.com/en-us/microsoft-fabric">Microsoft Fabric</a>
                </p>
              </div>
            </div>
            
            <div className="footer-easter-egg">
              <p>
                🎯 You found the footer! Here's a secret: I optimize ETL pipelines with PySpark and I'm proud of it! 
                Currently processing 100M+ records daily at MAQ Software. 🚀
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
