import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // ✅ เพิ่ม Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBJ_4aQ8eNTVzsYxNaPf0YXxmtSAzRO3BM",
  authDomain: "task-tracker-7f7c0.firebaseapp.com",
  projectId: "task-tracker-7f7c0",
  storageBucket: "task-tracker-7f7c0.appspot.com",
  messagingSenderId: "896581087484",
  appId: "1:896581087484:android:2be78ad1646d4043616779"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ✅ ใช้ Authentication

export { db, auth };
