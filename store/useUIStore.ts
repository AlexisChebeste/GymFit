import { create } from 'zustand';

interface TimerStore {
  time: number;
  initialTime: number;
  isRunning: boolean;
  isOpen: boolean;
  intervalId: NodeJS.Timeout | null;


  startTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setOpen: (isOpen: boolean) => void;
  addExtraTime: (seconds: number) => void;
}

export const useTimerStore = create<TimerStore>()(
    (set, get) => ({
        time: 0,
        initialTime: 0,
        isRunning: false,
        isOpen: false,
        intervalId: null,

        startTimer: (seconds) => {
            const currentInterval = get().intervalId;
            if (currentInterval) clearInterval(currentInterval);
            const endTime = Date.now() + seconds * 1000;

            set({ time: seconds, initialTime: seconds, isRunning: true, isOpen: true });

            const id = setInterval(() => {
                const now = Date.now();
                const timeLeft = Math.ceil((endTime - now) / 1000);

                if (timeLeft <= 0) {
                    get().stopTimer();
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                } else {
                    set({ time: timeLeft });
                }
            }, 1000);

            set({ intervalId: id });
        },

        pauseTimer: () => {
            const id = get().intervalId;
            if (id) clearInterval(id);
            set({ isRunning: false, intervalId: null });
        },

        resumeTimer: () => {
            if (get().isRunning) return;
            get().startTimer(get().time);
        },

        addExtraTime: (seconds) => {
            set((state) => ({ 
                time: state.time + seconds, 
                initialTime: state.initialTime + seconds
            }));
        },

        stopTimer: () => {
            const id = get().intervalId;
            if (id) clearInterval(id);
            set({ time: 0, isRunning: false, isOpen: false, intervalId: null });
        },

        setOpen: (open) => set({ isOpen: open }),
    })
);