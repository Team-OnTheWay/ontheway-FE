import { useState } from 'react'
import './TextArea.css'

const colors = {
  lightGray: '#F2F2F2',
  gray: '#D7DAE0',
  orange: '#FD5D35',
  none: 'transparent',
  white: '#FFFFFF',
}

type TextAreaProps = {
  label: string
  borderColor: 'lightGray' | 'gray' | 'orange'
  placeholder?: string
}

function TextArea(props : TextAreaProps){
  const [text, setText] = useState('')

  return(
    <div>
      <p>{props.label}</p>
      <div className='text-area' style={{borderColor: text.length >= 100 ? colors.orange : colors[props.borderColor]}}>
        <textarea
        placeholder={props.placeholder ?? "Text"}
        value={text}
        maxLength={100}
        onChange={(e) => setText(e.target.value.slice(0, 100))}/>

        <span className='text-count'>
          <span style={{color: text.length >= 100 ? colors.orange : colors.gray}}>
            {text.length}
          </span>
          <span style={{color: colors.gray}}>/100</span>
        </span>
      </div>
    </div>
  )
}

export default TextArea