import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Menu, Code, Cpu, Activity, Layout, Terminal, Zap, Globe, ChevronDown } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import ParticleBackground from './ParticleBackground';
import profileImg from './profile.jpg';



// --- NEW 3D TILT CARD COMPONENT (FIXED) ---
const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for rotation
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Calculate rotation based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    
    // Calculate width/height
    const width = rect.width;
    const height = rect.height;
    
    // Get mouse position relative to element center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate percentage (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative transition-all duration-200 ease-linear ${className}`}
    >
      {/* REMOVED THE WHITE PLACEHOLDER DIV HERE */}
      
      {/* This renders your actual profile card */}
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};
// --- COUNTER COMPONENT ---
const Counter = ({ from = 0, to, duration = 1.5, suffix = "" }) => {
  const nodeRef = useRef();
  const isInView = useInView(nodeRef, { once: true, margin: "0px" });

  useEffect(() => {
    const node = nodeRef.current;
    if (isInView) {
      const controls = animate(from, to, {
        duration: duration,
        onUpdate: (value) => {
          if (node) {
            node.textContent = Math.floor(value) + suffix;
          }
        },
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [from, to, isInView, suffix, duration]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
};

// --- NEW: AESTHETIC SPRING CURSOR ---
const AestheticCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Detect hover on clickable elements
      const target = e.target;
      const isClickable = target.tagName === 'A' || 
                          target.tagName === 'BUTTON' || 
                          target.closest('a') || 
                          target.closest('button') ||
                          target.classList.contains('cursor-pointer');
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <>
      {/* 1. The Small Dot (Instant Follow) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1 // Disappears slightly when hovering to let ring take over
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* 2. The Large Ring (Laggy Spring Follow) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/50 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.8 : 1, // Expands when hovering links
          borderColor: isHovering ? "rgb(168, 85, 247)" : "rgba(255, 255, 255, 0.3)", // Turns Purple on hover
          backgroundColor: isHovering ? "rgba(168, 85, 247, 0.1)" : "transparent"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15, 
          mass: 0.8 
        }}
      />
    </>
  );
};
// --- MATRIX DATA RAIN COMPONENT ---
const ZapLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate 15 streams of data
  const drops = Array.from({ length: 15 });

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group p-4 bg-black border border-slate-800 rounded-2xl text-slate-400 hover:text-cyan-400 hover:bg-slate-950 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/20 cursor-none overflow-visible"
    >
      {/* 1. HOVER GLOW BORDER (Pulsing Shield) */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-cyan-500/50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* 2. THE ICON (Kept on top) */}
      <div className="relative z-20">{children}</div>

      {/* 3. MATRIX RAIN EFFECT */}
      {isHovered && (
        <div className="absolute top-full left-0 w-full h-32 pointer-events-none overflow-visible z-10">
          {drops.map((_, i) => {
            // Random properties for "Chaos"
            const randomX = Math.floor(Math.random() * 40) - 20; // Spread left/right
            const randomDuration = 0.5 + Math.random() * 0.5;    // Fast speed
            const randomDelay = Math.random() * 0.5;             // Staggered start
            const height = Math.random() * 20 + 10;              // Length of the trail
            
            return (
              <motion.div
                key={i}
                initial={{ y: -10, opacity: 0 }}
                animate={{ 
                  y: 80,             // Shoot down
                  opacity: [0, 1, 0] // Flash in and out
                }}
                transition={{ 
                  duration: randomDuration, 
                  repeat: Infinity, 
                  delay: randomDelay,
                  ease: "easeIn"     // Accelerate like heavy rain
                }}
                style={{
                  left: '50%',
                  marginLeft: randomX,
                  height: height,
                }}
                // The "Meteor" Look: A gradient streak
                className="absolute top-0 w-[2px] bg-gradient-to-b from-cyan-300 via-cyan-500 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)] rounded-full"
              >
                {/* Optional: Add binary numbers at the tip of larger drops */}
                {height > 25 && (
                  <span className="absolute bottom-0 -left-[3px] text-[8px] text-white font-mono font-bold">
                    {Math.random() > 0.5 ? '1' : '0'}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </a>
  );
};
// --- SPOTLIGHT CARD ---
const SpotlightCard = ({ children, className = "", spotColor = "rgba(168, 85, 247, 0.25)" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
// --- NEW BIG & GLOWING PROJECT CAROUSEL ---
const ProjectCarousel = ({ projects }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % projects.length);
    }, 4000); // Slower interval (4s) for better viewing
    return () => clearInterval(interval);
  }, [projects.length]);

  const getCardStyle = (index) => {
    const len = projects.length;
    // Calculate distance from active card
    const offset = (index - active + len) % len;

    // CENTER CARD (Active) - Big & Glowing
   // CENTER CARD (Active) - With Breathing & Levitation
    if (offset === 0) {
      return { 
        x: "0%", 
        scale: 1, 
        opacity: 1, 
        zIndex: 20, 
        filter: "blur(0px) brightness(1.2)",
        display: "block",
        
        // --- ADDED: The Breathing Animation ---
        y: [0, -12, 0], // Floats up 12px and back down
        boxShadow: [
          "0px 0px 60px -10px rgba(168, 85, 247, 0.6)", // Purple Glow
          "0px 0px 90px -5px rgba(34, 211, 238, 0.8)",  // Cyan Burst (Peak)
          "0px 0px 60px -10px rgba(168, 85, 247, 0.6)"  // Back to Purple
        ],
        
        // --- ADDED: Loop settings ---
        transition: {
            // This handles the slide movement speed
            layout: { duration: 0.8, type: "spring" }, 
            // This handles the breathing loop
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      };
    }
    // RIGHT CARD (Next)
    else if (offset === 1) {
      return { 
        x: "110%", // Pushed far right
        scale: 0.8, 
        opacity: 0.4, 
        zIndex: 10, 
        filter: "blur(4px) brightness(0.6)",
        boxShadow: "none",
        display: "block"
      };
    }
    // LEFT CARD (Previous)
    else if (offset === len - 1) {
      return { 
        x: "-110%", // Pushed far left
        scale: 0.8, 
        opacity: 0.4, 
        zIndex: 10, 
        filter: "blur(4px) brightness(0.6)",
        boxShadow: "none",
        display: "block"
      };
    }
    // HIDDEN CARDS
    else {
      return { 
        x: "0%", 
        scale: 0, 
        opacity: 0, 
        zIndex: 0,
        display: "none" 
      };
    }
  };

  return (
    <div className="relative h-[600px] w-full flex justify-center items-center perspective-1000">
      {projects.map((project, i) => (
        <motion.div
          key={i}
          className="absolute w-[90%] md:w-[600px] rounded-3xl" // Increased Width to 600px
          initial={false}
          animate={getCardStyle(i)}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 15 }} // Smoother, longer transition
        >
          {/* Card Content */}
          <div className="bg-slate-990 border border-white/10 p-8 md:p-12 h-[450px] flex flex-col justify-between rounded-3xl relative overflow-hidden group">
             {/* Inner Gradient */}
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-50"></div>
             
             <div>
               <div className="flex justify-between items-start mb-6">
                 <div className="text-purple-400 bg-purple-500/10 p-4 rounded-2xl">
                   {project.icon}
                 </div>
                 <div className="bg-white/10 px-3 py-1 rounded-full text-xs text-white/70 uppercase tracking-widest font-bold">
                   Featured
                 </div>
               </div>
               
               <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
                 {project.title}
               </h3>
               
               <p className="text-slate-400 text-lg leading-relaxed">
                 {project.description}
               </p>
             </div>

             <div className="flex gap-3 flex-wrap mt-auto relative z-10">
                {project.tags.map(tag => (
                  <span key={tag} className="border border-white/10 bg-black/40 text-blue-300 px-4 py-2 rounded-xl text-sm font-medium">
                    {tag}
                  </span>
                ))}
             </div>
          </div>
        </motion.div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-10 flex gap-3 z-30">
        {projects.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-purple-500' : 'w-2 bg-slate-700 hover:bg-slate-600'}`} 
          />
        ))}
      </div>
    </div>
  );
};
// --- DATA ---
const personalData = {
  name: "Binayak Panda",
  email: "binayakpanda08@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/binayak-panda-2006b08p",
    github: "https://github.com/Binayak-panda",
  }
};

const skillCategories = [
  {
    title: "Engineering & Hardware",
    id: "hardware",
    items: [
      { name: "PLC Automation", icon: <Activity />, percent: 75, color: "text-cyan-400", stroke: "#22d3ee" },
      { name: "Arduino / IoT", icon: <Zap />, percent: 60, color: "text-yellow-400", stroke: "#facc15" },
      { name: "AutoCAD Design", icon: <Layout />, percent: 65, color: "text-red-400", stroke: "#f87171" },
      { name: "Circuit Analysis", icon: <Cpu />, percent: 45, color: "text-blue-400", stroke: "#60a5fa" },
    ]
  },
  {
    title: "Software & Logic",
    id: "software",
    items: [
      { name: "Python", icon: <Terminal />, percent: 45, color: "text-green-400", stroke: "#4ade80" },
      { name: "Java Development", icon: <Code />, percent: 55, color: "text-orange-400", stroke: "#fb923c" },
      { name: "C / Embedded C", icon: <Code />, percent: 85, color: "text-indigo-400", stroke: "#818cf8" },
      { name: "DSA", icon: <Globe />, percent: 20, color: "text-purple-400", stroke: "#c084fc" },
    ]
  }
];

const projects = [
  {
    title: "Automated Swing Bridge",
    description: "Engineered a PLC-based control system for a swing bridge mechanism. Implemented safety interlocks using limit switches and ladder logic to ensure collision-free operation during critical opening and closing sequences.",
    tags: ["PLC", "Automation", "Ladder Logic"],
    icon: <Layout size={40} />
  },
  {
    title: "Line Following Robot",
    description: "Built an autonomous robot capable of tracking complex paths using IR sensor arrays and Arduino. Optimized motor control logic for smooth cornering and speed adjustments, demonstrating real-time closed-loop control.",
    tags: ["Arduino", "Sensors", "Robotics"],
    icon: <Cpu size={40} />
  },
  {
    title: "Smart Traffic Controller",
    description: "Developed a simulation of a 4-way traffic junction using Java Swing. Implemented dynamic timing algorithms based on traffic density inputs to optimize flow and reduce congestion, featuring a custom GUI.",
    tags: ["Java", "GUI", "Algorithms"],
    icon: <Activity size={40} />
  },
  {
    title: "Food Order System",
    description: "Architected a console-based restaurant management system in C. Utilized Data Structures like Linked Lists and Queues to handle order processing, billing, and live inventory tracking efficiently.",
    tags: ["C", "Data Structures", "Memory Mgmt"],
    icon: <Terminal size={40} />
  }
];
// --- MAIN APP COMPONENT ---
const App = () => {
  const gradientText = "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500";

  return (
    // 'cursor-none' hides the default mouse so we can see our custom one
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white cursor-none">
      
      {/* --- THE NEW AESTHETIC CURSOR --- */}
      <AestheticCursor />
      {/* -------------------------------- */}

    {/* Navbar - Fully Transparent */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-8xl rounded-full border border-white/10 bg-slate-900/15 backdrop-blur-md transition-all">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="font-bold text-lg md:text-xl tracking-tight text-white cursor-pointer uppercase">
            <span className="text-blue-400">Designed To Move</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="relative group hover:text-white transition-colors cursor-none py-1">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-orange-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <div className="md:hidden text-white/70 cursor-pointer">
            <Menu size={24} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden text-center px-4 bg-black">
        <ParticleBackground />
        
        {/* Subtle Background Glow that follows mouse is managed by SpotlightCard in other sections, kept simple here for performance */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-slate-950 via-slate-950/50 to-transparent z-0 pointer-events-none"></div>

        <motion.div className="relative z-10 flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-7xl md:text-9xl font-semibold mb-6 tracking-tight drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400">{personalData.name}</h1>
          <div className="h-10 md:h-12 mb-10">
            <h2 className="text-xl md:text-2xl font-mono font-medium text-cyan-400 tracking-wider">
              <span className="text-blue-500 font-black text-3xl">&gt;</span>
              <span className="text-purple-400 font-bold">
                <Typewriter words={[' Electrical & Electronics Engineer', ' PLC & Automation Specialist', ' IoT Developer', ' Tech Enthusiast']} loop={0} cursor cursorStyle='_' typeSpeed={70} deleteSpeed={50} delaySpeed={1000} />
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-center gap-6 mt-4">
            <a href="#contact" className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-cyan-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] cursor-none">Contact Me</a>
            <div className="flex gap-6 items-center">
               <a href={personalData.socials.github} target="_blank" rel="noreferrer" className="cursor-none"><Github className="hover:text-cyan-400 transition-colors hover:scale-110" size={32} /></a>
               <a href={personalData.socials.linkedin} target="_blank" rel="noreferrer" className="cursor-none"><Linkedin className="hover:text-blue-400 transition-colors hover:scale-110" size={32} /></a>
            </div>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
          <a href="#about" className="flex flex-col items-center group cursor-none">
            <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2 relative overflow-hidden group-hover:border-white/60 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
               <motion.div className="w-1.5 h-3 bg-cyan-400 rounded-full relative z-10" animate={{ y: [0, 15, 0], opacity: [1, 0.5, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <span className="text-white/50 text-[10px] uppercase tracking-[0.25em] mt-3 group-hover:text-cyan-300 transition-colors font-medium">Scroll</span>
          </a>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-black px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-8">
               <div>
                 <h2 className="text-lg font-semibold text-cyan-400 tracking-wider uppercase mb-2">About Me</h2>
                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Binayak Panda</span>.</h1>
                 <p className="text-xl text-slate-300 font-medium">Electrical & Electronics Engineer with a passion for building smart, automated systems.</p>
               </div>
               <p className="text-slate-400 leading-relaxed text-lg">I bridge the gap between hardware and software, crafting innovative solutions that bring ideas to life.</p>
               
               <div className="flex flex-wrap gap-6 p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-800/80 rounded-xl"><Cpu className="w-6 h-6 text-cyan-400" /></div>
                    <div><div className="text-2xl font-bold text-white"><Counter to={4} suffix="+" /></div><div className="text-sm text-slate-400 font-medium">Projects</div></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-800/80 rounded-xl"><Code className="w-6 h-6 text-purple-400" /></div>
                    <div><div className="text-2xl font-bold text-white"><Counter to={10} suffix="k+" duration={2} /></div><div className="text-sm text-slate-400 font-medium">Lines Code</div></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-800/80 rounded-xl"><Zap className="w-6 h-6 text-yellow-400" /></div>
                    <div><div className="text-2xl font-bold text-white">∞</div><div className="text-sm text-slate-400 font-medium">Learning</div></div>
                 </div>
               </div>
             </motion.div>

            {/* Right Image Side - 3D TILT EFFECT WITH COLOR FIX */}
             <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative lg:ml-auto perspective-1000">
               
               {/* 1. The Colorful Gradient Border & Glow is defined here */}
              <TiltCard className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-[3px] shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                 
                 {/* 2. The Inner Dark Card */}

                 <div className="relative rounded-xl overflow-hidden bg-slate-900 h-full">
                   
                   {/* The Image */}
                   <img 
                        src={profileImg} 
                        alt="Binayak Panda" 
                        // REMOVED "grayscale" HERE so it is always colorful
                        className="w-full h-auto rounded-xl transition-all duration-500 object-cover pointer-events-none" 
                      />
                   
                   {/* Glass Sheen Effect */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>

                   {/* Text Overlay */}
                   <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
                     <p className="text-white font-bold text-xl tracking-wide translate-z-10">BINAYAK PANDA</p>
                     <p className="text-cyan-400 text-sm font-medium">Exploring the frontiers of tech.</p>
                   </div>
                 </div>
               </TiltCard>

               {/* Background Decorative Blur */}
               <div className="absolute top-6 -right-6 w-full h-full border-2 border-blue-500/20 rounded-3xl -z-10"></div>
             
             </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(147, 51, 234, 0.5) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical <span className={gradientText}>Arsenal</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">My toolkit for bridging the physical and digital worlds.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {skillCategories.map((category, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                variants={{
                  hover: { 
                    y: -5, 
                    borderColor: idx === 0 ? "rgba(34, 211, 238, 0.5)" : "rgba(168, 85, 247, 0.5)",
                    boxShadow: idx === 0 ? "0px 10px 30px -10px rgba(34, 211, 238, 0.2)" : "0px 10px 30px -10px rgba(168, 85, 247, 0.2)"
                  }
                }}
                className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 h-full"
              >
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  {idx === 0 ? <Zap className="text-cyan-400" /> : <Terminal className="text-purple-400" />}
                  {category.title}
                </h3>
                
                <div className="space-y-6">
                  {category.items.map((skill, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover="hover"
                      variants={{
                        hover: {
                          scale: 1.02, 
                          x: 5, 
                          backgroundColor: "rgba(30, 41, 59, 1)", 
                          borderColor: skill.stroke 
                        }
                      }}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 transition-colors group cursor-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg bg-slate-950 ${skill.color} group-hover:scale-110 transition-transform`}>{skill.icon}</div>
                        <span className="font-medium text-slate-200 text-lg group-hover:text-white transition-colors">{skill.name}</span>
                      </div>
                      
                      <div className="relative flex items-center justify-center w-14 h-14">
                        <svg className="transform -rotate-90 w-full h-full overflow-visible">
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                          <motion.circle 
                            cx="28" cy="28" r="24" 
                            stroke={skill.stroke} 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeLinecap="round" 
                            initial={{ strokeDasharray: "150", strokeDashoffset: "150" }} 
                            whileInView={{ strokeDashoffset: 150 - (150 * skill.percent) / 100 }} 
                            viewport={{ once: true }} 
                            variants={{
                              hover: {
                                strokeWidth: 6,
                                scale: 1.1,
                                filter: `drop-shadow(0 0 8px ${skill.stroke})`,
                                transition: { duration: 0.3 }
                              }
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }} 
                          />
                        </svg>
                        <span className="absolute text-xs font-bold text-white">
                           <Counter from={0} to={skill.percent} duration={1.5} suffix="%" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Projects Section */}
      <section id="projects" className="py-20 px-4 bg-black relative overflow-hidden">
        
        {/* --- Background Effects (Stars & Nebula) --- */}
        <div className="absolute inset-0 w-full h-full star-pattern"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        {/* ------------------------------------------- */}

        <div className="max-w-full mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured <span className={gradientText}>Projects</span></h2>
            <p className="text-slate-400">Swiping through engineering excellence.</p>
          </div>
          
          {/* THE CAROUSEL COMPONENT */}
          <ProjectCarousel projects={projects} />
          
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-black relative overflow-hidden px-4">
        <div className="absolute inset-0 w-full h-full star-pattern"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get in <span className="text-cyan-400">Touch</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full"></div>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Whether you want to discuss Electric Vehicles, PLC Automation, or just say hi—my inbox is always open.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400"><Mail size={24} /></div>
                  <div><h3 className="text-lg font-bold text-white">Email Me</h3><a href={`mailto:${personalData.email}`} className="text-slate-400 hover:text-cyan-400 transition-colors">{personalData.email}</a></div>
                </div>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><Linkedin size={24} /></div>
                  <div><h3 className="text-lg font-bold text-white">LinkedIn</h3><a href={personalData.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-purple-400 transition-colors">Let's connect professionally</a></div>
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-white font-semibold mb-4">Follow my work on</h3>
                <div className="flex gap-4">
                  <a href={personalData.socials.github} target="_blank" rel="noreferrer" className="p-4 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-none"><Github size={24} /></a>
                  <a href={personalData.socials.linkedin} target="_blank" rel="noreferrer" className="p-4 bg-slate-900 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all cursor-none"><Linkedin size={24} /></a>
                  <a href={`mailto:${personalData.email}`} className="p-4 bg-slate-900 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all cursor-none"><Mail size={24} /></a>
                </div>
              </div>
              {/* --- NEW QUICK LINKS --- */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4">Quick Access</h3>
                <div className="flex gap-6 text-sm font-medium text-slate-400">
                  <a href="#home" className="hover:text-cyan-400 transition-colors cursor-none">Home</a>
                  <a href="#about" className="hover:text-cyan-400 transition-colors cursor-none">About</a>
                  <a href="#skills" className="hover:text-cyan-400 transition-colors cursor-none">Skills</a>
                  <a href="#projects" className="hover:text-cyan-400 transition-colors cursor-none">Projects</a>
                </div>
              </div>
            </motion.div>
            
            <SpotlightCard className="p-8" spotColor="rgba(34, 211, 238, 0.15)">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div><label className="block text-sm font-medium text-slate-400 mb-2">Your Name</label><input type="text" placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-none" /></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-2">Your Email</label><input type="email" placeholder="john@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-none" /></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-2">Message</label><textarea rows="4" placeholder="I have an idea for a project..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-none"></textarea></div>
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 cursor-none">Send Message</button>
              </form>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* --- BLUEPRINT FOOTER WITH ELECTRIC GROUNDING --- */}
        <footer className="py-20 bg-black relative overflow-hidden flex flex-col items-center justify-center">
          
         {/* --- LIQUID PLASMA NAME WITH REFLECTION --- */}
        
        {/* 1. Define the Animation Style */}
        <style>{`
          @keyframes textShine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-text-shine {
            background-size: 200% auto;
            animation: textShine 5s linear infinite;
          }
        `}</style>

        <div className="relative mb-10 z-10 text-center">
          
          {/* 2. THE MAIN NAME (Moving Gradient) */}
          <h1 className="text-[12vw] md:text-[150px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-text-shine select-none relative z-10">
            Binayak Panda
          </h1>

          {/* 3. THE REFLECTION (Flipped & Faded) */}
          <h1 className="absolute top-full left-0 w-full text-[12vw] md:text-[150px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-text-shine select-none opacity-20 origin-bottom transform -scale-y-100 blur-sm pointer-events-none">
            Binayak Panda
          </h1>

          {/* 4. Floor Fade (Hides the bottom of reflection) */}
          <div className="absolute top-full left-0 w-full h-full bg-gradient-to-b from-transparent to-black pointer-events-none z-20"></div>

        </div>

          {/* 2. Social Icons (Now with Zap Effect!) */}
          <div className="flex gap-6 mb-8 relative z-20">
              <ZapLink href={personalData.socials.github}>
                <Github size={28} />
              </ZapLink>

              <ZapLink href={personalData.socials.linkedin}>
                <Linkedin size={28} />
              </ZapLink>

              <ZapLink href={`mailto:${personalData.email}`}>
                <Mail size={28} />
              </ZapLink>
          </div>

          {/* 3. The Ground Line (Where the electricity flows to) */}
          <div className="relative w-full max-w-2xl h-10 flex items-center justify-center mb-8">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
              <div className="relative w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] z-10"></div>
              <div className="absolute w-20 h-20 bg-cyan-500/20 blur-xl rounded-full"></div>
          </div>

          <p className="text-slate-500 font-medium text-sm relative z-20">© 2026 Binayak Panda. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default App;