

export default function PhotosTab() {
    return (
        <div className="flex flex-col gap-4 flex-1 w-full pt-6">
            <button className="bg-primary text-black py-3 rounded-lg font-semibold">
                + Subir foto
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* fotos */}
                {[1,2,3,4].map((_, i) => (
                <div
                    key={i}
                    className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center"
                >
                    📸
                </div>
                ))}
            </div>
        </div>
    );
}