import './App.css';
import { auth, db, provider } from './firebase'
import { onAuthStateChanged} from 'firebase/auth'

import { collection, doc, getDocs, addDoc, deleteDoc } from 'firebase/firestore/lite';
import React, { useEffect, useState } from 'react'

function Books() {
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

function App() {
    const [user, setUser] = useState()
    onAuthStateChanged(auth, setUser)
    return (<>
        <Books />
        <p>{user ? `logged in as ${user.displayName}` : 'not logged in'}</p>
        </>)
}

export default App;
