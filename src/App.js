import {
  query,
  orderBy,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore/lite'
import React, { useEffect, useState } from 'react'
import './App.css'
import { signOut, db, onAuthStateChanged, signIn } from './firebase'

function Books({ user }) {
  const [books, setBooks] = useState([])
  const emptyInput = { title: '', author: '', publicationDate: '', tags: [] }
  const [input, setInput] = useState(emptyInput)

  useEffect(
    () =>
      (async () => {
        if (user) {
          const upstream = await getDocs(query(collection(db, 'books'), orderBy('title')))
          setBooks(upstream.docs.map(d => ({ ...d.data(), key: d.id })))
        }
      })(),
    [user]
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
      <td>{book.publicationDate || ''}</td>
      <td>{book.tags ? book.tags.join(' ') : ''}</td>
      <td>
        <button onClick={deleteBook(book.key)}>delete</button>
      </td>
    </tr>
  ))

  const inputCell = (name, ty = 'text') => (
    <td>
      <input
        name={name}
        type={ty}
        value={input[name]}
        onChange={ev => setInput({ ...input, [name]: ev.target.value })}
      />
    </td>
  )

  const addRow = () =>
    (async () => {
      let newBooks = [...books, { ...input, tags: input.tags.trim().split(/[\s,]+/) }]
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
          <th>Date</th>
          <th>Tags</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows}
        <tr>
          {inputCell('title')}
          {inputCell('author')}
          {inputCell('publicationDate', 'number')}
          {inputCell('tags')}
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
      if (u === null || u === undefined) {
        signIn()
      }
      setUser(u)
    })
  }, [])

  let loginStatus
  if (user && user !== undefined) {
    loginStatus = (
      <p>
        logged in as {user.displayName} <button onClick={signOut}>sign out</button>
      </p>
    )
  } else {
    loginStatus = <p>not logged in</p>
  }

  return (
    <>
      <Books user={user} />
      {loginStatus}
    </>
  )
}

export default App
