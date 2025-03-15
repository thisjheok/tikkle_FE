import React, { useState, useEffect } from 'react'
import Modal from '../modal/modal'
import { motion } from 'framer-motion'
import './Login.css'
import * as Sentry from '@sentry/react';
import {
  postUserData,
  getNoticeDepartment,
  getNoticeSite,
  getNoticeDepartment2,
  getSaraminTags
} from '../../api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getStorageData, setStorageData} from '../../util/storage'
interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

interface FieldSelection {
  field: string
  subField: string
}


const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  // onChange,
}) => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [department, setDepartment] = useState('')
  const [schools, setSchools] = useState<string[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [departments2, setDepartments2] = useState<string[]>([])
  const [subscribeDepartments, setSubscribeDepartments] = useState<string[]>(['', '', ''])
  // const [subscribeJobs, setSubscribeJobs] = useState<string[]>(['', '', ''])
  // const [allChecked, setAllChecked] = useState(false)
  const [terms, setTerms] = useState({
    privacyPolicy: false,
  })
  const [fieldSelections, setFieldSelections] = useState<FieldSelection[]>([
    { field: '', subField: '' },
    { field: '', subField: '' },
    { field: '', subField: '' },
  ])
  const [tags, setTags] = useState<Record<string, string[]>>({})
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getStorageData('access_token')
      setAccessToken(token)
    }
    getToken()
  }, [])

  useEffect(() => {
    const fetchSchools = async () => {
      if (step === 1 && schools.length === 0 && accessToken) {
        try {
          const schoolOptions: string[] = await getNoticeSite()
          setSchools(schoolOptions)
        } catch (error) {
          Sentry.captureException(error);
          console.error('Error fetching schools:', error)
        }
      }
    }

    fetchSchools()
  }, [step, accessToken])

  useEffect(() => {
    const fetchTags = async () => {
      if (step === 2 && Object.keys(tags).length === 0) {
        try {
          const tagsData = await getSaraminTags()
          setTags(tagsData)
        } catch (error) { 
          Sentry.captureException(error);
          console.error('Error fetching Saramin tags:', error)
        }
      }
    }

    fetchTags()
  }, [step])

  useEffect(() => {
    const fetchDepartments = async () => {
      if (school) {
        try {
          const departmentOptions: string[] = await getNoticeDepartment(school)
          setDepartments(departmentOptions)
        } catch (error) {
          console.error('Error fetching departments:', error)
          // toast.error('학과 정보를 불러오는데 실패했습니다.')
        }
      } else {
        setDepartments([])
      }
    }

    fetchDepartments()
  }, [school])

  useEffect(() => {
    const fetchDepartments2 = async () => {
      if (school) {
        try {
          const departmentOptions2: string[] = await getNoticeDepartment2(school)
          setDepartments2(departmentOptions2)
        } catch (error) {
          Sentry.captureException(error);
          console.error('Error fetching departments:', error)
          // toast.error('관심 학과 정보를 불러오는데 실패했습니다.')
        }
      } else {
        setDepartments2([])
      }
    }

    fetchDepartments2()
  }, [school])


  const handleSubscribeDepartmentChange = (index: number, value: string) => {
    const newSubscribeDepartments = [...subscribeDepartments]
    newSubscribeDepartments[index] = value
    setSubscribeDepartments(newSubscribeDepartments)
  }

  // const handleSubscribeJobChange = (index: number, value: string) => {
  //   const newSubscribeJobs = [...subscribeJobs]
  //   newSubscribeJobs[index] = value
  //   setSubscribeJobs(newSubscribeJobs)
  // }

  // const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { checked } = event.target
  //   setAllChecked(checked)
  //   setTerms({
  //     privacyPolicy: checked
  //   })
  // }

  const handleFieldChange = (index: number, value: string) => {
    const newSelections = [...fieldSelections]
    newSelections[index] = { field: value, subField: '' }
    setFieldSelections(newSelections)
  }

  const handleSubFieldChange = (index: number, value: string) => {
    const newSelections = [...fieldSelections]
    newSelections[index] = { ...newSelections[index], subField: value }
    setFieldSelections(newSelections)
  }

  const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setTerms(prevTerms => ({
      ...prevTerms,
      [name]: checked,
    }))
  }

  const validateStep1 = () => {
    if (!name || !school || !department) {
      toast.error('모든 필수 항목을 입력해주세요.')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    const hasSelectedDepartment = subscribeDepartments.some(dept => dept !== '');
    const hasSelectedJob = fieldSelections.some(selection => selection.field !== '' && selection.subField !== '');
  
    if (!hasSelectedDepartment && !hasSelectedJob) {
      toast.error('관심있는 학과 공지와 채용공고를 최소 한 개씩 선택해주세요.');
      return false;
    }
  
    if (!hasSelectedDepartment) {
      toast.error('관심있는 학과 공지를 최소 한 개 선택해주세요.');
      return false;
    }
  
    if (!hasSelectedJob) {
      toast.error('관심있는 채용공고를 최소 한 개 선택해주세요.');
      return false;
    }
  
    return true;
  };

  const validateStep3 = () => {
    if (!terms.privacyPolicy) {
      toast.error('필수 약관에 동의해주세요.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      handleFormSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFormSubmit = async () => {
    const userData = {
      name: name,
      university: school,
      department: department,
      subscribe_notices: subscribeDepartments.filter(dept => dept !== ''),
      subscribe_saramin: fieldSelections.reduce((acc, selection) => {
        if (selection.field && selection.subField) {
          if (!acc[selection.field]) {
            acc[selection.field] = [];
          }
          acc[selection.field].push(selection.subField);
        }
        return acc;
      }, {} as Record<string, string[]>),
      // terms_of_service_agreement: terms.termsOfService,
      personal_information_collection_agreement: terms.privacyPolicy,
      // promotion_and_information_receipt_agreement: terms.promotions,
    }
    console.log(fieldSelections);
    console.log(userData);
    try {
      await postUserData(userData)
      setStorageData('is_new', 'false')
      toast.success('사용자 정보가 성공적으로 등록되었습니다.')
      onSubmit()
      onClose()
      // 짧은 지연 후 페이지 새로고침
      setTimeout(() => {
        window.location.reload()
      }, 1000) // 1초 후 새로고침
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error posting user data:', error)
      toast.error('사용자 정보 제출에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const renderStep1 = () => (
    <div className="Login-info-right">
      <div className="Login-Information">
        <div className="Login-input">
          <div className="Login-form-group">
            <label className="form-label">사용자 이름</label>
            <input
              type="text"
              id="name"
              className="Login-form-input2"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="Login-form-group">
            <label className="form-label">학교</label>
            <select
              id="school"
              className="Login-form-input"
              value={school}
              onChange={e => setSchool(e.target.value)}
            >
              <option value="" disabled>학교를 선택하세요</option>
              {schools.map((schoolName, index) => (
                <option key={index} value={schoolName}>{schoolName}</option>
              ))}
            </select>
          </div>
          <div className="Login-form-group">
            <label className="form-label">학과</label>
            <select
              id="depart"
              className="Login-form-input"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="" disabled>학과를 선택하세요</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="Login-info-right">
      <div className="Login-Information">
        <div className="Login-input">
          <div className="Login-form-group">
            <label className="form-label">관심있는 학과 공지</label>
            <div className="Login-form-group2">
              {[0, 1, 2].map(index => (
                <select
                  key={index}
                  id={`extra-department-${index + 1}`}
                  className="Login-form-input1"
                  value={subscribeDepartments[index]}
                  onChange={e => handleSubscribeDepartmentChange(index, e.target.value)}
                >
                  <option value="" disabled>선택</option>
                  {departments2.map((dept, deptIndex) => (
                    <option key={deptIndex} value={dept}>{dept}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>
          <div className="Login-form-group">
            <label className="form-label">관심있는 채용공고</label>
            {[0, 1, 2].map(index => (
              <div className="recruit-selection" key={index}>
                <select
                  className="Login-form-input1 recruit-select"
                  value={fieldSelections[index].field}
                  onChange={e => handleFieldChange(index, e.target.value)}
                >
                  <option value="" disabled>분야 선택</option>
                  {Object.keys(tags).map((tagKey, idx) => (
                    <option key={idx} value={tagKey}>{tagKey}</option>
                  ))}
                </select>
                <select
                  className="Login-form-input1 recruit-select"
                  value={fieldSelections[index].subField}
                  onChange={e => handleSubFieldChange(index, e.target.value)}
                >
                  <option value="" disabled>세부 분야 선택</option>
                  {fieldSelections[index].field && tags[fieldSelections[index].field] &&
                    tags[fieldSelections[index].field].map((subField, idx) => (
                      <option key={idx} value={subField}>{subField}</option>
                    ))
                  }
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="Login-info-right">
      <div className="Login-Information">
        <div className="Login-terms">
          <div className="terms-form">
            {/* <div className="term-item">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChange}
                id="chk1"
              />
              <label htmlFor="chk1"></label>
              <label htmlFor="chk1">선택 포함 전체 약관 동의</label>
            </div> */}
            {/* <div className="term-item">
              <input
                type="checkbox"
                name="termsOfService"
                checked={terms.termsOfService}
                onChange={handleTermChange}
                id="chk2"
              />
              <label htmlFor="chk2"></label>
              <label htmlFor="chk2">이용약관 동의 (필수)</label>
            </div> */}
            <div className="term-item">
              <input
                type="checkbox"
                name="privacyPolicy"
                checked={terms.privacyPolicy}
                onChange={handleTermChange}
                id="chk3"
              />
              <label htmlFor="chk3"></label>
              <label htmlFor="chk3">개인정보 수집 및 이용동의 (필수)</label>
              <label className='checkPolicy' onClick={() => window.open('https://tikkeul-service.notion.site/aeaefffa24cd48eca005c0fb71b9358c?pvs=4', '_blank')}>약관 보기</label>
            </div>
            {/* <div className="term-item">
              <input
                type="checkbox"
                name="promotions"
                checked={terms.promotions}
                onChange={handleTermChange}
                id="chk4"
              />
              <label htmlFor="chk4"></label>
              <label htmlFor="chk4">프로모션 등 혜택/정보 수신 동의 (선택)</label>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <motion.div
          className="info-modal-content"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item}>
              {step === 3 ?
            <div className="Login-info-left-2">
              <div className="Login-maintext-5">
                <div className="Login-maintext-4">
                  Co-Grow
                  </div>
                <div className="Login-maintext-1">
                  <div>
                    함께 성장하다
                  </div>
                </div>
                <div className="Login-maintext-6">
                  <div>티끌은 유저의 잠재력을 존중하고</div>
                  그 잠재력을 발휘할 수 있는 기회를 제공합니다.
                </div>
              </div>
              <img className="Login-policy-img" src="img/Login/data4.svg" />
              </div>
              :
              <div className="Login-info-left">
              <div className="Login-maintext">
                <div className="Login-maintext-3">
                  티끌은
                  </div>
                <div className="Login-maintext-1">
                  <div>
                    <span>커리어 솔루션</span>을 제안합니다.
                  </div>
                </div>
                <div className="Login-maintext-2">
                  <div>티끌은 다양한 정보 시장속에서 </div> 더 넓고 개인
                  맞춤화된 경험과 가치를 만들어갑니다.
                </div>
                </div>
                <img src="img/Login/data2.svg"/>
                </div>}
          </motion.div>
          <motion.div variants={item}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            <div className="button-group">
              <button className={`nav-btn ${step > 1 ? '' : 'invisible'}`} onClick={handleBack}>
                이전
              </button>
              <button className="nav-btn" onClick={handleNext}>
                {step === 3 ? '제출' : '다음'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </Modal>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </>
  )
}

export default InfoModal