import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({children, className}: GlassCardProps){
    return (
        <div className={`bg-black/[0.02] backdrop-blur-lg shadow-md rounded-xl ${className || ''}`}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20">
                {children}
            </div>
        </div>
    )
}

export function GlassCardText({children, className}: GlassCardProps){
    return (
        <div className={`bg-black/[0.02] backdrop-blur-lg shadow-md rounded-xl ${className || ''}`}>
            <div className="px-4 py-2 sm:px-6 md:px-8">
                {children}
            </div>
        </div>
    )
}