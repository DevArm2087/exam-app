import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Notes() {
  const { lessonId } = useParams();

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`notes-${lessonId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    localStorage.setItem(`notes-${lessonId}`, JSON.stringify(notes));
  }, [notes, lessonId]);

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([...notes, { id: Date.now(), text: noteText.trim() }]);
    setNoteText("");
  };

  const removeNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="fade-in container">
      <h2>Notes for Lesson ID: {lessonId}</h2>
      <div className="input-group">
        <textarea
          placeholder="Add a new note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="input-textarea"
        />
        <button className="btn-primary" onClick={addNote}>
          Add Note
        </button>
      </div>
      {notes.length === 0 && <p>No notes yet.</p>}
      <ul className="notes-list">
        {notes.map((n) => (
          <li key={n.id} className="note-item">
            {n.text}
            <button className="btn-danger" onClick={() => removeNote(n.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
