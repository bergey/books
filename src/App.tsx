import './App.css'
import * as Firebase from './firebase'
import React, { useEffect, useState } from 'react'
import { Book } from './databaseTypes'
import { User } from 'firebase/auth'
import { query, orderBy, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore/lite'
import { signOut, onAuthStateChanged, signIn } from './firebase'
import { Column, Row, useTable } from 'react-table'

type BooksProps = { user: any }

const Books = ({ user }: BooksProps) => {
    const noBooks: Book[] = []
    const [books, setBooks] = useState(noBooks)
    const emptyInput = { key: '', title: '', author: '', publicationDate: '', tags: [] }
    const [input, setInput] = useState(emptyInput)

    const deleteBook = React.useCallback((key: string) => {
        return () =>
            (async () => {
                console.log(`key=${key}`)
                setBooks(books => books.filter(b => b.key !== key))
                await deleteDoc(doc(Firebase.books, key))
            })()
    }, [])

    // React Table
    const columns: Column<Book>[] = React.useMemo(
        () => [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Author', accessor: 'author' },
            { Header: 'Date', accessor: 'publicationDate' },
            { Header: 'Tags', accessor: 'tags' },
            {
                Header: 'Action', id: 'delete', Cell: ({ row }: { row: Row<Book> }) => {
                    // console.log(row)
                    return (
                        <button onClick={deleteBook(row.original.key)}>delete</button>
                    )
                }
            }
        ], [deleteBook])
    const tablet = useTable({ columns, data: books })

    useEffect(() => {
        ; (async () => {
            if (user) {
                const upstream = await getDocs(query(Firebase.books, orderBy('title')))
                setBooks(upstream.docs.map(d => ({ ...d.data(), key: d.id } as Book)))
            }
        })()
    }, [user])

    const rows = tablet.rows.map(row => {
        tablet.prepareRow(row)
        return (
            <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>
                        {cell.render('Cell')}
                    </td>
                ))}
            </tr>
        )
    })

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
        <table {...tablet.getTableProps()}>
            <thead>
                {tablet.headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} >
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...tablet.getTableBodyProps()}>
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

const upload_csv = (file: any) => {
    fetch('/upload_csv',
        {
            method: 'POST',
            body: file,
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain'
            }
        })
}

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    onAuthStateChanged((u: User | null) => {
      if (u === null || u === undefined) {
        signIn()
      } else {
        setUser(u)
      }
    })
  }, [])

  let loginStatus: JSX.Element
  if (user && user !== undefined) {
    loginStatus = (
      <p>
        logged in as {user.displayName} <button onClick={signOut}>sign out</button>
      </p>
    )
  } else {
    loginStatus = <p>not logged in; changes will not be saved</p>
  }

  return (
    <>
      <Books user={user} />
      {loginStatus}
      <input type='file' onChange={(ev: any) => upload_csv(ev.target.files[0])} />
    </>
 )
}

export default App
