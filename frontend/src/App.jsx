import { useEffect, useState } from 'react'

import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import backendInfo from "./custom/backend-info.json"


function App() {
  const [verified, setVerified] = useState(false)
  useEffect(() => {
    fetch(`${backendInfo.url}/api/verify`,{credentials: "include"})
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
