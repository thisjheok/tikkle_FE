import React, { useEffect, useState, useRef, useCallback } from 'react'
import RecruitmentCard from './recruitmentCard'
import useRecruitmentStore from './recruitStore'
import { fetchRecruitments, toggleBookmark2 } from '../../../../api'
import './recruitment.css'
import { Recruitment } from '../../../../store/Rec'
import * as Sentry from '@sentry/react';
import Loading from '../../../Loading/Loading';
interface RecruitmentContainerProps {
  searchTerm: string
  selectedJob: string | null
}
const RecruitmentContainer: React.FC<RecruitmentContainerProps> = ({
  searchTerm,
  selectedJob,
}) => {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevPageRef = useRef<number>(1)
  const prevSearchTermRef = useRef<string>('')
  const prevSelectedJobRef = useRef<string | null>(null)
  const { recruitments: cachedRecruitments, updateCache, shouldFetchNewData } = useRecruitmentStore()
  
  const loadRecruitments = useCallback(async () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)

    try {
      if (
        page === prevPageRef.current &&
        searchTerm === prevSearchTermRef.current &&
        selectedJob === prevSelectedJobRef.current
      ) {
        return
      }

      if (page === 1 && !shouldFetchNewData(searchTerm, selectedJob)) {
        setRecruitments(cachedRecruitments)
        setHasMore(true)
        return
      }

      console.log('Fetching recruitments for page:', page)
      const data = await fetchRecruitments(
        15,
        page,
        selectedJob || '',
        searchTerm
      )

      if (data.length === 0 || data.length < 15) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      if (page === 1) {
        setRecruitments(data)
        updateCache(data, searchTerm, selectedJob, page, data.length === 15)
      } else {
        setRecruitments(prevRecruitments => [...prevRecruitments, ...data])
      }
      
      prevPageRef.current = page
      prevSearchTermRef.current = searchTerm
      prevSelectedJobRef.current = selectedJob
    } catch (err) {
      Sentry.captureException(err);
      setError('채용 정보를 불러오는 데 실패했습니다.')
      console.error('Error fetching recruitments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, searchTerm, selectedJob, cachedRecruitments, shouldFetchNewData, updateCache])

  useEffect(() => {
    if (
      prevSearchTermRef.current !== searchTerm ||
      prevSelectedJobRef.current !== selectedJob
    ) {
      setRecruitments([])
      setPage(1)
      prevPageRef.current = 1
      setHasMore(true)
    }
    loadRecruitments()
  }, [loadRecruitments, searchTerm, selectedJob])

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setPage(prevPage => prevPage + 1)
    }
  }, [isLoading, hasMore])
  
  const handleBookmarkClick = async (id: string) => {
    try {
      const isBookmarked = await toggleBookmark2(id)
      setRecruitments(prevRecruitments =>
        prevRecruitments.map(recruitment =>
          recruitment.id === id
            ? { ...recruitment, bookmark: isBookmarked }
            : recruitment
        )
      )
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error toggling bookmark:', error)
      setError('북마크 설정에 실패했습니다.')
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div className="recruitment-container" ref={containerRef}>
      {recruitments.map(recruitment => (
        <RecruitmentCard
          id={recruitment.id}
          key={recruitment.id}
          companyimg={recruitment.company_img}
          dday={recruitment.dday}
          isBookmarked={recruitment.bookmark}
          handleBookmarkClick={() => handleBookmarkClick(recruitment.id)}
          titles={recruitment.titles}
          experience={recruitment.experience}
          jobType={recruitment.jobType}
          location={recruitment.location}
          company={recruitment.company}
          education={recruitment.education}
          deadline={recruitment.deadline}
          jobcate={recruitment.jobcate}
          url={recruitment.url}
        />
      ))}
      {isLoading && <Loading type="recruitment" />}
      {error && <p>{error}</p>}
      {!hasMore && <p>모든 채용 정보를 불러왔습니다.</p>}
    </div>
  )
}

export default RecruitmentContainer
