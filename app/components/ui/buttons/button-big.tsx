import React from "react";

interface ButtonProps{
    children: React.ReactNode
    onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
}) => {
    return(
        <button className={`relative cursor-pointer border border-black overflow-hidden rounded-xl px-5 py-4 text-sm font-medium transition-all duration-300 hover:bg-black hover:text-white shadow-lg hover:shadow-xl`}
        style={{ 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: 18,
        }}
        onClick={onClick}>
            {children}
        </button>
    )
}

export default Button