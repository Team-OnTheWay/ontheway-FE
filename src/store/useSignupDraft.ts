import { create } from 'zustand'

// 회원가입 입력값 (회원가입 -> 약관동의로 넘겨서, 약관동의에서 가입 요청을 보낸다)
export interface SignupDraft {
    id: string
    name: string
    birth: string
    email: string
    password: string
    passwordConfirm: string
    nickname: string
    isIdChecked: boolean
    isEmailVerified: boolean
}

interface SignupDraftState {
    draft: SignupDraft | null
    setDraft: (draft: SignupDraft) => void
    clear: () => void
}

// 비밀번호가 들어 있어서 localStorage 등에 저장하지 않고 메모리에만 둔다
// (약관동의에서 뒤로 가도 입력값이 남고, 새로고침하면 사라진다)
export const useSignupDraft = create<SignupDraftState>()((set) => ({
    draft: null,
    setDraft: (draft) => set({ draft }),
    clear: () => set({ draft: null }),
}))
