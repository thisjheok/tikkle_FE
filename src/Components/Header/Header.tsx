import React, { useState } from 'react'
import './Header.css'
import AuthHandler from '../Login/AuthHandler'
import MyPageModal from '../Mypage/Mypage'
// import { KAKAO_SDK_ID } from '../../store/slices/constant'
import { UserData } from '../../api'
declare global {
  interface Window {
    Kakao: any
  }
}

interface HeaderProps {
  userData: UserData | null
}

const Header: React.FC<HeaderProps> = ({ userData }) => {
  // const [isAuthTokenPresent, setIsAuthTokenPresent] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
  //   script.async = true
  //   document.body.appendChild(script)

  //   script.onload = () => {
  //     if (window.Kakao) {
  //       if (!window.Kakao.isInitialized()) {
  //         window.Kakao.init(KAKAO_SDK_ID)
  //       }
  //     }
  //   }

  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openModal = (index: number) => {
    setModalIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  // const shareToKakao = () => {
  //   if (window.Kakao) {
  //     window.Kakao.Link.sendDefault({
  //       objectType: 'feed',
  //       content: {
  //         title: '티끌 공유하기',
  //         description: '티끌 서비스를 친구에게 공유해보세요!',
  //         imageUrl: 'https://i.ibb.co/H7t4gdq/Frame-1.png', // 실제 이미지 URL로 교체하세요
  //         link: {
  //           mobileWebUrl: window.location.href,
  //           webUrl: window.location.href,
  //         },
  //       },
  //       buttons: [
  //         {
  //           title: '웹으로 보기',
  //           link: {
  //             mobileWebUrl: window.location.href,
  //             webUrl: window.location.href,
  //           },
  //         },
  //       ],
  //     })
  //   } else {
  //     console.error('Kakao SDK is not loaded')
  //   }
  // }

  const IntroLink = () => {
    window.open(
      'https://campusnow.notion.site/ccc5e7ddd888426387eac41537ca58b3',
      '_blank'
    )
  }

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('access_token')
  //   if (accessToken) {
  //     setIsAuthTokenPresent(true)
  //     // console.log(accessToken)
  //     // console.log(isAuthTokenPresent)
  //   }
  // }, [])

  return (
    <header className="Header-main">
      <div className="Header-left">
        <div className="Header-text" onClick={handleClick}>
          <img
            src="img/Logo/Mainlogo.svg"
            alt="Main Logo"
            style={{ width: '30%' }}
          />
        </div>
      </div>
      <div className="Header-right">
        <div className="Header-intro">
          {userData ? `${userData.name}님 반가워요!` : '게스트님 반가워요!'}
        </div>
        <div className="Header-intro" onClick={IntroLink}>
          티끌 소개
        </div>
        <div className="Header-mypage" onClick={() => openModal(0)}>
          마이페이지
        </div>
        {/* <div className="Header-intro" onClick={shareToKakao}>
          공유하기
        </div> */}
        <div className="Header-profile">
          <AuthHandler />
        </div>
      </div>
      <MyPageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialSelectedIndex={modalIndex}
      />
    </header>
  )
}

export default Header
