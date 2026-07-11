import { type Task } from "../EmailManager"

interface TaskCardProps {
    task: Task,
    onDelete?: (taskId: number) => void,
    onEdit?: (task: Task) => void,
    onToggleComplete?: (taskId: number) => void
}

export function TaskCard({ task, onDelete, onEdit, onToggleComplete }: TaskCardProps) {
    const completedClass = task.isComplete ? 'line-through opacity-50' : '';

    return (
        <div className="bg-slate-300 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow hover:translate-y-1">
            <div className="flex items-start gap-3">
                {/*Checkbox*/}
                <input
                    className="mt-2 w-4 h-4 cursor-pointer accent-green-600"
                    type="checkbox"
                    checked={task.isComplete}
                    onChange={() => onToggleComplete?.(task.id)}
                />

                {/*Content*/}
                <div className="flex-1">
                    <h3 className={`text-lg font-semibol text-slate-900 ${completedClass}`}>{task.title}</h3>
                    <p className={`text-slate-600 text-sm mt-1 ${completedClass}`}>{task.description}</p>
                </div>

                {/*Actions*/}
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                        onClick={() => onEdit?.(task)}
                    >
                        Edit
                    </button>

                    <button
                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                        onClick={() => onDelete?.(task.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div >

    )
}