import './FindPw.css'

import TextField from '../components/TextField.tsx'
import CustomButton from '../components/CustomButton.tsx'
import CustomTopAppBar from '../components/CustomTopAppBar'

function FindPw(){
    return(
        <>
        <div className="find-pw-page">
            <CustomTopAppBar
                title="비밀번호 찾기"
                variant="large"
                subtitle="가입하신 비밀번호를 확인하실 수 있습니다."
                onBack={() => window.history.back()}
                />
            <div className='find-pw-page-hug'>
                
            

                <div className="email-input">
                    <TextField label="아이디" height={48} borderColor="lightGray" backgroundColor="white" leftLocationIcon={false} placeholder="아이디를 입력해주세요." timer={false} rightButton="none" />
                </div>
                <div className="email-input">
                    <TextField label="이메일" height={48} borderColor="lightGray" backgroundColor="white" leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none" />
                </div>
                <div className="find-pw-button">
                    <CustomButton name="비밀번호 찾기"color="#fd5d35"fontColor="#ffffff"size="lg"/>
                </div>
            </div>

            </div>
            </>
    )
}

export default FindPw