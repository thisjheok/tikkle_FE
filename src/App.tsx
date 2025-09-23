import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import { useState, useEffect } from 'react'
import Loading from './Components/Loading/Loading'
import './App.css'
import { ThemeProvider } from './assets/Theme/ThemeContext'

const ROUTE_PATH = {
  HOME: '/',
  LOGIN: '/login',
}

const router = createMemoryRouter([
  {
    path: ROUTE_PATH.HOME,
    element: <Home />,
  },
])

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleLoading = () => {
      setIsLoading(false)
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      handleLoading()
    } else {
      document.addEventListener('DOMContentLoaded', handleLoading)
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handleLoading)
    }
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
