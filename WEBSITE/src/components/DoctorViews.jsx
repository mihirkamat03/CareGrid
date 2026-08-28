import React from 'react';
import { BarChart2, Activity, Users, Calendar, FileText, Settings, Download, Search, CheckCircle, Clock } from 'lucide-react';
import { useCareGrid } from '../context/CareGridContext';
import './DoctorViews.css';

export function AnalyticsView() {
  return (
    <div className="doc-view-container">
      <div className="view-header">
        <h2>Advanced Analytics</h2>
        <button className="secondary-action-btn"><Download size={16}/> Export Report</button>
      </div>
      
      <div className="analytics-grid">
        <div className="panel chart-panel">
          <h3>Patient Flow (Weekly)</h3>
          <div className="mock-bar-chart">
            <div className="bar" style={{height: '60%'}}><span>Mon</span></div>
            <div className="bar" style={{height: '80%'}}><span>Tue</span></div>
            <div className="bar" style={{height: '40%'}}><span>Wed</span></div>
            <div className="bar" style={{height: '90%', background: '#10b981'}}><span>Thu</span></div>
            <div className="bar" style={{height: '70%'}}><span>Fri</span></div>
            <div className="bar" style={{height: '30%'}}><span>Sat</span></div>
          </div>
        </div>
        
        <div className="panel stats-panel">
          <h3>Key Metrics</h3>
          <div className="metric-row"><span className="text-muted">Total Consultations</span><strong>1,284</strong></div>
          <div className="metric-row"><span className="text-muted">Avg Revenue/Day</span><strong className="text-emerald">₹18,500</strong></div>
          <div className="metric-row"><span className="text-muted">Patient Retention</span><strong className="text-sky">86%</strong></div>
          <div className="metric-row"><span className="text-muted">AI Prescriptions</span><strong>942</strong></div>
        </div>
      </div>
    </div>
  );
}

export function DoctorAppointmentsView() {
  const { queue } = useCareGrid();
  // Filter queue to show as appointments for demonstration, or use patientAppointments if we had a global list
  // Actually, let's just show the queue data since bookings flow directly into the live queue in this prototype!
  const appointments = queue.filter(q => q.status !== 'Completed');

  return (
    <div className="doc-view-container">
      <div className="view-header">
        <h2>Scheduled Appointments</h2>
        <div className="search-bar"><Search size={18} className="text-muted"/><input type="text" placeholder="Search appointments..." /></div>
      </div>
      
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="text-center p-4 text-muted">No upcoming appointments.</div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="panel flex-row-between mb-3">
              <div className="flex-col">
                <strong className="text-lg">{apt.name}</strong>
                <span className="text-muted text-sm">{apt.condition} • {apt.location}</span>
              </div>
              <div className="flex-col text-right">
                <strong className="text-emerald">{apt.time}</strong>
                <span className="status-badge-small waiting">{apt.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function PrescriptionsArchive() {
  const records = [
    { id: 101, patient: "Arjun Mehta", date: "Today", condition: "Viral Fever" },
    { id: 102, patient: "Neha Singh", date: "Yesterday", condition: "Migraine" },
    { id: 103, patient: "Rohan Das", date: "22 Aug", condition: "Routine Checkup" },
  ];

  return (
    <div className="doc-view-container">
      <div className="view-header">
        <h2>Prescriptions Archive</h2>
        <button className="primary-action-btn">Filter by Date</button>
      </div>

      <div className="records-grid">
        {records.map(r => (
          <div key={r.id} className="record-card panel">
            <FileText size={32} className="text-sky mb-2" />
            <h4>{r.patient}</h4>
            <span className="text-muted">{r.date} • {r.condition}</span>
            <button className="secondary-full-btn mt-2"><Download size={14}/> Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PatientsDirectory() {
  return (
    <div className="doc-view-container text-center panel" style={{padding: '4rem'}}>
      <Users size={48} className="text-muted mx-auto mb-4" />
      <h2>Patient Directory</h2>
      <p className="text-muted mt-2">All registered patients will appear here.</p>
    </div>
  );
}

export function DoctorSettings() {
  return (
    <div className="doc-view-container">
      <h2>Profile & Settings</h2>
      <div className="panel mt-4" style={{maxWidth: '600px'}}>
        <div className="form-group mb-4">
          <label className="text-muted text-sm block mb-2">Clinic Name</label>
          <input type="text" className="styled-input" defaultValue="City Care Clinic" />
        </div>
        <div className="form-group mb-4">
          <label className="text-muted text-sm block mb-2">Consultation Fee (₹)</label>
          <input type="number" className="styled-input" defaultValue="500" />
        </div>
        <div className="form-group mb-4">
          <label className="text-muted text-sm block mb-2">AI Voice Assistant</label>
          <div className="flex-row-between panel bg-dark">
            <span>Enable Auto-Prescription Gen</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <button className="primary-action-btn massive-action-btn mt-4">Save Changes</button>
      </div>
    </div>
  );
}
