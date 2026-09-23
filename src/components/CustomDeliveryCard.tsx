import { Link, useNavigate } from 'react-router-dom';
import './CustomDeliveryCard.css'
import { Circle, MapPin, Calendar, FileText } from './CustomIcon'
import CustomRequestCount from './CustomRequestCount'

interface CustomDeliveryCard {
    id:number;
    count?: number;   // 없으면 요청 뱃지를 숨긴다
    startAddr: string;
    endAddr: string;
    date: string;
    startTime: string;
    endTime?: string;
    price: string;
    review?: boolean;
}

function CustomDeliveryCard({ id, count, startAddr, endAddr, date, startTime, endTime, price, review=false }: CustomDeliveryCard) {
    const navigate = useNavigate();

    return (
        <div className={`custom-delivery ${review ? 'review' : ''}`}> 
            <Link className='w-100' to={`/delivery/detail/${id}`}>
                {count !== undefined && <CustomRequestCount count={count} />}
                <div className="delivery-content">
                    <div className="delivery-route">
                        <div className="delivery-route-row">
                            <Circle width={20} height={20} stroke="#4576F7" />
                            <span className="delivery-address">{startAddr}</span>
                        </div>
                        <div className="delivery-route-line">
                            <span></span>
                        </div>
                        <div className="delivery-route-row">
                            <MapPin width={20} height={20} stroke="#FD5D35" />
                            <span className="delivery-address">{endAddr}</span>
                        </div>
                    </div>
                    <div className="delivery-info">
                        <div className="delivery-info-row">
                            <div className="delivery-info-label">
                                <Calendar width={14} height={14} />
                                <span>일정</span>
                            </div>
                            <span className="delivery-info-value">{date} {startTime}{endTime ? `~${endTime}` : ''}</span>
                        </div>
                        <div className="delivery-info-row">
                            <div className="delivery-info-label">
                                <FileText width={14} height={14} />
                                <span>희망금액</span>
                            </div>
                            <span className="delivery-info-value">{price}원</span>
                        </div>
                    </div>
                </div>
            </Link>
            {review && <button onClick={() => navigate(`/review/write?boardId=${id}`)} className="delivery-review-button">후기 작성하기</button>}
        </div>
    )
}

export default CustomDeliveryCard