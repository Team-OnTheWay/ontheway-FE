import './TimeInput.css'
import { Arrow } from './CustomIcon'

type TimeInputProps = {
  borderColor: 'gray' | 'none' | 'orange'
  backgroundColor: 'white' | 'gray'
  start?: string                                   // "08:00"
  end?: string                                     // "10:00"
  onChange?: (start: string, end: string) => void
}

const colors = {
  lightGray: '#F2F2F2',
  gray: '#D7DAE0',
  orange: '#FD5D35',
  none: 'transparent',
  white: '#FFFFFF',
}

// 00:00 ~ 23:30, 30분 단위
const TIMES = Array.from({ length: 48 }, (_, i) =>
  `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)

function TimeInput(props: TimeInputProps) {
  const start = props.start ?? '00:00'
  const end = props.end ?? '00:00'
  const style = {
    border: props.borderColor === 'none' ? 'none' : `1px solid ${colors[props.borderColor]}`,
    backgroundColor: colors[props.backgroundColor],
  }

  const select = (value: string, onSelect: (value: string) => void) => (
    <div className='time-select-wrapper'>
      <select style={style} value={value} onChange={(e) => onSelect(e.target.value)}>
        {TIMES.map(time => <option key={time} value={time}>{time}</option>)}
      </select>
      <div className='time-dropdown-arrow'>
        <Arrow width={24} height={24} strokeWidth={2}/>
      </div>
    </div>
  )

  return (
    <div className='time-input'>
      <div className='time-input-block'>
        {select(start, (value) => props.onChange?.(value, end))}
        <p>~</p>
        {select(end, (value) => props.onChange?.(start, value))}
      </div>
    </div>
  )
}

export default TimeInput
