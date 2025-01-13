import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Recruitment } from '../../../store/Rec'

interface RecruitmentState {
  recruitments: Recruitment[]
  lastFetched: number | null
  cacheTimeout: number
  page: number
  hasMore: boolean
  searchTerm: string
  selectedJob: string | null
  setRecruitments: (recruitments: Recruitment[]) => void
  appendRecruitments: (newRecruitments: Recruitment[]) => void
  updateCache: (
    recruitments: Recruitment[], 
    search: string, 
    job: string | null, 
    currentPage: number,
    hasMoreItems: boolean
  ) => void
  shouldFetchNewData: (search: string, job: string | null) => boolean
  updateBookmark: (id: string, isBookmarked: boolean) => void
  setPage: (page: number) => void
  setHasMore: (hasMore: boolean) => void
}

const useRecruitmentStore = create<RecruitmentState>()(
  devtools(
    (set, get) => ({
      recruitments: [],
      lastFetched: null,
      cacheTimeout: 5 * 60 * 1000, // 5분
      page: 1,
      hasMore: true,
      searchTerm: '',
      selectedJob: null,
      
      setRecruitments: (recruitments) => set({ recruitments }),
      
      appendRecruitments: (newRecruitments) => set(state => ({
        recruitments: [...state.recruitments, ...newRecruitments]
      })),
      
      updateCache: (recruitments, search, job, currentPage, hasMoreItems) => set({
        recruitments,
        lastFetched: Date.now(),
        searchTerm: search,
        selectedJob: job,
        page: currentPage,
        hasMore: hasMoreItems
      }),
      
      shouldFetchNewData: (search, job) => {
        const state = get()
        const now = Date.now()
        
        return !state.lastFetched || 
               now - state.lastFetched > state.cacheTimeout ||
               search !== state.searchTerm ||
               job !== state.selectedJob
      },

      updateBookmark: (id, isBookmarked) => set(state => ({
        recruitments: state.recruitments.map(recruitment =>
          recruitment.id === id
            ? { ...recruitment, bookmark: isBookmarked }
            : recruitment
        )
      })),

      setPage: (page) => set({ page }),
      setHasMore: (hasMore) => set({ hasMore }),
    }),
    {
      name: 'Recruitment Store'
    }
  )
)

export default useRecruitmentStore
