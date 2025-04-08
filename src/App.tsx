import {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";

type TodolistsType = { id: string, title: string}

type TasksType = {
    [key: string]: TaskStateType
}

type TaskStateType = {
    data: TaskType[]
    filter: FilterValuesType
}

export const App = ()=> {

    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistId1, title: "What to learn"},
        {id: todolistId2, title: "What to buy"}
    ])

    let [tasks, setTasks] = useState<TasksType>({
        [todolistId1]: {
            data: [
                {id: v1(), title: "HTML&CSS1111", isDone: true},
                {id: v1(), title: "JS1111", isDone: true}
            ],
            filter: "all"
        },
        [todolistId2]: {
            data: [
                {id: v1(), title: "HTML&CSS22222", isDone: true},
                {id: v1(), title: "JS2222", isDone: true}
            ],
            filter: "all"
        }
    });

    const removeTodolist = (payload:{todolistId: string}) => {
        const {todolistId} = payload
        setTodolists(todolists.filter(list => list.id !== todolistId))
    }

    function removeTask(payload:{todolistId: string, taskId: string}) {
        const {todolistId, taskId} = payload
       setTasks( {...tasks, [todolistId]: {...tasks[todolistId], data: tasks[todolistId].data.filter(task => task.id !== taskId) }} )
    }

    function addTask(payload:{todolistId: string, title: string}) {
        const {todolistId, title} = payload
        setTasks({...tasks, [todolistId]: {...tasks[todolistId], data: [...tasks[todolistId].data, {id: v1(), title, isDone: false}]}})

    }

    function changeStatus(payload: {todolistId: string, taskId: string, isDone: boolean}) {
        const { todolistId, taskId, isDone } = payload;
        setTasks({...tasks, [todolistId]: {...tasks[todolistId],
                data: tasks[todolistId].data.map(task => task.id === taskId ? {...task, isDone} : task )} })
    }

    function changeFilter(payload: {todolistId: string, filter: FilterValuesType}) {
        const {todolistId, filter} = payload;
        setTasks({...tasks, [todolistId]: {...tasks[todolistId], filter}});
    }


    return (
        <div className="App">
            {todolists.map((el) => {
                return (
                    <Todolist
                        key={el.id}
                        todolistId={el.id}
                        filter={tasks[el.id].filter}
                        title={el.title}
                        tasks={tasks[el.id].data}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        removeTodolist={removeTodolist}
                    />
                )
            })}


        </div>
    );
}
