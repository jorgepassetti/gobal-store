// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Make sure you have 'db' exported from firebase.ts
import { BillingAddress } from '@/redux/features/billing-slice';
import { ShippingAddress } from '@/redux/features/shipping-slice';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  billing?: BillingAddress;
  shipping?: ShippingAddress;
  // Add other fields as needed
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in → fetch extended profile from Firestore
          try {
            console.log('User signed in:', firebaseUser.uid);

            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as unknown as Omit<
                User,
                'uid' | 'email' | 'displayName'
              >;

              // Merge Auth user data with Firestore data
              const mergedUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                ...userData, // This includes billing, shipping, etc.
              };

              setUser(mergedUser);
            } else {
              // No profile in Firestore — use minimal auth data
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
              });
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to load user profile');
            // Still set minimal user so app doesn’t break
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            });
          }
        } else {
          // User signed out
          setUser(null);
          setError(null);
        }
        setLoading(false); // Always set loading to false at end
      },
      (err) => {
        console.error('Auth state change error:', err);
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe; // Cleanup listener
  }, []); // Empty dependency array — runs once on mount

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
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
