// 필터에서 쓰는 값의 형태와 라벨 만들기
// (컴포넌트 파일과 분리해야 Fast Refresh가 정상 동작한다)

// 지역 필터 값: 시·도만 고르고 끝낼 수도 있어서 district는 없을 수 있다
export interface RegionValue {
    sido: string
    district?: string
}

export interface PriceValue {
    min: number
    max: number
}

// 네 가지 필터를 한 묶음으로 다룬다
export interface FilterValues {
    start: RegionValue | null
    end: RegionValue | null
    rating: number | null
    price: PriceValue | null
}

export const EMPTY_FILTERS: FilterValues = { start: null, end: null, rating: null, price: null }

export const PRICE_MIN = 0
export const PRICE_MAX = 100000
export const PRICE_STEP = 1000

// 금액을 "20,000원" 형태로
export function formatPrice(value: number) {
    return value.toLocaleString('ko-KR') + '원'
}

// 칩에 보여줄 짧은 라벨
export function regionLabel(value: RegionValue) {
    return value.district ? value.sido + ' ' + value.district : value.sido
}

export function priceLabel(value: PriceValue) {
    return formatPrice(value.min) + '~' + formatPrice(value.max)
}

export function ratingLabel(value: number) {
    return value === 5 ? '5.0' : value.toFixed(1) + ' 이상'
}

// 주소 검색(다음 우편번호)이 돌려주는 주소는 "서울 영등포구 …"처럼 시·도를 줄여 쓴다.
// 서버는 주소를 LIKE 로 찾으므로 필터 값도 같은 형태로 바꿔 보낸다
const SIDO_SHORT: Record<string, string> = {
    '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구', '인천광역시': '인천',
    '광주광역시': '광주', '대전광역시': '대전', '울산광역시': '울산', '경기도': '경기',
    '충청북도': '충북', '충청남도': '충남', '전라남도': '전남', '경상북도': '경북', '경상남도': '경남',
}

export function regionQuery(value: RegionValue | null) {
    if (!value) return undefined
    const sido = SIDO_SHORT[value.sido] ?? value.sido
    return value.district ? `${sido} ${value.district}` : sido
}

// 필터 값 -> 목록 API 쿼리 (희망금액은 "이 금액 이하"로 거른다)
export function filterQuery(values: FilterValues) {
    return {
        startAddress: regionQuery(values.start),
        endAddress: regionQuery(values.end),
        rating: values.rating ?? undefined,
        hopePrice: values.price?.max,
    }
}
