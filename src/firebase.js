import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';


const firebaseConfig = {
    apiKey: "AIzaSyAvatZfZuSG49YPSN17INahQX6aokYG9q8",
    authDomain: "books-331420.firebaseapp.com",
    projectId: "books-331420",
    storageBucket: "books-331420.appspot.com",
    messagingSenderId: "97831789532",
    appId: "1:97831789532:web:24d92bf9be475802c72519",
    measurementId: "G-29SXV008TY"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(firebase); */
const db = getFirestore(firebase);

export default db