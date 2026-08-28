import React, { useState, useEffect, useRef, Suspense } from 'react';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Activity, Zap, Shield, ArrowRight, CheckCircle2, Play, Users, Clock, 
  Pill, Stethoscope, Sparkles, Cpu, ChevronRight, Star, Heart, MapPin, 
  Mic, Radio, Send, Award, DollarSign, Smartphone, HelpCircle, ChevronDown, Check, X, Rocket
} from 'lucide-react';
import '../App.css';

gsap.registerPlugin(ScrollTrigger);

const Hero3D = React.lazy(() => import('../components/Hero3D'));

function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const mockupRef = useRef(null);

  // Interactive Live Demo Sandbox State
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' | 'doctor' | 'pharmacy'
  const [demoToken, setDemoToken] = useState(14);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState(false);
  const [typedDiagnosis, setTypedDiagnosis] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);

  // Interactive ROI Calculator State
  const [patientsPerDay, setPatientsPerDay] = useState(45);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // State for HUD telemetry during launch
  const [altitude, setAltitude] = useState("0 M");
  const [hudVelocity, setHudVelocity] = useState("MACH 0.0");
  const [hudStage, setHudStage] = useState("IGNITION READY");

  // Upward Cloud & Star Rocket Lift-off Sequence
  const handleLaunchRocket = (e, targetPath = '/auth') => {
    if (e) e.preventDefault();
    if (isLaunching) return;
    setIsLaunching(true);

    const tl = gsap.timeline({
      onComplete: () => {
        navigate(targetPath, { state: { fromLaunch: true } });
      }
    });

    // 1. Initial Ignition Blast & Page Drops Downwards
    tl.to(".sky-transition-bg", { opacity: 1, duration: 0.35, ease: "power2.out" }, 0)
      .to(".altitude-hud-card", { opacity: 1, duration: 0.25 }, 0.1)
      .to(".hero-wrapper, .landing-section, .navbar, footer", {
        y: "85vh",
        scale: 0.88,
        filter: "blur(12px)",
        opacity: 0.05,
        duration: 0.75,
        ease: "power2.in"
      }, 0)
      // 2. Volumetric Clouds rush downwards across the screen
      .fromTo(".cloud-puff", 
        { y: "-40vh", opacity: 0, scale: 0.8 },
        { y: "140vh", opacity: 0.85, scale: 1.4, duration: 0.85, stagger: 0.08, ease: "power2.in" },
        0.15
      )
      // 3. Rocket ascends vertically upwards through clouds
      .fromTo(".liftoff-rocket-wrapper",
        { y: "40vh", opacity: 0, scale: 0.8 },
        { y: "-130vh", opacity: 1, scale: 1.2, duration: 0.95, ease: "power3.in" },
        0.2
      )
      // 4. Vertical Starfield warp streaks rush downwards at hypersonic speed
      .fromTo(".starfield-warp-vertical",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        0.4
      )
      .fromTo(".star-streak-vert",
        { y: "-60vh", opacity: 0 },
        { y: "130vh", opacity: 1, duration: 0.65, stagger: 0.02, ease: "power4.in" },
        0.45
      )
      // 5. Final blinding celestial supernova flash
      .to(".warp-celestial-flash", {
        opacity: 1,
        duration: 0.35,
        ease: "power2.in"
      }, 1.1);

    // Dynamic Telemetry HUD Ticker
    setTimeout(() => {
      setAltitude("3,200 M");
      setHudVelocity("MACH 4.2");
      setHudStage("TROPOSPHERE BREAK");
    }, 200);

    setTimeout(() => {
      setAltitude("28,500 M");
      setHudVelocity("MACH 14.8");
      setHudStage("MESOSPHERE / HYPERSPACE");
    }, 550);

    setTimeout(() => {
      setAltitude("120,000 M");
      setHudVelocity("WARP 1.0");
      setHudStage("ORBIT ACHIEVED • ARRIVING");
    }, 950);
  };

  // Voice AI diagnosis typing simulator
  useEffect(() => {
    if (isSpeaking) {
      setTypedDiagnosis('');
      setGeneratedPdf(false);
      const textToType = "Patient presents with fever (101°F) and acute headache since 2 days. Prescribing Paracetamol 500mg (2x daily) and Amoxicillin 250mg for 5 days. Blood test recommended.";
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < textToType.length) {
          setTypedDiagnosis(prev => prev + textToType.charAt(idx));
          idx++;
        } else {
          clearInterval(interval);
          setIsSpeaking(false);
          setGeneratedPdf(true);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  // 3D Tilt Effect on Mockup Window
  const handleMouseMove = (e) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -5;
    const tiltY = (x / (rect.width / 2)) * 5;
    
    gsap.to(mockupRef.current, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = () => {
    if (!mockupRef.current) return;
    gsap.to(mockupRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  useEffect(() => {
    // 1. Cinematic Multi-Layered Hero Intro Animation Sequence
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Step A: Ambient Glow Orbs bloom into life
    tl.fromTo(".glow-orb", 
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 0.4, duration: 1.2, ease: "power2.out" }
    )
    // Step B: Navbar drops in smoothly with slight spring
    .fromTo(".nav-container", 
      { y: -50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, clearProps: "all" },
      "-=0.9"
    )
    // Step C: Floating Pill Badge pops in with bounce
    .fromTo(".hero-pill-badge", 
      { scale: 0.7, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(2)", clearProps: "all" },
      "-=0.6"
    )
    // Step D: Kinetic 3D Headline lines slide & rotate up
    .fromTo(".hero-title-line", 
      { y: 55, opacity: 0, rotateX: 25 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.0, stagger: 0.16, ease: "power4.out", clearProps: "all" },
      "-=0.5"
    )
    // Step E: Hero Subtitle fades & glides up
    .fromTo(".hero-description", 
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
      "-=0.6"
    )
    // Step F: Dual CTA Action Buttons pop & spring in
    .fromTo(".hero-cta-group > *", 
      { scale: 0.82, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "back.out(2.0)", clearProps: "all" },
      "-=0.5"
    )
    // Step G: 3D Interactive Terminal Ascends & De-blurs
    .fromTo(".interactive-mockup-window", 
      { y: 90, rotateX: 22, scale: 0.9, opacity: 0, filter: "blur(10px)" },
      { y: 0, rotateX: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power4.out", clearProps: "all" },
      "-=0.5"
    )
    // Step H: Inner Terminal Cards Stagger in
    .fromTo(".mock-card-panel", 
      { y: 35, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.4)", clearProps: "all" },
      "-=0.6"
    );

    // 2. Safe Scroll Animations with clearProps
    gsap.from(".bento-card", {
      opacity: 0,
      y: 35,
      duration: 0.7,
      stagger: 0.12,
      clearProps: "all",
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 85%",
        once: true
      }
    });

    gsap.from(".calculator-card", {
      opacity: 0,
      scale: 0.96,
      y: 35,
      duration: 0.7,
      clearProps: "all",
      scrollTrigger: {
        trigger: ".calculator-card",
        start: "top 85%",
        once: true
      }
    });

    gsap.from(".compare-card", {
      opacity: 0,
      y: 35,
      duration: 0.7,
      stagger: 0.15,
      clearProps: "all",
      scrollTrigger: {
        trigger: ".comparison-grid",
        start: "top 85%",
        once: true
      }
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(refreshTimer);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Calculate ROI values
  const hoursSavedMonth = Math.round((patientsPerDay * 6 * 26) / 60);
  const extraRevenueMonth = (patientsPerDay * 180 * 26).toLocaleString('en-IN');
  const paperlessPrescriptions = (patientsPerDay * 26).toLocaleString('en-IN');

  const faqs = [
    {
      q: "How does CareGrid live queue tracking work for patients?",
      a: "When patients book through CareGrid, they receive a live smart token. The app calculates their exact waiting time based on real-time doctor consultation speeds, letting them arrive right when it's their turn."
    },
    {
      q: "Do doctors need special hardware or training to use AI Prescriptions?",
      a: "Zero extra hardware needed. Doctors can use their existing laptop, tablet, or phone. Simply tap the microphone, speak naturally during the diagnosis, and our medical NLP engine generates a digital, structured PDF instantly."
    },
    {
      q: "How does the partner pharmacy get notified?",
      a: "As soon as the doctor approves the digital prescription, CareGrid sends an encrypted dispatch ping directly to the clinic's partnered pharmacy downstairs. Medicines are packaged before the patient even reaches the pharmacy counter."
    },
    {
      q: "Is patient healthcare data secure and HIPAA / GDPR compliant?",
      a: "Yes. All health records, audio transcriptions, and medical files are end-to-end encrypted with AES-256 and stored on isolated Firestore multi-tenant security layers."
    },
    {
      q: "What are the platform charges for doctors and clinics?",
      a: "Basic queue management and clinic profiles are 100% free with zero commission on consultation fees. Advanced AI voice prescriptions and predictive pharmacy analytics are available as high-value monthly add-ons."
    }
  ];

  return (
    <div className="app-container" ref={heroRef}>
      
      {/* ================= UPWARD CLOUD & STAR ROCKET LIFTOFF SEQUENCE ================= */}
      {isLaunching && (
        <div className="liftoff-overlay">
          <div className="sky-transition-bg"></div>

          {/* Volumetric Clouds */}
          <div className="clouds-container">
            <div className="cloud-puff cloud-puff-1"></div>
            <div className="cloud-puff cloud-puff-2"></div>
            <div className="cloud-puff cloud-puff-3"></div>
          </div>

          {/* Vertical Warp Speed Stars */}
          <div className="starfield-warp-vertical">
            {[...Array(35)].map((_, i) => (
              <div 
                key={i} 
                className="star-streak-vert" 
                style={{
                  left: `${(i * 2.8) + (i % 2) * 1.5}%`,
                  height: `${120 + ((i * 17) % 180)}px`,
                  animationDelay: `${(i % 5) * 0.05}s`
                }}
              ></div>
            ))}
          </div>

          {/* Rocket Ascending Vertically */}
          <div className="liftoff-rocket-wrapper">
            <div className="rocket-ship-vertical">
              <div className="rocket-cockpit-window"></div>
              <div className="rocket-fin-left"></div>
              <div className="rocket-fin-right"></div>
            </div>
            <div className="rocket-vertical-plume"></div>
          </div>

          {/* Sci-Fi Altitude HUD */}
          <div className="altitude-hud-card">
            <span className="hud-title">CareGrid Launch OS</span>
            <span className="hud-val">{altitude} • {hudVelocity}</span>
            <span className="hud-sub">{hudStage}</span>
          </div>

          {/* Supernova Celestial Flash */}
          <div className="warp-celestial-flash"></div>
        </div>
      )}

      {/* ================= UNIFIED FULL-PAGE 3D & GLOW BACKDROP ================= */}
      <div className="ambient-bg">
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
        <div className="grid-matrix"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      {/* Floating Modern Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="brand-container">
            <img src="/caregrid-logo.png" alt="CareGrid" className="nav-logo" />
            <span className="brand-name">
              <span className="brand-care">Care</span><span className="brand-grid">Grid</span>
            </span>
          </Link>

          <div className="nav-links">
            <a href="#ecosystem">The Ecosystem</a>
            <a href="#features">Features</a>
            <a href="#calculator">ROI Calculator</a>
            <a href="#compare">Comparison</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="nav-right-actions">
            <button 
              onClick={(e) => handleLaunchRocket(e, '/auth')} 
              className="nav-btn-primary" 
              style={{border: 'none', cursor: 'pointer'}}
            >
              Launch App <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-wrapper">
        <div className="hero-inner">
          

          <h1 className="hero-title-main">
            <span className="hero-title-line">The Unified OS for</span> <br />
            <span className="hero-title-line text-gradient-emerald">Modern Healthcare.</span>
          </h1>

          <p className="hero-description">
            CareGrid eliminates crowded waiting rooms, transforms doctor voice notes into instant AI prescriptions, and links local pharmacies into a 30-minute hyper-local delivery loop.
          </p>

          <div className="hero-cta-group">
            <button 
              onClick={(e) => handleLaunchRocket(e, '/auth')} 
              className="btn-glow-primary"
            >
              <Zap size={18} /> Get Started Free <Rocket size={18} />
            </button>
            <a href="#ecosystem" className="btn-glass-secondary">
              <Play size={16} /> Explore Live Interactive Demo
            </a>
          </div>

          {/* ================= 3D TILT PRODUCT SHOWCASE ================= */}
          <div 
            className="hero-mockup-container" 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
          >
            <div className="interactive-mockup-window" ref={mockupRef}>
              <div className="window-header">
                <div className="window-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="window-title-badge">CareGrid Unified Terminal • Live Demo Mode</span>
                <span className="live-badge-mini">● Realtime Sync</span>
              </div>

              <div className="mockup-grid-live">
                
                {/* 1. Patient Radar Preview */}
                <div className="mock-card-panel">
                  <div className="mock-card-header">
                    <h4><Smartphone size={16} className="text-sky"/> Live Token Radar</h4>
                    <span className="live-badge-mini">Live</span>
                  </div>
                  <div className="live-token-counter">
                    <div className="token-big-num">#{demoToken}</div>
                    <div className="token-label-text">Your Token Number</div>
                  </div>
                  <div className="mock-queue-pills">
                    <div className="queue-row-mini active">
                      <span>Currently Inside</span>
                      <strong className="text-emerald">Token #12</strong>
                    </div>
                    <div className="queue-row-mini">
                      <span>Est. Waiting Time</span>
                      <strong className="text-sky">{Math.max(0, (demoToken - 12) * 15)} mins</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Doctor AI Speech Desk */}
                <div className="mock-card-panel">
                  <div className="mock-card-header">
                    <h4><Mic size={16} className="text-emerald"/> AI Voice Desk</h4>
                    <span style={{fontSize: '0.75rem', color: '#10b981'}}>NLP Active</span>
                  </div>
                  
                  <div className="wave-animation-box">
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                  </div>

                  <div className="prescription-preview-box">
                    <strong style={{color: '#38bdf8', display: 'block', marginBottom: '2px'}}>Prescription Generated:</strong>
                    <span>Paracetamol 500mg (2x/day), Amoxicillin 250mg (8h).</span>
                  </div>
                </div>

                {/* 3. Pharmacy Ping Loop */}
                <div className="mock-card-panel">
                  <div className="mock-card-header">
                    <h4><Pill size={16} className="text-purple"/> Pharmacy Loop</h4>
                    <span style={{fontSize: '0.75rem', color: '#a78bfa'}}>Auto-Ping</span>
                  </div>
                  
                  <div className="pharmacy-ping-status">
                    <CheckCircle2 size={24} className="text-emerald" />
                    <div>
                      <strong style={{fontSize: '0.85rem', color: '#fff'}}>Order Dispatched</strong>
                      <p style={{fontSize: '0.75rem', color: '#94a3b8', margin: 0}}>Medication packed for Token #{demoToken}</p>
                    </div>
                  </div>

                  <div style={{marginTop: '16px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center'}}>
                    ⏱️ Ready before patient reaches desk
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= INTERACTIVE ECOSYSTEM SHOWCASE ================= */}
      <section className="landing-section" id="ecosystem">
        <div className="section-head-center">
          <span className="section-tagline">Three Core Stakeholders</span>
          <h2 className="section-title-large">One Unified Seamless Ecosystem.</h2>
          <p className="section-subtitle-text">
            Experience how CareGrid synchronizes patients, doctor clinics, and neighborhood pharmacies in a zero-friction loop.
          </p>
        </div>

        {/* Animated Interactive Tabs */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap'}}>
          <button 
            onClick={() => setActiveTab('patient')}
            className={`tab-button-pill ${activeTab === 'patient' ? 'active' : ''}`}
          >
            <Smartphone size={18}/> 1. For Patients (Zero Crowds)
          </button>
          <button 
            onClick={() => setActiveTab('doctor')}
            className={`tab-button-pill ${activeTab === 'doctor' ? 'active' : ''}`}
          >
            <Mic size={18}/> 2. For Doctors (AI Voice OS)
          </button>
          <button 
            onClick={() => setActiveTab('pharmacy')}
            className={`tab-button-pill ${activeTab === 'pharmacy' ? 'active' : ''}`}
          >
            <Pill size={18}/> 3. For Pharmacies (Fast POS)
          </button>
        </div>

        {/* Tab Content Box with Smooth Transition Animation */}
        <div key={activeTab} className="calculator-card tab-content-anim" style={{gridTemplateColumns: '1fr 1fr'}}>
          {activeTab === 'patient' && (
            <>
              <div>
                <span className="section-tagline">Patient Freedom</span>
                <h3 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#fff'}}>Wait in your living room, not an infectious clinic.</h3>
                <p style={{color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px'}}>
                  Track your exact queue position with real-time GPS and token distance. Receive instant alerts when you're 2 patients away.
                </p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Live dynamic token countdown</span></div>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Instant digital prescription PDF download</span></div>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>One-tap pharmacy ordering with 20% discount</span></div>
                </div>
              </div>
              <div className="mock-card-panel" style={{padding: '30px', textAlign: 'center'}}>
                <h4 style={{fontSize: '1.1rem', color: '#fff'}}>Interactive Queue Simulation</h4>
                <p className="text-muted" style={{fontSize: '0.85rem', marginBottom: '20px'}}>Drag the slider to test your waiting time:</p>
                <input 
                  type="range" 
                  min="12" 
                  max="30" 
                  value={demoToken} 
                  onChange={(e) => setDemoToken(Number(e.target.value))}
                  className="styled-slider"
                />
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                  <div className="calc-stat-box" style={{flex: 1, marginRight: '10px'}}>
                    <div className="num">#{demoToken}</div>
                    <div className="label">Your Token</div>
                  </div>
                  <div className="calc-stat-box" style={{flex: 1}}>
                    <div className="num" style={{color: '#38bdf8'}}>{Math.max(0, (demoToken - 12) * 15)}m</div>
                    <div className="label">Estimated Wait</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'doctor' && (
            <>
              <div>
                <span className="section-tagline">Doctor Efficiency</span>
                <h3 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#fff'}}>Never type prescriptions on a keyboard again.</h3>
                <p style={{color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px'}}>
                  Speak naturally during consultation. CareGrid’s medical NLP engine extracts symptoms, diagnosis, dosages, and creates a verified PDF automatically.
                </p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Saves 6 minutes per patient consultation</span></div>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Automatic bill dispatch to patient phone</span></div>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Complete medical history records archive</span></div>
                </div>
              </div>
              <div className="mock-card-panel" style={{padding: '30px', textAlign: 'center'}}>
                <h4 style={{fontSize: '1.1rem', color: '#fff'}}>Voice Prescription Sandbox</h4>
                <p className="text-muted" style={{fontSize: '0.85rem', marginBottom: '18px'}}>Click the microphone to test AI diagnosis:</p>
                
                <button 
                  onClick={() => setIsSpeaking(true)}
                  disabled={isSpeaking}
                  className="btn-glow-primary"
                  style={{margin: '0 auto 16px', padding: '12px 28px'}}
                >
                  <Mic size={18} /> {isSpeaking ? "Listening & Transcribing..." : "Tap to Speak"}
                </button>

                {isSpeaking && (
                  <div className="wave-animation-box" style={{height: '40px'}}>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                    <div className="sound-bar"></div>
                  </div>
                )}

                {typedDiagnosis && (
                  <div style={{
                    background: 'rgba(0,0,0,0.4)', 
                    border: '1px solid rgba(56,189,248,0.2)', 
                    borderRadius: '12px', 
                    padding: '12px', 
                    fontSize: '0.85rem', 
                    color: '#38bdf8', 
                    textAlign: 'left',
                    marginBottom: '10px'
                  }}>
                    🎙️ <em>"{typedDiagnosis}"</em>
                  </div>
                )}

                {generatedPdf && (
                  <div className="prescription-preview-box" style={{background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.35)'}}>
                    <strong className="text-emerald">✨ Prescription PDF Generated:</strong>
                    <p style={{margin: '4px 0 0', fontSize: '0.82rem'}}>Dr. Sharma • Verified AI Model • Dispatched to Pharmacy</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'pharmacy' && (
            <>
              <div>
                <span className="section-tagline">Pharmacy Defense</span>
                <h3 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#fff'}}>Beat quick-commerce with instant local orders.</h3>
                <p style={{color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px'}}>
                  Neighborhood pharmacies lose customers to 10-minute delivery apps. CareGrid sends local clinic prescriptions directly to their counter in real-time.
                </p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Guaranteed local patient retention</span></div>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Pre-packaged orders before patient checkout</span></div>
                  <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Automated inventory stock sync</span></div>
                </div>
              </div>
              <div className="mock-card-panel" style={{padding: '30px'}}>
                <h4 style={{fontSize: '1.1rem', color: '#fff'}}>Live Dispatch Pipeline</h4>
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div className="queue-row-mini active">
                    <span>1. Doctor Approved Prescription</span>
                    <strong className="text-emerald">0.2s</strong>
                  </div>
                  <div className="queue-row-mini active">
                    <span>2. Partner Pharmacy Pinged</span>
                    <strong className="text-emerald">Instant</strong>
                  </div>
                  <div className="queue-row-mini active">
                    <span>3. Packaging & Ready for Pickup</span>
                    <strong className="text-sky">Under 5 mins</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= BENTO GRID FEATURES ================= */}
      <section className="landing-section" id="features">
        <div className="section-head-center">
          <span className="section-tagline">Engineering Excellence</span>
          <h2 className="section-title-large">Built for Zero Latency Healthcare.</h2>
          <p className="section-subtitle-text">Every feature designed to eliminate waiting, reduce physician burnout, and protect local businesses.</p>
        </div>

        <div className="bento-grid">
          {/* Card 1 */}
          <div className="bento-card bento-span-2">
            <div className="bento-icon-wrapper">
              <Radio size={28} />
            </div>
            <div>
              <h3>Real-Time Queue Synchronization</h3>
              <p>Powered by Firestore real-time websockets. When a doctor advances the token number, thousands of patient apps reflect the update in less than 50 milliseconds.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bento-card">
            <div className="bento-icon-wrapper emerald">
              <Mic size={28} />
            </div>
            <div>
              <h3>AI Voice Medical NLP</h3>
              <p>State-of-the-art speech-to-prescription pipeline tuned specifically on Indian medical nomenclature, dosages, and brand names.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bento-card">
            <div className="bento-icon-wrapper purple">
              <DollarSign size={28} />
            </div>
            <div>
              <h3>Zero Platform Commission</h3>
              <p>We believe in zero platform leakage. Clinics keep 100% of their consultation fees with direct peer-to-peer settlement.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bento-card bento-span-2">
            <div className="bento-icon-wrapper emerald">
              <Shield size={28} />
            </div>
            <div>
              <h3>Multi-Clinic Electronic Health Records</h3>
              <p>Unified digital health vaults. Patients carry their verified prescriptions, lab reports, and vitals across all partner clinics seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE ROI CALCULATOR ================= */}
      <section className="landing-section" id="calculator">
        <div className="section-head-center">
          <span className="section-tagline">Clinic Economics</span>
          <h2 className="section-title-large">Calculate Your Clinic's Time & Revenue Gain.</h2>
          <p className="section-subtitle-text">See how much time CareGrid saves your clinic staff and physician every single month.</p>
        </div>

        <div className="calculator-card">
          <div>
            <span className="section-tagline">Interactive Clinic Model</span>
            <h3 style={{fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 16px', color: '#fff'}}>How many patients do you treat per day?</h3>
            <p className="text-muted" style={{fontSize: '0.95rem'}}>Adjust the slider based on your clinic's daily footfall:</p>
            
            <div className="slider-container">
              <div className="slider-header">
                <span style={{fontWeight: 600}}>Daily Patient Load</span>
                <span className="slider-val-badge">{patientsPerDay} Patients / Day</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="150" 
                value={patientsPerDay} 
                onChange={(e) => setPatientsPerDay(Number(e.target.value))}
                className="styled-slider"
              />
            </div>

            <button 
              onClick={(e) => handleLaunchRocket(e, '/auth')} 
              className="btn-glow-primary" 
              style={{marginTop: '10px'}}
            >
              Transform My Clinic <ArrowRight size={16} />
            </button>
          </div>

          <div className="calc-metrics-grid">
            <div className="calc-stat-box">
              <div className="num">{hoursSavedMonth} hrs</div>
              <div className="label">Doctor Time Saved / Mo</div>
            </div>
            <div className="calc-stat-box">
              <div className="num" style={{color: '#38bdf8'}}>₹{extraRevenueMonth}</div>
              <div className="label">Extra Potential Revenue / Mo</div>
            </div>
            <div className="calc-stat-box">
              <div className="num" style={{color: '#a78bfa'}}>96%</div>
              <div className="label">Patient Retention Rate</div>
            </div>
            <div className="calc-stat-box">
              <div className="num">{paperlessPrescriptions}</div>
              <div className="label">Paper Prescriptions Digitized</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BEFORE VS AFTER COMPARISON ================= */}
      <section className="landing-section" id="compare">
        <div className="section-head-center">
          <span className="section-tagline">Why CareGrid Wins</span>
          <h2 className="section-title-large">Broken Offline System vs CareGrid OS.</h2>
        </div>

        <div className="comparison-grid">
          {/* Old Broken System */}
          <div className="compare-card broken">
            <h3 className="compare-title" style={{color: '#ef4444'}}>
              <X size={24} /> The Traditional Clinic System
            </h3>
            <div className="compare-list">
              <div className="compare-item"><X size={18} className="text-red" /> <span>1.5 to 2 hours spent sitting in infectious waiting rooms</span></div>
              <div className="compare-item"><X size={18} className="text-red" /> <span>Doctors waste 6-8 minutes typing or writing paper notes</span></div>
              <div className="compare-item"><X size={18} className="text-red" /> <span>Paper prescriptions get torn, lost, or misplaced</span></div>
              <div className="compare-item"><X size={18} className="text-red" /> <span>Pharmacies lose regular patients to 10-minute delivery apps</span></div>
            </div>
          </div>

          {/* Smart CareGrid System */}
          <div className="compare-card smart">
            <h3 className="compare-title" style={{color: '#10b981'}}>
              <CheckCircle2 size={24} /> The CareGrid Outpatient OS
            </h3>
            <div className="compare-list">
              <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Zero waiting room crowd — patients arrive just in time</span></div>
              <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>AI Voice generates structured digital PDF prescriptions in seconds</span></div>
              <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Lifetime cloud vault for medical history and reports</span></div>
              <div className="compare-item"><CheckCircle2 size={18} className="text-emerald" /> <span>Local pharmacies get pre-packaged orders before patient arrival</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="landing-section" id="faq">
        <div className="section-head-center">
          <span className="section-tagline">Frequently Asked Questions</span>
          <h2 className="section-title-large">Everything You Need to Know.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
              <div className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                <span style={{color: '#fff'}}>{faq.q}</span>
                <ChevronDown size={18} style={{transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', color: '#38bdf8'}} />
              </div>
              {openFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= GRAND AURORA CTA ================= */}
      <section className="landing-section">
        <div className="grand-cta-banner">
          <h2 style={{fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, margin: '16px 0 20px', color: '#fff'}}>
            Ready to upgrade your clinic to <br />
            <span className="text-gradient-emerald">CareGrid 2.0?</span>
          </h2>
          <p className="text-muted" style={{maxWidth: '600px', margin: '0 auto 36px', fontSize: '1.1rem'}}>
            Join hundreds of forward-thinking physicians and local pharmacies transforming outpatient care today.
          </p>

          <div style={{display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap'}}>
            <button 
              onClick={(e) => handleLaunchRocket(e, '/auth')} 
              className="btn-glow-primary" 
              style={{padding: '18px 42px', fontSize: '1.1rem'}}
            >
              Launch Portal Now <Rocket size={20} style={{marginLeft: '6px'}} />
            </button>
          </div>
        </div>
      </section>

      {/* Grand Footer */}
      <footer className="grand-footer">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px'}}>
          <img src="/caregrid-logo.png" alt="CareGrid" style={{height: '32px'}} />
          <strong style={{fontSize: '1.2rem', color: '#fff'}}>Care<span style={{color: '#10b981'}}>Grid</span> OS</strong>
        </div>
        <p style={{margin: '0 0 10px'}}>The Unified Outpatient Healthcare Operating System.</p>
        <p style={{color: '#64748b', fontSize: '0.8rem'}}>© 2026 CareGrid Inc. All rights reserved. Built with Firebase & GSAP.</p>
      </footer>

    </div>
  );
}

export default LandingPage;
