import React, { useState, useEffect } from 'react'
import Header from '../Components/Header/Header'
import Loading from '../Components/Loading'
import Footer from '../Components/Footer/Footer'
import AuthHandler from '../Components/Login/AuthHandler'
import Search from '../Components/Search/Searchbar'
import Main from '../Components/Main/main'
import { getUserData, UserData } from '../api' // api 경로를 적절히 수정하세요
// import ThemeSelector from '../assets/Theme/ThemeSelector'
import * as Sentry from '@sentry/react'

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData()
        setUserData(data)
      } catch (error) {
        Sentry.captureException(error)
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const params = new URLSearchParams(location.search)
  const code = params.get('code')

  if (code) {
    return (
      <div>
        <Loading />
        <AuthHandler />
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <Header userData={userData} />
      <Search userData={userData} />
      {/* <ThemeSelector/> */}
      <Main userData={userData} />
      <Footer />
    </div>
  )
}

export default Home
