import React, { useState } from 'react'
import './Mypagemodal.css'
import {deleteUser} from '../../../../api'
import * as Sentry from '@sentry/react';
import {removeStorageData } from '../../../../util/storage'
const Getout: React.FC = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleGetoutClick = () => {
    setShowConfirmModal(true)
  }
  const handleLogout = () => {
    removeStorageData('access_token')
    removeStorageData('is_new')
    removeStorageData('refresh_token')
    window.location.reload()
  }

  const handleConfirm = async () => {
    try {
      console.log('사용자가 탈퇴를 확인했습니다.');
      setShowConfirmModal(false);
      await deleteUser(); // deleteUser 함수가 완료될 때까지 기다립니다.
      console.log('사용자 탈퇴가 완료되었습니다.');
      handleLogout(); // 탈퇴 완료 후 로그아웃 실행
    } catch (error) {
      console.error('탈퇴 처리 중 오류가 발생했습니다:', error);
      Sentry.captureException(error);
      // 여기에 사용자에게 오류 메시지를 보여주는 로직을 추가할 수 있습니다.
    }
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
  }

  return (
    <div className="Getout-Container">
      <div className="Getout-MainTitle">서비스 탈퇴</div>
      <div className="Getout-Button" onClick={handleGetoutClick}>
        탈퇴하기
      </div>

      {showConfirmModal && (
        <div className="Confirm-Modal">
          <div className="Confirm-Modal-Content">
            <p>정말로 탈퇴하시겠습니까?</p>
            <div className="Confirm-Modal-Buttons">
              <button onClick={handleConfirm}>확인</button>
              <button onClick={handleCancel}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Getout
