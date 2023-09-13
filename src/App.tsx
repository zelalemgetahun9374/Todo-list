import { useEffect, useRef, useState } from "react"
import TaskItem from "./components/TaskItem"

type taskType = {
    id: number,
    name: string,
    completed: boolean
}

type filterType = "all" | "completed" | "uncompleted"
const TASK_KEY = "task_list"

function isTaskType(obj: any): boolean {
    return ((typeof obj === "object") &&
        ((obj as taskType).id !== undefined && (obj as taskType).name !== undefined && (obj as taskType).completed !== undefined) &&
        (typeof obj.id === "number" && typeof obj.name === "string" && typeof obj.completed === "boolean"));
}

function App() {
    const [tasks, setTasks] = useState<taskType[]>(() => {
        try {
            const value = JSON.parse(localStorage.getItem(TASK_KEY) || "")
            if (Array.isArray(value)) return value.filter((task) => isTaskType(task))

        } catch (error) {
            console.log(error)
        }

        return []
    })

    const [visibleTasks, setVisibleTasks] = useState<taskType[]>([])
    const [filter, setFilter] = useState<filterType>("all")

    const newTaskInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
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

    function addTask() {
        const task = newTaskInputRef.current?.value
        if (task) {
            setTasks((tasks) => [...tasks, {
                id: tasks.length == 0 ? 0 : tasks[tasks.length - 1].id + 1,
                name: task,
                completed: false
            }])
            newTaskInputRef.current.value = ""
            newTaskInputRef.current.focus();
        } else {
            console.log("New task can't be empty");
        }
    }

    function deleteTask(id: number) {
        setTasks((tasks) => tasks.filter(task => task.id !== id))
    }

    function updateTask(id: number) {
        setTasks((tasks) => tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed }
            }
            return task
        }))
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-2 00">
            <div className={`flex flex-col items-center gap-4 w-[600px] lg:w-[760px] h-[90vh] m-auto my-4 p-8 bg-[#fbfcfc] border border-gray-300 rounded-xl shadow-2xl`}>
                <h1 className="text-3xl font-medium text-sky-900 text-center ">
                    Todo task list
                </h1>
                <div className="flex">
                    <input
                        placeholder="Add a new task"
                        className="w-60 px-2 py-1 border-b-2 border-blue-500 focus:outline-none bg-transparent placeholder-gray-400/70 text-gray-700"
                        type="text"
                        onKeyDown={e => { e.key === 'Enter' ? addTask() : null }}
                        ref={newTaskInputRef}
                    />

                    <button
                        type="submit"
                        className="ml-2 px-2 py-1.5  text-white bg-blue-500 border-2 border-blue-500 rounded-lg flex"
                        onClick={addTask}
                    >
                        <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="9" />  <line x1="9" y1="12" x2="15" y2="12" />  <line x1="12" y1="9" x2="12" y2="15" /></svg>
                        <span> Add</span>
                    </button>
                </div>
                <div className="flex bg-white border divide-x rounded-lg mt-8">
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

                <ul id="task_list" className="flex flex-col self-start gap-2 w-full pr-2 overflow-y-auto overflow-x-hidden">
                    {
                        visibleTasks.map((task) =>
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                name={task.name}
                                completed={task.completed}
                                updateTask={updateTask}
                                deleteTask={deleteTask}
                            />)
                    }
                </ul>
            </div>

        </main>
    )
}

export default App
