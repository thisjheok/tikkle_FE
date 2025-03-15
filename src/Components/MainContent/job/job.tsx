import React, { useState, useMemo, useEffect } from 'react'
import './job.css'
import { getStorageData, setStorageData } from '../../../util/storage'
interface JobProps {
  subscribeSaramin?: string[]
  onJobSelect: (selectedJob: string ) => void
}

const Job: React.FC<JobProps> = ({ subscribeSaramin = [], onJobSelect }) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const jobs = useMemo(() => {
    return subscribeSaramin.filter(job => typeof job === 'string')
  }, [subscribeSaramin])

  useEffect(() => {
    const initializeSelectedJob = async () => {
      const savedJob = await getStorageData('selectedJob')
      if(savedJob){
        setSelectedJob(savedJob)
      }else{
        if(jobs.length > 0){
          setSelectedJob(jobs[0])
          onJobSelect(jobs[0])
          setStorageData('selectedJob', jobs[0])
        }
      }
    }
    initializeSelectedJob()
  }, [])

  // useEffect(() => {
  //   if (jobs.length > 0 && !selectedJob) {
  //     setSelectedJob(jobs[0])
  //     onJobSelect(jobs[0])
  //   }
  // }, [jobs, onJobSelect])

  const handleClick = (job: string) => {
    if (selectedJob === job) {
        return; // 이미 선택된 job을 다시 클릭하면 아무 동작도 하지 않음
    }
    setSelectedJob(job)
    onJobSelect(job)
    setStorageData('selectedJob', job)
  }

  return (
    <div className="job-container">
      {jobs.map(job => (
        <div
          key={job}
          className={`job-selector ${selectedJob === job ? 'selected' : ''}`}
          onClick={() => handleClick(job)}
        >
          {job}
        </div>
      ))}
    </div>
  )
}

export default Job
