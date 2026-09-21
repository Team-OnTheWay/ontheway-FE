import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfile from '../components/CustomProfile'
import CustomList from '../components/CustomList'
import CustomNavBar from '../components/CustomNavBar'
import { ThumbsUp, Truck, MapPinOutline, Edit, Megaphone, ChevronDown, ChevronRight, Logout } from '../components/CustomIcon'
import './CustomMyPage.css'
 
// 이 페이지 아이콘 공통 색
const ICON_COLOR = "#33363D"
 
function CustomMyPage() {
    return (
        <div className="mypage">
            <CustomTopAppBar variant="title" title="마이" />
 
            <div className="mypage__body">
                {/* 프로필 카드 — 펼침이 아니라 이동(오른쪽 화살표)이라 이 페이지에서 직접 구성 */}
                <button className="mypage__profile">
                    <CustomProfile width={16} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />
                    <div className="mypage__profile-text">
                        <p className="mypage__profile-name">하루</p>
                        <p className="mypage__profile-date">2026.09.08</p>
                    </div>
                    <ChevronRight />
                </button>
 
                {/* 후기 */}
                <div className="mypage__section">
                    <CustomList variant="list03" label="후기" />
                    <CustomList variant="list01" label="후기 관리" icon={<ThumbsUp />} />
                </div>
 
                {/* FAQ */}
                <div className="mypage__section">
                    <CustomList variant="list03" label="FAQ" />
                    <CustomList variant="list01" label="배송의뢰" icon={<Truck stroke={ICON_COLOR} />} trailing={<ChevronDown />} />
                    <CustomList variant="list01" label="이동경로" icon={<MapPinOutline stroke={ICON_COLOR} />} trailing={<ChevronDown />} />
                    <CustomList variant="list01" label="의뢰 수정" icon={<Edit />} trailing={<ChevronDown />} />
                    <CustomList variant="list01" label="배송 중단" icon={<Megaphone stroke={ICON_COLOR} />} trailing={<ChevronDown />} />
                </div>
 
                {/* 계정관리 */}
                <div className="mypage__section">
                    <CustomList variant="list03" label="계정관리" />
                    <CustomList variant="list01" label="로그아웃" trailing={<Logout />} />
                    <CustomList variant="list01" label="회원탈퇴" />
                </div>
            </div>
 
            <CustomNavBar initialActive="my" />
        </div>
    )
}
 
export default CustomMyPage