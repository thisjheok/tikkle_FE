import React, { useState } from 'react'
import './recruitment.css'
import { postContentsRequest } from '../../../../api'
import { motion } from 'framer-motion'
import * as Sentry from '@sentry/react';
interface RecruitmentCardProps {
  id: string // 새로 추가된 prop
  companyimg: string
  company: string
  dday: string
  isBookmarked: boolean
  handleBookmarkClick: () => Promise<void>
  titles: string[]
  experience: string[] | string
  jobType: string[] | string
  location: { [key: string]: string[] } | string
  education: string
  deadline: string
  jobcate: string[] | string
  url: string
}

const RecruitmentCard: React.FC<RecruitmentCardProps> = ({
  id,
  companyimg,
  company,
  dday,
  isBookmarked: initialIsBookmarked,
  handleBookmarkClick,
  titles,
  experience,
  jobType,
  location,
  education,
  deadline,
  jobcate,
  url,
}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)

  const formatTag = (
    tag: string[] | string | { [key: string]: string[] }
  ): string => {
    if (Array.isArray(tag)) {
      const [first, ...rest] = tag
      return rest.length > 0 ? `${first} 외 ${rest.length}개` : first
    } else if (typeof tag === 'string') {
      return tag
    } else if (typeof tag === 'object') {
      const [city, districts] = Object.entries(tag)[0]
      return districts.length > 1
        ? `${city} ${districts[0]} 외 ${districts.length - 1}개`
        : `${city} ${districts[0]}`
    }
    return ''
  }

  const formatJobCate = (jobcate: string[] | string): string => {
    if (Array.isArray(jobcate)) {
      return jobcate.join(', ')
    }
    return jobcate
  }

  const handleBookmarkClickWrapper = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the card click event from firing
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await handleBookmarkClick()
      setIsBookmarked(!isBookmarked) // Toggle the bookmark state
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCardClick = async () => {
    try {
      if (id) {
        await postContentsRequest('사람인', id)
      }
      window.open(url, '_blank')
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error posting contents request:', error)
    }
  }

  return (
    <motion.div 
      className="recruitment-mainBox" 
      onClick={handleCardClick}
      whileHover={{
        scale: 1.03,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <div className="recruitment-Box1">
        <div className="recruitment-company">
          <img
            src={companyimg}
            alt="Company Logo"
            className="company-logo"
            onError={e => {
              e.currentTarget.src = 'img/Mypage/Proile.svg' // Fallback image path
            }}
          />
        </div>
        <div className="recruitment-dday">{dday}</div>
        <img
          src={isBookmarked ? 'img/Star.svg' : 'img/Star-none.svg'}
          alt="Bookmark"
          className={`bookmark-icon1 ${isUpdating ? 'updating' : ''}`}
          onClick={handleBookmarkClickWrapper}
        />
      </div>
      <div className="recruitment-Box2">
        <div className="recruitment-title">[{company}]</div>
        {titles.map((title, index) => (
          <div key={index} className="recruitment-title">
            {title}
          </div>
        ))}
      </div>
      <div className="recruitment-Box3">
        <div className="recruitment-tag">{formatTag(experience)}</div>
        <div className="recruitment-tag">{formatTag(jobType)}</div>
        <div className="recruitment-tag">{formatTag(location)}</div>
      </div>
      <div className="recruitment-Box4">
        <div className="recruitment-info">
          <div className="recruitment-info-conaniner">
            <div className="recruitment-info1">학력조건</div>
            <div className="recruitment-info2">{education}</div>
          </div>
          <div className="recruitment-info-conaniner">
            <div className="recruitment-info1">상세직무</div>
            <div className="recruitment-info2">{formatJobCate(jobcate)}</div>
          </div>
          <div className="recruitment-info-conaniner">
            <div className="recruitment-info1">마감일</div>
            <div className="recruitment-info2">{deadline}</div>
          </div>
        </div>
      </div>
      </motion.div>
  )
}

export default RecruitmentCard
