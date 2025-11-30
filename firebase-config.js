// TODO: Replace with your Firebase project's configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBeWLqvyI_981KY6w_1tR5D0zz-INeAe2A",
  authDomain: "tech-materials-library.firebaseapp.com",
  projectId: "tech-materials-library",
  storageBucket: "tech-materials-library.firebasestorage.app",
  messagingSenderId: "448489648432",
  appId: "1:448489648432:web:bdf4c41034baa6a30318f5",
  measurementId: "G-NPKWPK19HK"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
