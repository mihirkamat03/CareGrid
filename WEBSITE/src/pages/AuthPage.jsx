import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { User, Eye, EyeOff, Stethoscope } from 'lucide-react';
import './AuthPage.css'; 

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('doctor'); 
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    gsap.fromTo(".auth-left-content", 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(".auth-right-content", 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card-container">
        
        {/* LEFT SIDE */}
        <div className="auth-left">
          {/* AI Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="auth-video-bg"
          >
            <source src="/auth-bg.mp4" type="video/mp4" />
          </video>
          <div className="auth-video-overlay"></div>
          
          <div className="auth-left-content">
            <Link to="/" className="auth-brand">
              <img src="/caregrid-logo.png" alt="CareGrid" />
              <span>Care<span className="text-emerald">Grid</span></span>
            </Link>
            <h1>
              You will be accessing CareGrid's core applications: <span>ClinicOS™</span>
            </h1>
            
            <div className="auth-demo-links">
              <Link to="/doctor" className="demo-btn primary-outline">Doctor Demo</Link>
              <Link to="/patient" className="demo-btn secondary-outline">Patient Demo</Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-right-content">
            <h2>{isLogin ? 'Log In to CareGrid™' : 'Sign Up for CareGrid™'}</h2>

            <div className="role-toggle">
              <button 
                onClick={() => setRole('doctor')}
                className={role === 'doctor' ? 'active' : ''}
              >
                <Stethoscope size={16} /> Doctor
              </button>
              <button 
                onClick={() => setRole('patient')}
                className={role === 'patient' ? 'active' : ''}
              >
                <User size={16} /> Patient
              </button>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="input-group">
                  <label>Your Name</label>
                  <div className="input-wrapper">
                    <input type="text" placeholder={role === 'doctor' ? "Dr. Rahul Sharma" : "John Doe"} />
                    <User className="input-icon" size={16} />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Your Email</label>
                <div className="input-wrapper">
                  <input type="email" placeholder="hello@clinic.com" />
                  <User className="input-icon" size={16} />
                </div>
              </div>

              <div className="input-group">
                <label>Your Password</label>
                <div className="input-wrapper">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="icon-btn">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="custom-checkbox"></span>
                  Remember
                </label>
                <a href="#" className="forgot-link">Forgotten?</a>
              </div>

              <button className="auth-submit-btn">
                {isLogin ? 'Log In' : 'Create Account'}
              </button>

              <div className="auth-switch">
                <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="switch-btn">
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthPage;
