import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function HeaderSession({name, description}: {name: string, description: string}) {
  return (
    <>
        <div className="w-full flex items-center justify-between gap-2">
            
            <p className="uppercase text-sm text-primary leading-5 tracking-widest">Sesión Actual</p>

            <Link href="/workouts" className="ml-auto text-sm text-secondary hover:underline transition-colors">
                <ArrowLeft className="w-4 h-4 inline-block mr-1" />
                Volver a mis rutinas
            </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full pb-2">
            
            <div className="flex flex-col gap-2 ">
                
                <h1 className="text-4xl font-bold">{name}</h1>  
                <p className="text-sm text-secondary">{description}</p>
            </div>
        </div>
    </>
  );
}