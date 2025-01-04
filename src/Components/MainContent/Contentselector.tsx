import React, { useState } from 'react'
import './Content.css'
import Noticelist from './Notice/noticelist'
import Noticemain from './Notice/noticemain'
import Activities from './Activities/activities'
import SearchBox from '../Search/Searchbox'
import Scholarship from './Scholarship/scholarship'
import Competition from './Competition/competition'
import Department from './Department/Department'
import RecruitmentContainer from './Recruitment/recruitment'
import Job from './job/job'
import { UserData } from '../../api'
import Mypageinfo from '../modal/Mypageinfomodal'

interface ContentSelectorProps {
  userData: UserData | null
}

const ContentSelector: React.FC<ContentSelectorProps> = ({ userData }) => {
  const [selectedNotice, setSelectedNotice] = useState('공지사항')
  const [activeTab, setActiveTab] = useState('전체')
  const [tabs, setTabs] = useState(['전체'])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  ) // Correctly type as string | null
  // const [tagList, setTagList] = useState<string[]>([]) // Keep this if needed
  const notices = ['공지사항', '채용공고', '장학', '대외활동', '공모전']
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTagListUpdate = (tags: string[]) => {
    // setTagList(tags)
    setTabs(['전체', ...tags])
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department)
  }

  const renderContent = () => {
    switch (selectedNotice) {
      case '공지사항':
        return (
          <>
            {userData && (
              <Department
                departments={userData.subscribe_notices}
                onDepartmentSelect={handleDepartmentSelect}
              />
            )}
            <SearchBox onSearch={handleSearch} />
            <Noticelist />
            <Noticemain
              activeTab={activeTab}
              onTagListUpdate={handleTagListUpdate}
              searchTerm={searchTerm}
              selectedDepartment={selectedDepartment}
            />
          </>
        )
      case '장학':
        return <Scholarship />
      case '채용공고':
        const jobList = userData?.subscribe_saramin
          ? Object.values(userData.subscribe_saramin).flat()
          : []
        return (
          <>
            <Job subscribeSaramin={jobList} onJobSelect={setSelectedJob} />
            <SearchBox onSearch={handleSearch} />
            <RecruitmentContainer
              searchTerm={searchTerm}
              selectedJob={selectedJob}
            />
          </>
        )
      case '대외활동':
        return <Activities />
      case '공모전':
        return <Competition />
      default:
        return null
    }
  }

  return (
    <div className="Content-selector">
      <Mypageinfo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="Content-Selector-main">
        {notices.map(notice => (
          <div
            key={notice}
            className={`Content-Selector-sector ${
              selectedNotice === notice ? 'selected' : ''
            }`}
            onClick={() => setSelectedNotice(notice)}
          >
            {notice}
          </div>
        ))}
      </div>
      <div className="Counter-main2">
        {selectedNotice === '공지사항' && (
          <div className="Content-Selector-main2">
            {tabs.map(tab => (
              <div
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`Contents ${selectedNotice === '채용공고'||'공지사항' ? 'align-left' : ''}`}>
        {renderContent()}
      </div>
    </div>
  )
}

export default ContentSelector
