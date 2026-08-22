import React, { useEffect } from 'react';
import gsap from 'gsap';
import { Home, Calendar, Clock, HeartPulse, Stethoscope, Pill, ArrowRight, User as UserIcon, Bell, Search, ChevronDown, MapPin, FileText } from 'lucide-react';
import './PatientTracker.css';

function PatientDashboard() {
  
  useEffect(() => {
    gsap.fromTo(".dash-sidebar", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".dash-header", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(".dash-content-grid", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    gsap.to(".mini-token-circle", { scale: 1.05, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);

  const historyData = [
    { id: 1, docName: "Dr. Rahul Sharma", specialty: "Cardiologist", location: "City Clinic", date: "24 Jun 2026", time: "11:00 AM" },
    { id: 2, docName: "Dr. Anita Desai", specialty: "Dermatologist", location: "SkinCare Hub", date: "14 Feb 2026", time: "10:00 AM" },
    { id: 3, docName: "Dr. Linnea Adr", specialty: "General", location: "Apollo Clinic", date: "27 Jan 2026", time: "14:00 PM" }
  ];

  return (
    <div className="dash-page">
      
      {/* Floating Sidebar */}
      <div className="dash-sidebar floating-sidebar">
        <div className="dash-logo-box">
          <img src="/caregrid-logo.png" alt="CareGrid Logo" className="dash-logo" />
          <span className="brand-text">Care<span className="text-emerald">Grid</span></span>
        </div>
        
        <div className="sidebar-section">
          <span className="sidebar-label">Primary Menu</span>
          <nav className="dash-nav">
            <button className="nav-item active"><Home size={18} /> Dashboard</button>
            <button className="nav-item"><Stethoscope size={18} /> My Doctors</button>
            <button className="nav-item"><Calendar size={18} /> Appointments <span className="nav-badge">01</span></button>
            <button className="nav-item"><Pill size={18} /> Pharmacy</button>
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Profile</span>
          <nav className="dash-nav">
            <button className="nav-item"><HeartPulse size={18} /> Health Records</button>
            <button className="nav-item"><Bell size={18} /> Notifications</button>
          </nav>
        </div>

        <div className="dash-profile">
          <div className="profile-btn">
            <div className="avatar">JD</div>
            <div className="profile-info">
              <p className="name">John Doe</p>
              <p className="role">Premium Member</p>
            </div>
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
              <div className="avatar-small">JD</div>
              <span>John Doe</span>
              <ChevronDown size={14} className="text-muted"/>
            </div>
          </div>
        </header>

        <div className="dash-content">
          <div className="dash-content-grid">
            
            {/* LEFT MAIN COLUMN */}
            <div className="main-feed-col">
              
              {/* Banner Card */}
              <div className="patient-hero-banner">
                <div className="hero-content">
                  <h2>Get 20% off your first pharmacy order!</h2>
                  <p>Link your CareGrid prescriptions directly to local pharmacies and get medicines delivered in 30 minutes.</p>
                  <button className="hero-btn">Claim Offer <ArrowRight size={16} /></button>
                </div>
                <div className="banner-decor"></div>
              </div>

              {/* Stats / Categories Pills */}
              <div className="dashboard-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="stats-pills-row">
                  <div className="stat-pill bg-purple-gradient cursor-pointer">
                    <div className="pill-icon"><Stethoscope size={20} /></div>
                    <div className="pill-info">
                      <span className="pill-val">Consult</span>
                      <span className="pill-label">Book Doctor</span>
                    </div>
                  </div>
                  
                  <div className="stat-pill bg-emerald-gradient cursor-pointer">
                    <div className="pill-icon"><Pill size={20} /></div>
                    <div className="pill-info">
                      <span className="pill-val">Order</span>
                      <span className="pill-label">Medicines</span>
                    </div>
                  </div>

                  <div className="stat-pill bg-yellow-gradient cursor-pointer">
                    <div className="pill-icon"><FileText size={20} /></div>
                    <div className="pill-info">
                      <span className="pill-val">Upload</span>
                      <span className="pill-label">Lab Reports</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previously Visited List */}
              <div className="dashboard-section mt-4">
                <div className="section-header">
                  <h3 className="section-title">My Appointments</h3>
                  <button className="text-btn">View All</button>
                </div>
                
                <div className="advanced-list">
                  {historyData.map((doc, index) => (
                    <div key={doc.id} className="adv-list-item">
                      <div className="adv-avatar">{doc.docName.charAt(4)}</div>
                      <div className="adv-details">
                        <h4>{doc.docName}</h4>
                        <span className="adv-sub"><MapPin size={12}/> {doc.location}</span>
                      </div>
                      <div className="adv-time">
                        <span>{doc.date}</span>
                        <span className="text-muted">{doc.time}</span>
                      </div>
                      <div className="adv-status">
                        <span className="status-badge-small completed">Completed</span>
                      </div>
                      <button className="adv-action">Rebook</button>
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
                    <span className="number">15</span>
                  </div>
                  
                  <div className="tracker-stats">
                    <div className="t-stat">
                      <span>Currently Inside</span>
                      <strong>#12</strong>
                    </div>
                    <div className="t-stat">
                      <span>Est. Wait</span>
                      <strong className="text-yellow">15 mins</strong>
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
                
                <button className="secondary-full-btn">Order Refill from Pharmacy</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
