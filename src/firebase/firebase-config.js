import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Импорт Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDaAN2CroRxNVbW8TbGNq0yYepVK3YXGpA",
  authDomain: "linguo-9d479.firebaseapp.com",
  projectId: "linguo-9d479",
  storageBucket: "linguo-9d479.appspot.com",
  messagingSenderId: "45115560783",
  appId: "1:45115560783:web:6057fa2b66a033b47e2b3a"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация сервисов Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Инициализация Firebase Storage
