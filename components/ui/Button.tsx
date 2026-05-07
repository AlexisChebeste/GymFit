
export default function Button({ children, onClick, disabled, className, type }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; type?: "button" | "submit" | "reset" }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#00FF00]/50  transition-colors text-[#00FF00]/70 text-lg font-medium cursor-pointer duration-300 ${disabled ? 'opacity-70 cursor-not-allowed' : 'bg-[#1E1E1E] hover:bg-[#2A2A2A]'} ${className || ''}`}
            type={type || 'button'}
        >
            {children}
        </button>
    );
}