import { memo, useId } from 'react'
import deleteIcon from '../assets/delete.png'

type taskItemProps = {
    id: number,
    name: string,
    completed: boolean,
    onUpdateTask: (id: number) => void,
    onDeleteTask: (id: number) => void,
}

const TaskItem = memo(({ id, name, completed, onUpdateTask, onDeleteTask }: taskItemProps) => {
    const checkboxId = useId();
    console.log(checkboxId)

    return (
        <li className='flex items-center gap-2 w-full'>
            <input className="hidden grow-0 shrink-0" type="checkbox" id={checkboxId} checked={completed} onChange={() => onUpdateTask(id)} />
            <label className="flex items-center grow px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100 border border-" htmlFor={checkboxId}>
                <span className="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 rounded-full">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </span>
                <p className={`ml-2 text-lg grow px-2 rounded-sm ${completed ? 'text-[#9CA3AF] line-through' : 'text-gray-900'}`}>{name}</p>
            </label>

            <div className="group relative grow-0 shrink-0 flex flex-col align-bottom">
                <button
                    type='button'
                    onClick={() => onDeleteTask(id)}
                    className='text-white border border-red-200 hover:bg-red-200 focus:ring-4 focus:outline-none focus:ring-red-300 
                        font-medium rounded text-sm p-1 text-center inline-flex items-center mr-2'
                >
                    <img className='w-4 h-4' src={deleteIcon} alt="delete task" />
                </button>
                <p className="absolute top-8 right-0 scale-0 z-10 overflow-visible rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Delete</p>
            </div>
        </li>
    )
})

export default TaskItem