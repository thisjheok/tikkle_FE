import React, { useState, useMemo, useEffect } from 'react'
import './job.css'

interface JobProps {
  subscribeSaramin?: string[]
  onJobSelect: (selectedJob: string | null) => void
}

const Job: React.FC<JobProps> = ({ subscribeSaramin = [], onJobSelect }) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const jobs = useMemo(() => {
    return subscribeSaramin.filter(job => typeof job === 'string')
  }, [subscribeSaramin])

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
      onJobSelect(jobs[0])
    }
  }, [jobs, onJobSelect])

  const handleClick = (job: string) => {
    const newSelectedJob = selectedJob === job ? null : job
    setSelectedJob(newSelectedJob)
    onJobSelect(newSelectedJob)
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
