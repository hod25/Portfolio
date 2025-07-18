"use client";
import { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

export default function ResumeDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // סגירה אוטומטית אם לוחצים מחוץ לרכיב
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="resume-dropdown" ref={ref}>
      <a onClick={() => setOpen(!open)} className="profile-link">
        <FaUser /> <span className="link-text">CV</span>
      </a>
      {open && (
        <div className="resume-menu">
          <a href="/Hod_Mitrany_Resume.pdf" download>Download PDF</a>
          <a href="/Hod_Mitrany_Resume.pdf" target="_blank">View PDF</a>
          <a
            href="https://docs.google.com/document/d/1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW/edit?usp=sharing"
            target="_blank"
          >
            Google Docs
          </a>
        </div>
      )}
    </div>
  );
}
