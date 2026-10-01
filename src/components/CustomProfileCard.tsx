import { useState, type ReactNode } from 'react';
import './CustomProfileCard.css'
import { Arrow } from './CustomIcon';

interface CustomProfileCard {
    nickname: string;
    date: string;
    rateing: number;
    review: number;
    chipElement?: ReactNode;
    profileElement: ReactNode;
    onClick?: () => void;
    expandable?: boolean;   // false면 펼침 화살표를 숨긴다 (예: 유저 신고 화면)
}

function CustomProfileCard({ nickname, date, rateing, review, chipElement, profileElement, onClick, expandable = true }: CustomProfileCard) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClickArrow = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="custom-profile-card">
            {/* 칩은 넘겨줬을 때만 표시 */}
            {chipElement && <div className="custom-profile-card-title">{chipElement}</div>}

            <div className="custom-profile-card-content">
                <div className="content-profile">{profileElement}</div>

                <div className="profile-info">
                    <div className="nickname">{nickname}</div>
                    <div className="date">{date}</div>
                    {/* 화살표 누르면 평균·후기가 바로 밑에 한 줄로 */}
                    {isOpen && (
                        <div className="profile-details">
                            <span className="rating">평균 {Number(rateing).toFixed(1)}</span>
                            <span className="review">후기 {review}건</span>
                        </div>
                    )}
                </div>

                {/* 오른쪽 열: 화살표(위) + 신고(아래) */}
                {expandable && <div className="content-right">
                    <button
                        className={`content-arrow ${isOpen ? 'rotated' : ''}`}
                        onClick={handleClickArrow}
                        aria-label="더보기"
                    >
                        <Arrow width={48} height={48} strokeWidth={2} />
                    </button>
                    {/* 신고할 동작(onClick)을 넘겨줬을 때만 표시 (내 글 등에서는 숨김) */}
                    {isOpen && onClick && <span onClick={onClick} className="profile-report">신고</span>}
                </div>}
            </div>
        </div>
    )
}

export default CustomProfileCard