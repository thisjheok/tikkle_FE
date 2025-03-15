import React, { useState, useEffect } from 'react'
import './Department.css'
import { getStorageData, setStorageData } from '../../../util/storage'
interface DepartmentProps {
  departments: string[]
  onDepartmentSelect: (department: string) => void // Prop to notify parent about the selected department
}

const Department: React.FC<DepartmentProps> = ({
  departments,
  onDepartmentSelect,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )

  useEffect(() => {
    const initializeSelectedDepartment = async () => {
      const savedDepartment = await getStorageData('selectedDepartment')
      setSelectedDepartment(savedDepartment || '전체공지')
    }
    initializeSelectedDepartment()
  }, [])

  const handleClick = (department: string) => {
    setSelectedDepartment(department)
    onDepartmentSelect(department) 
    setStorageData('selectedDepartment', department)
  }

  return (
    <div className="department-container">
      {departments.map(department => (
        <div
          key={department}
          className={`department-selector ${
            selectedDepartment === department ? 'selected' : ''
          }`}
          onClick={() => handleClick(department)}
        >
          {department}
        </div>
      ))}
    </div>
  )
}

export default Department
