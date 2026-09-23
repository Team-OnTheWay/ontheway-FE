import './TextArea.css'

const colors = {
  lightGray: '#F2F2F2',
  gray: '#D7DAE0',
  orange: '#FD5D35',
  none: 'transparent',
  white: '#FFFFFF',
}

const MAX_LENGTH = 100

type TextAreaProps = {
  borderColor: 'lightGray' | 'gray' | 'orange'
  textcount?: number          // value를 안 넘기는 곳에서 보여줄 글자 수
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
}

function TextArea(props : TextAreaProps){
    // value를 넘긴 곳은 실제 글자 수를 센다
    const count = props.value !== undefined ? props.value.length : (props.textcount ?? 0)

    return(<div className='text-area' style={{borderColor: colors[props.borderColor]}}>
        <textarea
            placeholder={props.placeholder ?? "Text"}
            maxLength={MAX_LENGTH}
            value={props.value}
            onChange={(e) => props.onChange?.(e.target.value)}
        />
        <span className='text-count'>
            <span style={{ color: count === MAX_LENGTH ? colors.orange : colors.gray }}>
                {count}
            </span>
            <span style={{ color: colors.gray }}>/{MAX_LENGTH}</span>
        </span>
    </div>)
}

export default TextArea
