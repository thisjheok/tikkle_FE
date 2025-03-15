import React from 'react'
import './Loading.css'

interface LoadingProps {
  type?: 'mypage' | 'main' | 'notice' | 'recruitment';
}

const Loading: React.FC<LoadingProps> = ({ type = 'main' }) => {
  return (
    <div className={`loading-wrapper ${type === 'mypage' ? 'loading-mypage' : ''}
    ${type === 'notice' ? 'loading-notice' : ''}
    ${type === 'recruitment' ? 'loading-recruitment' : ''}
    `}>
      <div className='loading-logo'><img src = '/img/Logo/Logo241229.svg' alt='logo'></img></div>
      <div className="spinner"></div>
    </div>
  )
}

export default Loading