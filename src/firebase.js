import { initializeApp } from 'firebase/app'
import * as Auth from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyAvatZfZuSG49YPSN17INahQX6aokYG9q8',
  authDomain: 'books-331420.firebaseapp.com',
  projectId: 'books-331420',
  storageBucket: 'books-331420.appspot.com',
  messagingSenderId: '97831789532',
  appId: '1:97831789532:web:24d92bf9be475802c72519',
  measurementId: 'G-29SXV008TY',
}
// Initialize Firebase
const firebase = initializeApp(firebaseConfig)
export const db = getFirestore(firebase)

export const auth = Auth.getAuth()
const provider = new Auth.GoogleAuthProvider()

// TODO redirect on mobile instead of popup
export const signIn = () =>
  Auth.signInWithPopup(auth, provider)
    .then(result => {
      console.log(result.user)
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.email
      // The AuthCredential type that was used.
      console.log({ errorCode, errorMessage, email })
    })
export const onAuthStateChanged = callback => Auth.onAuthStateChanged(auth, callback)
