import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Home, Calendar, Clock, HeartPulse, Stethoscope, Pill, ArrowRight, User as UserIcon, Bell, Search, ChevronDown, MapPin, FileText, CreditCard, X, LogOut } from 'lucide-react';
import { useCareGrid } from '../context/CareGridContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import BookingFlowManager from '../components/PatientBookingFlow';
import { HealthRecordsView, PharmacyView, MyDoctorsView, PatientAppointmentsView, PatientProfileView } from '../components/PatientViews';
import './PatientTracker.css';

function PatientDashboard() {
  const { currentToken, queue, triggerPayment, patientDoctors, pendingPayment, markPaymentComplete, patientAppointments, myTokenNumber } = useCareGrid();
  const { userProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [showRadar, setShowRadar] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);

  const patientName = userProfile?.name || 'John Doe';
  const patientInitials = patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  useEffect(() => {
    gsap.fromTo(".dash-sidebar", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".dash-header", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(".dash-content-grid", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    gsap.to(".mini-token-circle", { scale: 1.05, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);

  // Real-time payment notification from doctor
  useEffect(() => {
    if (pendingPayment && !pendingPayment.paid) {
      setShowPaymentNotification(true);
      // Animate the notification sliding in
      setTimeout(() => {
        gsap.fromTo(".payment-notification-overlay", 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo(".payment-notification-card", 
          { y: 100, scale: 0.9, opacity: 0 }, 
          { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
        );
      }, 100);
    }
  }, [pendingPayment]);

  return (
    <div className="dash-page">
      <div className="dash-sidebar floating-sidebar">
        <div className="dash-logo-box">
          <img src="/caregrid-logo.png" alt="CareGrid Logo" className="dash-logo" />
          <span className="brand-text">Care<span className="text-emerald">Grid</span></span>
        </div>
        
        <div className="sidebar-section">
          <span className="sidebar-label">Primary Menu</span>
          <nav className="dash-nav">
            <button className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}><Home size={18} /> Dashboard</button>
            <button className={`nav-item ${activeView === 'doctors' ? 'active' : ''}`} onClick={() => setActiveView('doctors')}><Stethoscope size={18} /> My Doctors</button>
            <button className={`nav-item ${activeView === 'appointments' ? 'active' : ''}`} onClick={() => setActiveView('appointments')}><Calendar size={18} /> Appointments <span className="nav-badge">02</span></button>
            <button className={`nav-item ${activeView === 'pharmacy' ? 'active' : ''}`} onClick={() => setActiveView('pharmacy')}><Pill size={18} /> Pharmacy</button>
            <button className={`nav-item ${activeView === 'records' ? 'active' : ''}`} onClick={() => setActiveView('records')}><HeartPulse size={18} /> Health Records</button>
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Profile</span>
          <nav className="dash-nav">
            <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}><UserIcon size={18} /> Profile Settings</button>
            <button className="nav-item" onClick={() => showToast('No new notifications', 'info')}><Bell size={18} /> Notifications</button>
          </nav>
        </div>

        <div className="dash-profile">
          <div className="profile-btn">
            <div className="avatar">{patientInitials}</div>
            <div className="profile-info">
              <p className="name">{patientName}</p>
              <p className="role">Premium Member</p>
            </div>
            <LogOut size={16} className="logout-icon" style={{cursor: 'pointer', color: '#a1a1aa', marginLeft: 'auto'}} onClick={() => { logout(); window.location.href = '/auth'; }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dash-main">
        <header className="dash-header">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search clinics, doctors, medicines..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={18} />
              <div className="notification-dot"></div>
            </button>
            <div className="header-profile">
              <div className="avatar-small">{patientInitials}</div>
              <span>{patientName}</span>
              <ChevronDown size={14} className="text-muted"/>
            </div>
          </div>
        </header>

        <div className="dash-content">
          {activeView === 'dashboard' && (
            <div className="dash-content-grid">
              
              {/* LEFT MAIN COLUMN */}
              <div className="main-feed-col">
                
                {/* Banner Card */}
                <div className="patient-hero-banner">
                  <div className="hero-content">
                    <h2>Get 20% off your first pharmacy order!</h2>
                    <p>Link your CareGrid prescriptions directly to local pharmacies and get medicines delivered in 30 minutes.</p>
                    <button className="hero-btn" onClick={() => setActiveView('pharmacy')}>Claim Offer <ArrowRight size={16} /></button>
                  </div>
                  <div className="banner-decor"></div>
                </div>

                {/* Stats / Categories Pills */}
                <div className="dashboard-section">
                  <h3 className="section-title">Quick Actions</h3>
                  <div className="stats-pills-row">
                    <div className="stat-pill bg-purple-gradient cursor-pointer" onClick={() => setShowRadar(true)}>
                      <div className="pill-icon"><Stethoscope size={20} /></div>
                      <div className="pill-info">
                        <span className="pill-val">Consult</span>
                        <span className="pill-label">Book Doctor</span>
                      </div>
                    </div>
                    
                    <div className="stat-pill bg-emerald-gradient cursor-pointer" onClick={() => setActiveView('pharmacy')}>
                      <div className="pill-icon"><Pill size={20} /></div>
                      <div className="pill-info">
                        <span className="pill-val">Order</span>
                        <span className="pill-label">Medicines</span>
                      </div>
                    </div>

                    <div className="stat-pill bg-yellow-gradient cursor-pointer" onClick={() => setActiveView('records')}>
                      <div className="pill-icon"><FileText size={20} /></div>
                      <div className="pill-info">
                        <span className="pill-val">Upload</span>
                        <span className="pill-label">Lab Reports</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Past History Doctors */}
                <div className="dashboard-section mt-4">
                  <div className="section-header">
                    <h3 className="section-title">Already Visited Doctors</h3>
                    <button className="text-btn" onClick={() => setActiveView('doctors')}>View All</button>
                  </div>
                  <div className="advanced-list">
                    {patientDoctors.map(doc => (
                      <div key={doc.id} className="adv-list-item">
                        <div className="adv-avatar">{doc.name.charAt(4)}</div>
                        <div className="adv-details">
                          <h4>{doc.name}</h4>
                          <span className="adv-sub"><MapPin size={12}/> {doc.location}</span>
                        </div>
                        <div className="adv-time">
                          <span>{doc.specialty}</span>
                        </div>
                        <button className="adv-action" onClick={() => setShowRadar(true)}>Re-Book</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR COLUMN */}
              <div className="right-sidebar-col">
                
                {/* Live Tracker Widget */}
                <div className="live-tracker-widget panel">
                  <div className="panel-header">
                    <h3>Live Token Tracker</h3>
                    <span className="live-badge"><div className="dot"></div> Live</span>
                  </div>
                  
                  <div className="tracker-mini-layout">
                    <div className="mini-token-circle">
                      <span className="label">Your Token</span>
                      <span className="number">{myTokenNumber || 15}</span>
                    </div>
                    
                    <div className="tracker-stats">
                      <div className="t-stat">
                        <span>Currently Inside</span>
                        <strong>#{currentToken}</strong>
                      </div>
                      <div className="t-stat">
                        <span>Est. Wait</span>
                        <strong className="text-yellow">{Math.max(0, ((myTokenNumber || 15) - currentToken) * 15)} mins</strong>
                      </div>
                      <div className="t-stat">
                        <span>Clinic</span>
                        <strong>City Clinic</strong>
                      </div>
                    </div>
                  </div>
                  <button className="massive-action-btn mt-4">Get Directions</button>
                </div>

                {/* Active Prescriptions */}
                <div className="active-meds panel">
                  <div className="panel-header">
                    <h3>Current Medications</h3>
                  </div>
                  
                  <div className="med-compact-card">
                    <div className="med-icon bg-emerald-light"><Pill size={20} className="text-emerald" /></div>
                    <div className="med-info">
                      <h4>Paracetamol 500mg</h4>
                      <span>2 times a day</span>
                    </div>
                    <div className="radio-dot active"></div>
                  </div>

                  <div className="med-compact-card">
                    <div className="med-icon bg-sky-light"><Pill size={20} className="text-sky" /></div>
                    <div className="med-info">
                      <h4>Amoxicillin 250mg</h4>
                      <span>Every 8 hours</span>
                    </div>
                    <div className="radio-dot"></div>
                  </div>
                  
                  <button className="secondary-full-btn" onClick={() => setActiveView('pharmacy')}>Order Refill from Pharmacy</button>
                </div>

              </div>
            </div>
          )}

          {activeView === 'records' && <HealthRecordsView />}
          {activeView === 'pharmacy' && <PharmacyView triggerPayment={triggerPayment} />}
          {activeView === 'doctors' && <MyDoctorsView />}
          {activeView === 'appointments' && <PatientAppointmentsView />}
          {activeView === 'profile' && <PatientProfileView />}

        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <button className={`m-nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}><Home size={20}/></button>
        <button className={`m-nav-item ${activeView === 'doctors' ? 'active' : ''}`} onClick={() => setActiveView('doctors')}><Stethoscope size={20}/></button>
        <button className={`m-nav-item ${activeView === 'pharmacy' ? 'active' : ''}`} onClick={() => setActiveView('pharmacy')}><Pill size={20}/></button>
        <button className={`m-nav-item ${activeView === 'records' ? 'active' : ''}`} onClick={() => setActiveView('records')}><HeartPulse size={20}/></button>
      </div>

      {/* Real-time Payment Request Notification from Doctor */}
      {showPaymentNotification && pendingPayment && (
        <div className="payment-notification-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div className="payment-notification-card panel" style={{
            maxWidth: '440px', width: '100%', background: '#18181b',
            border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '1.5rem',
            padding: '2rem', textAlign: 'center', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.2)'
          }}>
            <button 
              onClick={() => setShowPaymentNotification(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.05)', border: 'none',
                color: '#a1a1aa', borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.2rem'
            }}>
              <CreditCard size={30} />
            </div>

            <h2 style={{fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px'}}>Consultation Bill Ready</h2>
            <p className="text-muted" style={{fontSize: '0.9rem', margin: '0 0 1.5rem'}}>
              {pendingPayment.doctorName} completed your checkup for <strong style={{color: '#fff'}}>{pendingPayment.condition}</strong>.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem'
            }}>
              <span className="text-muted" style={{fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Amount Due</span>
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)'}}>
                ₹{pendingPayment.amount}
              </div>
            </div>

            <button 
              className="primary-action-btn massive-action-btn"
              style={{width: '100%', padding: '14px', borderRadius: '1rem', fontSize: '1rem'}}
              onClick={() => {
                setShowPaymentNotification(false);
                triggerPayment(pendingPayment.amount, 'doctor_fee');
              }}
            >
              Pay Now & Get Receipt
            </button>

            <button 
              className="text-btn"
              style={{marginTop: '10px', width: '100%', color: '#71717a'}}
              onClick={() => setShowPaymentNotification(false)}
            >
              Pay Later
            </button>
          </div>
        </div>
      )}

      {showRadar && (
        <BookingFlowManager onClose={() => setShowRadar(false)} />
      )}
    </div>
  );
}

export default PatientDashboard;
