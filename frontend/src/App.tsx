import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '')
  const [screen, setScreen] = useState<'login' | 'register'>('login')

  const handleSuccess = (t: string, e: string) => {
    localStorage.setItem('token', t)
    localStorage.setItem('userEmail', e)
    setToken(t)
    setEmail(e)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setToken('')
    setEmail('')
    setScreen('login')
  }

  if (token) {
    return <Dashboard onLogout={handleLogout} userEmail={email} />
  }

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-logo">📋 ProjectHub</div>
        <div className="auth-logo-sub">Professional Project Management</div>
        {screen === 'login'
          ? <Login onSuccess={handleSuccess} onSwitch={() => setScreen('register')} />
          : <Register onSuccess={handleSuccess} onSwitch={() => setScreen('login')} />
        }
      </div>
    </div>
  )
}

export default App
