import React from "react";

interface GlassButtonProps{
    children: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'outline'
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    onClick,
    variant = 'primary'
}) => {
    return(
        <button className={`relative cursor-pointer overflow-hidden rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${variant === 'primary' ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : variant === 'outline' ? 'border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/10' : 'bg-gradient-to-r from-pink-500 to-purple-600 bg-opacity-40 backdrop-blur-md border border-white/20 hover:bg-opacity-50'}`}
        style={{ 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: 15,
        }}
        onClick={onClick}>
            {children}
        </button>
    )
}

export default GlassButton