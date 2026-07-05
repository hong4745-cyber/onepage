import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// apiKey가 없으면(.env 미설정) 앱 전체가 죽지 않도록 auth/db를 null로 두고 넘어간다.
export const firebaseReady = Boolean(firebaseConfig.apiKey)

let app = null
export let auth = null
export let db = null

if (firebaseReady) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} else {
  console.warn('[firebase] .env에 VITE_FIREBASE_* 값이 설정되지 않아 인증/DB 기능이 비활성화됩니다.')
}

export default app
