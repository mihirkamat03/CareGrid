import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { Mic, MicOff, Users, Clock, Activity, Send, CheckCircle2, FileText, Settings, LogOut, ChevronLeft, Calendar, Search, Bell, ChevronDown, MapPin, Video, Phone, DollarSign } from 'lucide-react';
import { useCareGrid } from '../context/CareGridContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { AnalyticsView, DoctorAppointmentsView, PrescriptionsArchive, PatientsDirectory, DoctorSettings } from '../components/DoctorViews';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const { queue, currentToken, callNextToken, triggerPayment, addPatientToQueue, completeConsultation } = useCareGrid();
  const { userProfile, logout } = useAuth();
  const { showToast } = useToast();
  const doctorName = userProfile?.name || 'Dr. Sharma';
  const doctorInitials = doctorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const specialty = userProfile?.specialty || 'Cardiologist';
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [consultationFee, setConsultationFee] = useState(500);

  // Initial load animations
  useEffect(() => {
    gsap.fromTo(".dash-sidebar", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".dash-header", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(".dash-content-grid", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
  }, []);

  // View transition animations
  useEffect(() => {
    if (selectedPatient) {
      gsap.fromTo(".consultation-view", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.fromTo(".main-feed-col > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" });
      gsap.fromTo(".right-sidebar-col > *", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 });
    }
  }, [selectedPatient]);

  // AI Mic animation
  useEffect(() => {
    if (isRecording) {
      gsap.to(".pulse-ring-1", { scale: 1.5, opacity: 0, duration: 1.5, repeat: -1, ease: "sine.inOut" });
      gsap.to(".pulse-ring-2", { scale: 1.2, opacity: 0.2, duration: 1, repeat: -1, ease: "sine.inOut", delay: 0.2 });
    } else {
      gsap.killTweensOf(".pulse-ring-1");
      gsap.killTweensOf(".pulse-ring-2");
      gsap.set([".pulse-ring-1", ".pulse-ring-2"], { scale: 1, opacity: 0 });
    }
  }, [isRecording]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const renderCalendar = () => {
    const days = [];
    for(let i=1; i<=31; i++) {
      days.push(
        <span key={i} className={`cal-num ${i === 22 ? 'cal-active' : ''} ${i === 15 || i === 28 ? 'cal-has-event' : ''}`}>
          {i}
        </span>
      );
    }
    return days;
  }

  return (
    <div className="dash-page">
      
      {/* Floating Sidebar */}
      <div className="dash-sidebar floating-sidebar">
        <div className="dash-logo-box">
          <img src="/caregrid-logo.png" alt="CareGrid Logo" className="dash-logo" />
          <span className="brand-text">Care<span className="text-sky">Grid</span></span>
        </div>
        
        <div className="sidebar-section">
          <span className="sidebar-label">Primary Menu</span>
          <nav className="dash-nav">
            <button className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => {setActiveView('dashboard'); setSelectedPatient(null);}}><Activity size={18} /> Dashboard</button>
            <button className={`nav-item ${activeView === 'patients' ? 'active' : ''}`} onClick={() => setActiveView('patients')}><Users size={18} /> Patients</button>
            <button className={`nav-item ${activeView === 'appointments' ? 'active' : ''}`} onClick={() => setActiveView('appointments')}><Calendar size={18} /> Appointments <span className="nav-badge">03</span></button>
            <button className={`nav-item ${activeView === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveView('prescriptions')}><FileText size={18} /> Prescriptions</button>
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Profile</span>
          <nav className="dash-nav">
            <button className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}><Settings size={18} /> Profile Settings</button>
            <button className="nav-item" onClick={() => showToast("No new notifications", "info")}><Bell size={18} /> Notifications</button>
          </nav>
        </div>

        <div className="dash-profile">
          <div className="profile-btn">
            <div className="avatar">{doctorInitials}</div>
            <div className="profile-info">
              <p className="name">{doctorName}</p>
              <p className="role">{specialty}</p>
            </div>
            <LogOut size={16} className="logout-icon" onClick={() => { logout(); window.location.href = '/auth'; }} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dash-main">
        <header className="dash-header">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search patients, records, appointments..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn" onClick={() => showToast("No new alerts.", "info")}>
              <Bell size={18} />
              <div className="notification-dot"></div>
            </button>
            <div className="header-profile">
              <div className="avatar-small">{doctorInitials}</div>
              <span>{doctorName}</span>
              <ChevronDown size={14} className="text-muted"/>
            </div>
          </div>
        </header>

        <div className="dash-content">
          
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'appointments' && <DoctorAppointmentsView />}
          {activeView === 'prescriptions' && <PrescriptionsArchive />}
          {activeView === 'patients' && <PatientsDirectory />}
          {activeView === 'settings' && <DoctorSettings />}

          {activeView === 'dashboard' && !selectedPatient ? (
            /* ==================================================== */
            /*                 COMPLEX DASHBOARD VIEW               */
            /* ==================================================== */
            <div className="dash-content-grid">
              
              {/* LEFT MAIN COLUMN */}
              <div className="main-feed-col">
                
                {/* Hero Banner */}
                <div className="doctor-hero-banner">
                  <div className="hero-content">
                    <h2>AI-Powered Consultations</h2>
                    <p>Reduce prescription time by 80% using CareGrid Voice AI. Just speak naturally, and we generate the PDF.</p>
                    <button className="hero-btn" onClick={() => setActiveView('analytics')}>View Analytics</button>
                  </div>
                  <div className="hero-decor">
                    {/* Reusing the abstract styling concept */}
                  </div>
                </div>

                {/* Categories / Stats Row */}
                <div className="dashboard-section">
                  <h3 className="section-title">Overview Statistics</h3>
                  <div className="stats-pills-row">
                    <div className="stat-pill bg-purple-gradient">
                      <div className="pill-icon"><Users size={20} /></div>
                      <div className="pill-info">
                        <span className="pill-val">42</span>
                        <span className="pill-label">Total Patients</span>
                      </div>
                    </div>
                    
                    <div className="stat-pill bg-emerald-gradient">
                      <div className="pill-icon"><Clock size={20} /></div>
                      <div className="pill-info">
                        <span className="pill-val">14m</span>
                        <span className="pill-label">Avg. Wait Time</span>
                      </div>
                    </div>

                    <div className="stat-pill bg-sky-gradient">
                      <div className="pill-icon"><Activity size={20} /></div>
                      <div className="pill-info">
                        <span className="pill-val">15</span>
                        <span className="pill-label">Tokens Left</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue / Appointments List */}
                <div className="dashboard-section mt-4">
                      <div className="section-header">
                        <h3>Live Queue</h3>
                        <div className="header-actions">
                          <button className="text-btn" onClick={() => showToast("Loading full queue...", "info")}>View All</button>
                        </div>
                      </div>
                      
                      {queue.length === 0 ? (
                        <div className="empty-state" style={{textAlign: 'center', padding: '4rem', color: '#a1a1aa', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem'}}>
                          Queue is empty. Waiting for patients...
                        </div>
                      ) : (
                        <div className="advanced-queue-list">
                      {queue.map((patient, index) => (
                        <div key={patient.id} className={`adv-queue-item ${patient.id === currentToken ? 'active' : ''}`}>
                          <div className="adv-q-avatar">{patient.name.charAt(0)}</div>
                          <div className="adv-q-details">
                            <h4>{patient.name}</h4>
                            <span className="adv-q-sub"><MapPin size={12}/> {patient.location}</span>
                          </div>
                          <div className="adv-q-time">
                            <span>{patient.time}</span>
                            <span className="text-muted">Token #{patient.id}</span>
                          </div>
                          <div className="adv-q-status">
                            <span className={`status-badge-small ${patient.status === 'Inside' ? 'inside' : 'waiting'}`}>
                              {patient.status}
                            </span>
                          </div>
                          <button onClick={() => handlePatientClick(patient)} className="adv-q-action">
                            {patient.status === 'Inside' ? 'Consult' : 'View'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT SIDEBAR COLUMN */}
              <div className="right-sidebar-col">
                
                {/* Calendar Widget */}
                <div className="calendar-widget panel">
                  <div className="cal-header">
                    <h3>Calendar</h3>
                    <span className="cal-month-selector">Aug 2026 <ChevronDown size={14}/></span>
                  </div>
                  <div className="cal-grid">
                    <div className="cal-days-header">
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div className="cal-numbers">
                      {renderCalendar()}
                    </div>
                  </div>
                </div>

                {/* Queue Controller (Like Select Package) */}
                <div className="queue-controller panel">
                  <h3>Queue Controls</h3>
                  
                  <div className="control-option active">
                    <div className="ctrl-icon bg-sky-light"><Users size={18} className="text-sky"/></div>
                    <div className="ctrl-info">
                      <h4>In-Clinic Patients</h4>
                      <span>Token #{currentToken} is inside</span>
                    </div>
                    <div className="radio-dot active"></div>
                  </div>

                  <div className="control-option" onClick={() => showToast("Switching to Video Queue...", "info")}>
                    <div className="ctrl-icon bg-purple-light"><Video size={18} className="text-purple"/></div>
                    <div className="ctrl-info">
                      <h4>Video Consultations</h4>
                      <span>2 scheduled today</span>
                    </div>
                    <div className="radio-dot"></div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      callNextToken();
                      gsap.fromTo(".adv-queue-item.active", { scale: 0.95, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
                    }}
                    className="massive-action-btn"
                  >
                    Call Next Token
                  </button>
                  <button className="secondary-full-btn" style={{marginTop: '10px'}} onClick={() => showToast("Queue paused. Patients notified.", "info")}>Pause Queue</button>
                </div>

              </div>
            </div>
          ) : (
            /* ==================================================== */
            /*               CONSULTATION VIEW (AI)                 */
            /* ==================================================== */
            <div className="consultation-view">
              <button className="back-btn" onClick={() => setSelectedPatient(null)}>
                <ChevronLeft size={20} /> Back to Dashboard
              </button>

              <div className="consult-layout">
                {/* Patient Details Panel */}
                <div className="patient-details-panel panel">
                  <div className="patient-profile-header">
                    <div className="large-avatar">{selectedPatient.name.charAt(0)}</div>
                    <div>
                      <h2>{selectedPatient.name}</h2>
                      <p>Token #{selectedPatient.id} • 28 yrs • Male</p>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Reported Symptoms</h3>
                    <div className="symptom-tags">
                      <span className="symptom-tag">{selectedPatient.condition}</span>
                      <span className="symptom-tag">Cough</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Vitals</h3>
                    <div className="vitals-grid">
                      <div className="vital-box"><span>BP</span><strong>120/80</strong></div>
                      <div className="vital-box"><span>Temp</span><strong>99.1°F</strong></div>
                      <div className="vital-box"><span>Weight</span><strong>72 kg</strong></div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Medical History</h3>
                    <p className="history-text">No known allergies. Previously treated for minor asthma in 2021.</p>
                  </div>
                  
                  <div className="detail-section">
                     <h3>Quick Actions</h3>
                     <div className="patient-quick-actions" style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                      <button className="icon-btn" onClick={() => showToast("Opening Video Call...", "success")} style={{padding: '10px', background: '#27272a', borderRadius: '10px', color: '#fff', border: 'none', cursor: 'pointer'}}><Video size={20} /></button>
                      <button className="icon-btn" onClick={() => showToast("Dialing patient...", "success")} style={{padding: '10px', background: '#27272a', borderRadius: '10px', color: '#fff', border: 'none', cursor: 'pointer'}}><Phone size={20} /></button>
                      <button className="icon-btn" onClick={() => showToast("Generating medical history PDF...", "info")} style={{padding: '10px', background: '#27272a', borderRadius: '10px', color: '#fff', border: 'none', cursor: 'pointer'}}><FileText size={20} /></button>
                     </div>
                  </div>
                </div>

                {/* AI Workspace Panel */}
                <div className="ai-workspace-panel panel">
                  <div className="ai-header">
                    <h2 className="flex-title"><Mic size={20} className="text-sky" /> AI Prescription Generator</h2>
                    <span className="ai-badge">Powered by CareGrid AI</span>
                  </div>

                  <div className="ai-workspace">
                    {/* AI Video Background */}
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="ai-video-bg"
                    >
                      <source src="/doctor-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="ai-video-overlay"></div>

                    <div className="visualizer-container">
                      <div className="pulse-ring pulse-ring-1"></div>
                      <div className="pulse-ring pulse-ring-2"></div>
                      <button 
                        onClick={() => setIsRecording(!isRecording)}
                        className={`mic-btn ${isRecording ? 'recording' : ''}`}
                      >
                        {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                      </button>
                    </div>

                    <div className="ai-status-text">
                      <h3>
                        {aiProcessing ? "Processing prescription..." : 
                         isRecording ? "Listening to diagnosis..." : "Tap microphone to speak"}
                      </h3>
                      <p>
                        {aiProcessing ? "Applying CareGrid medical NLP model..." : 
                         isRecording ? "Speak the patient's symptoms, diagnosis, and prescribed medicines naturally." : "The AI will automatically generate a structured PDF and ping the pharmacy."}
                      </p>
                    </div>
                  </div>

                  {/* Consultation Fee Input */}
                  <div className="fee-input-section" style={{
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '12px 16px', background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '12px', marginBottom: '12px',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <DollarSign size={20} className="text-emerald" />
                    <span style={{color: '#a1a1aa', fontSize: '0.9rem', whiteSpace: 'nowrap'}}>Consultation Fee:</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <span style={{color: '#10b981', fontWeight: 700, fontSize: '1.1rem'}}>₹</span>
                      <input 
                        type="number"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(Number(e.target.value))}
                        style={{
                          width: '80px', background: 'rgba(255,255,255,0.08)', 
                          border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px',
                          padding: '6px 10px', color: '#10b981', fontWeight: 700,
                          fontSize: '1.1rem', outline: 'none'
                        }}
                      />
                    </div>
                    <span style={{color: '#52525b', fontSize: '0.75rem', marginLeft: 'auto'}}>Sent to patient on approve</span>
                  </div>

                  <div className="ai-actions">
                    <button className="secondary-action-btn" onClick={() => showToast("Reviewing draft...", "info")}><CheckCircle2 size={20} /> Review Draft</button>
                    <button 
                      className="primary-action-btn"
                      onClick={() => {
                        setAiProcessing(true);
                        setIsRecording(false);
                        gsap.to(".pulse-ring-1", { scale: 2, opacity: 0, duration: 0.5, stagger: 0.2, repeat: 4 });
                        setTimeout(() => {
                          setAiProcessing(false);
                          completeConsultation(selectedPatient.id, selectedPatient.condition, consultationFee);
                          showToast("Prescription generated & payment sent to patient!", "success");
                          setSelectedPatient(null);
                        }, 3000);
                      }}
                    >
                      {aiProcessing ? "Generating..." : <><Send size={20} /> Approve & Send Bill</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) }

        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="mobile-nav-doc">
        <button className={`m-nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}><Activity size={20}/></button>
        <button className={`m-nav-item ${activeView === 'patients' ? 'active' : ''}`} onClick={() => setActiveView('patients')}><Users size={20}/></button>
        <button className={`m-nav-item ${activeView === 'appointments' ? 'active' : ''}`} onClick={() => setActiveView('appointments')}><Calendar size={20}/></button>
        <button className={`m-nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}><Settings size={20}/></button>
      </div>
    </div>
  );
}

export default DoctorDashboard;
