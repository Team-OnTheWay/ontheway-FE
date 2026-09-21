import { useState } from 'react'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProductCard from '../components/CustomProductCard'
import CustomList from '../components/CustomList'
import CustomCheckbox from '../components/CustomCheckbox'
import TextArea from '../components/TextArea'
import CustomButton from '../components/CustomButton'
import './CustomReportPostPage.css'

const REASONS = [
    '허용되지 않은 물품 또는 위험 물품을 요청합니다.',
    '물품 정보와 사진이 물품 내용과 다릅니다.',
    '같은 내용의 게시글을 반복해서 올렸습니다.',
    '광고·홍보 또는 서비스와 무관한 내용을 게시했습니다.',
    '욕설·협박 또는 부적절한 언행을 했습니다.',
]

function CustomReportPostPage() {
    const [selectedReasons, setSelectedReasons] = useState<number[]>([])

    const handleCheck = (index: number) => {
        if (selectedReasons.includes(index)) {
            setSelectedReasons(selectedReasons.filter(i => i !== index))
        } else if (selectedReasons.length < 3) {
            setSelectedReasons([...selectedReasons, index])
        }
    }

    return (
        <div className="report">
            <CustomTopAppBar variant="centered" title="게시글 신고" />

            <div className="report__body">
                <CustomProductCard number="물품번호" category="서류봉투" money="5,000" width={361} />

                <div className="report__section">
                    <CustomList variant="list03" label="신고 사유를 선택해주세요." />
                    <p className="report__hint">최대 3개까지 선택가능</p>
                </div>

                <div className="report__checks">
                    {REASONS.map((reason, i) => (
                        <CustomCheckbox key={i} label={reason} size="sm"
                        checked={selectedReasons.includes(i)}
                        onChange={() => handleCheck(i)} />
                    ))}
                </div>

                <div className="report__area">
                    <TextArea label="신고 사유" borderColor="lightGray"
                    placeholder="신고 사유를 적어주세요." />
                </div>
            </div>

            <div className="report__footer">
                <CustomButton name="신고하기" color="#fd5d35" fontColor="#ffffff" size="lg" />
            </div>
        </div>
    )
}

export default CustomReportPostPage