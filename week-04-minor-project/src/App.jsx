import { useState } from "react";
import "./App.css";
import NotesApp from "./components/NotesApp";
import TodoApp from "./components/TodoApp";

function App() {
  const [page, setPage] = useState("todo");

  return (
    <div>

      <nav className="navbar">

        <h2>My Productivity App</h2>

        <div>
          <button onClick={() => setPage("todo")}>
            To-Do
          </button>

          <button onClick={() => setPage("notes")}>
            Notes
          </button>
        </div>

      </nav>

      {page === "todo" ? <TodoApp /> : <NotesApp />}

    </div>
  );
}

export default App;