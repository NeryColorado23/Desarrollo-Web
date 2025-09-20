import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './login/login' 
import Dashboard from './dashboard/dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Login/>  
    <Dashboard/>
    </>
  )
}

export default App
