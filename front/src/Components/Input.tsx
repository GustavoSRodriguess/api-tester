import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    id,
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
            <input
                id={id}
                className={`block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;

