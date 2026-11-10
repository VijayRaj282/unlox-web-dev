import { useEffect, useState } from "react";

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [search, setSearch] = useState("");

  // Track whether we are editing a note
  const [editingId, setEditingId] = useState(null);

  // Load notes from Local Storage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));

    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Save notes to Local Storage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Add or update a note
  const saveNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      return;
    }

    // Update existing note
    if (editingId !== null) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title,
                content: content,
                category: category,
              }
            : note
        )
      );

      setEditingId(null);
    }

    // Add new note
    else {
      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        category: category,
        date: new Date().toLocaleString(),
      };

      setNotes([newNote, ...notes]);
    }

    // Clear form
    setTitle("");
    setContent("");
    setCategory("Personal");
  };

  // Start editing a note
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setEditingId(note.id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setTitle("");
    setContent("");
    setCategory("Personal");
    setEditingId(null);
  };

  // Delete note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Search notes
  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText) ||
      note.category.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="notes-app">

      <h1>My Notes</h1>

      {/* Search */}
      <input
        className="search-input"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Note Form */}
      <div className="note-form">

        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Personal</option>
          <option>Study</option>
          <option>Work</option>
          <option>Important</option>
        </select>

        <div className="note-buttons">

          <button onClick={saveNote}>
            {editingId !== null ? "Update Note" : "Add Note"}
          </button>

          {editingId !== null && (
            <button
              className="cancel-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* Notes */}
      <div className="notes-container">

        {filteredNotes.length === 0 ? (
          <p className="empty">
            No notes found.
          </p>
        ) : (
          filteredNotes.map((note) => (

            <div className="note-card" key={note.id}>

              <div className="note-header">

                <h2>{note.title}</h2>

                <div className="note-actions">

                  <button
                    className="edit-note"
                    onClick={() => editNote(note)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-note"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

              <p className="note-content">
                {note.content}
              </p>

              <div className="note-footer">

                <span>
                  {note.category}
                </span>

                <small>
                  {note.date}
                </small>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default NotesApp;