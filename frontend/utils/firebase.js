
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "final-year-project-50cf8.firebaseapp.com",
  projectId: "final-year-project-50cf8",
  storageBucket: "final-year-project-50cf8.firebasestorage.app",
  messagingSenderId: "537798540426",
  appId: "1:537798540426:web:b10353555433b6e0548173"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider();
export {auth , provider}