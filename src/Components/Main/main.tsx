import React, { useState } from 'react'
import MainContainer from './maincontainer'
import './main.css'
import Calendar from '../Calendar/calendar'
import Schedule from '../Schedule/schedule'
import ContentSelector from '../MainContent/Container/Contentselector'
import { UserData } from '../../api'

interface MainProps {
  userData: UserData | null
}
const Main: React.FC<MainProps> = ({ userData }) => {
  // 선택된 날짜와 해당 날짜의 이벤트를 관리
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEvents, setSelectedEvents] = useState<any[]>([])

  return (
    <MainContainer>
      <div className="main-left">
        {/* Calendar 컴포넌트에 선택된 날짜와 이벤트 설정 함수 전달 */}
        <Calendar
          setSelectedDate={setSelectedDate}
          setSelectedEvents={setSelectedEvents}
        />
        {/* Schedule 컴포넌트에 선택된 날짜와 이벤트 전달 */}
        <Schedule date={selectedDate} events={selectedEvents} />
      </div>
      <div className="Noice">
        <ContentSelector userData={userData} />
      </div>
    </MainContainer>
  )
}

export default Main
