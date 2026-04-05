import { UserRound } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-stone-950 shadow-md border-b border-gray-200 dark:border-gray-800 max-h-14 h-full">
        <div className="mx-auto flex items-center justify-between h-full px-4">
            <Link href="/" className="text-2xl font-bold text-primary italic">
                TrackFit
            </Link>

            <Link href="/profile" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full 
              p-2 hover:bg-gray-100 dark:hover:bg-gray-700
            ">
                <UserRound size={20} />
            </Link>
        </div>
    </header>
  );
}
