

export default function ProgressPage() {

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[85vh]">
                <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Biometria</p>
                
                <div className="flex  roudend-full w-full  h-8 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full rounded-r-none flex items-center justify-center" style={{ width: '50%' }}>
                        <span className="text-xs text-white font-medium">Medidas</span>
                    </div>
                    <div className="h-full flex items-center justify-center" style={{ width: '50%' }}>
                        <span className="text-xs text-gray-300 font-medium">Fotos</span>
                    </div>

                </div>
            </main>
        </div>
    );
}