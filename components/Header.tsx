import { Bell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-stone-950 shadow-md border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto p-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary italic">
                TrackFit
            </Link>

            <Bell className="w-5 h-5" />
        </div>
    </header>
  );
}
