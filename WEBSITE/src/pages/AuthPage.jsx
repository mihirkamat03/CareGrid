import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { User, Eye, EyeOff, Stethoscope, Mail, Lock, Phone, FileDigit, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthPage() {
  const [isDoctor, setIsDoctor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const formSliderRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fromLaunch = location.state?.fromLaunch;
  const [showArrivalMist, setShowArrivalMist] = useState(!!fromLaunch);
  const { currentUser, userRole, createUserProfile, createDoctorProfile } = useAuth();

  // Patient form state
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [patientName, setPatientName] = useState('');

  // Doctor form state
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [licenseId, setLicenseId] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser && userRole) {
      navigate(userRole === 'doctor' ? '/doctor' : '/patient');
    }
  }, [currentUser, userRole, navigate]);

  useEffect(() => {
    if (fromLaunch) {
      // Warp speed drop-in entrance animation
      const tl = gsap.timeline();
      tl.fromTo(".auth-card-container", 
        { y: -120, opacity: 0, scale: 0.92, filter: "blur(12px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power4.out" }
      )
      .fromTo(".auth-left-content", 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4"
      )
      .fromTo(".auth-right-content", 
        { scale: 0.92, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, "-=0.4"
      );

      // Fade out arrival mist
      gsap.to(".arrival-warp-mist", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => setShowArrivalMist(false)
      });
    } else {
      // Standard gentle entrance
      gsap.fromTo(".auth-left-content", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
      gsap.fromTo(".auth-right-content", { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" });
    }
  }, [fromLaunch]);

  useEffect(() => {
    if (formSliderRef.current) {
      if (isDoctor) {
        gsap.to(formSliderRef.current, { x: "-50%", duration: 0.6, ease: "power3.inOut" });
        gsap.to(".auth-left-overlay", { background: "linear-gradient(to right, rgba(9, 9, 11, 0.2), rgba(56, 189, 248, 0.2))", duration: 0.6 });
      } else {
        gsap.to(formSliderRef.current, { x: "0%", duration: 0.6, ease: "power3.inOut" });
        gsap.to(".auth-left-overlay", { background: "linear-gradient(to right, rgba(9, 9, 11, 0.2), rgba(16, 185, 129, 0.2))", duration: 0.6 });
      }
    }
  }, [isDoctor]);

  const handleLogin = async (e, role) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = role === 'patient' ? patientEmail : doctorEmail;
    const password = role === 'patient' ? patientPassword : doctorPassword;
    const name = role === 'patient' ? (patientName || 'Patient') : (doctorName || 'Doctor');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      
      let userCredential;
      let isNewUser = false;

      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInError) {
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          isNewUser = true;
        } else {
          throw signInError;
        }
      }

      // Create/Update profile in Firestore
      if (role === 'doctor') {
        await createDoctorProfile(userCredential.user.uid, {
          role: 'doctor',
          name: name,
          email: email,
          licenseId: licenseId || 'MCI-000000',
          specialty: 'Cardiologist',
          clinicName: `${name}'s Clinic`,
          qualification: 'MBBS, MD',
          address: 'City Care Clinic'
        });
      } else if (isNewUser) {
        await createUserProfile(userCredential.user.uid, {
          role: 'patient',
          name: name,
          email: email,
          phone: '',
          savedDoctors: [
            { id: '1', name: "Dr. Rahul Sharma", specialty: "Cardiologist", location: "City Care Clinic" },
            { id: '2', name: "Dr. Anita Desai", specialty: "Dermatologist", location: "SkinCare Center" }
          ],
          appointments: [
            { id: '101', docName: "Dr. Rahul Sharma", specialty: "Cardiologist", date: "Today", time: "10:00 AM", status: "Confirmed", clinic: "City Care Clinic", tokenNumber: 15 }
          ],
          records: [
            { id: '1', type: "Prescription", title: "General Consultation", date: "12 Aug 2023", doctor: "Dr. Rahul Sharma", tags: ["Fever", "Completed"] },
            { id: '2', type: "Report", title: "Blood Test Results", date: "05 Aug 2023", doctor: "PathLabs", tags: ["Lab", "Normal"] }
          ]
        });
      }

      // Navigate
      setTimeout(() => {
        if (role === 'doctor') navigate('/doctor');
        else navigate('/patient');
      }, 400);

    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
      if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered. Try logging in.';
      if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {showArrivalMist && <div className="arrival-warp-mist"></div>}
      <div className="auth-card-container">
        
        {/* LEFT SIDE: VIDEO BG */}
        <div className="auth-left">
          <video autoPlay loop muted playsInline className="auth-video-bg">
            <source src="/auth-bg.mp4" type="video/mp4" />
          </video>
          <div className="auth-video-overlay auth-left-overlay"></div>
          
          <div className="auth-left-content">
            <Link to="/" className="auth-brand">
              <img src="/caregrid-logo.png" alt="CareGrid" />
              <span>Care<span className={isDoctor ? "text-sky" : "text-emerald"}>Grid</span></span>
            </Link>
            
            <h1>
              {isDoctor ? "The Unified OS for " : "Smart Healthcare for "} 
              <br/>
              <span>{isDoctor ? "Modern Clinics" : "Modern Patients"}</span>
            </h1>

            <div className="auth-switch-prompt mt-10">
              <p className="auth-prompt-text mb-4">{isDoctor ? "Are you a patient looking for care?" : "Are you a doctor managing a clinic?"}</p>
              <button 
                className={`switch-role-btn ${isDoctor ? 'patient-style' : 'doctor-style'}`}
                onClick={() => { setIsDoctor(!isDoctor); setError(''); }}
              >
                Switch to {isDoctor ? "Patient Portal" : "Doctor Portal"} <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: GLASS FORMS */}
        <div className="auth-right">
          <div className="auth-right-content">
            
            {error && (
              <div className="auth-error" style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                {error}
              </div>
            )}

            <div className="form-window">
              <div className="form-slider" ref={formSliderRef}>
                
                {/* PATIENT FORM */}
                <div className="form-pane">
                  <h2>Patient Login</h2>
                  <p className="form-subtext">Access your live tokens, records, and pharmacy.</p>
                  
                  <form onSubmit={(e) => handleLogin(e, 'patient')}>
                    <div className="input-group">
                      <label>Full Name</label>
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          placeholder="John Doe" 
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                        />
                        <User size={18} className="input-icon" />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Email Address</label>
                      <div className="input-wrapper">
                        <input 
                          type="email" 
                          placeholder="john@example.com" 
                          required 
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                        />
                        <Mail size={18} className="input-icon" />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label>Password</label>
                      <div className="input-wrapper">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          required 
                          value={patientPassword}
                          onChange={(e) => setPatientPassword(e.target.value)}
                        />
                        <button type="button" className="icon-btn" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <button type="submit" className="auth-submit-btn patient-btn" disabled={isLoading}>
                      {isLoading ? 'Authenticating...' : 'Sign In to CareGrid'}
                    </button>
                  </form>
                  <div className="mobile-switch-role">
                    <p>Are you a doctor? <button onClick={() => setIsDoctor(true)}>Clinic Portal</button></p>
                  </div>
                </div>

                {/* DOCTOR FORM */}
                <div className="form-pane">
                  <h2>Clinic Login</h2>
                  <p className="form-subtext">Manage your queue and generate AI prescriptions.</p>
                  
                  <form onSubmit={(e) => handleLogin(e, 'doctor')}>
                    <div className="input-group">
                      <label>Doctor Name</label>
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          placeholder="Dr. Smith" 
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                        />
                        <Stethoscope size={18} className="input-icon" />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Professional Email</label>
                      <div className="input-wrapper">
                        <input 
                          type="email" 
                          placeholder="dr.smith@clinic.com" 
                          required 
                          value={doctorEmail}
                          onChange={(e) => setDoctorEmail(e.target.value)}
                        />
                        <Mail size={18} className="input-icon" />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Medical License / Clinic ID</label>
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          placeholder="MCI-123456" 
                          value={licenseId}
                          onChange={(e) => setLicenseId(e.target.value)}
                        />
                        <FileDigit size={18} className="input-icon" />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label>Password</label>
                      <div className="input-wrapper">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          required 
                          value={doctorPassword}
                          onChange={(e) => setDoctorPassword(e.target.value)}
                        />
                        <button type="button" className="icon-btn" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <button type="submit" className="auth-submit-btn doctor-btn mt-4" disabled={isLoading}>
                      {isLoading ? 'Authenticating...' : 'Access ClinicOS'}
                    </button>
                  </form>
                  <div className="mobile-switch-role">
                    <p>Looking for care? <button onClick={() => setIsDoctor(false)}>Patient Portal</button></p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
