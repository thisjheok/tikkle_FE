import React from 'react'
import './notice.css'
const Noticelist: React.FC = () => {
  return (
    <div className="Noticelist">
      <div className="Noticelist-item department">번호</div>
      <div className="Noticelist-item title">제목</div>
      <div className="Noticelist-item date">작성일</div>
    </div>
  )
}

export default Noticelist
