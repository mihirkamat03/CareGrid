import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profileRef = doc(db, 'users', user.uid);
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            const profile = profileSnap.data();
            setUserProfile(profile);
            setUserRole(profile.role);
          } else {
            // Profile doesn't exist yet — will be created by AuthPage on signup
            setUserProfile(null);
            setUserRole(null);
          }
        } catch (err) {
          console.warn("Failed to fetch user profile:", err);
          setUserProfile(null);
          setUserRole(null);
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUserProfile = async (uid, profileData) => {
    const profileRef = doc(db, 'users', uid);
    await setDoc(profileRef, {
      ...profileData,
      createdAt: new Date().toISOString()
    });
    setUserProfile(profileData);
    setUserRole(profileData.role);
  };

  const createDoctorProfile = async (uid, profileData) => {
    // 1. Create user profile
    await createUserProfile(uid, profileData);

    // 2. Create public doctor profile (for patient search/discovery)
    const doctorRef = doc(db, 'doctors', uid);
    await setDoc(doctorRef, {
      name: profileData.name,
      specialty: profileData.specialty || 'General Physician',
      qualification: profileData.qualification || 'MBBS',
      clinicId: uid,
      clinicName: profileData.clinicName || `${profileData.name}'s Clinic`,
      address: profileData.address || 'Not set',
      rating: 4.8,
      patientsServed: 0,
      available: true
    });

    // 3. Create clinic document
    const clinicRef = doc(db, 'clinics', uid);
    await setDoc(clinicRef, {
      doctorName: profileData.name,
      specialty: profileData.specialty || 'General Physician',
      clinicName: profileData.clinicName || `${profileData.name}'s Clinic`,
      address: profileData.address || 'Not set',
      timings: '09:00 AM - 05:00 PM',
      fee: 500,
      currentToken: 0,
      queue: [],
      settings: { aiEnabled: true, autoQueue: true }
    });
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userProfile,
    userRole,
    loading,
    createUserProfile,
    createDoctorProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
