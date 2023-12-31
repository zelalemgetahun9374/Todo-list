import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import TaskItem from "./components/TaskItem"

// TYPES
type taskType = {
    id: number,
    name: string,
    completed: boolean
}

type addTaskReducerActionType = {
    type: "add_task",
    name: string
}

type otherTaskReducerActionType = {
    type: "delete_task" | "update_task",
    id: number
}

type tasksReducerActionType = addTaskReducerActionType | otherTaskReducerActionType

type filterType = "all" | "completed" | "uncompleted"


// local storage key name for storing tasks
const TASKS_KEY = "task_list"

// trys to check if an object is of type 'taskType[]'
function isTaskType(obj: any): boolean {
    return ((typeof obj === "object") &&
        ((obj as taskType).id !== undefined && (obj as taskType).name !== undefined && (obj as taskType).completed !== undefined) &&
        (typeof obj.id === "number" && typeof obj.name === "string" && typeof obj.completed === "boolean"));
}

// implements logic to extract valid tasks from local storage
function getStoredTasks(): taskType[] {
    try {
        const value = JSON.parse(localStorage.getItem(TASKS_KEY) || "")
        if (Array.isArray(value)) return value.filter((task) => isTaskType(task))

    } catch (error) {
        console.log(error)
    }

    return []
}

// reducer function that handles adding, updating and deleting tasks
function tasksReducer(state: taskType[], action: tasksReducerActionType): taskType[] {
    switch (action.type) {
        case "add_task":
            return [...state, {
                id: state.length == 0 ? 0 : state[state.length - 1].id + 1,
                name: action.name,
                completed: false
            }]

        case "update_task":
            return state.map(task => {
                if (task.id === action.id) {
                    return { ...task, completed: !task.completed }
                }
                return task
            })

        case "delete_task":
            return state.filter(task => task.id !== action.id)
    }
}

function App() {
    const [tasks, dispatch] = useReducer(tasksReducer, null, getStoredTasks)

    const [visibleTasks, setVisibleTasks] = useState<taskType[]>([])
    const [filter, setFilter] = useState<filterType>("all")

    const newTaskInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }, [tasks])

    useEffect(() => {
        switch (filter) {
            case "all":
                setVisibleTasks(tasks)
                return
            case "completed":
                setVisibleTasks(tasks.filter(task => task.completed === true))
                return
            case "uncompleted":
                setVisibleTasks(tasks.filter(task => task.completed === false))
                return
        }
    }, [tasks, filter])

    const handleAddTask = useCallback(() => {
        const task = newTaskInputRef.current?.value
        if (task) {
            dispatch({ type: "add_task", name: task })
            newTaskInputRef.current.value = ""
            newTaskInputRef.current.focus();
        } else {
            console.log("New task can't be empty");
        }
    }, [])

    const handleDeleteTask = useCallback((id: number) => {
        dispatch({ type: "delete_task", id: id })
    }, [])

    const handleUpdateTask = useCallback((id: number) => {
        dispatch({ type: "update_task", id: id })
    }, [])

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value as filterType)
    }, [])

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className={`flex flex-col items-center gap-4 p-4 w-[94vw] xs:w-[92vw] sm:w-[600px] lg:w-[760px] h-[90vh] m-auto bg-[#fbfcfc] border border-gray-300 rounded-xl shadow-2xl`}>
                <h1 className="text-3xl font-medium text-sky-900 text-center ">
                    Todo Task List
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <input
                        placeholder="Add a new task"
                        className="w-fit xs:w-60 px-2 py-1 border-b-2 border-blue-500 focus:outline-none bg-transparent placeholder-gray-400/70 text-gray-700"
                        type="text"
                        onKeyDown={e => { e.key === 'Enter' ? handleAddTask() : null }}
                        ref={newTaskInputRef}
                    />

                    <button
                        type="submit"
                        className="ml-2 px-2 py-1.5 text-white bg-blue-500 border-2 border-blue-500 rounded-lg flex items-center justify-center gap-1 w-fit"
                        onClick={handleAddTask}
                    >
                        <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="9" />  <line x1="9" y1="12" x2="15" y2="12" />  <line x1="12" y1="9" x2="12" y2="15" /></svg>
                        <span> Add</span>
                    </button>
                </div>
                <div className="bg-white border divide-x rounded-lg hidden sm:flex sm:mt-4">
                    <button className={`flex items-center px-4 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 sm:text-base sm:px-6 hover:bg-blue-600 hover:text-white ${filter === "all" ? 'text-white bg-blue-600 outline-none' : 'bg-none text-blue-600'}`} onClick={() => { setFilter("all") }}>
                        <span>All</span>
                    </button>
                    <button className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 hover:bg-green-500 hover:text-white ${filter === "completed" ? 'text-white bg-green-500 outline-none' : 'bg-none text-green-600'}`} onClick={() => { setFilter("completed") }}>
                        <span>Completed</span>
                    </button>
                    <button className={`flex items-center px-4 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 sm:text-base sm:px-6 hover:bg-orange-500 hover:text-white ${filter === "uncompleted" ? 'text-white bg-orange-500 outline-none' : 'bg-none text-orange-500'}`} onClick={() => { setFilter("uncompleted") }}>
                        <span>Uncompleted</span>
                    </button>
                </div>

                <div className="w-max block my-2 sm:hidden">
                    <select name="Filter" id="filter" className="border-2 border-blue-500 p-1" onChange={handleFilterChange} defaultValue="all">
                        <option value="all"><p className="text-sm font-medium text-green-400">All</p></option>
                        <option value="completed">Completed</option>
                        <option value="uncompleted">Uncompleted</option>
                    </select>
                </div>

                <ul id="task_list" className="flex flex-col self-start gap-2 w-full overflow-y-auto overflow-x-hidden">
                    {
                        visibleTasks.map((task) =>
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                name={task.name}
                                completed={task.completed}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                            />)
                    }
                </ul>
            </div>

        </main>
    )
}

export default App
