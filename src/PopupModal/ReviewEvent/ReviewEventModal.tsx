import './ReviewEvent.css'
import React, { useState } from 'react'

interface ReviewEventModalProps {
  onClose: () => void;
  onHideToday: () => void;
}

const ReviewEventModal: React.FC<ReviewEventModalProps> = ({ onClose, onHideToday }) => {
  const [isChecked, setIsChecked] = useState(false);
  
  const handleClose = () => {
    if (isChecked) {
      onHideToday();
    } else {
      onClose();
    }
  };
  
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecked(!isChecked);
    onHideToday();
  };
  
  return (
    <>
      <div className='review-event-modal-overlay' onClick={handleClose}></div>
      <div className='review-event-modal-wrapper'>
        <div className='review-event-modal-container'>
          <div className='review-event-modal-background'></div>
          <div className='review-event-modal-content'>
              <div className='review-event-date'>
                  3.27(목) ~ 4.20(일)
              </div>
              <div className='review-event-title-1'>
                  티끌 새학기
              </div>
              <div className='review-event-title-2'>
                  EVENT
              </div>
              <div className='review-event-description'>
                  티끌 가입 후 설문조사 실시해서 <br />
                  스타벅스 쿠폰 받아가세요!
              </div>
              <div className='review-event-btn' onClick={() => window.open('https://tally.so/r/w2okVb', '_blank')}>
                  설문조사 하러 가기
              </div>
          </div>
          <div className='review-event-close-btn' onClick={handleClose}>
              X
          </div>
        </div>
        <div className='review-event-neglect-btn'>
            <div 
              className='review-event-neglect-btn-check' 
              onClick={handleCheckboxClick}
              style={isChecked ? {backgroundColor: '#fff'} : {}}
            >
            </div>
            <div className='review-event-neglect-btn-text'>
                오늘 하루 보지 않기
            </div>
        </div>
      </div>
    </>
  )
}

export default ReviewEventModal

