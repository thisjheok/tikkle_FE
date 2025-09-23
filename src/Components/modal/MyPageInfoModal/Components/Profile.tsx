import React, { useState } from 'react'
import './Mypagemodal.css'

const Profile = () => {
  const [nickname, setNickname] = useState('')

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  const handleUpdateProfile = () => {
    // 프로필 업데이트 로직 추가
    console.log('프로필 업데이트:', nickname)
    // 서버에 프로필 업데이트 요청 보내기
    // 업데이트 성공 시 알림 메시지 표시 등의 작업 수행
  }

  return (
    <div className="Content">
      <div className="Proile-img"></div>
      <input
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChange={handleNicknameChange}
      />
      <button className="Update-button" onClick={handleUpdateProfile}>
        프로필 수정하기
      </button>
    </div>
  )
}

export default Profile
