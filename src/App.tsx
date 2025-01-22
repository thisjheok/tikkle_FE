import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import Loading from './Components/Loading'
import './App.css'
import { ThemeProvider } from './assets/Theme/ThemeContext'

const ROUTE_PATH = {
  HOME: '/',
  LOGIN: '/login',
}

const Home = lazy(() => import('./Pages/Home'))

const router = createBrowserRouter([
  {
    path: ROUTE_PATH.HOME,
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
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
