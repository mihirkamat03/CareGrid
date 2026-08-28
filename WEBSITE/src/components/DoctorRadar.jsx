import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { X, MapPin, Star, Phone } from 'lucide-react';
import './DoctorRadar.css';

function DoctorRadar({ onClose, onBook }) {
  const [isScanning, setIsScanning] = useState(true);

  const nearbyDoctors = [
    { id: 'n1', name: 'Dr. Aisha Khan', specialty: 'Cardiologist', distance: '1.2 km', rating: 4.8 },
    { id: 'n2', name: 'Dr. Rohan Das', specialty: 'General Physician', distance: '2.5 km', rating: 4.9 },
    { id: 'n3', name: 'Dr. Sarah Lee', specialty: 'Dermatologist', distance: '3.1 km', rating: 4.6 },
  ];

  const visitedDoctors = [
    { id: 1, name: "Dr. Rahul Sharma", specialty: "Cardiologist", location: "City Clinic" },
    { id: 2, name: "Dr. Anita Desai", specialty: "Dermatologist", location: "SkinCare Hub" }
  ];

  useEffect(() => {
    // Stop scanning after 3.5 seconds
    const timer = setTimeout(() => {
      setIsScanning(false);
      gsap.fromTo(".nearby-doc-item", 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" }
      );
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="radar-overlay">
      <div className="radar-modal">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        
        <h2>Find Nearby Doctors</h2>
        <p className="radar-subtext">Locating the best specialists around you...</p>

        <div className="radar-container">
          {/* Radar Sweep Animation */}
          <div className="radar-center"></div>
          {isScanning && <div className="radar-sweep"></div>}
          
          <div className="radar-ring r1"></div>
          <div className="radar-ring r2"></div>
          <div className="radar-ring r3"></div>
          
          {/* Found Doctors plotted on the radar */}
          {!isScanning && (
            <>
              <div className="nearby-doc-item pos-1" onClick={() => onBook(nearbyDoctors[0])}>
                <div className="doc-dot"></div>
                <div className="doc-tooltip">
                  <strong>{nearbyDoctors[0].name}</strong>
                  <span>{nearbyDoctors[0].specialty} • {nearbyDoctors[0].distance}</span>
                </div>
              </div>
              
              <div className="nearby-doc-item pos-2" onClick={() => onBook(nearbyDoctors[1])}>
                <div className="doc-dot"></div>
                <div className="doc-tooltip">
                  <strong>{nearbyDoctors[1].name}</strong>
                  <span>{nearbyDoctors[1].specialty} • {nearbyDoctors[1].distance}</span>
                </div>
              </div>

              <div className="nearby-doc-item pos-3" onClick={() => onBook(nearbyDoctors[2])}>
                <div className="doc-dot"></div>
                <div className="doc-tooltip">
                  <strong>{nearbyDoctors[2].name}</strong>
                  <span>{nearbyDoctors[2].specialty} • {nearbyDoctors[2].distance}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="visited-section">
          <h3>Previously Visited</h3>
          <div className="visited-list">
            {visitedDoctors.map(doc => (
              <div key={doc.id} className="visited-item" onClick={() => onBook(doc)}>
                <div className="v-avatar">{doc.name.charAt(4)}</div>
                <div className="v-info">
                  <h4>{doc.name}</h4>
                  <span>{doc.specialty}</span>
                </div>
                <button className="rebook-btn">Rebook</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DoctorRadar;
