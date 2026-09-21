import { useRef, useState } from 'react'
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
}

function DateInput(props: DateInputProps) {
  const [date, setDate] = useState(props.defaultValue ?? '')
  const dateRef = useRef<HTMLInputElement>(null)

  return (
    <div className="date-input">
      {props.label && <p className="date-input__label">{props.label}</p>}
      <div className="date-input-box" style={{ borderColor: colors[props.borderColor] }}>
        <input type="text" placeholder="YYYY.MM.DD" value={date} readOnly />
        <button className="calendar-icon" type="button" onClick={() => dateRef.current?.showPicker()}>
          <Calendar width={20} height={20} stroke="#6B7280" />
        </button>
        <input className="date-picker" ref={dateRef} type="date" onChange={(e) => setDate(e.target.value.replaceAll('-', '.'))} />
      </div>
    </div>
  )
}

export default DateInput