// 캘린더 하단 일정 정보 컴포넌트
import React from 'react'
import './schedule.css'

const Schedule: React.FC<{ date: Date | null; events: any[] }> = ({
  date,
  events,
}) => {
  if (!date) {
    return <div className="Schedule">날짜를 선택하세요.</div>
  }

  return (
    <div className="Schedule">
      {events.length > 0 ? (
        events.map((event, index) => (
          <div className="Schedule-maincontainer" key={index}>
            <div className="Schedule-main2conatainer">
              <div className="Schedule-recnet-icon"></div>
              <div className="Schedule-date">
                {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}
                일
              </div>
            </div>
            <div className="Schedule-key">
              <div className="Schedule-title">{String(event.summary)}</div>
              <div className="Schedule-time">
                {new Date(event.start.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                ~{' '}
                {new Date(event.end.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="Schedule-maincontainer">
          <div className="Schedule-main2conatainer">
            <div className="Schedule-recnet-icon"></div>
            <div className="Schedule-date">
              {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일
            </div>
          </div>
          <div className="Schedule-title">일정이 없습니다.</div>
        </div>
      )}
    </div>
  )
}

export default Schedule
