import React from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    containerClassName?: string;
    placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
    label,
    id,
    options,
    containerClassName = '',
    className = '',
    ...props
}) => {
    return (
        <div className={`mb-4 ${containerClassName}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 text-white ${className}`}
                {...props}
            >
                {props.placeholder && <option value="">{props.placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;

