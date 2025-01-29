
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB3GAkiUqafPB7PbpO5TDIOdeQUi7adXFY",
    authDomain: "connectverse-events.firebaseapp.com",
    projectId: "connectverse-events",
    storageBucket: "connectverse-events.firebasestorage.app",
    messagingSenderId: "874888962547",
    appId: "1:874888962547:web:a24dace8d36e6d6d267286",
    measurementId: "G-Y3LYGV7LKS"
};


const app = initializeApp(firebaseConfig);
export const db =getFirestore(app)