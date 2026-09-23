import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfile from '../components/CustomProfile'
import TextField from '../components/TextField'
import DateInput from '../components/DateInput'
import CustomButton from '../components/CustomButton'
import './CustomProfilePage.css'
import CustomDiv from '../components/CustomDiv'
import { useNavigate } from 'react-router-dom'
import { useMyInfo } from '../hooks/useMyInfo'
import { formatDate } from '../utils/apiFormat'
 
// 내 프로필 조회 (수정은 '수정하기' 화면에서)
function CustomProfilePage() {
    const navigate = useNavigate();
    const { info } = useMyInfo();

    return (
        <CustomDiv backgroundColor='#FFFFFF'>
            <CustomTopAppBar variant="centered" title={info ? `${info.nickName}님의 프로필` : '프로필'} />
 
            <div className="profile__body">
                <div className="profile__avatar">
                    {info?.userImage
                        ? <img className="profile__image" src={info.userImage} alt="프로필 사진" />
                        : <CustomProfile width={36} height={45} strok="#FD5D35" strokWidth={2} diameter={90} backgroundColor="#FEF1ED" />}
                </div>
 
                <TextField label="아이디" height={56} borderColor="none" backgroundColor="gray"
                    leftLocationIcon={false} placeholder="아이디" timer={false} rightButton="none"
                    value={info?.userId ?? ''} disabled />
 
                <DateInput label="생년월일" borderColor="gray" value={formatDate(info?.birthday)} disabled />
 
                <TextField label="이메일" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="이메일" timer={false} rightButton="none"
                    value={info?.email ?? ''} disabled />
 
                <TextField label="닉네임" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="닉네임" timer={false} rightButton="none"
                    value={info?.nickName ?? ''} disabled />
            </div>
 
            <div className="profile__footer">
                <CustomButton name="수정하기" color="#fd5d35" fontColor="#ffffff" size="lg" onClick={() => navigate('/my/profile/edit')}/>
            </div>
        </CustomDiv>
    )
}
 
export default CustomProfilePage
