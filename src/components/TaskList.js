import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loder from "../assets/loader.gif";

function TaskList() {
  const [tasks, settasks] = useState([]);
  const [taskCompleted, settaskCompleted] = useState([]);
  const [isLoader, setisLoader] = useState(false);

  const getTasks = async () => {
    setisLoader(true);
    try {
      const { data } = await axios.get(`${URL}/api/task`);
      settasks(data);
      setisLoader(false);
    } catch (error) {
      toast.error(error.message);
      setisLoader(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const [formData, setformData] = useState({
    name: "",
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/task`, formData);
      setformData({ ...formData, name: "" });
      getTasks();
      return toast.success("Task added...");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/task/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [taskId, settaskId] = useState("");
  const [isEditing, setisEditing] = useState(false);
  const getSingleTask = async (task) => {
    setformData({ name: task.name, completed: false });
    settaskId(task._id);
    setisEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.put(`${URL}/api/task/${taskId}`, formData);
      setformData({ ...formData, name: "" });
      setisEditing(false);
      getTasks();
      return toast.success("Task updated...");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const data = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/task/${task._id}`, data);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    settaskCompleted(cTask);
  }, [tasks]);

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Task Created: </b>
            {tasks.length}
          </p>
          <p>
            <b>Completed Task: </b>
            {taskCompleted.length}
          </p>
        </div>
      )}

      <hr />
      {isLoader && (
        <div className="--flex-center">
          <img src={loder} alt="Loadingimg" />
        </div>
      )}
      {!isLoader && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default TaskList;
