import './App.css';

/* import { getAnalytics } from "firebase/analytics"; */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc } from 'firebase/firestore/lite';
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

function App() {
  const [books, setBooks] = useState([])
  const emptyInput = {title: '', author: '' }
  const [input, setInput] = useState(emptyInput)

  useEffect( () => ( async () => {
      const upstream = await getDocs(collection(db, 'books'))
      setBooks(upstream.docs.map(d => ({...d.data(), key: d.id})))
  })(), [])

  const deleteBook = (key) => () => (async () => {
      console.log(`key=${key}`)
      await deleteDoc(doc(db, 'books', key))
      setBooks(books.filter( b => b.key !== key))
    })()

  const rows = books.map(book => (
      <tr key={book.key}>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td><button onClick={deleteBook(book.key)}>delete</button></td>
      </tr>
  ))

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
