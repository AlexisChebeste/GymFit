"use client"

import { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../ui/Button";
import { Pause, Play, Plus } from "lucide-react";
import CircularTimer from "./CircularTimer";


export default function Timer({onClose}: {onClose: () => void}) {

    const [initialTime, setInitialTime] = useState<number>(120); 
    const [timer, setTimer] = useState<number>(120);
    const [isRunning, setIsRunning] = useState<boolean>(true);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    setIsRunning(false);
                }

                if (prev === 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const handleAddExtraTime = () => {
        setTimer(prev => prev + 30);
        setInitialTime(prev => prev + 30); 
    };

    return (
        <Modal className="max-w-sm">
            <div className="flex flex-col gap-10 items-center justify-center p-4">
                <p className="text-2xl font-semibold">Tiempo de descanso</p>
                <CircularTimer 
                    timer={timer} 
                    initialTime={initialTime} 
                    isRunning={isRunning} 
                    setIsRunning={setIsRunning} 
                    formatTime={formatTime} 
                />
                <div className="flex flex-col gap-4 w-full">
                    <Button onClick={onClose} autoFocus={true} className="bg-green-600 hover:bg-green-700 text-lg">
                        Terminar Descanso
                    </Button>
                    <Button onClick={handleAddExtraTime} className="bg-transparent border border-zinc-800 hover:bg-zinc-800 text-lg text-white">
                        <Plus className="w-4 h-4 inline-block mr-1" />
                        Agregar 30s
                    </Button>
                </div>
            </div>
        </Modal>
    );
}