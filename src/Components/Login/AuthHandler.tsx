// AuthHandler.tsx
import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  kakaoLogin,
  naverLogin,
  googleLogin,
  GoogleAuthData,
} from '../../store/slices/authslice'
import { RootState } from '../../store/store'
import { postgoogleAuth, postsign } from '../../api'
import LoginButton from './Loginbutton'
import DataListener from './DataListener'
import Loading from '../Loading/Loading'
import { getStorageData, setStorageData, removeStorageData } from '../../util/storage'
const LoginModal = lazy(() => import('./Loginmodal'))
const InfoModal = lazy(() => import('../Login/informodal'))

const AuthHandler: React.FC = () => {
  const params = new URLSearchParams(location.search)
  const code = params.get('code')
  const state = params.get('state')
  const dispatch = useDispatch()
  const googleAuthData = useSelector(
    (state: RootState) => state.auth.googleAuthData
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    department: '',
    extraDepartments: ['', '', ''],
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      const token = await getStorageData('access_token');
      if (token) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
        setIsModalOpen(true) 
      }
    }
    const checkIsNew = async () => {
      const is_new = await getStorageData('is_new');
      if (is_new === 'true') openInfoModal();
    }
    checkToken();
    checkIsNew();
    console.log(isLoggedIn);
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (code && state) {
      setIsLoggedIn(true)
      if (state.includes('kakao')) postsign(code, 'kakao')
      else if (state.includes('naver')) postsign(code, 'naver')
      else if (state.includes('google')) {
        console.log(code)
        handleGoogleAuthData(code)
      }
    }
  }, [code, state])

  useEffect(() => {
    if (googleAuthData.code) {
      console.log('Updated googleAuthData:', googleAuthData)
      handlePostGoogleAuth()
    }
  }, [googleAuthData])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const openInfoModal = () => setIsInfoModalOpen(true)
  const closeInfoModal = () => setIsInfoModalOpen(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target

    if (id.startsWith('extra-department')) {
      const index = parseInt(id.split('-')[2]) - 1
      setFormData(prev => ({
        ...prev,
        extraDepartments: prev.extraDepartments.map((dept, i) =>
          i === index ? value : dept
        ),
      }))
    } else {
      setFormData(prev => ({ ...prev, [id]: value }))
    }
  }

  const handleSubmit = () => {
    console.log('Form Data:', formData)
    closeInfoModal()
  }

  const handleKakaoLogin = () => {
    setStorageData('last_login_type', 'kakao')
    dispatch(kakaoLogin())
    closeModal()
  }

  const handleNaverLogin = () => {
    setStorageData('last_login_type', 'naver')
    dispatch(naverLogin())
    closeModal()
  }

  const handleGoogleLogin = () => {
    setStorageData('last_login_type', 'google')
    dispatch(googleLogin())
    closeModal()
  }

  const handleGoogleAuthData = (code: string) => {
    console.log(code)
    dispatch(GoogleAuthData({ code }))
    closeModal()
  }

  const handlePostGoogleAuth = () => {
    if (googleAuthData) {
      postgoogleAuth(googleAuthData)
    } else {
      console.log('Google authentication data is missing')
    }
  }

  const handleLogout = () => {
    removeStorageData('access_token')
    removeStorageData('is_new')
    removeStorageData('refresh_token')
    setIsLoggedIn(false)
    window.location.reload()
  }

  const handleLoginButtonClick = () => {
    if (isLoggedIn) {
      handleLogout()
    } else {
      openModal()
    }
  }

  const receiveAuthData = (authData: any) => {
    console.log('Received auth data in Home component:', authData)
  }

  return (
    <div>
      <DataListener onReceiveAuthData={receiveAuthData} />
      <LoginButton onClick={handleLoginButtonClick} isLoggedIn={isLoggedIn} />
      <Suspense fallback={<Loading />}>
        {isModalOpen && (
          <LoginModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onKakaoLogin={handleKakaoLogin}
            onNaverLogin={handleNaverLogin}
            onGoogleLogin={handleGoogleLogin}
          />
        )}
      </Suspense>
      <Suspense fallback={<Loading />}>
        {isInfoModalOpen && (
          <InfoModal
            isOpen={isInfoModalOpen}
            onClose={closeInfoModal}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
          />
        )}
      </Suspense>
    </div>
  )
}

export default AuthHandler
