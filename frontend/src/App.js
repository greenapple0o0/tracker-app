import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import CountdownTimer from "./components/CountdownTimer";
import "./styles/app.css";

// Replace with your deployed backend URL
const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (currentUser) fetchTasks();
  }, [currentUser]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!newTask) return;
    try {
      const res = await axios.post(`${API_BASE}/tasks`, { text: newTask });
      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id, username) => {
    try {
      const res = await axios.put(`${API_BASE}/tasks/${id}`, { username });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  return (
    <div className="App">
      <CountdownTimer />
      <h2>Welcome, {currentUser}</h2>

      <div className="add-task">
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add new task" />
        <button onClick={addTask}>Add Task</button>
      </div>

      <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} currentUser={currentUser} />
    </div>
  );
}

export default App;
