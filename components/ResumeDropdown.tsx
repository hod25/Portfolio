"use client";
import { useState, useRef, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';

export default function ResumeDropdown() {
  const resumeViewUrl = "/api/resume";
  const resumeDownloadUrl = "/api/resume?download=1";
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // זיהוי מובייל
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  // במובייל - הורדה ישירה, בדסקטופ - תפריט
  const handleClick = () => {
    if (isMobile) {
      // הורדה ישירה במובייל
      const link = document.createElement('a');
      link.href = resumeDownloadUrl;
      link.download = 'Hod_Mitrany_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // תפריט בדסקטופ
      setOpen(!open);
    }
  };

  return (
    <div className="resume-dropdown" ref={ref}>
      <a onClick={handleClick} className="profile-link">
        <FaFileAlt /> <span className="link-text">Resume</span>
      </a>
      {!isMobile && open && (
        <div className="resume-menu">
          <a href={resumeDownloadUrl} download>Download PDF</a>
          <a href={resumeViewUrl} target="_blank">View PDF</a>
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
