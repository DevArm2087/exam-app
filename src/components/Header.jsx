import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const location = useLocation();

  // برای تعیین لینک فعال، کلاس active اضافه می‌کنیم
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Books", path: "/books" },
    { name: "Results", path: "/results" },
  ];

  return (
    <header className="app-header">
      <nav className="nav-menu">
        {navLinks.map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            className={`nav-link ${location.pathname === path ? "active" : ""}`}
          >
            {name}
          </Link>
        ))}
      </nav>

      <Link to="/exam-quick" className="btn-quick-exam">
        Start Quick Exam
      </Link>
    </header>
  );
}

