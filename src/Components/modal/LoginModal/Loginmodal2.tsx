import React from 'react'
import Modal from '../modal'
import { motion } from 'framer-motion'
import './Loginmodal.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
}
//로그인 해주세요 하는 모달
const LoginModal2: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        className="LoginModal-contetnt"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <img src="img/Mypage/LoginTake.svg" className="LoginTake"></img>
      </motion.div>
    </Modal>
  )
}

export default LoginModal2
