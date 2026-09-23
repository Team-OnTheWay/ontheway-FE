import CustomLogo from '../components/CustomLogo'
import TextField from '../components/TextField'
import CustomCheckbox from '../components/CustomCheckbox'
import CustomButton from '../components/CustomButton'
import './CustomLoginPage.css'
import { Link, useNavigate } from 'react-router-dom'
import CustomDiv from '../components/CustomDiv'
import { useAuthStore } from '../store/useAuthStore'
import { useState } from 'react'
import axios from 'axios'
 
function CustomLoginPage() {
    const navigate = useNavigate();
    const setLogin = useAuthStore((state) => state.setLogin);

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_LOGIN_HOST_URL}/user/login`, { accountId: id, password });
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            setLogin(accessToken, refreshToken);
            navigate('/');
        } catch (error) {
            alert('로그인 실패');
            console.error('로그인 실패', error);
        }
    };

    return (
        <CustomDiv>
            <div style={{display:'flex', justifyContent:'center'}}>
                <CustomLogo className="login-page__logo" />
            </div>
        
            <div style={{display:'flex', flexDirection:'column', padding:'0px 16px'}}>
                <div className="login-page__id">
                    <TextField
                        label="아이디"
                        height={56}
                        borderColor="lightGray"
                        backgroundColor="white"
                        leftLocationIcon={false}
                        placeholder="아이디를 입력해주세요."
                        timer={false}
                        value={id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
                        rightButton="none"
                    />
                </div>
    
                <div className="login-page__pw">
                    <TextField
                        label="비밀번호"
                        height={56}
                        borderColor="lightGray"
                        backgroundColor="white"
                        leftLocationIcon={false}
                        placeholder="비밀번호를 입력해주세요."
                        timer={false}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        rightButton="eye"
                    />
                </div>
    
                <div className="login-page__auto">
                    <CustomCheckbox label="자동로그인" size="sm" />
                </div>
    
                <div className="login-page__button">
                    <CustomButton name="로그인" color="#fd5d35" fontColor="#ffffff" size="lg" onClick={handleLoginSubmit}/>
                </div>
    
                <div className="login-page__links">
                    <div className="login-page__links">
                        <Link to={'/find/id'}>아이디 찾기</Link>
                        <span className="login-page__divider"></span>
                        <Link to={'/find/pw'}>비밀번호 찾기</Link>
                        <span className="login-page__divider"></span>
                        <Link to={'/agree'}>회원가입</Link>
                    </div>
                </div>
            </div>
        </CustomDiv>
    )
}
 
export default CustomLoginPage