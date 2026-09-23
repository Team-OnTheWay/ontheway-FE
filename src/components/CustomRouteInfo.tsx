import './CustomRouteInfo.css'
import CustomList from './CustomList'
import { Circle, MapPin, Calendar, Wallet } from './CustomIcon'
 
interface CustomRouteInfoProps {
    startAddr: string;
    startDetail?: string;
    endAddr: string;
    endDetail?: string;
    date: string;
    time: string;
    price: string;
    priceLabel?: string;   // 기본 '희망금액' (물품 게시글은 '배송비')
}
 
function CustomRouteInfo({ startAddr, startDetail, endAddr, endDetail, date, time, price, priceLabel = '희망금액' }: CustomRouteInfoProps) {
    return (
        <div className="route-info">
            <CustomList variant="list03" label="경로정보" />
 
            <div className="route-info__route">
                <div className="route-info__stop">
                    <div className="route-info__marker">
                        <Circle width={24} height={24} stroke="#4576F7" />
                        <span className="route-info__line"></span>
                    </div>
                    <div className="route-info__address">
                        <p className="route-info__addr-main">{startAddr}</p>
                        {startDetail && <p className="route-info__addr-sub">{startDetail}</p>}
                    </div>
                </div>
 
                <div className="route-info__stop">
                    <div className="route-info__marker">
                        <MapPin width={24} height={24} stroke="#FD5D35" />
                    </div>
                    <div className="route-info__address">
                        <p className="route-info__addr-main">{endAddr}</p>
                        {endDetail && <p className="route-info__addr-sub">{endDetail}</p>}
                    </div>
                </div>
            </div>
 
            <div className="route-info__meta">
                <div className="route-info__meta-item">
                    <Calendar width={20} height={20} />
                    <div className="route-info__meta-text">
                        <p className="route-info__meta-label">배송가는 날</p>
                        <p className="route-info__meta-value">{date}</p>
                        <p className="route-info__meta-time">{time}</p>
                    </div>
                </div>
 
                <span className="route-info__divider"></span>
 
                <div className="route-info__meta-item">
                    <Wallet width={20} height={20} />
                    <div className="route-info__meta-text">
                        <p className="route-info__meta-label">{priceLabel}</p>
                        <p className="route-info__meta-value">{price}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default CustomRouteInfo