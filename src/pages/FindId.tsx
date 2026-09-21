import './FindId.css'
import TextField from '../components/TextField.tsx'
import CustomButton from '../components/CustomButton.tsx'
import CustomTopAppBar from '../components/CustomTopAppBar'

function FindId(){
    return(
        <>
        <div className="find-id-page">
            <CustomTopAppBar
            variant="large"
            title="아이디 찾기"
            subtitle="가입하신 아이디를 확인하실 수 있습니다."
            onBack={() => window.history.back()}
            />

            <div className='find-id-page-hug'>
                <div className="signup__row">
                    <TextField label="이메일" height={48} borderColor="lightGray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none" />
                    <div className="signup__side-btn">인증받기</div>
                </div>

                <TextField label="이메일 인증" height={48} borderColor="lightGray" backgroundColor="white"
                leftLocationIcon={false} placeholder="인증번호를 입력해주세요." timer={true}
                rightButton="label" rightButtonLabel="재전송" />

                <div className="find-id-button">
                    <CustomButton name="아이디 찾기" color="#fd5d35" fontColor="#ffffff" size="lg"/>
                </div>
            </div>
        </div>
        </>
    )
}

export default FindId