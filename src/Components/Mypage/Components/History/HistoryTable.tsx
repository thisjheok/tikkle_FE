import React, { useState, useEffect, useCallback } from 'react';
import './History.css';
import { getBookmarkedNotices, BookmarkedNotice,toggleBookmark } from '../../../../api';
import { getBookmarkedSaramin, BookmarkedSaramin,toggleBookmark2 } from '../../../../api';
import * as Sentry from '@sentry/react';

interface Item {
  분야: string
  제목: string
  날짜: string
  id: string
  url: string
}

interface HistoryTableProps {
  activeTab: string;
  refreshBookmarkStats: () => Promise<void>;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ activeTab,refreshBookmarkStats }) => {
  const clientItemsPerPage = 4
  const serverItemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [allData, setAllData] = useState<Item[]>([])
  const [displayData, setDisplayData] = useState<Item[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date('2024-03-01')
  )
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())

  const formatDate = (date: Date | undefined) => {
    return date ? date.toISOString().split('T')[0] : ''
  }

  const handleTitleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const convertToItem = (notice: BookmarkedNotice): Item => ({
    분야: '공지사항',
    제목: notice.title,
    날짜: new Date(notice.created_at).toLocaleDateString('ko-KR'),
    id: notice.id,
    url: notice.url,
  })

  const convertToSaraminItem = (notice: BookmarkedSaramin): Item => ({
    분야: '채용공고',
    제목: notice.title,
    날짜: new Date(notice.created_at).toLocaleDateString('ko-KR'),
    id: notice.id,
    url: notice.url,
  })

  const fetchDataBasedOnActiveTab = useCallback(async () => {
    try {
      let result: Item[] = []
      switch (activeTab) {
        case '공지사항':
          result = await fetchAllNotices()
          setSelectedItems(new Set())
          break
        case '채용공고':
          result = await fetchAllSaramin()
          setSelectedItems(new Set())
          break
        case '':
        case '전체':
          result = await fetchAllData()
          break
        case '장학':
        case '대외활동':
        case '공모전':
          result = []
          break
        default:
          result = await fetchAllData()
      }
      setAllData(result)
      setTotalPages(Math.ceil(result.length / clientItemsPerPage))
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error fetching data:', error)
      setAllData([])
      setTotalPages(1)
    }
  }, [activeTab, startDate, endDate])

  const fetchAllNotices = async (): Promise<Item[]> => {
    let allNotices: Item[] = []
    let page = 1
    let hasMore = true
    while (hasMore) {
      const result = await getBookmarkedNotices(
        serverItemsPerPage,
        page,
        formatDate(startDate),
        formatDate(endDate)
      )
      allNotices = [...allNotices, ...result.data.map(convertToItem)]
      hasMore = result.data.length === serverItemsPerPage
      page++
    }
    return allNotices
  }

  const fetchAllSaramin = async (): Promise<Item[]> => {
    let allSaramin: Item[] = []
    let page = 1
    let hasMore = true
    while (hasMore) {
      const result = await getBookmarkedSaramin(
        serverItemsPerPage,
        page,
        formatDate(startDate),
        formatDate(endDate)
      )
      allSaramin = [...allSaramin, ...result.data.map(convertToSaraminItem)]
      hasMore = result.data.length === serverItemsPerPage
      page++
    }
    return allSaramin
  }

  const fetchAllData = async (): Promise<Item[]> => {
    const [notices, saramin] = await Promise.all([
      fetchAllNotices(),
      fetchAllSaramin(),
    ])
    return [...notices, ...saramin].sort(
      (a, b) => new Date(b.날짜).getTime() - new Date(a.날짜).getTime()
    )
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchDataBasedOnActiveTab()
  }, [activeTab, startDate, endDate])

  useEffect(() => {
    const start = (currentPage - 1) * clientItemsPerPage
    const end = start + clientItemsPerPage
    const newDisplayData = allData.slice(start, end)
    setDisplayData(newDisplayData)

    newDisplayData.forEach((item, index) => {
      console.log(`Item ${index}:`, item)
    })
  }, [currentPage, allData])

  const handleCheckboxChange = (index: number) => {
    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = new Set(prevSelectedItems)
      if (newSelectedItems.has(index)) {
        newSelectedItems.delete(index)
      } else {
        newSelectedItems.add(index)
      }
      return newSelectedItems
    })
  }

  const handleDelete = async () => {
    try {
      const itemsToDelete = Array.from(selectedItems).map(index => allData[index]);
      
      for (const item of itemsToDelete) {
        if (item.분야 === '공지사항') {
          await toggleBookmark(item.id)
        } else if (item.분야 === '채용공고') {
          await toggleBookmark2(item.id)
        }
      }

      const newData = allData.filter((_, index) => !selectedItems.has(index));
      setAllData(newData);
      setTotalPages(Math.ceil(newData.length / clientItemsPerPage));
      setSelectedItems(new Set());
      setCurrentPage(1);

      // 북마크 통계 새로고침
      await refreshBookmarkStats();
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error deleting items and toggling bookmarks:', error)
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value)
    setStartDate(newStartDate)
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate)
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value)
    setEndDate(newEndDate)
    if (startDate && newEndDate < startDate) {
      setStartDate(newEndDate)
    }
  }
  return (
    <div className="history-container">
      <div className="date-header">
        <div className="date-picker">
          <img src="img/calendar_2.svg" alt="Start Date" />
          <input
            type="date"
            value={formatDate(startDate)}
            onChange={handleStartDateChange}
            max={formatDate(endDate)}
            className="date-input"
          />
        </div>
        <span> ~</span>
        <div className="date-picker">
          <img src="img/calendar_2.svg" alt="End Date" />
          <input
            type="date"
            value={formatDate(endDate)}
            onChange={handleEndDateChange}
            min={formatDate(startDate)}
            className="date-input"
          />
        </div>
        <img src="img/delete_2.svg" alt="Delete" />
        <button className="delete-button" onClick={handleDelete}>
          삭제
        </button>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th></th>
            <th>분야</th>
            <th>제목</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item, index) => (
            <tr className='History-table-list' key={item.id}>
              <td>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <span className="custom-checkbox"></span>
                </label>
              </td>
              <td>{item.분야}</td>
              <td>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    handleTitleClick(item.url)
                  }}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {item.제목}
                </a>
              </td>
              <td>{item.날짜}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination1">
        <button
          className="page-button"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <img src="/img/left.svg" alt="Previous" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <span
            key={index}
            className={`page-number ${
              currentPage === index + 1 ? 'active' : ''
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </span>
        ))}
        <button
          className="page-button"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <img src="/img/right.svg" alt="Next" />
        </button>
      </div>
    </div>
  )
}

export default HistoryTable
