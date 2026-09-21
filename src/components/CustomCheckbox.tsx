import { useState } from 'react'
import './CustomCheckbox.css'

interface CustomCheckboxProps {
    label: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    size?: "sm" | "lg";
    checked?: boolean;
    onChange?: () => void;
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none"
        stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-4-4" />
        </svg>
    )
}

function CustomCheckbox({ label, defaultChecked = false, disabled = false, size = "lg", checked, onChange }: CustomCheckboxProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked = checked !== undefined ? checked : internalChecked;

    const handleChange = () => {
        if (onChange) {
            onChange();
        } else {
            setInternalChecked(!internalChecked);
        }
    };

    return (
        <label className={`checkbox checkbox--${size} ${disabled ? "checkbox--disabled" : ""}`}>
            <input
            type="checkbox"
            className="checkbox__input"
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            />
            <span className="checkbox__box">
                <CheckIcon />
            </span>
            <span className="checkbox__label">{label}</span>
        </label>
    )
}

export default CustomCheckbox