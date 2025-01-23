import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getNoticeSite, 
  getNoticeDepartment, 
  getNoticeDepartment2,
  updateUserUniversity,
  getUserData,
} from '../../api';
import * as Sentry from '@sentry/react';
interface SchoolState {
  schools: string[];
  departments: string[];
  departments2: string[];
  selectedSchool: string;
  selectedDepartment: string;
  subscribeDepartments: string[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  isInitialized: boolean;
}

const initialState: SchoolState = {
  schools: [],
  departments: [],
  departments2: [],
  selectedSchool: '',
  selectedDepartment: '',
  subscribeDepartments: ['', '', '', ''],
  loading: false,
  error: null,
  lastFetchTime: null,
  isInitialized: false
};

// 캐시 유효 시간을 5분으로 설정
const CACHE_DURATION = 5 * 60 * 1000;

// 학교 목록 가져오기
export const fetchSchools = createAsyncThunk(
  'school/fetchSchools',
  async (_, { getState }) => {
    const state = getState() as { school: SchoolState };
    const now = Date.now();
    
    // 캐시된 데이터가 있고 유효기간이 지나지 않았다면 새로 fetch하지 않음
    if (state.school.schools.length > 0 && 
        state.school.lastFetchTime && 
        now - state.school.lastFetchTime < CACHE_DURATION) {
      return state.school.schools;
    }
    console.log('학교 목록 가져오기');
    const schools = await getNoticeSite();
    return schools;
  }
);

// 학과 목록 가져오기
export const fetchDepartments = createAsyncThunk(
  'school/fetchDepartments',
  async (school: string) => {
    const departments = await getNoticeDepartment(school);
    return departments;
  }
);

// 구독 가능한 학과 목록 가져오기
export const fetchDepartments2 = createAsyncThunk(
  'school/fetchDepartments2',
  async (school: string) => {
    const departments = await getNoticeDepartment2(school);
    return departments;
  }
);

// 학교 정보 업데이트
export const updateSchoolInfo = createAsyncThunk(
  'school/updateSchoolInfo',
  async (data: {
    university: string;
    department: string;
    subscribe_notices: string[];
  }) => {
    await updateUserUniversity(data);
    return data;
  }
);

// 사용자 데이터 가져오기
export const fetchUserSchoolData = createAsyncThunk(
  'school/fetchUserSchoolData',
  async () => {
    const userData = await getUserData();
    return {
      university: userData.university,
      department: userData.department,
      // '전체공지'를 제외한 구독 학과 목록
      subscribeDepartments: userData.subscribe_notices_without_filter
        .filter(dept => dept !== '전체공지')
    };
  }
);

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    setSelectedSchool: (state, action) => {
      state.selectedSchool = action.payload;
      state.selectedDepartment = '';
      state.subscribeDepartments = ['', '', '', ''];
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    setSubscribeDepartments: (state, action) => {
      state.subscribeDepartments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSchools
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.schools = action.payload;
        state.loading = false;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '학교 목록을 불러오는데 실패했습니다.';
        Sentry.captureException(action.error);
      })
      // fetchDepartments
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      })
      // fetchDepartments2
      .addCase(fetchDepartments2.fulfilled, (state, action) => {
        state.departments2 = action.payload;
      })
      // fetchUserSchoolData 처리 수정
      .addCase(fetchUserSchoolData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSchoolData.fulfilled, (state, action) => {
        state.selectedSchool = action.payload.university;
        state.selectedDepartment = action.payload.department;
        
        // subscribeDepartments 배열 처리
        const filteredDepts = action.payload.subscribeDepartments;
        state.subscribeDepartments = [
          ...filteredDepts,
          ...Array(4 - filteredDepts.length).fill('')
        ];
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(fetchUserSchoolData.rejected, (state, action) => {
        state.error = action.error.message || '사용자 데이터를 불러오는데 실패했습니다.';
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const { 
  setSelectedSchool, 
  setSelectedDepartment, 
  setSubscribeDepartments 
} = schoolSlice.actions;

export default schoolSlice.reducer;