import './CustomProgressStep.css'
import CustomList from './CustomList'
import { CircleCheck, Truck, CircleEmpty, CircleX } from './CustomIcon'
 
// canceled: 배송취소/배송중단 (주황 X)
// halted: 진행 중에 중단된 단계 (회색 트럭)
type StepStatus = "done" | "current" | "pending" | "canceled" | "halted"
 
export type Step = {
    title: string;
    description: string;
    status: StepStatus;
    meta?: string;        // 완료: 날짜/시간, 현재: 상태 태그 텍스트
}
 
interface CustomProgressStepProps {
    steps: Step[];
}
 
function StepIcon({ status }: { status: StepStatus }) {
    if (status === "done") return <CircleCheck width={24} height={24} />
    if (status === "current") return <Truck width={24} height={24} stroke="#4576F7" />
    if (status === "canceled") return <CircleX width={24} height={24} />
    if (status === "halted") return <Truck width={24} height={24} stroke="#58616A" />
    return <CircleEmpty width={24} height={24} />
}
 
function CustomProgressStep({ steps }: CustomProgressStepProps) {
    return (
        <div className="progress-step">
            <CustomList variant="list03" label="진행 단계" />
 
            <div className="progress-step__list">
                {steps.map((step, i) => (
                    <div className="progress-step__row" key={i}>
                        <div className="progress-step__marker">
                            <StepIcon status={step.status} />
                            {i < steps.length - 1 && <span className="progress-step__line"></span>}
                        </div>
 
                        <div className={`progress-step__text progress-step__text--${step.status}`}>
                            <p className="progress-step__step-title">{step.title}</p>
                            <p className="progress-step__step-desc">{step.description}</p>
                        </div>
 
                        <div className="progress-step__meta">
                            {step.status === "done" && step.meta && (
                                <span className="progress-step__date">{step.meta}</span>
                            )}
                            {step.status === "current" && step.meta && (
                                <span className="progress-step__tag">{step.meta}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
 
export default CustomProgressStep