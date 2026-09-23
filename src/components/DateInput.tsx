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

  // 달력 아이콘이나 칸을 누르면 브라우저 날짜 선택창을 연다
  const openPicker = () => {
    const picker = pickerRef.current
    if (!picker || props.disabled) return
    try {
      picker.showPicker()
    } catch {
      picker.click()   // showPicker 를 지원하지 않는 브라우저
    }
  }

  return (
    <div className="date-input">
      {props.label && <p className="date-input__label">{props.label}</p>}
      <div className="date-input-box" style={{ borderColor: colors[props.borderColor] }}>
        <input type="text" placeholder="YYYY.MM.DD" defaultValue={props.defaultValue} value={props.value} onChange={props.onChange} disabled={props.disabled} readOnly={props.disabled || (props.value !== undefined && !props.onChange)}/>
        <button type="button" className="calendar-icon" onClick={openPicker} disabled={props.disabled} aria-label="달력에서 날짜 선택">
          <Calendar width={20} height={20} stroke="#6B7280" />
        </button>
        {/* 화면에 보이지 않는 날짜 선택창. 고른 값(YYYY-MM-DD)은 위 칸과 같은 onChange 로 전달 */}
        <input
          ref={pickerRef}
          type="date"
          className="date-input__picker"
          tabIndex={-1}
          aria-hidden="true"
          value={toPickerValue(props.value ?? props.defaultValue)}
          onChange={(e) => props.onChange?.(e)}
          disabled={props.disabled}
        />
      </div>
    </div>
  )
}

export default DateInput
