export default function Spinner({label}) {
    return (
        <div className="items-center justify-center flex flex-col min-h-[200px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent">
                {label && <span className="text-2xl text-purple-600 animate-bounce duration-500">{label}</span>}
            </div>
        </div>
    )
}