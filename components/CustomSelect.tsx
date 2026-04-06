import { useState } from "react";
import { ChevronDown,  Check } from "lucide-react";

export function CustomSelect({ options, value, onChange, defaultValue = "Seleccionar ejercicio" }: { options: any[]; value: string; onChange: (value: string) => void, defaultValue?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.id === value);

  return (
    <div className="relative w-full max-w-xs font-sans">
      {/* Botón que simula el select */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-zinc-900/50 backdrop-blur-md border border-white/10 p-3 rounded-xl text-left hover:border-primary/50 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium tracking-wide">
            {selectedOption?.name || defaultValue}
          </span>
        </div>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Lista de opciones (Dropdown) */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
          {options.map((ex: any) => (
            <button
              key={ex.id}
              onClick={() => {
                onChange(ex.id);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full p-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <span>{ex.name}</span>
              {value === ex.id && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}