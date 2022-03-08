import * as functions from 'firebase-functions'
import { parse as csv } from 'csv-parse/sync'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as admin from 'firebase-admin'

type Book = { key: string; title: string; author: string; publicationDate: string; tags: string[] }
admin.initializeApp()
export const books = admin
  .firestore()
  .collection('books') as admin.firestore.CollectionReference<Book>

const app = express()
app.use(bodyParser.text())

// // https://firebase.google.com/docs/functions/typescript

export const upload_csv = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.set('Allow', 'POST')
    res.send(405)
  }
  const csv_books: Array<Book> = csv(req.body, { comment: '#', columns: true })
  functions.logger.debug(`file is ${csv_books.length} lines long`, { structuredData: true })
  for (const row of csv_books) {
    books.add(row)
  }
  res.send('Hello from Firebase!')
})
