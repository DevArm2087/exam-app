import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Books({ selectedLesson, onSelectBook, selectedBook }) {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : [];
  });
  const [bookName, setBookName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (!bookName.trim()) return;
    setBooks([...books, { id: Date.now().toString(), name: bookName.trim() }]);
    setBookName("");
  };

  const removeBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  // انتخاب کتاب و رفتن به صفحه پاسخبرگ
  const selectBook = (id) => {
    onSelectBook(id);
    navigate(`/answer-sheet?lesson=${selectedLesson}&book=${id}`);
  };

  return (
    <div className="fade-in container">
      <h2>Choose a Book for Lesson</h2>
      <p>Lesson ID: {selectedLesson}</p>

      <div className="input-group">
        <input
          type="text"
          placeholder="New book name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="input-text"
        />
        <button className="btn-primary" onClick={addBook}>
          Add Book
        </button>
      </div>

      {books.length === 0 && <p>No books added yet.</p>}

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <button
              className="btn-link"
              onClick={() => selectBook(book.id)}
              aria-pressed={selectedBook === book.id}
            >
              {book.name}
            </button>
            <button className="btn-danger" onClick={() => removeBook(book.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
