import React from 'react'
import './Mypagemodal.css'
import { KAKAO_SDK_ID } from '../../../store/slices/constant'
import * as Sentry from '@sentry/react';
declare global {
  interface Window {
    Kakao: any
  }
}

// 환경 변수에서 카카오 키를 가져옵니다.

const Recommend: React.FC = () => {
  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
  //   script.async = true
  //   document.body.appendChild(script)

  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  const shareToKakao = () => {
    if (window.Kakao) {
      const kakao = window.Kakao

      if (!kakao.isInitialized()) {
        if (KAKAO_SDK_ID) {
          kakao.init(KAKAO_SDK_ID)
        } else {
          console.error('Kakao API key is not defined')
          Sentry.captureException('Kakao API key is not defined');
          return
        }
      }

      kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '티끌 공유하기',
          description: '티끌 서비스를 친구에게 공유해보세요!',
          imageUrl: 'https://your-image-url.com/image.jpg', // 공유할 이미지 URL
          link: {
            mobileWebUrl: 'https://tikkle.netlify.app/',
            webUrl: 'https://tikkle.netlify.app/',
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: 'https://tikkle.netlify.app/',
              webUrl: 'https://tikkle.netlify.app/',
            },
          },
        ],
      })
    }
  }

  return (
    <div>
      <img
        src="img/Mypage/Share.svg"
        style={{ width: '250px', cursor: 'pointer' }}
        alt="Share"
        onClick={shareToKakao}
      />
    </div>
  )
}

export default Recommend
