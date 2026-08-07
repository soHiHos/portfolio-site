import React from "react";

interface GlassChipProps{
    children: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'outline'
}

export const GlassChip: React.FC<GlassChipProps> = ({
    children,
    onClick,
    variant = 'primary'
}) => {
    return(
        <button onClick={onClick} className={`relative overflow-hidden rounded-xl px-3 py-1 text-sm font-normal transition-all duration-300 ${variant === 'primary' ? 'bg-black text-white border border-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : variant === 'outline' ? 'border-2 border-black/30 text-black hover:border-black/50 hover:bg-black/10' : 'bg-gradient-to-r from-pink-500 to-purple-600 bg-opacity-40 backdrop-blur-md border border-black/20 hover:bg-opacity-50'}`}
        style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: 12,
        }}>
            {children}
        </button>
    )
}

export default GlassChip