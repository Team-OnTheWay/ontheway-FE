import { useState } from 'react'
import './CustomAccordion.css'
import { MinusIcon, PlusIcon } from './CustomIcon'

interface CustomAccordion {
    clientName: string
    itemName: string
    price: string
    defaultOpen?: boolean
    selected?: boolean          // 넘기면 선택 카드 (주황 테두리는 선택 여부를 따른다)
    onSelect?: () => void       // 카드(머리글)를 누르면 선택. +/- 버튼은 펼치기만 한다
    children?: React.ReactNode
}

function CustomAccordion({clientName, itemName, price, defaultOpen = false, selected, onSelect, children}: CustomAccordion){
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)
    // 선택 기능을 안 쓰는 곳은 예전처럼 펼쳐진 카드를 강조한다
    const highlighted = selected ?? isOpen

    const toggleAccordion = (e: React.MouseEvent) => {
        e.stopPropagation()   // 펼치기 버튼은 선택과 별개
        setIsOpen(prev => !prev)
    }

    const className = ['custom-accordion', isOpen && 'is-open', highlighted && 'is-selected', onSelect && 'is-selectable']
        .filter(Boolean).join(' ')

    return(
        <div className={className}>
            <div className="accordion-card-header" onClick={onSelect}>
                <div className="accordion-card-indicator"/>
                <div className="accordion-card-info">
                    <h3 className="accordion-card-title">{clientName}님의 의뢰</h3>
                    <p className="accordion-card-item-name">{itemName}</p>
                </div>
                <div className="accordion-card-action">
                    <span className="accordion-card-price">{price}원</span>
                    <button className="accordion-card-add-button" onClick={toggleAccordion} aria-label={isOpen ? "접기" : "펼치기"}>
                        {isOpen ? <MinusIcon/> : <PlusIcon/>}
                    </button>
                </div>
            </div>
            <div className="accordion-card-content">
                {children || <div className="accordion-default-box"/>}
            </div>
        </div>
    )
}

export default CustomAccordion
