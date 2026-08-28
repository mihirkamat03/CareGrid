import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { MapPin, Search, Crosshair, Star, Users, Award, Clock, Calendar as CalIcon, CreditCard, CheckCircle2, ChevronLeft, Map } from 'lucide-react';
import { useCareGrid } from '../context/CareGridContext';
import { useAuth } from '../context/AuthContext';
import './PatientBookingFlow.css';

// Master Component
export default function BookingFlowManager({ onClose }) {
  const [step, setStep] = useState('LOCATION'); // LOCATION, MAP, PROFILE, BOOKING, PREMIUM
  const [userLocation, setUserLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const handleLocationConfirm = (loc) => {
    setUserLocation(loc);
    setStep('MAP');
  };

  const handleDoctorSelect = (doc) => {
    setSelectedDoctor(doc);
    setStep('PROFILE');
  };

  const handleBookInitiate = () => {
    setStep('BOOKING');
  };

  const handleSlotConfirm = () => {
    setStep('PREMIUM');
  };

  const handleFlowComplete = () => {
    onClose();
  };

  return (
    <div className="booking-flow-overlay">
      <div className="booking-flow-container">
        {step === 'LOCATION' && <LocationPrompt onConfirm={handleLocationConfirm} onCancel={onClose} />}
        {step === 'MAP' && <DoctorMap location={userLocation} onSelectDoctor={handleDoctorSelect} onBack={() => setStep('LOCATION')} />}
        {step === 'PROFILE' && <DoctorProfile doctor={selectedDoctor} onBook={handleBookInitiate} onBack={() => setStep('MAP')} />}
        {step === 'BOOKING' && <ClinicBooking doctor={selectedDoctor} onConfirm={handleSlotConfirm} onBack={() => setStep('PROFILE')} />}
        {step === 'PREMIUM' && <PremiumPrompt doctor={selectedDoctor} onComplete={handleFlowComplete} />}
      </div>
    </div>
  );
}

// 1. Location Prompt
function LocationPrompt({ onConfirm, onCancel }) {
  const [loc, setLoc] = useState('');

  useEffect(() => {
    gsap.fromTo(".location-modal", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
  }, []);

  return (
    <div className="location-modal panel">
      <button className="close-btn" onClick={onCancel}>✕</button>
      <div className="modal-header-center">
        <div className="icon-circle bg-sky-light"><MapPin size={24} className="text-sky"/></div>
        <h2>Set Your Location</h2>
        <p>We need your address to find the best nearby doctors accurately.</p>
      </div>

      <div className="mock-map-container">
        <div className="mock-map-bg"></div>
        <div className="map-crosshair"><Crosshair size={24} className="text-sky pulse-anim" /></div>
      </div>

      <div className="location-search-box">
        <Search size={18} className="text-muted" />
        <input 
          type="text" 
          placeholder="Enter address or drag map..." 
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
        />
        <button className="locate-me-btn"><Crosshair size={18}/></button>
      </div>

      <button className="massive-action-btn mt-4" onClick={() => onConfirm(loc || 'Current Location')}>
        Confirm Location
      </button>
    </div>
  );
}

// 2. Map & Radar View
function DoctorMap({ location, onSelectDoctor, onBack }) {
  const { patientDoctors } = useCareGrid();

  const presetPositions = [
    { top: "30%", left: "40%" },
    { top: "60%", left: "70%" },
    { top: "50%", left: "20%" },
    { top: "25%", left: "65%" },
    { top: "68%", left: "35%" },
    { top: "40%", left: "80%" }
  ];

  const doctors = (patientDoctors && patientDoctors.length > 0 ? patientDoctors : [
    { id: '1', name: "Dr. Rahul Sharma", specialty: "Cardiologist", rating: 4.9, patients: "5k+", qual: "MBBS, MD", distance: "1.2 km" },
    { id: '2', name: "Dr. Anita Desai", specialty: "Dermatologist", rating: 4.7, patients: "2k+", qual: "MBBS, DDVL", distance: "2.5 km" },
    { id: '3', name: "Dr. Vikram Singh", specialty: "General Physician", rating: 4.8, patients: "10k+", qual: "MBBS", distance: "0.8 km" }
  ]).map((doc, idx) => {
    const pos = presetPositions[idx % presetPositions.length];
    return {
      ...doc,
      top: doc.top || pos.top,
      left: doc.left || pos.left,
      rating: doc.rating || 4.8,
      patients: doc.patients || "1.2k+",
      qual: doc.qual || doc.qualification || "MBBS, MD",
      distance: doc.distance || `${(0.8 + (idx * 0.6)).toFixed(1)} km`
    };
  });

  useEffect(() => {
    gsap.fromTo(".map-view", { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo(".doc-pin", { scale: 0, y: -20 }, { scale: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "back.out(1.5)" });
  }, [doctors.length]);

  return (
    <div className="map-view panel full-height">
      <div className="map-header">
        <button className="icon-btn" onClick={onBack}><ChevronLeft size={20}/></button>
        <div>
          <h3>Doctors Near You</h3>
          <p className="text-muted text-sm"><Map size={12}/> {location}</p>
        </div>
      </div>

      <div className="interactive-map">
        <div className="map-grid-bg"></div>
        {/* User Pin */}
        <div className="user-pin" style={{ top: '50%', left: '50%' }}>
          <div className="user-dot"></div>
          <div className="radar-ring r1"></div>
          <div className="radar-ring r2"></div>
        </div>

        {/* Doctor Pins */}
        {doctors.map(doc => (
          <div key={doc.id} className="doc-pin" style={{ top: doc.top, left: doc.left }} onClick={() => onSelectDoctor(doc)}>
            <img src="/caregrid-logo.png" alt="doc" className="doc-pin-img" />
            <div className="doc-pin-info">
              <strong>{doc.name}</strong>
              <span>{doc.specialty} • {doc.distance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Doctor Profile Modal
function DoctorProfile({ doctor, onBook, onBack }) {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(".profile-view", 
      { y: 50, opacity: 0, scale: 0.95 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
    )
    .fromTo(".huge-avatar", 
      { scale: 0, rotate: -90 }, 
      { scale: 1, rotate: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" }, "-=0.2"
    )
    .fromTo(".doc-titles > *", 
      { x: -20, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.5"
    )
    .fromTo(".d-stat", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.3"
    )
    .fromTo(".book-corner-btn", 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.4"
    );

    // Continuous glow animation on the avatar
    gsap.to(".huge-avatar", {
      boxShadow: "0 0 25px rgba(56, 189, 248, 0.7), 0 0 50px rgba(129, 140, 248, 0.4)",
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div className="profile-view panel full-height relative">
      <div className="profile-header-image">
        <div className="animated-bg-overlay"></div>
      </div>
      
      <div className="profile-content">
        <button className="glass-back-btn" onClick={onBack}><ChevronLeft size={20}/></button>
        
        <div className="doc-main-info">
          <div className="huge-avatar">{doctor?.name ? (doctor.name.replace(/^Dr\.\s*/i, '').charAt(0) || doctor.name.charAt(0) || 'D') : 'D'}</div>
          <div className="doc-titles">
            <h2>{doctor.name}</h2>
            <p className="text-sky">{doctor.specialty}</p>
            <p className="text-muted">{doctor.qual || doctor.qualification || "MBBS, MD"}</p>
          </div>
          <button className="primary-action-btn book-corner-btn" onClick={onBook}>Book Appointment</button>
        </div>

        <div className="doc-stats-grid mt-4">
          <div className="d-stat">
            <Users size={24} className="text-emerald glow-icon"/>
            <strong>{doctor.patients}</strong>
            <span>Patients</span>
          </div>
          <div className="d-stat">
            <Star size={24} className="text-yellow glow-icon"/>
            <strong>{doctor.rating}</strong>
            <span>Rating</span>
          </div>
          <div className="d-stat">
            <Award size={24} className="text-purple glow-icon"/>
            <strong>8 Yrs</strong>
            <span>Experience</span>
          </div>
        </div>

        <div className="doc-about mt-4">
          <h3>About Doctor</h3>
          <p className="text-muted mt-2">Dr. Sharma is a highly experienced specialist focusing on modern diagnostic techniques. Believes in minimal medication and lifestyle corrections.</p>
        </div>
      </div>
    </div>
  );
}

// 4. Clinic Booking (Time Slots)
function ClinicBooking({ doctor, onConfirm, onBack }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  
  const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "04:00 PM", "04:30 PM"];

  useEffect(() => {
    gsap.fromTo(".booking-view", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 });
  }, []);

  const handleSlotClick = (slot) => {
    // Simulate Intelligent System: Hardcode 10:00 AM to be "unavailable" and suggest 10:15 AM
    if (slot === "10:00 AM") {
      setSelectedSlot(null);
      setSuggestion({ requested: slot, available: "10:15 AM" });
      gsap.fromTo(".suggestion-box", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" });
    } else {
      setSuggestion(null);
      setSelectedSlot(slot);
    }
  };

  return (
    <div className="booking-view panel full-height">
      <div className="map-header">
        <button className="icon-btn" onClick={onBack}><ChevronLeft size={20}/></button>
        <div>
          <h3>Book Appointment</h3>
          <p className="text-muted text-sm">{doctor.name}</p>
        </div>
      </div>

      <div className="clinic-details mt-4">
        <div className="c-info-row"><MapPin size={18} className="text-sky"/> <span>City Care Clinic, Main Road</span></div>
        <div className="c-info-row"><Clock size={18} className="text-emerald"/> <span>09:00 AM - 05:00 PM</span></div>
      </div>

      <h3 className="mt-4 mb-2">Select Time Slot</h3>
      <div className="slots-grid">
        {slots.map(s => (
          <button 
            key={s} 
            className={`slot-btn ${selectedSlot === s ? 'active' : ''} ${s === '10:00 AM' ? 'high-demand' : ''}`}
            onClick={() => handleSlotClick(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {suggestion && (
        <div className="suggestion-box mt-4">
          <div className="s-icon"><Clock size={24}/></div>
          <div className="s-text">
            <strong>{suggestion.requested} is currently full.</strong>
            <p>CareGrid AI found an opening at <span className="text-emerald font-bold">{suggestion.available}</span>. Would you like this instead?</p>
          </div>
          <button className="secondary-action-btn" onClick={() => { setSuggestion(null); setSelectedSlot(suggestion.available); }}>Accept</button>
        </div>
      )}

      {selectedSlot && !suggestion && (
        <button className="massive-action-btn mt-4" onClick={onConfirm}>Confirm Booking for {selectedSlot}</button>
      )}
    </div>
  );
}

// 5. Token Premium Subscription
function PremiumPrompt({ doctor, onComplete }) {
  const { addPatientToQueue, triggerPayment, bookAppointment } = useCareGrid();
  const { currentUser, userProfile } = useAuth();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    gsap.fromTo(".premium-view", { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
  }, []);

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment & add to queue
    setTimeout(async () => {
      const patientName = userProfile?.name || "John Doe";
      const patientUid = currentUser ? currentUser.uid : "demo_patient";
      const clinicId = doctor?.clinicId || "demo_clinic";
      const bookingTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      // 1. Add to Doctor's live queue & get assigned token
      const tokenNum = await addPatientToQueue({
        patientId: patientUid,
        name: patientName,
        condition: "Consultation",
        time: bookingTime,
        location: "CareGrid App",
        clinicId: clinicId,
        age: 28,
        gender: "Male"
      });
      
      // 2. Add to Patient's personal appointment list
      await bookAppointment({
        doctorId: clinicId,
        docName: doctor?.name || "Dr. Rahul Sharma",
        specialty: doctor?.specialty || "Cardiologist",
        date: "Today",
        time: bookingTime,
        status: "Confirmed",
        clinic: doctor?.clinicName || "City Care Clinic",
        tokenNumber: tokenNum
      });

      triggerPayment(20, 'token_tracking'); // Show the receipt printer animation for Rs 20
      onComplete(); // Close flow
    }, 1200);
  };

  return (
    <div className="premium-view panel text-center">
      <div className="icon-circle bg-emerald-light mx-auto mb-4"><CheckCircle2 size={32} className="text-emerald"/></div>
      <h2>Appointment Secured!</h2>
      <p className="text-muted mt-2">Your slot with {doctor.name} is reserved.</p>

      <div className="premium-upsell mt-4">
        <h3>Live Token Tracking</h3>
        <p className="text-sm text-muted mt-2 mb-4">Don't wait in crowded clinic rooms. Pay just ₹20 to get a live radar of your queue position on your phone.</p>
        
        <button className="massive-action-btn bg-purple-gradient" onClick={handlePay} disabled={processing}>
          {processing ? "Processing ₹20..." : "Pay ₹20 & Track Token"}
        </button>
        <button className="text-btn mt-2" onClick={onComplete} disabled={processing}>No thanks, I will wait at clinic</button>
      </div>
    </div>
  );
}
