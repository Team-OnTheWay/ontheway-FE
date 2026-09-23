import { useEffect, useMemo, useRef, useState } from 'react'
import type { MyInfo } from '../hooks/useMyInfo'
import { useNavigate } from 'react-router-dom'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfile from '../components/CustomProfile'
import TextField from '../components/TextField'
import DateInput from '../components/DateInput'
import CustomButton from '../components/CustomButton'
import './CustomProfileEditPage.css'
import CustomDiv from '../components/CustomDiv';
import { CameraIcon } from '../components/CustomIcon'
import { User } from '../api/User'
import { Email } from '../api/Email'
import { useMyInfo } from '../hooks/useMyInfo'
import { errorMessage, formatDate, parseDateInput } from '../utils/apiFormat'

function CustomProfileEditPage() {
    const navigate = useNavigate()
    const { info } = useMyInfo()

    const [birthday, setBirthday] = useState('')
    const [email, setEmail] = useState('')
    const [emailCode, setEmailCode] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [timerKey, setTimerKey] = useState(0)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickName, setNickName] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    // 내 정보를 처음 받았을 때 칸 채우기 (렌더 중에 한 번만)
    const [filledFrom, setFilledFrom] = useState<MyInfo | null>(null)
    if (info && info !== filledFrom) {
        setFilledFrom(info)
        setBirthday(formatDate(info.birthday))
        setEmail(info.email)
        setNickName(info.nickName)
    }

    // 고른 사진 미리보기
    const preview = useMemo(() => image ? URL.createObjectURL(image) : null, [image])
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const emailChanged = !!info && email.trim() !== info.email
    const passwordOk = newPassword.length === 0 || (newPassword.length >= 8 && newPassword.length <= 15)
    const passwordMatch = newPassword.length > 0 && newPassword === confirmPassword

    // 이메일을 바꾸려면 새 이메일 인증이 먼저 필요하다
    const sendEmailCode = async () => {
        if (!emailChanged) return alert('변경할 이메일을 입력해주세요.')
        try {
            await new Email().sendCode({ email: email.trim(), purpose: 'CHANGE_EMAIL' })
            setEmailSent(true)
            setEmailVerified(false)
            setTimerKey(key => key + 1)
            alert('인증번호가 전송되었습니다. 이메일을 확인해주세요.')
        } catch (error) {
            alert(errorMessage(error, '인증번호 전송에 실패했어요.'))
        }
    }

    const verifyEmailCode = async () => {
        if (!emailCode.trim() || emailVerified) return
        try {
            await new Email().verifyCode({ email: email.trim(), authCode: emailCode, purpose: 'CHANGE_EMAIL' })
            setEmailVerified(true)
            alert('이메일 인증이 완료되었습니다.')
        } catch (error) {
            alert(errorMessage(error, '인증번호가 일치하지 않거나 만료되었습니다.'))
        }
    }

    // 바뀐 항목만 보낸다
    const handleSave = async () => {
        if (!info) return
        const dto: { nickName?: string; newPassword?: string; newEmail?: string; newBirthday?: string } = {}

        if (nickName.trim() && nickName.trim() !== info.nickName) {
            if (nickName.trim().length > 7) return alert('닉네임은 7자리 이내로 입력해주세요.')
            dto.nickName = nickName.trim()
        }
        const parsedBirthday = parseDateInput(birthday)
        if (birthday.trim() && !parsedBirthday) return alert('생년월일을 YYYY.MM.DD 형식으로 입력해주세요.')
        if (parsedBirthday && parsedBirthday !== info.birthday) dto.newBirthday = parsedBirthday
        if (emailChanged) {
            if (!emailVerified) return alert('변경할 이메일 인증을 먼저 완료해주세요.')
            dto.newEmail = email.trim()
        }
        if (newPassword) {
            if (!passwordOk) return alert('새 비밀번호는 8~15자리로 입력해주세요.')
            if (!passwordMatch) return alert('새 비밀번호가 일치하지 않아요.')
            dto.newPassword = newPassword
        }
        if (Object.keys(dto).length === 0 && !image) return alert('변경된 내용이 없어요.')

        setSaving(true)
        try {
            await new User().updateInfo({ dto, image: image ?? undefined })
            alert(dto.newPassword ? '수정되었습니다. 비밀번호가 바뀌어 다시 로그인이 필요할 수 있어요.' : '수정되었습니다.')
            navigate('/my/profile', { replace: true })
        } catch (error) {
            alert(errorMessage(error, '정보 수정에 실패했어요.'))
        } finally {
            setSaving(false)
        }
    }

    return (
        <CustomDiv backgroundColor='#FFFFFF'>
            <CustomTopAppBar variant="centered" title={info ? `${info.nickName}님의 프로필` : '프로필'} />

            <div className="profile__body">
                {/* 프로필 사진 + 카메라 배지 (누르면 사진 선택) */}
                <div className="profile__avatar">
                    {preview || info?.userImage
                        ? <img className="profile-edit__image" src={preview ?? info?.userImage ?? ''} alt="프로필 사진" />
                        : <CustomProfile width={36} height={45} strok="#FD5D35" strokWidth={2} diameter={90} backgroundColor="#FEF1ED" />}
                    <button className="profile__camera" aria-label="사진 변경" onClick={() => fileRef.current?.click()}>
                        <CameraIcon />
                    </button>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden
                        onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                </div>

                {/* 아이디 (수정 불가) */}
                <TextField label="아이디" height={56} borderColor="none" backgroundColor="gray"
                    leftLocationIcon={false} placeholder="아이디" timer={false} rightButton="none"
                    value={info?.userId ?? ''} disabled />

                <DateInput label="생년월일" borderColor="gray" value={birthday} onChange={(e) => setBirthday(e.target.value.replace(/-/g, '.'))} />

                {/* 이메일 + 인증받기 (이메일을 바꿀 때만) */}
                <div className="profile__row">
                    <TextField label="이메일" height={56} borderColor="gray" backgroundColor="white"
                        leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none"
                        value={email} disabled={emailVerified}
                        onChange={(e) => { setEmail(e.target.value); setEmailSent(false); setEmailVerified(false) }} />
                    <div className="profile-edit__side-btn" onClick={sendEmailCode}>{emailSent ? '재전송' : '인증받기'}</div>
                </div>
                {emailSent && (
                    <TextField label="이메일 인증" height={56} borderColor="gray" backgroundColor="white"
                        leftLocationIcon={false} placeholder="인증번호를 입력해주세요." timer={!emailVerified} resetKey={timerKey}
                        rightButton="label" rightButtonLabel={emailVerified ? '확인완료' : '인증'}
                        rightButtonColor={emailVerified ? '#9CA3AF' : '#FD5D35'} rightButtonDisabled={emailVerified}
                        value={emailCode} disabled={emailVerified}
                        onRightButtonClick={verifyEmailCode}
                        onChange={(e) => setEmailCode(e.target.value)} />
                )}

                {/* 새 비밀번호 (바꿀 때만 입력) */}
                <TextField label="새 비밀번호" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="새 비밀번호를 입력해주세요." timer={false} rightButton="eye"
                    helperText={newPassword && passwordOk ? '8~15자리 이내' : undefined}
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                <TextField label="새 비밀번호 확인" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="새 비밀번호를 한 번 더 입력해주세요." timer={false} rightButton="eye"
                    helperText={passwordMatch ? '비밀번호 일치' : undefined}
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <TextField label="닉네임" height={56} borderColor="gray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="닉네임을 입력해주세요." timer={false} rightButton="none"
                    helperText={nickName.trim() && nickName.trim().length <= 7 ? '7자리 이내' : undefined}
                    value={nickName} onChange={(e) => setNickName(e.target.value)} />
            </div>

            <div className="profile__footer">
                <CustomButton name={saving ? '저장 중...' : '수정하기'} color="#fd5d35" fontColor="#ffffff" size="lg" onClick={saving ? undefined : handleSave} />
            </div>
        </CustomDiv>
    )
}

export default CustomProfileEditPage
