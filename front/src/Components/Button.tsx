import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    ...props
}) => {
    const baseStyle = 'font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm';

    let variantStyle = '';
    switch (variant) {
        case 'primary':
            variantStyle = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white';
            break;
        case 'secondary':
            variantStyle = 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-gray-100 border border-gray-500';
            break;
        case 'danger':
            variantStyle = 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
            break;
        default:
            variantStyle = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white';
            break;
    }

    return (
        <button
            type={props.type || 'button'}
            className={`${baseStyle} ${variantStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

