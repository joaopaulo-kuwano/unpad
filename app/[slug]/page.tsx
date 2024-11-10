'use client'
import { useEffect, useRef, useState } from "react"

import { getFirestore, collection, getDocs, query, where, doc, addDoc, updateDoc } from 'firebase/firestore'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "unpad-1e35a.firebaseapp.com",
  databaseURL: "https://unpad-1e35a-default-rtdb.firebaseio.com",
  projectId: "unpad-1e35a",
  storageBucket: "unpad-1e35a.firebasestorage.app",
  messagingSenderId: "1095409834473",
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: "G-HK6VMLBCRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

let timer = setTimeout(() => { }, 0)

export default function Page(props: { params: Promise<{ slug: string }> }) {

  const [pageId, setPageId] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [content, setContent] = useState('')
  const divRef = useRef(null);

  const getPad = async () => {
    const params = await props.params
    const s = params.slug
    setSlug(s)
    const col = collection(db, 'paginas')
    const q = query(col, where('pageName', '==', s))
    const snapshot = await getDocs(q)
    snapshot.forEach(e => {
      setPageId(e.id)
      console.log('id: ', e.id, ' => ', e.data())
      setContent(e.data().content)
    })

    if (snapshot.size > 0) return

    const a = await addDoc(col, {
      pageName: s,
      content: '',
    })
    console.log(a.id)
    setPageId(a.id)
  }

  const updatePad = async () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const docRef = doc(db, 'paginas', pageId)
      updateDoc(docRef, { pageName: slug, content })
    }, 1000)
  }

  useEffect(() => { getPad() }, [])
  useEffect(() => { updatePad() }, [content])

  return <textarea
    value={content}
    style={{ height: '99vh', width: '100%', padding: 10 }}
    onChange={(e: any) => setContent(e.target.value)}
  />
}
