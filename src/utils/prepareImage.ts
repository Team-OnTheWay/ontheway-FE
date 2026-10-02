// 업로드 전 사진 정리: 아이폰 HEIC/HEIF -> JPG 변환 + 크기 줄이기.
// - 서버는 JPG·PNG·WEBP만 받는다 (HEIC는 거부)
// - 배포 서버 앞단(nginx)이 1MB 넘는 요청을 막아서, 1MB 아래로 맞춰 보낸다
// 화면에 보이는 사진 폭은 최대 약 470px(2~3배 화면이면 약 1,400px)이라 긴 변 1600px이면 충분하다

const MAX_SIDE = 1600
const MAX_BYTES = 900 * 1024   // 1MB 한도에 요청의 다른 부분(필드·경계 문자열) 여유를 둔 값
const QUALITIES = [0.8, 0.7, 0.6, 0.5]
const SKIP_BYTES = 500 * 1024   // 이미 작은 JPG·PNG·WEBP는 다시 압축하지 않는다

type Drawable = ImageBitmap | HTMLImageElement

export function isHeic(file: File) {
    return /^image\/hei[cf](-sequence)?$/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
}

// 브라우저가 직접 읽을 수 있으면 그대로 연다 (아이폰 사파리는 HEIC도 읽는다). 못 읽으면 null
async function decode(blob: Blob): Promise<Drawable | null> {
    if ('createImageBitmap' in window) {
        try {
            return await createImageBitmap(blob, { imageOrientation: 'from-image' })   // 사진 회전 정보 반영
        } catch { /* 아래 img 방식으로 다시 시도 */ }
    }
    const url = URL.createObjectURL(blob)
    try {
        const img = new Image()
        img.src = url
        await img.decode()
        return img
    } catch {
        return null
    } finally {
        URL.revokeObjectURL(url)
    }
}

function toJpeg(canvas: HTMLCanvasElement, quality: number) {
    return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
}

// 긴 변을 maxSide 이하로 줄여 JPG로 저장. 그래도 크면 화질 -> 크기 순으로 더 줄인다
async function compress(image: Drawable): Promise<Blob> {
    const width = 'naturalWidth' in image ? image.naturalWidth : image.width
    const height = 'naturalHeight' in image ? image.naturalHeight : image.height
    let side = Math.min(MAX_SIDE, Math.max(width, height))
    let last: Blob | null = null
    while (side >= 400) {
        const scale = side / Math.max(width, height)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(width * scale)
        canvas.height = Math.round(height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) break
        ctx.fillStyle = '#ffffff'   // 투명한 PNG가 JPG에서 검게 나오지 않게
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        for (const quality of QUALITIES) {
            last = await toJpeg(canvas, quality)
            if (last && last.size <= MAX_BYTES) return last
        }
        side = Math.round(side * 0.8)
    }
    if (!last) throw new Error('사진을 변환하지 못했어요.')
    return last
}

// 고른 사진을 업로드용으로 정리한다. 실패하면 Error를 던진다 (사용자에게 다른 사진을 고르게)
export async function prepareImage(file: File): Promise<File> {
    const heic = isHeic(file)
    if (!heic && file.size <= SKIP_BYTES && /^image\/(jpeg|png|webp)$/i.test(file.type)) return file

    let image = await decode(file)
    if (!image && heic) {
        // 크롬 등 HEIC를 못 읽는 브라우저에서만 변환 라이브러리를 불러온다 (용량이 커서 필요할 때만)
        const { default: heic2any } = await import('heic2any')
        const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
        image = await decode(Array.isArray(converted) ? converted[0] : converted)
    }
    if (!image) throw new Error('지원하지 않는 사진 형식이에요. 다른 사진을 골라주세요.')

    const blob = await compress(image)
    if ('close' in image) image.close()
    const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
}
