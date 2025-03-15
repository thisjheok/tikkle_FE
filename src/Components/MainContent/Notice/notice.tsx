import React, { useState } from 'react'
import './notice.css'
import { toggleBookmark, postContentsRequest } from '../../../api'
import * as Sentry from '@sentry/react';

interface Notice {
  id: string
  department: string
  index: string
  title: string
  created_at: string
  is_bookmarked: boolean
  top: boolean
  url: string
}

interface NoticeProps {
  notice: Notice
  onBookmarkUpdate?: (id: string, newStatus: boolean) => void 
}

const Notice: React.FC<NoticeProps> = ({ notice, onBookmarkUpdate }) => {
  const [isBookmarked, setIsBookmarked] = useState(notice.is_bookmarked)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isUpdating) return

    setIsUpdating(true)
    try {
      await toggleBookmark(notice.id)
      setIsBookmarked(!isBookmarked)
      if (onBookmarkUpdate) {
        onBookmarkUpdate(notice.id, !isBookmarked)
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to update bookmark status:', error)
      // 에러 처리: 사용자에게 알림을 표시하거나 다른 적절한 처리를 수행
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNoticeClick = async () => {
    try {
      await postContentsRequest('공지', notice.id)
      window.open(notice.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error posting contents request:', error)
      // 에러 처리: 사용자에게 알림을 표시하거나 다른 적절한 처리를 수행
    }
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const [year, month, day] = dateString.split('.')
    return (
      today.getFullYear() === parseInt(year) &&
      today.getMonth() + 1 === parseInt(month) &&
      today.getDate() === parseInt(day)
    )
  }

  return (
    <div 
      className="notice" 
      onClick={handleNoticeClick}
    >
      <span className={`department ${notice.top ? 'notice-highlight' : 'notice-index'}`}>
        <div className='department-text'>{notice.top ? '[공지]' : notice.index}</div>
      </span>
      <div className="title">
        <div className='title-container'>
          <span className='title-text'>{notice.title}</span>
          {isToday(notice.created_at) && <span className="new-badge">N</span>}
        </div>
      </div>
      <span className="date">{notice.created_at}</span>
      <img
        src={isBookmarked ? 'img/Star.svg' : 'img/Star-none.svg'}
        alt="Bookmark"
        className={`bookmark-icon ${isUpdating ? 'updating' : ''}`}
        onClick={handleBookmarkClick}
      />
    </div>
  )
}

export default Notice
