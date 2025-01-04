import { motion } from "framer-motion"
import LoginModal2 from '../modal/Loginmodal2'
import Mypageinfo from '../modal/Mypageinfomodal'
import { useState } from 'react'

const Bell = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const isLoggedIn = localStorage.getItem('access_token')
  
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
    <>
      <motion.div
        whileHover={{
          scale: 1.2,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        onClick={handleBellClick}
      >
        <img src="img/bell.svg" alt="bell" />
      </motion.div>
      
      <LoginModal2 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <Mypageinfo isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default Bell
