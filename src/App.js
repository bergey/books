import './App.css';

/* import { getAnalytics } from "firebase/analytics"; */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
import React, { useEffect, useState } from 'react'

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

const e = React.createElement;

function App() {
  const [books, setBooks] = useState(
      [ { title: 'Moby Dick', author: 'Herman Melville' }
      , { title: 'Walden', 'author': 'Henry David Thoreau' }
  ])
  const emptyInput = {title: '', author: '' }
  const [input, setInput] = useState(emptyInput)

  useEffect( () => ( async () => {
      const upstream = await getDocs(collection(db, 'books'))
      setBooks(upstream.docs.map(d => d.data()))
  })(), [])

  const rows = books.map(book =>
      e ('tr', {}, e('td', {}, book.title), e('td', {}, book.author), e('td')))

  const inputCell = name => (
      <td>
        <input name={name} type="text" value={input[name]}
          onChange={ev => setInput({...input, [name]: ev.target.value })} />
      </td>
  )

  const addRow = () => (async () => {
      setBooks([...books, input])
      const bookRef = await addDoc(collection(db, 'books'), input)
      console.log(`bookRef=${bookRef}`)
      setInput(emptyInput)
  })()

  return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            {inputCell('title')}
            {inputCell('author')}
            <td><button onClick={addRow}>+</button></td>
          </tr>
        </tbody>
      </table>
  )

}

export default App;
