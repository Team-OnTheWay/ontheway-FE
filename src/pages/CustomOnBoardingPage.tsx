import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomOnboardingImage from '../components/CustomOnboardingImage'
import CustomButton from '../components/CustomButton'
import CustomDiv from '../components/CustomDiv'
import './CustomOnBoardingPage.css'

const SLIDES = [
    { step: 1, title: '매일 가는 길을 등록해요', description: '평소 이동하는 경로를 등록하고 물품을 전달해 보세요.' },
    { step: 2, title: '가는 길에 배송을 시작해요', description: '등록한 경로를 따라 이동하며 물품을 전달해 보세요.' },
    { step: 3, title: '가는 길에 가볍게 전달해요', description: '이동하는 길에 작은 물품을 전달하고 배송을 완료해 보세요.' },
] as const

const SWIPE_THRESHOLD = 60 // 이 거리(px) 이상 밀어야 다음/이전 슬라이드로 넘어갑니다.

function CustomOnBoardingPage() {
    const navigate = useNavigate()
    const [index, setIndex] = useState(0)
    const [dragX, setDragX] = useState(0)
    const [dragging, setDragging] = useState(false)
    const startX = useRef(0)

    const isLast = index === SLIDES.length - 1

    const goTo = (next: number) => {
        setIndex(Math.max(0, Math.min(SLIDES.length - 1, next)))
    }

    // 터치·마우스 드래그 모두 pointer 이벤트로 처리
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        startX.current = e.clientX
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging) return
        let dx = e.clientX - startX.current
        // 첫/마지막 슬라이드 바깥으로는 덜 밀리게
        if ((index === 0 && dx > 0) || (isLast && dx < 0)) dx /= 3
        setDragX(dx)
    }

    const handlePointerUp = () => {
        if (!dragging) return
        if (dragX < -SWIPE_THRESHOLD) goTo(index + 1)
        else if (dragX > SWIPE_THRESHOLD) goTo(index - 1)
        setDragging(false)
        setDragX(0)
    }

    const footer = (
        <div className="onboarding-page__footer">
            <CustomButton name="시작하기" color="#fd5d35" fontColor="#ffffff" size="lg" onClick={() => navigate('/agree')} />
            <div className="onboarding-page__login">
                이미 계정이 있나요?
                <Link to={'/login'}>로그인</Link>
            </div>
        </div>
    )

    return (
        <CustomDiv footerElement={footer} pullToRefresh={false}>
            <div className="onboarding-page">
                <div
                    className="onboarding-page__viewport"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div
                        className={`onboarding-page__track${dragging ? ' onboarding-page__track--dragging' : ''}`}
                        style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
                    >
                        {SLIDES.map((slide) => (
                            <div className="onboarding-page__slide" key={slide.step}>
                                <div className={`onboarding-page__image onboarding-page__image--${slide.step}`}>
                                    <CustomOnboardingImage step={slide.step} />
                                </div>
                                <div className="onboarding-page__text">
                                    <strong className="onboarding-page__title">{slide.title}</strong>
                                    <p className="onboarding-page__description">{slide.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="onboarding-page__dots">
                    {SLIDES.map((slide, i) => (
                        <button
                            type="button"
                            key={slide.step}
                            className={`onboarding-page__dot${i === index ? ' onboarding-page__dot--active' : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`${i + 1}번째 슬라이드`}
                        />
                    ))}
                </div>
            </div>
        </CustomDiv>
    )
}

export default CustomOnBoardingPage
