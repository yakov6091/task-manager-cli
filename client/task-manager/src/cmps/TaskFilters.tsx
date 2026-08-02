import { type FilterStatus } from "../TaskManager";

interface TaskFilterProps {
    currentFilter: FilterStatus,
    onFilterChange: (filter: FilterStatus) => void,
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFilterProps) {
    return (
        <div className="flex gap-2 justify-center my-6">
            {(['all', 'active', 'completed'] as FilterStatus[]).map((status) => (
                <button
                    key={status}
                    onClick={() => onFilterChange(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${currentFilter === status ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    {status}
                </button>
            ))}
        </div>
    );
}