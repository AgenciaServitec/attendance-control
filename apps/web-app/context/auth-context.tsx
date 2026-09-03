"use client";

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../lib/firebase/config";
import type {UserDocument} from "@servitec-work/types";

interface AuthContextType {
    user: User | null;
    profile: UserDocument | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setProfile({ id: userDoc.id, ...userDoc.data() } as UserDocument);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);