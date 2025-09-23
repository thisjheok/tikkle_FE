import { motion } from 'framer-motion'
import LoginModal2 from '../modal/LoginModal/Loginmodal2'
import TikkeulNotice from '../tikkeulNotice/TikkeulNotice'
import { useState, useEffect } from 'react'
import { getStorageData } from '../../util/storage'
import './Bell.css'

const Bell = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // useEffect를 사용하여 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getStorageData('access_token')
        setIsLoggedIn(!!token)
      } catch (error) {
        console.error('Failed to check login status:', error)
        setIsLoggedIn(false)
      }
    }
    
    checkLoginStatus()
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleBellClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
    } else {
      openModal()
    }
  }

  return (
    <div className='Bell'>
      <motion.div
        whileHover={{
          scale: 1.2,
          transition: { type: 'spring', stiffness: 400, damping: 10 },
        }}
        onClick={handleBellClick}
      >
        <img src="img/bell3.svg" alt="bell" className='Bell-img'/>
      </motion.div>

      <LoginModal2
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <TikkeulNotice isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default Bell
