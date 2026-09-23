/// <reference types="kakao.maps.d.ts" />

export type LatLng = { lat: number; lng: number }

// 주소 -> 좌표 (카카오 services 라이브러리의 Geocoder, index.html에서 libraries=services로 불러옴)
// 찾지 못하면 null
export function geocode(address: string): Promise<LatLng | null> {
    return new Promise((resolve) => {
        if (!window.kakao?.maps) return resolve(null)
        kakao.maps.load(() => {
            const geocoder = new kakao.maps.services.Geocoder()
            geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK && result[0]) {
                    resolve({ lat: Number(result[0].y), lng: Number(result[0].x) })
                } else {
                    resolve(null)
                }
            })
        })
    })
}
