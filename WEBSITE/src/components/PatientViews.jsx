import React, { useState } from 'react';
import { Upload, FileText, Pill, Search, MapPin, Plus, ShoppingBag, Download, Clock } from 'lucide-react';
import { useCareGrid } from '../context/CareGridContext';
import './PatientViews.css';

export function HealthRecordsView() {
  const { patientRecords } = useCareGrid();

  return (
    <div className="patient-view-container panel" style={{animation: 'fadeIn 0.4s ease'}}>
      <div className="flex-row-between">
        <h2>Health Records</h2>
        <button className="primary-action-btn"><Upload size={16}/> Upload Record</button>
      </div>

      <div className="records-grid mt-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px'}}>
        {patientRecords.length === 0 ? (
          <div className="text-center p-4 text-muted panel w-full" style={{gridColumn: '1 / -1'}}>
            <FileText size={40} className="mx-auto mb-2 text-muted" />
            <p>No health records yet.</p>
          </div>
        ) : (
          patientRecords.map(rec => (
            <div key={rec.id} className="record-card panel bg-dark" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.05)', transition: '0.3s'}}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="flex-row-between">
                <FileText size={24} className={rec.type === 'Prescription' ? 'text-emerald' : 'text-sky'} />
                <span className="text-muted text-sm">{rec.date}</span>
              </div>
              <h3 style={{margin: '5px 0'}}>{rec.title}</h3>
              <p className="text-muted text-sm m-0">Issued by {rec.doctor}</p>
              
              <div className="tags-row" style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                {rec.tags?.map((tag, i) => (
                  <span key={i} className="status-badge-small" style={{fontSize: '0.7rem', padding: '2px 8px'}}>{tag}</span>
                ))}
              </div>
              
              <button className="secondary-full-btn mt-2" style={{marginTop: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', color: '#fff', borderRadius: '8px', cursor: 'pointer'}}>
                <Download size={14}/> Download PDF
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function PharmacyView({ triggerPayment }) {
  const [cart, setCart] = useState([]);
  
  const medicines = [
    { id: 1, name: "Paracetamol 500mg", price: 50 },
    { id: 2, name: "Amoxicillin 250mg", price: 120 },
    { id: 3, name: "Vitamin C Supplements", price: 200 },
    { id: 4, name: "Cough Syrup", price: 85 },
  ];

  const addToCart = (med) => setCart([...cart, med]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="view-container flex-row-view">
      <div className="flex-2">
        <div className="view-header">
          <h2>CareGrid Pharmacy</h2>
          <div className="search-bar"><Search size={18} className="text-muted"/><input type="text" placeholder="Search medicines..." /></div>
        </div>
        
        <div className="meds-grid">
          {medicines.map(med => (
            <div key={med.id} className="med-card panel">
              <Pill size={28} className="text-emerald mb-2" />
              <h4>{med.name}</h4>
              <span className="price">₹{med.price}</span>
              <button className="secondary-full-btn mt-2" onClick={() => addToCart(med)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 panel cart-panel">
        <h3><ShoppingBag size={20}/> Your Cart</h3>
        {cart.length === 0 ? <p className="text-muted mt-4">Cart is empty</p> : (
          <div className="cart-items mt-4">
            {cart.map((c, i) => (
              <div key={i} className="cart-item">
                <span>{c.name}</span>
                <strong>₹{c.price}</strong>
              </div>
            ))}
            <div className="divider"></div>
            <div className="cart-total"><span>Total</span><strong>₹{total}</strong></div>
            <button className="primary-action-btn massive-action-btn mt-4" onClick={() => { setCart([]); triggerPayment(total); }}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MyDoctorsView() {
  const { patientDoctors, setPatientDoctors } = useCareGrid();

  const handleAddDoctor = () => {
    const name = prompt("Doctor Name:");
    const specialty = prompt("Specialty:");
    const location = prompt("Location/Clinic Address:");
    if (name && specialty) {
      setPatientDoctors([...patientDoctors, { id: Date.now(), name, specialty, location }]);
    }
  };

  return (
    <div className="view-container panel" style={{animation: 'fadeIn 0.4s ease'}}>
      <div className="flex-row-between mb-4">
        <h2>My Doctors</h2>
        <button className="primary-action-btn" onClick={handleAddDoctor}><Plus size={16}/> Add Doctor</button>
      </div>
      
      {patientDoctors.length === 0 ? (
        <div className="empty-state text-center p-4">No doctors added yet.</div>
      ) : (
        <div className="records-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px'}}>
          {patientDoctors.map(d => (
            <div key={d.id} className="record-card panel bg-dark" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.05)'}}>
              <h3 style={{margin: '0 0 5px 0'}}>{d.name}</h3>
              <p className="text-sky" style={{margin: '0 0 5px 0'}}>{d.specialty}</p>
              <p className="text-muted text-sm" style={{margin: '0 0 15px 0'}}><MapPin size={12}/> {d.location}</p>
              <button className="secondary-full-btn" style={{width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer'}}>Book Consult</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PatientAppointmentsView() {
  const { patientAppointments } = useCareGrid();
  const [selectedApt, setSelectedApt] = useState(null);

  // If we have an active appointment clicked, show the Live Tracker Modal
  if (selectedApt) {
    return <LiveTrackingScreen apt={selectedApt} onBack={() => setSelectedApt(null)} />;
  }

  return (
    <div className="patient-view-container panel" style={{animation: 'fadeIn 0.4s ease'}}>
      <div className="flex-row-between" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>My Appointments</h2>
        <button className="primary-action-btn">Book New</button>
      </div>
      <div className="mt-4">
        {patientAppointments.length === 0 ? (
          <div className="text-center p-4 text-muted">No upcoming appointments.</div>
        ) : (
          patientAppointments.map(apt => (
            <div 
              key={apt.id} 
              className="panel bg-dark mb-3 flex-row-between" 
              style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', marginBottom: '1rem', cursor: 'pointer', transition: '0.3s'}}
              onClick={() => setSelectedApt(apt)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div>
                <strong className="text-lg block" style={{display: 'block', fontSize: '1.1rem'}}>{apt.docName}</strong>
                <span className="text-muted text-sm">{apt.specialty} • {apt.clinic}</span>
              </div>
              <div className="text-right" style={{textAlign: 'right'}}>
                <strong className="block" style={{display: 'block'}}>{apt.date} • {apt.time}</strong>
                <span className={`status-badge-small ${apt.status === 'Confirmed' ? 'waiting' : 'inside'}`}>{apt.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LiveTrackingScreen({ apt, onBack }) {
  const { currentToken, queue } = useCareGrid();
  // Calculate est wait
  const myToken = apt?.tokenNumber || (queue.length > 0 ? queue[queue.length - 1].id : 15);
  const estWait = Math.max(0, (myToken - currentToken) * 15);

  return (
    <div className="live-track-modal panel" style={{animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)', background: 'rgba(20, 20, 25, 0.85)', backdropFilter: 'blur(25px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem'}}>
      <button onClick={onBack} style={{background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', marginBottom: '1rem'}}>
        ← Back
      </button>

      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h2 style={{fontSize: '1.8rem', marginBottom: '5px'}}>Live Token Tracker</h2>
        <p className="text-muted">Tracking your appointment with {apt.docName}</p>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '2rem'}}>
        <div style={{textAlign: 'center'}}>
          <span style={{color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Currently Inside</span>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#facc15', textShadow: '0 0 20px rgba(250, 204, 21, 0.4)'}}>
            #{currentToken}
          </div>
        </div>
        
        <div style={{width: '2px', height: '60px', background: 'rgba(255,255,255,0.1)'}}></div>

        <div style={{textAlign: 'center'}}>
          <span style={{color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Your Token</span>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#38bdf8', textShadow: '0 0 20px rgba(56, 189, 248, 0.4)'}}>
            #{myToken}
          </div>
        </div>
      </div>

      <div className="panel" style={{background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center'}}>
        <h3 style={{color: '#10b981', fontSize: '1.2rem', marginBottom: '5px'}}>Estimated Wait: {estWait} mins</h3>
        <p style={{fontSize: '0.9rem', color: '#a1a1aa'}}>Please reach the clinic 10 minutes before your expected time.</p>
      </div>
    </div>
  );
}

export function PatientProfileView() {
  return (
    <div className="patient-view-container panel">
      <h2>Profile & Settings</h2>
      <div className="mt-4" style={{maxWidth: '600px'}}>
        <div className="flex-row-between mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <div className="huge-avatar" style={{width: '60px', height: '60px', borderRadius: '50%', background: '#38bdf8', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'}}>
            JD
          </div>
          <button className="secondary-action-btn">Edit Photo</button>
        </div>
        <div className="form-group mb-4" style={{marginBottom: '1.5rem'}}>
          <label className="text-muted text-sm block mb-2" style={{display: 'block', marginBottom: '0.5rem'}}>Full Name</label>
          <input type="text" className="styled-input" style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white'}} defaultValue="John Doe" />
        </div>
        <div className="form-group mb-4" style={{marginBottom: '1.5rem'}}>
          <label className="text-muted text-sm block mb-2" style={{display: 'block', marginBottom: '0.5rem'}}>Email Address</label>
          <input type="email" className="styled-input" style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white'}} defaultValue="john.doe@example.com" />
        </div>
        <div className="form-group mb-4" style={{marginBottom: '1.5rem'}}>
          <label className="text-muted text-sm block mb-2" style={{display: 'block', marginBottom: '0.5rem'}}>Phone Number</label>
          <input type="text" className="styled-input" style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white'}} defaultValue="+91 9876543210" />
        </div>
        <button className="primary-action-btn massive-action-btn mt-4">Save Profile</button>
      </div>
    </div>
  );
}
