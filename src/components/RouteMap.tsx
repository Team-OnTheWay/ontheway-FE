/// <reference types="kakao.maps.d.ts" />
import { useEffect, useState } from 'react'
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk'
import './RouteMap.css'
import { geocode, type LatLng } from '../utils/geocode'

interface RouteMapProps {
    startAddr: string   // 출발지 주소 (도로명/지번)
    endAddr: string     // 도착지 주소
}

// 마커 이미지: 출발지는 파란 원, 도착지는 주황 핀 (카드·입력칸 아이콘과 같은 모양)
const START_MARKER = {
    src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#fff" stroke="#4576F7" stroke-width="4"/></svg>'),
    size: { width: 28, height: 28 },
    options: { offset: { x: 14, y: 14 } },
}
const END_MARKER = {
    src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" fill="#FD5D35"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>'),
    size: { width: 32, height: 32 },
    options: { offset: { x: 16, y: 30 } },
}

function RouteMap({ startAddr, endAddr }: RouteMapProps) {
    const [points, setPoints] = useState<{ start: LatLng; end: LatLng } | null>(null)
    const [failed, setFailed] = useState(false)
    const [map, setMap] = useState<kakao.maps.Map>()

    // 주소가 바뀔 때마다 좌표를 다시 찾는다
    useEffect(() => {
        let cancelled = false
        Promise.all([geocode(startAddr), geocode(endAddr)]).then(([start, end]) => {
            if (cancelled) return
            if (start && end) {
                setPoints({ start, end })
                setFailed(false)
            } else {
                setPoints(null)
                setFailed(true)
            }
        })
        return () => { cancelled = true }
    }, [startAddr, endAddr])

    // 출발지·도착지가 한 화면에 모두 들어오도록 범위 맞추기
    useEffect(() => {
        if (!map || !points) return
        const bounds = new kakao.maps.LatLngBounds()
        bounds.extend(new kakao.maps.LatLng(points.start.lat, points.start.lng))
        bounds.extend(new kakao.maps.LatLng(points.end.lat, points.end.lng))
        map.setBounds(bounds, 40, 40, 40, 40)
    }, [map, points])

    if (failed) {
        return <div className="route-map route-map--message">주소 위치를 찾지 못했어요.</div>
    }

    if (!points) {
        return <div className="route-map route-map--message">지도를 불러오는 중이에요.</div>
    }

    return (
        <div className="route-map">
            <Map center={points.start} className="route-map__canvas" level={7} onCreate={setMap}>
                <Polyline
                    path={[points.start, points.end]}
                    strokeWeight={4}
                    strokeColor="#FD5D35"
                    strokeOpacity={0.8}
                    strokeStyle="shortdash"
                />
                <MapMarker position={points.start} image={START_MARKER} title="출발지" />
                <MapMarker position={points.end} image={END_MARKER} title="도착지" />
            </Map>
        </div>
    )
}

export default RouteMap
