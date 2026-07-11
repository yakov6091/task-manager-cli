export function Header() {
    return (
        <header className="flex justify-between items-center text-white bg-blue-700 px-8 py-6 shadow-lg">
            <h2 className="text-2xl font-bold">Task-Manager</h2>

            <div className="flex gap-3">
                <button className="px-5 py-2 bg-white text-blue-400 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all cursor-pointer">Sign in</button>
                <button className="px-5 py-2 bg-white text-blue-400 rounded-lg font-semibold hover:bg-gray-400 transition-all cursor-pointer">Sign up</button>
            </div>
        </header>
    )
}