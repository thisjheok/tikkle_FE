import React, { useState, useEffect, useCallback } from 'react'
import './History.css'
import MypageContentSelector from './MypageContentSelector'
import { getBookmarkStats, BookmarkStats } from '../../../../api'
import * as Sentry from '@sentry/react';
const History: React.FC = () => {
  const [bookmarkStats, setBookmarkStats] = useState<BookmarkStats | null>(null);

  const refreshBookmarkStats = useCallback(async () => {
    try {
      const stats = await getBookmarkStats();
      setBookmarkStats(stats);
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to fetch bookmark stats:', error);
    }
  }, []);
  
  useEffect(() => {
    refreshBookmarkStats();
  }, [refreshBookmarkStats]);

  const bookmarks = [
    { category: '우리학교', count: bookmarkStats?.notice || 0 },
    { category: '취업', count: bookmarkStats?.saramin || 0 },
  ];

  return (
    <div className="History-All">
      <div className="History-title">
        <div className='History-title-num'>01</div>
        <div className='History-title-name'>히스토리</div>
      </div>
      <div className="History-Container">
        <div className="History-boxs">
          {bookmarks.map((bookmark, index) => (
            <div className="History-box" key={index}>
              <div className="History-item">
                <span className="History-category">{bookmark.category}</span>
                <span className="History-count">{bookmark.count}건</span>
              </div>
            </div>
          ))}
        </div>
        <MypageContentSelector refreshBookmarkStats={refreshBookmarkStats} />
      </div>
    </div>
  )
}

export default History