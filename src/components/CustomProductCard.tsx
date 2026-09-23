import { Box } from './CustomIcon';
import './CustomProductCard.css'

interface CustomProductCard {
    number: string;
    category: string;
    money: string;
    onClick?: () => void;
    selected?: boolean;   // 요청하기 화면에서 고른 물품
}

function CustomProductCard({number, category, money, onClick, selected = false}: CustomProductCard) {
  return (
    <>
        <div className={`custom-product ${selected ? 'custom-product--selected' : ''}`} onClick={onClick}>
            <div className='product-section'>
                <div className='product-box-section'>
                    <Box width={22} height={22} strokeWidth={2}></Box>
                </div>
                <div className='product-info-section'>
                    <div className='product-number'>{number}</div>
                    <div className='product-category'>{category}</div>
                </div>
            </div>
            <div>
                <span className='product-money'>{money}</span>
                <span className='product-money-unit'>원</span>
            </div>
        </div>
    </>
  )
}

export default CustomProductCard