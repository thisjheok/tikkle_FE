import React, { useState, useEffect, useRef } from 'react';
import './TikkeulNotice.css';
import TikkeulNoticeItem from './TikkeulNoticeItem';
import { getTikkeulNotice } from '../../api';
import type { TikkeulNotice as TikkeulNoticeType } from '../../api';

interface TikkeulNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

const TikkeulNotice: React.FC<TikkeulNoticeProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [tikkeulNotices, setTikkeulNotices] = useState<TikkeulNoticeType[]>([]);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTikkeulNotices = async () => {
      try {
        const notices = await getTikkeulNotice();
        setTikkeulNotices(notices);
      } catch (error) {
        console.error('Error fetching tikkeul notices:', error);
      }
    };

    fetchTikkeulNotices();
    
    // 모달 외부 클릭 감지를 위한 이벤트 리스너 추가
    const handleClickOutside = (event: MouseEvent) => {
      if (noticeRef.current && !noticeRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className='tikkeul-notice-container'>
      <div className="tikkeul-notice" ref={noticeRef}>
        <div className="tikkeul-notice-header">
          <span className="tikkeul-notice-header-title">공지</span>
          <img
            className="tikkeul-notice-header-close"
            src='/img/tikkeulNoticeClose.svg'
            alt="close"
            onClick={onClose}
          />
        </div>
        <div className="tikkeul-notice-content-box">
          <div className="tikkeul-notice-contents-list">
            {tikkeulNotices.map((notice) => (
              <TikkeulNoticeItem title={notice.title} date={notice.timestamp} url={notice.url} is_important={notice.is_important} />
            ))}
          </div>
        </div>
        <div className="tikkeul-notice-footer">
          <div className="tikkeul-notice-footer-button">
            <div className='tikkeul-notice-footer-button-text' onClick={() => window.open('https://tikkeul-service.notion.site/196389ea7463801ca419ddb629a60b51?pvs=74', '_blank')}>전체보기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikkeulNotice;
