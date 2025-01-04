import React, { useState, useEffect } from 'react'
import './Recruit.css'
import { toast } from 'react-toastify'
import { getSaraminTags, getUserData, updateUserSaraminSubscriptions } from '../../../api'
import * as Sentry from '@sentry/react';
interface FieldSelection {
  field: string
  subField: string
}

interface RecruitProps {
  onClose: () => void;
}

interface SaraminSubscriptions {
  [key: string]: string[];
}

const Recruit: React.FC<RecruitProps> = ({ onClose }) => {
  const [fieldSelections, setFieldSelections] = useState<FieldSelection[]>([
    { field: '', subField: '' },
    { field: '', subField: '' },
    { field: '', subField: '' },
  ])
  const [tags, setTags] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsData, userData] = await Promise.all([getSaraminTags(), getUserData()]);
        setTags(tagsData)
        
        if (userData.subscribe_saramin) {
          const userSelections = Object.entries(userData.subscribe_saramin).flatMap(([field, subFields]) => 
            (Array.isArray(subFields) ? subFields : [subFields]).map(subField => ({
              field,
              subField
            }))
          ).slice(0, 3);

          while (userSelections.length < 3) {
            userSelections.push({ field: '', subField: '' });
          }

          setFieldSelections(userSelections);
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('데이터 가져오기 오류:', error)
      }
    }

    fetchData()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const subscriptions: SaraminSubscriptions = fieldSelections.reduce((acc, selection) => {
      if (selection.field && selection.subField) {
        if (!acc[selection.field]) {
          acc[selection.field] = [];
        }
        acc[selection.field].push(selection.subField);
      }
      return acc;
    }, {} as SaraminSubscriptions);

    try {
      await updateUserSaraminSubscriptions(subscriptions);
      toast.success('구독 정보가 성공적으로 업데이트되었습니다.');
      console.log('구독 정보가 성공적으로 업데이트되었습니다.');
      onClose();
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) { 
      Sentry.captureException(error);
      console.error('구독 정보 업데이트 중 오류 발생:', error);
      toast.error('구독 정보 업데이트에 실패했습니다.');
    }
  }

  return (
    <div className="Recruit-All">
      <div className="Recruit-title">
        <div className='Recruit-title-num'>03</div>
        <div className='Recruit-title-name'>채용공고</div>
      </div>
      <div className="Recruit-Container">
        <form onSubmit={handleSubmit}>
          {[0, 1, 2].map(index => (
            <div className="Recruit-Conatiner2" key={index}>
              <div className="Recruit-text-Container">
                <label htmlFor={`field-${index}`}>분야</label>
                <select 
                  id={`field-${index}`}
                  className="field-select"
                  value={fieldSelections[index].field}
                  onChange={e => handleFieldChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    관심 분야를 선택하세요
                  </option>
                  {Object.keys(tags).map((tagKey, idx) => (
                    <option key={idx} value={tagKey}>
                      {tagKey}
                    </option>
                  ))}
                </select>
              </div>
              <div className="Recruit-text-Container">
                <label htmlFor={`sub-field-${index}`}>세부 분야</label>
                <select 
                  id={`sub-field-${index}`}
                  className="field-select"
                  value={fieldSelections[index].subField}
                  onChange={e => handleSubFieldChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    세부 분야를 선택하세요
                  </option>
                  {fieldSelections[index].field && tags[fieldSelections[index].field] && 
                    tags[fieldSelections[index].field].map((subField, idx) => (
                      <option key={idx} value={subField}>
                        {subField}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          ))}
          {/* <p className="Myschool-text">
            관심있는 학과를 선택해 공지사항을 확인해보세요!
          </p> */}
          <div className="buttons-1">
            <button className="button-save" type="submit" onClick={onClose}>
              저장
            </button>
            <button className="button-1" type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recruit;