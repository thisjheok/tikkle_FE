import React, { useEffect } from 'react'
import {setStorageData} from '../../util/storage'
interface AuthData {
  access_token: string
  refresh_token: string
  is_new: boolean
}

interface DataListenerProps {
  onReceiveAuthData: (authData: AuthData) => void
}

const DataListener: React.FC<DataListenerProps> = ({ onReceiveAuthData }) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const authData: AuthData = event.data
      console.log('Received auth data from popup:', authData)

      // 모든 필수 프로퍼티가 존재하는지 확인
      if (isValidAuthData(authData)) {
        setStorageData('access_token', authData.access_token)
        setStorageData('refresh_token', authData.refresh_token)
        setStorageData('is_new', authData.is_new.toString())
        // console.log('Data saved to chromeStorage.')

        // 부모 컴포넌트로 인증 데이터 전달
        onReceiveAuthData(authData)
        window.location.reload()
      } else {
        console.warn('Invalid auth data received:', authData)
      }
    }

    const isValidAuthData = (data: any): data is AuthData => {
      return (
        typeof data.access_token === 'string' &&
        typeof data.refresh_token === 'string' &&
        typeof data.is_new === 'boolean'
      )
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onReceiveAuthData])

  return null
}

export default DataListener
