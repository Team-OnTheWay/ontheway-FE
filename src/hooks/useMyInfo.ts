import { useEffect, useState } from 'react'
import { User } from '../api/User'

// GET /user/info 응답 (스웨거에 형태가 없어 서버 코드 기준으로 정의)
export interface MyInfo {
    userId: string
    userImage: string | null
    nickName: string
    rating: number | null
    email: string
    birthday: string      // "2003-09-02"
}

// 로그인한 내 정보. reload()로 다시 불러온다
export function useMyInfo() {
    const [info, setInfo] = useState<MyInfo | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let cancelled = false
        new User().info()
            .then(res => { if (!cancelled) setInfo((res.data.data as MyInfo) ?? null) })
            .catch(() => { /* 401이면 http-client가 로그인 화면으로 보낸다 */ })
        return () => { cancelled = true }
    }, [version])

    return { info, reload: () => setVersion(v => v + 1) }
}
