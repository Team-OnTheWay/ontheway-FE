import { useState, useEffect } from 'react'
import './TextField.css'
import { MapPinOutline, XButton, Eye, EyeOff } from './CustomIcon'

const colors = {
  lightGray: '#F2F2F2',
  gray: '#D7DAE0',
  orange: '#FD5D35',
  none: 'transparent',
  white: '#FFFFFF',
}

type TextFieldProps = {
  label: string
  height: 56 | 48
  borderColor: 'lightGray' | 'gray' | 'orange' | 'none'
  backgroundColor: 'white' | 'gray'
  leftLocationIcon: boolean
  placeholder: string
  timer: boolean
  rightButton: 'x' | 'label' | 'eye' | 'none'
  rightButtonLabel?: string
  helperText?: string
  defaultValue?: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}

function HelperCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="#FD5D35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function TextField(props: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [time, setTime] = useState(300)
  const isPassword = props.rightButton === 'eye'
  const inputType = isPassword && !showPassword ? 'password' : 'text'
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  useEffect(() => {
    if (!props.timer || time <= 0) return

    const timer = setInterval(() => {
      setTime(time => time - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [props.timer, time])

  return (
    <div className="text-field-container">
      <p>{props.label}</p>

      <div className="text-field" style={{ height: `${props.height}px`, borderColor: colors[props.borderColor], backgroundColor: colors[props.backgroundColor] }}>
        {props.leftLocationIcon && <span><MapPinOutline width={20} height={24} stroke="#4B5663" strokeWidth={2} /></span>}

        <input type={inputType} placeholder={props.placeholder} value={props.value} defaultValue={props.value === undefined ? props.defaultValue : undefined} disabled={props.disabled} onChange={(e) => props.onChange?.(e.target.value)} />

        {(props.timer || props.rightButton === 'label') && <div className='text-field-right'>
          {props.timer && <span className='timer'>{minutes}:{seconds.toString().padStart(2, '0')}</span>}
          {props.rightButton === 'label' && <div className='label-button'><button>{props.rightButtonLabel ?? 'Label'}</button></div>}
        </div>}

        {props.rightButton === 'x' && <XButton />}

        {props.rightButton === 'eye' && (
          <button className="eye-button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye width={24} height={24} stroke="#6A6A67" strokeWidth={2} /> : <EyeOff width={24} height={24} stroke="#6A6A67" strokeWidth={2} />}
          </button>
        )}
      </div>

      {props.helperText && (
        <p className="text-field-help"><HelperCheck />{props.helperText}</p>
      )}
    </div>
  )
}

export default TextField