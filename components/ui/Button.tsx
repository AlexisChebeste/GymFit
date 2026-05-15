
export default function Button({ children, onClick, disabled, className, type, autoFocus }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; type?: "button" | "submit" | "reset"; autoFocus?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`w-full flex items-center justify-center gap-2   border  transition-colors text-black text-lg font-medium cursor-pointer duration-300 ${disabled ? 'opacity-70 cursor-not-allowed' : 'bg-green-600 hover:bg-green-800'} ${className || ''}  p-4 rounded-md  border-transparent
                        "`}
            type={type || 'button'}
        >
            {children}
        </button>
    );
}