import CustomTopAppBar from '../components/CustomTopAppBar'
import TextField from '../components/TextField'
import DateInput from '../components/DateInput'
import CustomButton from '../components/CustomButton'
import './CustomSignUpPage.css'
import CustomDiv from '../components/CustomDiv'
import { User } from '../api/User'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Email } from '../api/Email'
 
function CustomSignupPage() {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');
    const [email, setEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timerKey, setTimerKey] = useState(0);

    const isIdValidForCheck = id.trim().length > 0;
    const isEmailValidForSend = email.trim().length > 0 && !isEmailVerified;
    const isFormValid = 
        isIdChecked &&
        isEmailVerified &&
        name.trim().length > 0 &&
        birth.trim().length > 0 &&
        password.length >= 8 && password.length <= 15 &&
        password === passwordConfirm &&
        nickname.trim().length > 0 && nickname.length <= 7;

    const handleCheckId = async () => {
        if (!isIdValidForCheck) return;
        try {
            const userApi = new User();
            await userApi.checkId({ userId: id });
            alert('사용 가능한 아이디입니다.');
            setIsIdChecked(true);
        } catch (error) {
            console.error('중복 확인 실패', error);
            alert('이미 사용 중인 아이디입니다.');
        }
    };

    const handleSendEmailCode = async () => {
        if (!isEmailValidForSend) return;
        try {
            const emailApi = new Email();
            await emailApi.sendCode({ email: email, purpose: 'SIGN_UP' });
            if (!isEmailSent) {
                setIsEmailSent(true);
                alert('인증번호가 전송되었습니다. 이메일을 확인해주세요.');
            } else {
                setTimerKey(prev => prev + 1);
                alert('인증번호가 재전송되었습니다.');
            }
        } catch (error) {
            console.error('이메일 전송 실패', error);
            alert('이메일 전송에 실패했습니다.');
        }
    };

    const handleVerifyEmailCode = async () => {
        if (!authCode.trim() || isEmailVerified) return;
        try {
            const emailApi = new Email();
            await emailApi.verifyCode({ email: email, authCode: authCode, purpose: "SIGN_UP" });
            alert('이메일 인증이 완료되었습니다.');
            setIsEmailVerified(true);
        } catch (error) {
            console.error('인증 실패', error);
            alert('인증번호가 일치하지 않거나 만료되었습니다.');
        }
    };

    const handleSignUp = async () => {
        if (!isFormValid) return;

        try {
            const userApi = new User();
            await userApi.signUp({
                userId: id,
                userName: name,
                birthday: birth,
                email: email,
                password: password,
                nickName: nickname,
            });

            alert('회원가입이 완료되었습니다!');
            navigate('/login');
        } catch (error) {
            console.error('회원가입 실패', error);
            alert('회원가입에 실패했습니다. 입력한 정보를 확인해주세요.');
        }
    };

    return (
        <CustomDiv>
            <CustomTopAppBar variant="large" title="회원가입" />
 
            <div className="signup__body">
                {/* 아이디 + 중복확인 */}
                <div className="signup__row">
                    <TextField label="아이디" height={56} borderColor="gray" backgroundColor="white"
                        leftLocationIcon={false} placeholder="아이디를 입력해주세요." timer={false} rightButton="none" 
                        value={id}
                        disabled={isIdChecked} // 중복확인 완료되면 아이디 수정 잠금 (선택사항)
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setId(e.target.value);
                            setIsIdChecked(false);
                        }}/>
                    <div 
                        className={`signup__side-btn ${!isIdValidForCheck || isIdChecked ? 'disabled' : ''}`} 
                        onClick={isIdValidForCheck && !isIdChecked ? handleCheckId : undefined}
                    >
                        {isIdChecked ? '확인완료' : '중복확인'}
                    </div>
                </div>
 
                {/* 이름 */}
                <TextField label="이름" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="이름을 입력해주세요." timer={false} rightButton="none" 
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
 
                {/* 생년월일 */}
                <DateInput label="생년월일" borderColor="gray" value={birth} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '');
                        let formattedValue = '';

                        if (rawValue.length <= 4) {
                            formattedValue = rawValue;
                        } else if (rawValue.length <= 6) {
                            formattedValue = `${rawValue.slice(0, 4)}-${rawValue.slice(4)}`;
                        } else {
                            formattedValue = `${rawValue.slice(0, 4)}-${rawValue.slice(4, 6)}-${rawValue.slice(6, 10)}`;
                        }

                        setBirth(formattedValue);
                    }}/>
 
                {/* 이메일 + 인증받기 */}
                <div className="signup__row">
                    <TextField label="이메일" height={56} borderColor="gray" backgroundColor="white"
                        leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none" 
                        value={email}
                        disabled={isEmailVerified} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(e.target.value);
                            setIsEmailSent(false); 
                            setIsEmailVerified(false);
                        }}/>
                    <div 
                        className={`signup__side-btn ${!isEmailValidForSend ? 'disabled' : ''}`} 
                        onClick={isEmailValidForSend ? handleSendEmailCode : undefined}
                    >
                        {isEmailVerified ? '인증완료' : (isEmailSent ? '재전송' : '인증받기')}
                    </div>
                </div>
 
                {/* 이메일 인증번호 입력창 */}
                {isEmailSent && (
                    <TextField 
                        label="이메일 인증" 
                        height={56} 
                        borderColor="gray" 
                        backgroundColor="white"
                        leftLocationIcon={false} 
                        placeholder={isEmailVerified ? "인증이 완료되었습니다." : "인증번호를 입력해주세요."} 
                        timer={!isEmailVerified}
                        resetKey={timerKey}
                        rightButton="label" 
                        rightButtonLabel={isEmailVerified ? '확인완료' : '인증'} 
                        rightButtonColor={isEmailVerified ? '#9CA3AF' : '#FD5D35'}
                        rightButtonDisabled={isEmailVerified}
                        value={authCode}
                        disabled={isEmailVerified} 
                        onRightButtonClick={handleVerifyEmailCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
                    />
                )}
 
                {/* 비밀번호 */}
                <TextField label="비밀번호" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="비밀번호를 입력해주세요." timer={false} rightButton="eye"
                    helperText="8~15자리 이내" 
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
 
                {/* 비밀번호 확인 */}
                <TextField label="비밀번호 확인" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="비밀번호를 다시 입력해주세요." timer={false} rightButton="eye"
                    helperText="비밀번호 일치" 
                    value={passwordConfirm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}/>
 
                {/* 닉네임 */}
                <TextField label="닉네임" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="닉네임을 입력해주세요." timer={false} rightButton="none"
                    helperText="7자리 이내" 
                    value={nickname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}/>
            </div>
 
            <div className="signup__footer">
                {/* 조건이 충족되지 않으면 클릭을 막고 색상을 비활성화 처리 */}
                <div style={{ opacity: isFormValid ? 1 : 0.6, cursor: isFormValid ? 'pointer' : 'not-allowed' }}>
                    <CustomButton 
                        name="다음으로" 
                        color={isFormValid ? "#fd5d35" : "#D7DAE0"} 
                        fontColor="#ffffff" 
                        size="lg" 
                        onClick={isFormValid ? handleSignUp : undefined}
                    />
                </div>
            </div>
        </CustomDiv>
    )
}
 
export default CustomSignupPage