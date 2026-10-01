import { useRef } from 'react'
import './DateInput.css'
import { Calendar } from './CustomIcon'

const colors = {
  lightGray: '#F2F2F2',
  gray: '#D7DAE0',
  orange: '#FD5D35',
  none: 'transparent',
  white: '#FFFFFF',
}


type DateInputProps = {
  label?: string
  borderColor: 'lightGray' | 'gray' | 'orange'
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

// "2003.09.02" / "2003-09-02" / "20030902" -> 달력에 넣을 "2003-09-02" (못 읽으면 빈 값)
function toPickerValue(text?: string) {
  const match = text?.match(/^(\d{4})\D?(\d{2})\D?(\d{2})/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : ''
}

function DateInput(props: DateInputProps) {
  const pickerRef = useRef<HTMLInputElement>(null)

  // 달력 아이콘 위에 겹친 실제 날짜 입력칸을 사용자가 "직접" 누르므로 모바일(iOS 사파리 등)에서도 선택창이 열린다.
  // PC 크롬은 칸 자체를 눌러도 선택창이 안 열려서, 눌렀을 때 showPicker 로 한 번 더 연다 (지원 안 하면 무시)
  const openPicker = () => {
    const picker = pickerRef.current
    if (!picker || props.disabled) return
    try {
      picker.showPicker()
    } catch {
      // 기본 동작(직접 누름)으로 열리는 브라우저
    }
  }

  return (
    <div className="date-input">
      {props.label && <p className="date-input__label">{props.label}</p>}
      <div className="date-input-box" style={{ borderColor: colors[props.borderColor] }}>
        <input type="text" placeholder="YYYY-MM-DD" defaultValue={props.defaultValue} value={props.value} onChange={props.onChange} disabled={props.disabled} readOnly={props.disabled || (props.value !== undefined && !props.onChange)}/>
        {/* 달력 아이콘(보이는 부분) + 그 위에 투명하게 겹친 실제 날짜 입력칸(누르는 부분).
            고른 값(YYYY-MM-DD)은 위 글자 칸과 같은 onChange 로 전달 */}
        <span className="calendar-icon" aria-hidden="true">
          <Calendar width={20} height={20} stroke="#6B7280" />
        </span>
        <input
          ref={pickerRef}
          type="date"
          className="date-input__picker"
          aria-label="달력에서 날짜 선택"
          value={toPickerValue(props.value ?? props.defaultValue)}
          onChange={(e) => props.onChange?.(e)}
          onClick={openPicker}
          disabled={props.disabled}
        />
      </div>
    </div>
  )
}

export default DateInput
