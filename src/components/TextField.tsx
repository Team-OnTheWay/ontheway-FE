import './TextField.css'
import { MapPinOutline, XButton } from './CustomIcon'
//2. props
type TextFieldProps = {
  label: string 
  
  height: 56 | 48
  borderColor: 'lightGray' | 'gray' | 'orange' | 'none'
  backgroundColor: 'white' | 'gray'
  leftLocationIcon: boolean
  placeholder: string
  timer: boolean
  rightButton: 'x' | 'label' | 'none'
}

// 1. TextField Component : () 안에 prop를 넣어주면 됨. 
function TextField(props : TextFieldProps) {
    return(
        <div className="text-field-container">
            <p>{props.label}</p>
            <div className="text-field" style={{ height: `${props.height}px`, borderColor: props.borderColor, backgroundColor: props.backgroundColor }}>
                {props.leftLocationIcon && <span><MapPinOutline width={20} height={24} stroke="#4B5663" strokeWidth={2} /></span>}
                <input placeholder={props.placeholder}/>
                {props.timer && <span>2:59</span>}
                {props.rightButton === 'x' && <XButton/>}
                {props.rightButton === 'label' && <div className='label-button'><button>Label</button></div>}
            </div>
        </div>
    )
}

// 3. 다른 파일에서 사용할 수 있도록 export 해야함.
export default TextField