import { useEffect, useState } from "react";
import "../App.css";

function TodoApp() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load tasks from Local Storage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to Local Storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: task,
      dueDate: dueDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setTask("");
    setDueDate("");
  };

  // Complete / uncomplete task
  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((item) => {
    if (filter === "completed") {
      return item.completed;
    }

    if (filter === "pending") {
      return !item.completed;
    }

    return true;
  });

  return (
    <div className="app">
      <h1>My To-Do List</h1>

      {/* Add Task Section */}
      <div className="input-section">

        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={addTask}>
          Add Task
        </button>

      </div>

      {/* Filter Buttons */}
      <div className="filters">

        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("completed")}>
          Completed
        </button>

        <button onClick={() => setFilter("pending")}>
          Pending
        </button>

      </div>

      {/* Task List */}
      <div className="task-list">

        {filteredTasks.length === 0 ? (
          <p className="empty">
            No tasks found.
          </p>
        ) : (
          filteredTasks.map((item) => (

            <div className="task" key={item.id}>

              <div className="task-info">

                <span
                  className={item.completed ? "completed" : ""}
                  onClick={() => toggleTask(item.id)}
                >
                  {item.text}
                </span>

                {item.dueDate && (
                  <small>
                    Due: {item.dueDate}
                  </small>
                )}

              </div>

              <button
                onClick={() => deleteTask(item.id)}
              >
                Delete
              </button>

            </div>

          ))
        )}

      </div>
    </div>
  );
}

export default TodoApp;