import { useEffect, useState } from 'react'

import './App.css'
import Login from './components/Login'
import Home from './components/Home'


function App() {
  const [verified, setVerified] = useState(false)
  useEffect(() => {
    fetch("http://localhost:8080/api/verify",{credentials: "include"})
      .then(res => res.json())
      .then(last => last.Verified ? setVerified(true) : setVerified(false))
      
  },[])
  return (
    <>
      {verified ? <Home/> : <Login />}
    </>
  )
}

export default App
