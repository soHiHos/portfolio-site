import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({children, className}: GlassCardProps){
    return (
        <div className={"backdrop-blur-md bg-white/30 border border-white/20 rounded-xl shadow-lg ${className}"}>
            {children}
        </div>
    )
}