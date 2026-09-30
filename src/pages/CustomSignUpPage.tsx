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
import { useSignupDraft } from '../store/useSignupDraft'
 
function CustomSignupPage() {
    const navigate = useNavigate();

    // 약관동의에서 뒤로 돌아오면 입력했던 값을 그대로 채운다
    const { draft, setDraft } = useSignupDraft();

    const [id, setId] = useState(draft?.id ?? '');
    const [name, setName] = useState(draft?.name ?? '');
    const [birth, setBirth] = useState(draft?.birth ?? '');
    const [email, setEmail] = useState(draft?.email ?? '');
    const [authCode, setAuthCode] = useState('');
    const [password, setPassword] = useState(draft?.password ?? '');
    const [passwordConfirm, setPasswordConfirm] = useState(draft?.passwordConfirm ?? '');
    const [nickname, setNickname] = useState(draft?.nickname ?? '');
    
    const [isIdChecked, setIsIdChecked] = useState(draft?.isIdChecked ?? false);
    const [isEmailSent, setIsEmailSent] = useState(draft?.isEmailVerified ?? false);
    const [isEmailVerified, setIsEmailVerified] = useState(draft?.isEmailVerified ?? false);
    const [timerKey, setTimerKey] = useState(0);

    const isIdValidForCheck = id.trim().length > 0;
    const isEmailValidForSend = email.trim().length > 0 && !isEmailVerified;
    // 비밀번호·비밀번호 확인·닉네임 조건 (도움말: 충족 전 회색, 충족하면 주황)
    const isPasswordOk = password.length >= 8 && password.length <= 15;
    const isPasswordMatch = passwordConfirm.length > 0 && password === passwordConfirm;
    const isNicknameOk = nickname.trim().length > 0 && nickname.length <= 7;
    const isFormValid = 
        isIdChecked &&
        isEmailVerified &&
        name.trim().length > 0 &&
        birth.trim().length > 0 &&
        isPasswordOk &&
        isPasswordMatch &&
        isNicknameOk;

    const handleCheckId = async () => {
        if (!isIdValidForCheck) return;
        try {
            const userApi = new User();
            const res = await userApi.checkId({ userId: id });
            // 서버는 중복이어도 성공(200)으로 답하고 data.exist 로 알려준다
            if ((res.data.data as { exist?: boolean } | undefined)?.exist) {
                alert('이미 사용 중인 아이디입니다.');
                return;
            }
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

    // 가입 요청은 약관동의에서 보낸다 (회원가입 -> 약관동의 순서)
    const handleNext = () => {
        if (!isFormValid) return;
        setDraft({ id, name, birth, email, password, passwordConfirm, nickname, isIdChecked, isEmailVerified });
        navigate('/agree');
    };

    return (
        <CustomDiv pullToRefresh={false}>
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
 
                {/* 이메일 인증번호 입력창 + 인증 버튼 (피그마: 인증 버튼은 위 재전송 버튼과 같은 크기) */}
                {isEmailSent && (
                    <div className="signup__row">
                        <TextField 
                            label="이메일 인증" 
                            height={56} 
                            borderColor="gray" 
                            backgroundColor="white"
                            leftLocationIcon={false} 
                            placeholder={isEmailVerified ? "인증이 완료되었습니다." : "인증번호를 입력해주세요."} 
                            timer={!isEmailVerified}
                            resetKey={timerKey}
                            rightButton="none" 
                            value={authCode}
                            disabled={isEmailVerified} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
                        />
                        <div 
                            className={`signup__side-btn ${isEmailVerified || !authCode.trim() ? 'disabled' : ''}`} 
                            onClick={!isEmailVerified && authCode.trim() ? handleVerifyEmailCode : undefined}
                        >
                            {isEmailVerified ? '확인완료' : '인증'}
                        </div>
                    </div>
                )}
 
                {/* 비밀번호 */}
                <TextField label="비밀번호" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="비밀번호를 입력해주세요." timer={false} rightButton="eye"
                    helperText="8~15자리 이내" helperActive={isPasswordOk}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
 
                {/* 비밀번호 확인 */}
                <TextField label="비밀번호 확인" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="비밀번호를 다시 입력해주세요." timer={false} rightButton="eye"
                    helperText="비밀번호 일치" helperActive={isPasswordMatch}
                    value={passwordConfirm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}/>
 
                {/* 닉네임 */}
                <TextField label="닉네임" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="닉네임을 입력해주세요." timer={false} rightButton="none"
                    helperText="7자리 이내" helperActive={isNicknameOk}
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
                        onClick={isFormValid ? handleNext : undefined}
                    />
                </div>
            </div>
        </CustomDiv>
    )
}
 
export default CustomSignupPage