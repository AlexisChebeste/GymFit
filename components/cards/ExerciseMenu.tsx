"use client"
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

export interface ExerciseMenuProps {
    onDelete: () => void;
}

export default function ExerciseMenu({
    onDelete,
}: ExerciseMenuProps) {

    const [activeModal, setActiveModal] = useState(false);

    const toggleMenuModal = () => {
        setActiveModal(prev => !prev);
    }

    const handleDelete = () => {
        onDelete();
        setActiveModal(false);
    }
    return(
        <>
            <button 
                className={` hover:text-green-500 transition-colors duration-200 cursor-pointer hover:bg-green-500/20 p-2 rounded-full ${activeModal ? 'bg-green-500/20 text-green-500' : ''}`}
                onClick={toggleMenuModal}
            >
                <EllipsisVertical className="w-5 h-5" />
            </button>

            {activeModal && (
                <div className="absolute top-16 border border-gray-500 right-4 bg-zinc-800 rounded-lg shadow-lg p-2 z-10 w-48">
                    <button className="w-full text-left px-4 py-2 hover:bg-zinc-700 rounded-lg transition-colors duration-200 cursor-pointer" onClick={handleDelete}>
                        Eliminar ejercicio
                    </button>
                </div>
            )}
        </>
    )
}