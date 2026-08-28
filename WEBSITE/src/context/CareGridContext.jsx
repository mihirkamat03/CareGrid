import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CareGridContext = createContext();

export const useCareGrid = () => useContext(CareGridContext);

// Default seed data
const SEED_QUEUE = [
  { id: 12, patientId: 'seed_1', name: "Arjun Mehta", time: "09:15 AM", status: "Inside", condition: "Viral Fever", location: "Mumbai", age: 34, gender: "Male" },
  { id: 13, patientId: 'seed_2', name: "Neha Singh", time: "09:30 AM", status: "Waiting", condition: "Migraine", location: "Delhi", age: 28, gender: "Female" },
  { id: 14, patientId: 'seed_3', name: "Rohan Das", time: "09:45 AM", status: "Waiting", condition: "Routine Checkup", location: "Bangalore", age: 45, gender: "Male" },
  { id: 15, patientId: 'demo_patient', name: "Priya Sharma", time: "10:00 AM", status: "Waiting", condition: "Skin Rash", location: "Pune", age: 22, gender: "Female" }
];

const SEED_RECORDS = [
  { id: '1', type: "Prescription", title: "General Consultation", date: "12 Aug 2023", doctor: "Dr. Rahul Sharma", condition: "Fever", tags: ["Fever", "Completed"] },
  { id: '2', type: "Report", title: "Blood Test Results", date: "05 Aug 2023", doctor: "PathLabs", condition: "Lab Test", tags: ["Lab", "Normal"] }
];

const SEED_APPOINTMENTS = [
  { id: '101', doctorId: 'demo_clinic', docName: "Dr. Rahul Sharma", specialty: "Cardiologist", date: "Today", time: "10:00 AM", status: "Confirmed", clinic: "City Care Clinic", tokenNumber: 15 },
  { id: '102', doctorId: 'demo_clinic', docName: "Dr. Anita Desai", specialty: "Dermatologist", date: "24 Aug", time: "11:30 AM", status: "Completed", clinic: "SkinCare Center", tokenNumber: 8 }
];

const SEED_DOCTORS = [
  { id: '1', name: "Dr. Rahul Sharma", specialty: "Cardiologist", location: "City Care Clinic", clinicId: 'demo_clinic' },
  { id: '2', name: "Dr. Anita Desai", specialty: "Dermatologist", location: "SkinCare Center", clinicId: 'demo_clinic' }
];

export const CareGridProvider = ({ children }) => {
  const { currentUser, userRole, userProfile } = useAuth();

  // Doctor state
  const [queue, setQueue] = useState(SEED_QUEUE);
  const [currentToken, setCurrentToken] = useState(12);

  // Patient state
  const [patientAppointments, setPatientAppointments] = useState(SEED_APPOINTMENTS);
  const [patientRecords, setPatientRecords] = useState(SEED_RECORDS);
  const [patientDoctors, setPatientDoctors] = useState(SEED_DOCTORS);
  const [myTokenNumber, setMyTokenNumber] = useState(15);

  // Shared UI state
  const [activePatient, setActivePatient] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentSource, setPaymentSource] = useState('generic'); // 'doctor_fee' | 'pharmacy' | 'token_tracking' | 'generic'

  // Real-time payment request from doctor
  const [pendingPayment, setPendingPayment] = useState(null);

  // ===================== FIRESTORE REALTIME SYNC =====================
  useEffect(() => {
    const unsubs = [];

    try {
      // 1. Always listen to shared clinic (demo_clinic)
      const sharedClinicRef = doc(db, 'clinics', 'demo_clinic');
      const unsubSharedClinic = onSnapshot(sharedClinicRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.currentToken !== undefined) setCurrentToken(data.currentToken);
          if (data.queue && data.queue.length > 0) setQueue(data.queue);
          if (data.pendingPayment) {
            if (!data.pendingPayment.paid) {
              setPendingPayment(data.pendingPayment);
            } else {
              setPendingPayment(null);
            }
          }
        } else {
          // Seed if doesn't exist
          setDoc(sharedClinicRef, { currentToken: 12, queue: SEED_QUEUE }, { merge: true });
        }
      });
      unsubs.push(unsubSharedClinic);

      // 2. If logged in as Doctor, also listen to doctor's own clinic doc
      if (currentUser && userRole === 'doctor') {
        const doctorClinicRef = doc(db, 'clinics', currentUser.uid);
        const unsubDoctorClinic = onSnapshot(doctorClinicRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.currentToken !== undefined) setCurrentToken(data.currentToken);
            if (data.queue && data.queue.length > 0) setQueue(data.queue);
          }
        });
        unsubs.push(unsubDoctorClinic);
      }

      // 3. Always listen to demo_patient user doc
      const sharedPatientRef = doc(db, 'users', 'demo_patient');
      const unsubSharedPatient = onSnapshot(sharedPatientRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.appointments && data.appointments.length > 0) setPatientAppointments(data.appointments);
          if (data.records && data.records.length > 0) setPatientRecords(data.records);
          if (data.savedDoctors && data.savedDoctors.length > 0) setPatientDoctors(data.savedDoctors);
          if (data.pendingPayment) {
            if (!data.pendingPayment.paid) {
              setPendingPayment(data.pendingPayment);
            } else {
              setPendingPayment(null);
            }
          }
        } else {
          setDoc(sharedPatientRef, { 
            appointments: SEED_APPOINTMENTS, 
            records: SEED_RECORDS, 
            savedDoctors: SEED_DOCTORS 
          }, { merge: true });
        }
      });
      unsubs.push(unsubSharedPatient);

      // 4. If logged in as Patient, also listen to patient's personal user doc
      if (currentUser && userRole === 'patient') {
        const userPatientRef = doc(db, 'users', currentUser.uid);
        const unsubUserPatient = onSnapshot(userPatientRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.appointments && data.appointments.length > 0) setPatientAppointments(data.appointments);
            if (data.records && data.records.length > 0) setPatientRecords(data.records);
            if (data.savedDoctors && data.savedDoctors.length > 0) setPatientDoctors(data.savedDoctors);
            if (data.pendingPayment) {
              if (!data.pendingPayment.paid) {
                setPendingPayment(data.pendingPayment);
              } else {
                setPendingPayment(null);
              }
            }
          }
        });
        unsubs.push(unsubUserPatient);
      }

      // 5. Always listen to all registered doctors in real-time
      const doctorsCol = collection(db, 'doctors');
      const unsubDoctors = onSnapshot(doctorsCol, (snapshot) => {
        if (!snapshot.empty) {
          const liveDocs = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            liveDocs.push({
              id: docSnap.id,
              clinicId: data.clinicId || docSnap.id,
              name: data.name || "Doctor",
              specialty: data.specialty || "Specialist",
              location: data.clinicName || data.address || "City Clinic",
              clinicName: data.clinicName || "City Clinic",
              rating: data.rating || 4.8,
              patients: data.patients || "1k+",
              qual: data.qualification || "MBBS, MD",
              distance: data.distance || "1.2 km",
              top: data.top || "38%",
              left: data.left || "48%"
            });
          });

          // Merge live registered doctors with default seed doctors
          const merged = [...liveDocs];
          SEED_DOCTORS.forEach((seedDoc, i) => {
            if (!merged.some(m => m.name === seedDoc.name || m.id === seedDoc.id)) {
              merged.push({
                ...seedDoc,
                rating: 4.9 - (i * 0.1),
                patients: "3k+",
                qual: "MBBS, MD",
                distance: `${1.2 + (i * 0.8)} km`,
                top: i === 0 ? "30%" : "60%",
                left: i === 0 ? "40%" : "70%"
              });
            }
          });
          setPatientDoctors(merged);
        }
      });
      unsubs.push(unsubDoctors);

    } catch (err) {
      console.warn("Firebase sync error:", err);
    }

    return () => unsubs.forEach(u => u());
  }, [currentUser, userRole]);

  // Update user's latest token number from queue or appointments
  useEffect(() => {
    if (patientAppointments && patientAppointments.length > 0) {
      const activeApt = patientAppointments.find(a => a.status === 'Confirmed');
      if (activeApt && activeApt.tokenNumber) {
        setMyTokenNumber(activeApt.tokenNumber);
      }
    }
  }, [patientAppointments]);

  // ===================== DOCTOR ACTIONS =====================

  const callNextToken = async () => {
    if (queue.length === 0) return;
    const nextIdx = queue.findIndex(p => p.id > currentToken);
    if (nextIdx === -1) return;
    
    const nextTokenId = queue[nextIdx].id;
    const updatedQueue = queue.map(p => {
      if (p.id === nextTokenId) return { ...p, status: "Inside" };
      if (p.id < nextTokenId) return { ...p, status: "Completed" };
      return p;
    });

    setCurrentToken(nextTokenId);
    setQueue(updatedQueue);

    try {
      // Sync to shared demo_clinic
      const sharedRef = doc(db, 'clinics', 'demo_clinic');
      await setDoc(sharedRef, { currentToken: nextTokenId, queue: updatedQueue }, { merge: true });

      // Sync to doctor's own clinic doc if logged in
      if (currentUser && userRole === 'doctor') {
        const docRef = doc(db, 'clinics', currentUser.uid);
        await setDoc(docRef, { currentToken: nextTokenId, queue: updatedQueue }, { merge: true });
      }
    } catch (err) {
      console.warn("Failed to sync next token.", err);
    }
  };

  const addPatientToQueue = async (patientData) => {
    const newId = queue.length > 0 ? queue[queue.length - 1].id + 1 : 1;
    const newEntry = { ...patientData, id: newId, status: newId === 1 ? 'Inside' : 'Waiting' };
    const updatedQueue = [...queue, newEntry];
    setQueue(updatedQueue);
    setMyTokenNumber(newId);
    if (newId === 1) setCurrentToken(1);

    try {
      // 1. Sync to shared demo_clinic
      const sharedRef = doc(db, 'clinics', 'demo_clinic');
      await setDoc(sharedRef, { 
        currentToken: newId === 1 ? 1 : currentToken, 
        queue: updatedQueue 
      }, { merge: true });

      // 2. Sync to target clinic if provided
      if (patientData.clinicId && patientData.clinicId !== 'demo_clinic') {
        const targetRef = doc(db, 'clinics', patientData.clinicId);
        await setDoc(targetRef, { 
          currentToken: newId === 1 ? 1 : currentToken, 
          queue: updatedQueue 
        }, { merge: true });
      }
    } catch (err) {
      console.warn("Failed to sync new patient to Firebase.", err);
    }
    return newId;
  };

  const completeConsultation = async (patientId, condition, feeAmount = 500) => {
    // 1. Mark patient completed in Queue
    const patient = queue.find(p => p.id === patientId);
    const updatedQueue = queue.map(p => p.id === patientId ? { ...p, status: 'Completed' } : p);
    setQueue(updatedQueue);
    
    // 2. Generate a prescription record
    const doctorName = userProfile?.name || 'Dr. Sharma';
    const newRecord = {
      id: Date.now().toString(),
      type: "Prescription",
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: "CareGrid AI Prescription",
      doctor: doctorName,
      condition: condition || "General Consultation",
      tags: ["AI Generated", "Verified"]
    };

    const newPayment = {
      amount: feeAmount || 500,
      doctorName: doctorName,
      condition: condition || "Consultation",
      timestamp: new Date().toISOString(),
      paid: false,
      transactionId: `CG-${Date.now()}`
    };

    // Update local state immediately
    setPatientRecords(prev => [newRecord, ...prev]);

    try {
      // 3. Update shared clinic queue & broadcast pending payment
      const sharedClinicRef = doc(db, 'clinics', 'demo_clinic');
      await setDoc(sharedClinicRef, { 
        queue: updatedQueue,
        pendingPayment: newPayment
      }, { merge: true });

      // 4. Update doctor's own clinic doc if logged in
      if (currentUser && userRole === 'doctor') {
        const doctorRef = doc(db, 'clinics', currentUser.uid);
        await setDoc(doctorRef, { queue: updatedQueue }, { merge: true });
      }

      // 5. Push prescription & bill to shared demo_patient doc
      const sharedPatientRef = doc(db, 'users', 'demo_patient');
      const sharedPatientSnap = await getDoc(sharedPatientRef);
      const existingRecords = sharedPatientSnap.exists() ? (sharedPatientSnap.data().records || []) : [];
      await setDoc(sharedPatientRef, { 
        records: [newRecord, ...existingRecords],
        pendingPayment: newPayment
      }, { merge: true });

      // 6. If patient has a registered account, also push to their user doc
      const patientUid = patient?.patientId;
      if (patientUid && patientUid !== 'demo_patient' && patientUid.indexOf('seed_') !== 0) {
        const patientRef = doc(db, 'users', patientUid);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          const userRecs = patientSnap.data().records || [];
          await setDoc(patientRef, { 
            records: [newRecord, ...userRecs],
            pendingPayment: newPayment
          }, { merge: true });
        }
      }

    } catch (err) {
      console.warn("Failed to complete consultation sync.", err);
    }
  };

  // ===================== PATIENT ACTIONS =====================

  const bookAppointment = async (apptData) => {
    const newApt = { 
      ...apptData, 
      id: Date.now().toString(),
      tokenNumber: apptData.tokenNumber || (queue.length > 0 ? queue[queue.length - 1].id + 1 : 1)
    };
    const updatedApts = [newApt, ...patientAppointments];
    setPatientAppointments(updatedApts);
    setMyTokenNumber(newApt.tokenNumber);

    try {
      // Sync to shared demo_patient
      const sharedRef = doc(db, 'users', 'demo_patient');
      await setDoc(sharedRef, { appointments: updatedApts }, { merge: true });

      // Sync to user's own profile if logged in
      if (currentUser) {
        const patientRef = doc(db, 'users', currentUser.uid);
        await setDoc(patientRef, { appointments: updatedApts }, { merge: true });
      }
    } catch (err) {
      console.warn("Failed to sync appointment.", err);
    }
  };

  const markPaymentComplete = async () => {
    setPendingPayment(null);
    
    try {
      // Clear on shared clinic
      const sharedClinicRef = doc(db, 'clinics', 'demo_clinic');
      await setDoc(sharedClinicRef, { pendingPayment: { paid: true } }, { merge: true });

      // Clear on shared demo_patient
      const sharedPatientRef = doc(db, 'users', 'demo_patient');
      await setDoc(sharedPatientRef, { pendingPayment: { paid: true } }, { merge: true });

      // Clear on user doc if logged in
      if (currentUser) {
        const patientRef = doc(db, 'users', currentUser.uid);
        await setDoc(patientRef, { pendingPayment: { paid: true } }, { merge: true });
      }
    } catch (err) {
      console.warn("Failed to mark payment complete.", err);
    }
  };

  const saveProfile = async (profileData) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, profileData, { merge: true });
    } catch (err) {
      console.warn("Failed to save profile.", err);
    }
  };

  // ===================== SHARED ACTIONS =====================

  const triggerPayment = (amount, source = 'generic') => {
    setPaymentAmount(amount);
    setPaymentSource(source);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const fetchDoctors = async () => {
    try {
      const doctorsCol = collection(db, 'doctors');
      const snap = await getDocs(doctorsCol);
      const docs = [];
      snap.forEach(d => {
        docs.push({ id: d.id, ...d.data() });
      });
      return docs.length > 0 ? docs : SEED_DOCTORS;
    } catch (err) {
      console.warn("Failed to fetch doctors.", err);
      return SEED_DOCTORS;
    }
  };

  return (
    <CareGridContext.Provider value={{
      currentToken, setCurrentToken,
      queue, setQueue,
      patientAppointments, bookAppointment,
      patientRecords, setPatientRecords,
      patientDoctors, setPatientDoctors,
      myTokenNumber, setMyTokenNumber,
      completeConsultation,
      activePatient, setActivePatient,
      callNextToken, addPatientToQueue,
      showPaymentModal, setShowPaymentModal,
      paymentAmount, triggerPayment,
      paymentSuccess, setPaymentSuccess,
      paymentSource, setPaymentSource,
      pendingPayment, setPendingPayment,
      markPaymentComplete,
      saveProfile,
      fetchDoctors
    }}>
      {children}
    </CareGridContext.Provider>
  );
};
