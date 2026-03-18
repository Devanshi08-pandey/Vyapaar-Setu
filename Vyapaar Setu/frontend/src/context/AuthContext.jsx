import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: safely fetch user doc from Firestore
  const fetchUserDoc = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
    } catch (err) {
      console.warn('Firestore unreachable, using auth-only data:', err.message);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const extra = await fetchUserDoc(firebaseUser.uid);
        const baseUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: extra?.role || 'customer' // Default to customer if role missing
        };
        setUser({ ...baseUser, ...extra });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const extra = await fetchUserDoc(userCredential.user.uid);
      const baseUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName
      };
      const userData = extra ? { ...baseUser, ...extra } : baseUser;
      setUser(userData);
      return userData;
    } catch (error) {
      // Provide user-friendly error messages
      const code = error.code;
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        throw 'Invalid email or password.';
      } else if (code === 'auth/wrong-password') {
        throw 'Incorrect password.';
      } else if (code === 'auth/too-many-requests') {
        throw 'Too many attempts. Please try again later.';
      }
      throw error.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const { email, password, name, role, businessName, phone, businessType, serviceType, location } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser = {
        name,
        email,
        role,
        uid: userCredential.user.uid,
        createdAt: new Date().toISOString()
      };

      if (role === 'vendor') {
        if (businessName) newUser.businessName = businessName;
        if (phone) newUser.phone = phone;
        if (businessType) newUser.businessType = businessType;
        if (serviceType) newUser.serviceType = serviceType;
        if (location) newUser.location = location;
      }

      // Save to Firestore
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      } catch (firestoreErr) {
        console.warn('Could not save user profile to Firestore:', firestoreErr.message);
      }
      
      setUser({ uid: userCredential.user.uid, email, ...newUser });
      return newUser;
    } catch (error) {
      const code = error.code;
      if (code === 'auth/email-already-in-use') {
        throw 'This email is already registered. Please login instead.';
      } else if (code === 'auth/weak-password') {
        throw 'Password should be at least 6 characters.';
      }
      throw error.message || 'Registration failed';
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
