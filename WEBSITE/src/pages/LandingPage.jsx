import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../App.css';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const heroTl = useRef(null);
  const featuresRef = useRef(null);
  
  useEffect(() => {
    // 1. Hero Section Animation
    heroTl.current = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTl.current.fromTo(".nav-container", 
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    )
    .to(".word", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15
    }, "-=0.5")
    .to(".hero-subtitle", {
        opacity: 1,
        y: -20,
        duration: 1
    }, "-=0.8")
    .to(".hero-cta", {
        opacity: 1,
        y: -20,
        duration: 1
    }, "-=0.9");

    // 2. Scroll Animations for Features
    const featureCards = gsap.utils.toArray('.feature-card');
    
    gsap.fromTo('.section-header', 
        { opacity: 0, y: 50 },
        {
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
                trigger: '.features-section',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    featureCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.2, // Stagger effect for cards
                scrollTrigger: {
                    trigger: '.features-grid',
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // 3. Scroll Animations for Deep Dives
    const deepDiveSections = gsap.utils.toArray('.deep-dive-section');
    deepDiveSections.forEach((section) => {
        const text = section.querySelector('.deep-dive-text');
        const video = section.querySelector('.deep-dive-video');
        
        gsap.fromTo(text,
            { opacity: 0, x: section.classList.contains('reverse') ? 50 : -50 },
            {
                opacity: 1, x: 0, duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(video,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1, scale: 1, duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 4. Problem Section Animations
    gsap.fromTo('.problem-heading', 
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1.5,
            scrollTrigger: { trigger: '.problem-section', start: "top 75%" }
        }
    );
    gsap.fromTo('.problem-card',
        { opacity: 0, scale: 0.8 },
        {
            opacity: 1, scale: 1, duration: 0.8, stagger: 0.2,
            scrollTrigger: { trigger: '.problem-grid', start: "top 80%" }
        }
    );

    // 5. Revenue Section Animations
    gsap.fromTo('.revenue-card',
        { opacity: 0, y: 100 },
        {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
            scrollTrigger: { trigger: '.revenue-grid', start: "top 85%" }
        }
    );

    // 6. Moat Parallax
    gsap.fromTo('.moat-content',
        { opacity: 0, scale: 0.9 },
        {
            opacity: 1, scale: 1, duration: 1,
            scrollTrigger: { trigger: '.moat-section', start: "top 75%", scrub: 1 }
        }
    );

    return () => {
        if (heroTl.current) heroTl.current.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="app-container">
        {/* Navbar */}
        <nav className="navbar">
            <div className="nav-container">
                <div className="brand-container">
                    <img src="/caregrid-logo.png" alt="CareGrid Logo" className="nav-logo" />
                    <span className="brand-name">
                        <span className="brand-care">Care</span><span className="brand-grid">Grid</span>
                    </span>
                </div>
                <div className="nav-links">
                    <a href="#features">The Ecosystem</a>
                    <a href="#doctors">For Doctors</a>
                    <a href="#pharmacies">For Pharmacies</a>
                    <Link to="/auth" className="nav-btn" style={{textDecoration: 'none'}}>Get Started</Link>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
            <video autoPlay loop muted playsInline className="hero-video">
                <source src="/bg-video.mp4" type="video/mp4" />
            </video>
            
            <div className="overlay"></div>
            
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="title-wrapper"><span className="word">The</span></span>
                    <span className="title-wrapper"><span className="word">Unified</span></span>
                    <br />
                    <span className="title-wrapper"><span className="word">Outpatient</span></span>
                    <span className="title-wrapper"><span className="word" style={{ color: "#4ade80" }}>OS.</span></span>
                </h1>
                <p className="hero-subtitle">Making Local Clinics Smart.</p>
                <Link to="/auth" className="cta-button hero-cta" style={{textDecoration: 'none'}}>Explore CareGrid</Link>
            </div>
        </section>

        {/* The Problem Section */}
        <section className="problem-section" id="problem">
            <div className="problem-container">
                <h2 className="problem-heading text-reveal">The current offline healthcare system is completely broken.</h2>
                <div className="problem-grid">
                    <div className="problem-card">
                        <h3>Patients</h3>
                        <p>Wait 1-2 hours in crowded, highly infectious waiting rooms just to get a token number.</p>
                    </div>
                    <div className="problem-card">
                        <h3>Doctors</h3>
                        <p>Hate typing on complex digital apps. They stick to pen and paper, losing crucial medical history.</p>
                    </div>
                    <div className="problem-card">
                        <h3>Pharmacies</h3>
                        <p>Losing massive business to online giants like Zepto and 1mg because patients order from home for discounts.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="features-section" id="features">
            <div className="section-header">
                <h2 className="section-title">The Complete Outpatient Ecosystem</h2>
                <p className="section-subtitle">Connecting everyone for a frictionless healthcare experience.</p>
            </div>
            
            <div className="features-grid" ref={featuresRef}>
                <div className="feature-card">
                    <div className="feature-icon">🧑‍⚕️</div>
                    <h3>For Patients</h3>
                    <h4>Live Queue Tracking</h4>
                    <p>Wait at home, not in crowded waiting rooms. Track your live token status directly from your phone.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🎙️</div>
                    <h3>For Doctors</h3>
                    <h4>AI Voice Prescriptions</h4>
                    <p>Stop typing. Speak naturally and our AI generates structured, digital PDF prescriptions instantly.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">💊</div>
                    <h3>For Pharmacies</h3>
                    <h4>The Ping Loop</h4>
                    <p>Instant digital prescription delivery means the medicines are packed before the patient even walks in.</p>
                </div>
            </div>
        </section>

        {/* Deep Dive Sections */}
        <section className="deep-dive-section" id="patients">
            <div className="deep-dive-container">
                <div className="deep-dive-text">
                    <h3>For Patients</h3>
                    <h2>Zero Waiting Room Crowds.</h2>
                    <p>Patients can track their live token status from home. "Token 12 is inside, you are Token 15, reach the clinic in 15 mins."</p>
                    <button className="cta-button secondary-btn">See Patient App</button>
                </div>
                <div className="deep-dive-video">
                    {/* Placeholder for patient-vid.mp4 */}
                    <div className="video-placeholder">Upload patient-vid.mp4 here</div>
                </div>
            </div>
        </section>

        <section className="deep-dive-section reverse" id="doctors">
            <div className="deep-dive-container">
                <div className="deep-dive-text">
                    <h3>For Doctors</h3>
                    <h2>AI Voice E-Prescriptions.</h2>
                    <p>Doctors hate typing. They just speak the symptoms and medicines naturally, and our AI Engine generates a structured digital PDF instantly.</p>
                    <button className="cta-button secondary-btn">See Doctor Dashboard</button>
                </div>
                <div className="deep-dive-video">
                    {/* Placeholder for doctor-vid.mp4 */}
                    <div className="video-placeholder">Upload doctor-vid.mp4 here</div>
                </div>
            </div>
        </section>

        <section className="deep-dive-section" id="pharmacies">
            <div className="deep-dive-container">
                <div className="deep-dive-text">
                    <h3>For Pharmacies</h3>
                    <h2>The Pharmacy Ping Loop.</h2>
                    <p>As soon as the doctor approves the prescription, it is instantly pinged to the partnered pharmacy downstairs. The medicine is packed and ready before the patient even walks in.</p>
                    <button className="cta-button secondary-btn">See Pharmacy POS</button>
                </div>
                <div className="deep-dive-video">
                    {/* Placeholder for pharmacy-vid.mp4 */}
                    <div className="video-placeholder">Upload pharmacy-vid.mp4 here</div>
                </div>
            </div>
        </section>

        {/* Revenue Model Section */}
        <section className="revenue-section" id="revenue">
            <div className="section-header">
                <h2 className="section-title">How We Make Money</h2>
                <p className="section-subtitle">Zero commission on doctor consultation fees to prevent platform leakage.</p>
            </div>
            <div className="revenue-grid">
                <div className="revenue-card rev-1">
                    <div className="rev-icon">🎫</div>
                    <h3>Patient Convenience Fee</h3>
                    <p>₹10 - ₹20 micro-fee for the privilege of live queue tracking from the comfort of their home.</p>
                </div>
                <div className="revenue-card rev-2">
                    <div className="rev-icon">🏪</div>
                    <h3>Pharmacy Commission</h3>
                    <p>15% commission or ₹2,000/month flat fee for routing guaranteed, immediate sales to a local monopoly.</p>
                </div>
                <div className="revenue-card rev-3">
                    <div className="rev-icon">🩸</div>
                    <h3>Diagnostic Affiliate</h3>
                    <p>15-20% B2B affiliate commission when doctors prescribe and patients book home blood tests.</p>
                </div>
                <div className="revenue-card rev-4">
                    <div className="rev-icon">⭐</div>
                    <h3>SaaS Premium for Doctors</h3>
                    <p>Basic queue management is free. The killer "AI Voice Prescription" is a premium ₹999/month add-on.</p>
                </div>
            </div>
        </section>

        {/* The Moat Section */}
        <section className="moat-section" id="moat">
            <div className="moat-content">
                <h2>Why won't big tech do this?</h2>
                <p>Platforms like Practo are marketplaces for <strong>finding</strong> doctors. CareGrid is a workflow OS for the doctors <strong>you already know</strong>. We deeply integrate into the physical offline behavior of Indian healthcare, giving local pharmacies a digital weapon to fight back against quick-commerce.</p>
            </div>
        </section>

        {/* Footer */}
        <footer className="footer">
            <div className="footer-content">
                <img src="/caregrid-logo.png" alt="CareGrid" className="footer-logo" />
                <p>The Unified Outpatient Healthcare OS.</p>
                <p className="copyright">© 2026 CareGrid. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
}

export default LandingPage;
