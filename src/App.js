import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore/lite'
import React, { useEffect, useState } from 'react'
import './App.css'
import { db, onAuthStateChanged, signIn } from './firebase'

function Books() {
  const [books, setBooks] = useState([])
  const emptyInput = { title: '', author: '' }
  const [input, setInput] = useState(emptyInput)

  useEffect(
    () =>
      (async () => {
        const upstream = await getDocs(collection(db, 'books'))
        setBooks(upstream.docs.map(d => ({ ...d.data(), key: d.id })))
      })(),
    []
  )

  function deleteBook(key) {
    return () =>
      (async () => {
        console.log(`key=${key}`)
        await deleteDoc(doc(db, 'books', key))
        setBooks(books.filter(b => b.key !== key))
      })()
  }

  const rows = books.map(book => (
    <tr key={book.key}>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>
        <button onClick={deleteBook(book.key)}>delete</button>
      </td>
    </tr>
  ))

  const inputCell = name => (
    <td>
      <input
        name={name}
        type='text'
        value={input[name]}
        onChange={ev => setInput({ ...input, [name]: ev.target.value })}
      />
    </td>
  )

  const addRow = () =>
    (async () => {
      let newBooks = [...books, input]
      setBooks(newBooks)
      const bookRef = await addDoc(collection(db, 'books'), input)
      newBooks[newBooks.length - 1].key = bookRef.id
      setBooks(newBooks)
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
          <td>
            <button onClick={addRow}>+</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function App() {
  const [user, setUser] = useState()

  useEffect(() => {
    onAuthStateChanged(u => {
      setUser(u)
      if (u === undefined) {
        signIn()
      }
    })
  }, [])

  return (
    <>
      <Books />
      <p>{user ? `logged in as ${user.displayName}` : 'not logged in'}</p>
    </>
  )
}

export default App
