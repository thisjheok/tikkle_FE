import React, { useState, useEffect } from 'react';
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
  }, []);

  return (
    <div className='tikkeul-notice-container'>
    <div className="tikkeul-notice">
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
            <TikkeulNoticeItem title={notice.title} date={notice.timestamp} url={notice.url} isimportant={notice.isimportant} />
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
