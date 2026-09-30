import { useEffect, useRef, useState } from 'react'
import { Order } from '../api/Order'
import type { LatLng } from '../utils/geocode'

// 배송 중 GPS: 5초마다 (배송 중일 때만 호출하고, 그 외 상태나 화면을 벗어나면 멈춘다)
const INTERVAL = 5000

// 화면이 보일 때만 콜백을 주기적으로 실행 (다른 탭·백그라운드에서는 멈춰서 요청·배터리 절약)
function useVisibleInterval(callback: () => void, enabled: boolean) {
    const saved = useRef(callback)
    useEffect(() => { saved.current = callback })

    useEffect(() => {
        if (!enabled) return
        let timer: ReturnType<typeof setInterval> | undefined
        const start = () => {
            if (timer) return
            saved.current()
            timer = setInterval(() => saved.current(), INTERVAL)
        }
        const stop = () => { clearInterval(timer); timer = undefined }
        const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop())
        onVisibility()
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
            stop()
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [enabled])
}

// 의뢰자: 전달자 위치를 5초마다 조회 (GET /order/location)
export function useCourierLocation(deliveryId: number, enabled: boolean) {
    const [location, setLocation] = useState<{ position: LatLng; updatedAt?: string } | null>(null)
    const [failed, setFailed] = useState(false)

    useVisibleInterval(() => {
        new Order().location({ locationRequestDto: { deliveryId } })
            .then(res => {
                const d = res.data.data
                if (d?.latitude != null && d?.longitude != null) {
                    setLocation({ position: { lat: d.latitude, lng: d.longitude }, updatedAt: d.updatedAt })
                }
                setFailed(false)
            })
            .catch(() => setFailed(true))   // 전달자가 아직 위치를 보내지 않은 경우 등
    }, enabled)

    return { location: enabled ? location : null, failed: enabled && failed }
}

type ShareState = 'idle' | 'sharing' | 'denied' | 'unsupported' | 'error'

// 전달자: 내 위치를 5초마다 전송 (PATCH /order/location)
// 웹이라서 이 화면을 열어 둔 동안만 보낼 수 있다. 폰 위치는 https(또는 localhost)에서만 받을 수 있다
export function useShareLocation(deliveryId: number, enabled: boolean) {
    const latest = useRef<GeolocationPosition | null>(null)
    const [state, setState] = useState<ShareState>('idle')
    const [sentAt, setSentAt] = useState<Date | null>(null)

    // 위치 변화를 계속 받아 두고, 전송은 5초 간격으로
    useEffect(() => {
        if (!enabled) return
        if (!('geolocation' in navigator)) {
            queueMicrotask(() => setState('unsupported'))
            return
        }
        const id = navigator.geolocation.watchPosition(
            pos => { latest.current = pos },
            err => setState(err.code === err.PERMISSION_DENIED ? 'denied' : 'error'),
            { enableHighAccuracy: true, maximumAge: INTERVAL, timeout: 20000 },
        )
        return () => navigator.geolocation.clearWatch(id)
    }, [enabled])

    useVisibleInterval(() => {
        const pos = latest.current
        if (!pos) return
        new Order().updateLocation({ deliveryId, latitude: pos.coords.latitude, longitude: pos.coords.longitude })
            .then(() => { setState('sharing'); setSentAt(new Date()) })
            .catch(() => setState('error'))
    }, enabled)

    return { state: enabled ? state : 'idle', sentAt }
}
