import React from "react";

export default function TaskList({ tasks, toggleTask, deleteTask, currentUser }) {
  const usernames = ["Apple", "Banana"];

  return (
    <div className="task-table">
      <div className="task-row header">
        <div>{usernames[0]}</div>
        <div>Task</div>
        <div>{usernames[1]}</div>
      </div>

      {tasks.map((task) => (
        <div key={task._id} className="task-row">
          <div>
            <input
              type="checkbox"
              checked={task.AppleDone}
              onChange={() => toggleTask(task._id, currentUser)}
              disabled={currentUser !== "Apple"}
            />
          </div>

          <div className="task-text">
            {task.text}
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>❌</button>
          </div>

          <div>
            <input
              type="checkbox"
              checked={task.BananaDone}
              onChange={() => toggleTask(task._id, currentUser)}
              disabled={currentUser !== "Banana"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
