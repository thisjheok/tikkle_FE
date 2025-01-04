// LoginButton.tsx
import React from 'react'
import './Login.css'

interface LoginButtonProps {
  onClick: () => void
  isLoggedIn: boolean
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, isLoggedIn }) => {
  return (
    <div className="Login-button" onClick={onClick}>
      {isLoggedIn ? '' : '로그인'}
    </div>
  )
}

export default LoginButton
