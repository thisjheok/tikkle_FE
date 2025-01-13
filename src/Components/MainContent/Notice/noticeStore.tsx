import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Notice } from '../../../api'

interface NoticeState {
  notices: Notice[]
  lastFetched: number | null
  cacheTimeout: number // 캐시 유효 시간 (밀리초)
  activeTab: string
  searchTerm: string
  selectedDepartment: string | null
  setNotices: (notices: Notice[]) => void
  updateCache: (notices: Notice[], tab: string, search: string, department: string | null) => void
  shouldFetchNewData: (tab: string, search: string, department: string | null) => boolean
}

const useNoticeStore = create<NoticeState>()(
  devtools(
    (set, get) => ({
      notices: [],
      lastFetched: null,
      cacheTimeout: 5 * 60 * 1000, // 5분
      activeTab: '',
      searchTerm: '',
      selectedDepartment: null,
      
      setNotices: (notices) => set({ notices }),
      
      updateCache: (notices, tab, search, department) => set({
        notices,
        lastFetched: Date.now(),
        activeTab: tab,
        searchTerm: search,
        selectedDepartment: department,
      }),
      
      shouldFetchNewData: (tab, search, department) => {
        const state = get()
        const now = Date.now()
        
        // 캐시가 만료되었거나, 검색 조건이 변경되었을 때 true 반환
        return !state.lastFetched || 
               now - state.lastFetched > state.cacheTimeout ||
               tab !== state.activeTab ||
               search !== state.searchTerm ||
               department !== state.selectedDepartment
      },
    }),
    {
      name: 'Notice Store' // Redux DevTools에서 표시될 스토어 이름
    }
  )
)

export default useNoticeStore