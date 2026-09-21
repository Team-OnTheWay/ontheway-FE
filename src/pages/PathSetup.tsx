import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProductCard from '../components/CustomProductCard'
import CustomButton from '../components/CustomButton'
import './Request.css'

function Request(){
    return (
        <div className='request-page'>
            <div className="request-products">
                <CustomTopAppBar title="요청하기"/>

                <CustomProductCard number={'물품번호'} category={'전자기기'} money={'20,000'} width={349} />
                <CustomProductCard number={'물품번호'} category={'서류봉투'} money={'5,000'} width={349} />
                <CustomProductCard number={'물품번호'} category={'전자기기'} money={'23,000'} width={349} />
            </div>

            <div className='new-box'>
                <div className="new-box__content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M12 5V19" stroke="#6A6A67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>새글추가</span>
                </div>
            </div>

            <div className="request-button">
                <CustomButton name="의뢰등록" color="#fd5d35" fontColor="#ffffff" size="lg"/>
            </div>
        </div>
    )
}

export default Request