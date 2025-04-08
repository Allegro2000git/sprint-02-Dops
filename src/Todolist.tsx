import {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskType>
    removeTask: (payload:{todolistId: string, taskId: string}) => void
    changeFilter: (payload: {todolistId: string, filter: FilterValuesType}) => void
    addTask: (payload:{todolistId: string, title: string}) => void
    changeTaskStatus: (payload:{todolistId: string, taskId: string, isDone: boolean}) => void
    filter: FilterValuesType
    removeTodolist: (payload:{todolistId: string}) => void
}

export const Todolist = (props: PropsType)=> {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addTask = () => {
        if (title.trim() !== "") {
            props.addTask({todolistId: props.todolistId, title: title.trim()});
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            addTask();
        }
    }

    const onAllClickHandler = () => props.changeFilter({todolistId: props.todolistId, filter: "all"});
    const onActiveClickHandler = () => props.changeFilter({todolistId: props.todolistId, filter: "active"});
    const onCompletedClickHandler = () => props.changeFilter({todolistId: props.todolistId, filter: "completed"});

    const removeTodolistHandler = () => {
        props.removeTodolist({todolistId: props.todolistId})
    }

    let tasksForTodolist = props.tasks
    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(task => !task.isDone)
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(task => task.isDone);
    }

        return <div>
        <h3>
            {props.title}
            <button onClick={removeTodolistHandler}>X</button>

        </h3>
        <div>
            <input value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}
            />
            <button onClick={addTask}>+</button>
            {error && <div className="error-message">{error}</div>}
        </div>
        <ul>
            {
                tasksForTodolist.map(t => {
                    const onClickHandler = () => props.removeTask({todolistId: props.todolistId, taskId: t.id})
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus({todolistId: props.todolistId, taskId: t.id, isDone: e.currentTarget.checked});
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <input type="checkbox"
                               onChange={onChangeHandler}
                               checked={t.isDone}/>
                        <span>{t.title}</span>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}
