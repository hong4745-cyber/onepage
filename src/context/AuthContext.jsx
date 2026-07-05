import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { auth, firebaseReady } from '../firebase'

const AuthContext = createContext(null)

function notReady() {
  return Promise.reject(new Error('Firebase 설정이 완료되지 않아 로그인을 사용할 수 없습니다.'))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(firebaseReady ? undefined : null) // undefined = 초기 로딩중, null = 비로그인

  useEffect(() => {
    if (!firebaseReady) return
    return onAuthStateChanged(auth, setUser)
  }, [])

  const value = {
    user: user ?? null,
    authReady: !firebaseReady || user !== undefined,
    login: firebaseReady ? (email, password) => signInWithEmailAndPassword(auth, email, password) : notReady,
    signup: firebaseReady ? (email, password) => createUserWithEmailAndPassword(auth, email, password) : notReady,
    loginWithGoogle: firebaseReady ? () => signInWithPopup(auth, new GoogleAuthProvider()) : notReady,
    logout: firebaseReady ? () => signOut(auth) : notReady,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
