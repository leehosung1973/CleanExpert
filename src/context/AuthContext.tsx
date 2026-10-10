import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_EMAIL, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  demoUser: { uid: string; email: string; displayName: string } | null;
  currentUser: { uid: string; email: string; displayName: string } | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemoCustomer: () => void;
  signInDemoAdmin: () => void;
  signOut: () => Promise<void>;
  toggleAdminMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [demoUser, setDemoUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdminManualOverride, setIsAdminManualOverride] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        setDemoUser(null);
        // Sync or retrieve user profile in Firestore
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              id: fbUser.uid,
              email: fbUser.email || '',
              name: fbUser.displayName || '고객님',
              role: fbUser.email === ADMIN_EMAIL ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.warn('User profile sync notice:', error);
          // Fallback profile if offline
          setUserProfile({
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || '고객님',
            role: fbUser.email === ADMIN_EMAIL ? 'admin' : 'customer',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        if (!demoUser) {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [demoUser]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      // If popup was blocked or failed, inform gently
      if (err.code !== 'auth/popup-closed-by-user') {
        alert('Google 로그인 처리 중 문제가 발생했습니다: ' + (err.message || '다시 시도해주세요.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const signInDemoCustomer = () => {
    const sampleCustomer = {
      uid: 'demo-customer-77',
      email: 'customer@cleanexpert.co.kr',
      displayName: '김민지 (체험 고객)'
    };
    setDemoUser(sampleCustomer);
    setUserProfile({
      id: sampleCustomer.uid,
      email: sampleCustomer.email,
      name: sampleCustomer.displayName,
      role: 'customer',
      createdAt: new Date().toISOString()
    });
  };

  const signInDemoAdmin = () => {
    const adminUser = {
      uid: 'demo-admin-01',
      email: ADMIN_EMAIL,
      displayName: 'CleanExpert 운영 총괄자'
    };
    setDemoUser(adminUser);
    setIsAdminManualOverride(true);
    setUserProfile({
      id: adminUser.uid,
      email: adminUser.email,
      name: adminUser.displayName,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  };

  const signOut = async () => {
    if (user) {
      await fbSignOut(auth);
    }
    setDemoUser(null);
    setUserProfile(null);
    setIsAdminManualOverride(false);
  };

  const toggleAdminMode = () => {
    setIsAdminManualOverride((prev) => !prev);
  };

  const activeUser = user ? {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '회원'
  } : demoUser;

  const isAdmin = Boolean(
    isAdminManualOverride ||
    (user && user.email === ADMIN_EMAIL) ||
    (userProfile && userProfile.role === 'admin') ||
    (demoUser && demoUser.email === ADMIN_EMAIL)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUser,
        currentUser: activeUser,
        userProfile,
        isAdmin,
        loading,
        signInWithGoogle,
        signInDemoCustomer,
        signInDemoAdmin,
        signOut,
        toggleAdminMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
