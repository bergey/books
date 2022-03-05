import { query, orderBy, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore/lite'
import { Book } from './databaseTypes'
import { useEffect, useState } from 'react'
import './App.css'
import { User } from 'firebase/auth'
import { signOut, onAuthStateChanged, signIn } from './firebase'
import * as Firebase from './firebase'
type BooksProps = { user: any }

const Books = ({ user }: BooksProps) => {
  const noBooks: Book[] = []
  const [books, setBooks] = useState(noBooks)
  const emptyInput = { key: '', title: '', author: '', publicationDate: '', tags: [] }
  const [input, setInput] = useState(emptyInput)

  useEffect(() => {
    ;(async () => {
      if (user) {
        const upstream = await getDocs(query(Firebase.books, orderBy('title')))
        setBooks(upstream.docs.map(d => ({ ...d.data(), key: d.id } as Book)))
      }
    })()
  }, [user])

  function deleteBook(key: string) {
    return () =>
      (async () => {
        console.log(`key=${key}`)
        await deleteDoc(doc(Firebase.books, key))
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

  const inputCell = (name: keyof Book, ty = 'text') => (
    <td>
      <input
        name={name}
        type={ty}
        value={input[name]}
        onChange={ev =>
          setInput({
            ...input,
            [name]: name === 'tags' ? ev.target.value.trim().split(/[\s,]+/) : ev.target.value,
          })
        }
      />
    </td>
  )

  const addRow = () =>
    (async () => {
      let newBooks = [...books, { ...input }]
      setBooks(newBooks)
      const bookRef = await addDoc(Firebase.books, input)
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
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    onAuthStateChanged((u: User | null) => {
      if (u === null || u === undefined) {
        signIn()
      } else {
        setUser(u)
      }
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
