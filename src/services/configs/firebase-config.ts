import { initializeApp } from 'firebase/app'

import {
   getAuth,
   onAuthStateChanged,
   createUserWithEmailAndPassword,
   sendEmailVerification,
   sendPasswordResetEmail,
   signInWithEmailAndPassword,
   signOut,
} from 'firebase/auth'

import {
   getFirestore,
   doc,
   collection,
   addDoc,
   getDoc,
   getDocs,
   query,
   where,
   updateDoc,
   deleteDoc,
} from 'firebase/firestore'

import { getStorage, ref, uploadBytes } from 'firebase/storage'

const {
   VITE_FIREBASE_API_KEY,
   VITE_FIREBASE_AUTH_DOMAIN,
   VITE_FIREBASE_PROJECT_ID,
   VITE_FIREBASE_STORAGE_BUCKET,
   VITE_FIREBASE_MESSAGING_SENDER_ID,
   VITE_FIREBASE_APP_ID,
} = import.meta.env

const config = {
   apiKey: VITE_FIREBASE_API_KEY,
   authDomain: VITE_FIREBASE_AUTH_DOMAIN,
   projectId: VITE_FIREBASE_PROJECT_ID,
   storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: VITE_FIREBASE_APP_ID,
}

const app = initializeApp(config)
const auth = getAuth(app)
const firestore = getFirestore(app)
const storage = getStorage()

export {
   //- auth
   auth,
   onAuthStateChanged,
   createUserWithEmailAndPassword,
   sendEmailVerification,
   sendPasswordResetEmail,
   signInWithEmailAndPassword,
   signOut,
   //- firestore
   firestore,
   doc,
   collection,
   addDoc,
   getDoc,
   getDocs,
   query,
   where,
   updateDoc,
   deleteDoc,
   //- storage
   storage,
   ref,
   uploadBytes,
}
