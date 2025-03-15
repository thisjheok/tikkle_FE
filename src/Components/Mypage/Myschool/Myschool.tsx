import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading';
import { 
  fetchSchools, 
  fetchDepartments, 
  fetchDepartments2,
  updateSchoolInfo,
  setSelectedSchool,
  setSelectedDepartment,
  setSubscribeDepartments,
  fetchUserSchoolData
} from '../../../store/slices/schoolSlice';
import { RootState } from '../../../store/store';
import './Myschool.css';
import { AppDispatch } from '../../../store/store';
import * as Sentry from '@sentry/react';
interface MySchoolProps {
  onClose: () => void;
}

const Myschool: React.FC<MySchoolProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    schools,
    departments,
    departments2,
    selectedSchool,
    selectedDepartment,
    subscribeDepartments,
    loading,
    error 
  } = useSelector((state: RootState) => state.school);

  // 컴포넌트 마운트 시 사용자 데이터 로드
  useEffect(() => {
    dispatch(fetchUserSchoolData())
      .catch(error => {
        Sentry.captureException(error);
        console.error('사용자 데이터를 불러오는 데 실패했습니다:', error);
        toast.error('사용자 정보를 불러오는 데 실패했습니다.');
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSchool) {
      dispatch(fetchDepartments(selectedSchool));
      dispatch(fetchDepartments2(selectedSchool));
    }
  }, [selectedSchool, dispatch]);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedSchool(e.target.value));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedDepartment(e.target.value));
  };

  const handleSubscribeDepartmentChange = (index: number, value: string) => {
    const newSubscribeDepartments = [...subscribeDepartments];
    newSubscribeDepartments[index] = value;
    dispatch(setSubscribeDepartments(newSubscribeDepartments));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedSchool || !selectedDepartment) {
      toast.error('학교와 학과를 선택해주세요.');
      return;   
    }
    try {
      await dispatch(updateSchoolInfo({
        university: selectedSchool,
        department: selectedDepartment,
        subscribe_notices: subscribeDepartments.filter(dept => dept !== '')
      })).unwrap();
      
      toast.success('학교 정보가 성공적으로 업데이트되었습니다.');
      onClose();
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('학교 정보 업데이트에 실패했습니다.');
    }
  };
  
  const DeleteBtn = ({ index }: { index: number }) => {
    return (
      <img className="Myschool-text-Container-select-delete" src="/img/Mypage/MySchoolDeleteBtn.svg" alt="delete" 
      onClick={() => handleDelete(index)}
      />
    )
  }
  
  const handleDelete = (index: number) => {
    const newSubscribeDepartments = [...subscribeDepartments];
    newSubscribeDepartments[index] = '';
    dispatch(setSubscribeDepartments(newSubscribeDepartments));
  }

  if (loading) return <Loading type="mypage" />;
  if (error) return <div>에러: {error}</div>;

  // JSX는 기존과 동일하되 state 대신 Redux store의 값을 사용
  return (
    <div className="Myschool-All">
      <div className="Myschool-title">
        <div className='Myschool-title-num'>02</div>
        <div className='Myschool-title-name'>우리학교</div>
      </div>
      <div className="Myschool-Container">
        <form onSubmit={handleSubmit}>
          <div className="Myschool-Conatiner2">
            <div className="Myschool-text-Container">
              <label htmlFor="school">학교</label>
              <select
                value={selectedSchool}
                onChange={handleSchoolChange}
              >
                <option value="" disabled>
                  학교를 선택해주세요
                </option>
                {schools.map((schoolName, index) => (
                  <option key={index} value={schoolName}>
                    {schoolName}
                  </option>
                ))}
              </select>
            </div>
            <div className="Myschool-text-Container">
              <label htmlFor="campus">학과</label>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                <option value="" disabled>
                  학과를 선택해주세요
                </option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="Myschool-Conatiner2">
            <div className="Myschool-text-Container">
              <label htmlFor="major">관심 사이트 1</label>
              <div className="Myschool-text-Container-select">
              <select
                    id={`extra-department-${1}`}
                    value={subscribeDepartments[0]}
                    onChange={e =>
                    handleSubscribeDepartmentChange(
                      0,
                      e.target.value
                    )
                    }
                  >
                  <option value="" disabled>
                    선택
                  </option>
                  {departments2.map((dept, deptIndex) => (
                  <option key={deptIndex} value={dept}>
                      {dept}
                  </option>
                    ))}
                  </select>
                  {
                    subscribeDepartments[0] && (
                      <DeleteBtn index={0} />
                    )
                  }
              </div>
            </div>
            <div className="Myschool-text-Container">
              <label htmlFor="year">관심 사이트 2</label>
              <div className="Myschool-text-Container-select">
              <select
                    id={`extra-department-${2}`}
                    value={subscribeDepartments[1]}
                    onChange={e =>
                    handleSubscribeDepartmentChange(
                      1,
                      e.target.value
                    )
                    }
                  >
                  <option value="" disabled>
                    선택
                  </option>
                  {departments2.map((dept, deptIndex) => (
                  <option key={deptIndex} value={dept}>
                      {dept}
                  </option>
                    ))}
                  </select>
                  {
                    subscribeDepartments[1] && (
                      <DeleteBtn index={1} />
                    )
                  }
              </div>
            </div>
          </div>

          <div className="Myschool-Conatiner2">
            <div className="Myschool-text-Container">
              <label htmlFor="major">관심 사이트 3</label>
              <div className="Myschool-text-Container-select">
              <select
                    id={`extra-department-${3}`}
                    value={subscribeDepartments[2]}
                    onChange={e =>
                    handleSubscribeDepartmentChange(
                      2,
                      e.target.value
                    )
                    }
                  >
                  <option value="" disabled>
                    선택
                  </option>
                  {departments2.map((dept, deptIndex) => (
                  <option key={deptIndex} value={dept}>
                      {dept}
                  </option>
                    ))}
                  </select>
                  {
                    subscribeDepartments[2] && (
                      <DeleteBtn index={2} />
                    )
                  }
              </div>
            </div>
            <div className="Myschool-text-Container">
              <label htmlFor="year">관심 사이트 4</label>
              <div className="Myschool-text-Container-select">
              <select
                    id={`extra-department-${4}`}
                    value={subscribeDepartments[3]}
                    onChange={e =>
                    handleSubscribeDepartmentChange(
                      3,
                      e.target.value
                    )
                    }
                  >
                  <option value="" disabled>
                    선택
                  </option>
                  {departments2.map((dept, deptIndex) => (
                  <option key={deptIndex} value={dept}>
                      {dept}
                  </option>
                    ))}
                  </select>
                  {
                    subscribeDepartments[3] && (
                      <DeleteBtn index={3} />
                    )
                  }
              </div>
            </div>
          </div>


          <div className="buttons">
            <button className="button-save" type="submit">
              저장
            </button>
            <button className="button" type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  )
}

export default Myschool
