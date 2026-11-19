import { useState, useRef, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa";

const RESUME_VIEW_URL = "/api/resume";
const RESUME_DOWNLOAD_URL = "/api/resume?download=1";
const RESUME_DOCS_URL =
  "https://docs.google.com/document/d/1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW/edit?usp=sharing";

export default function ResumeDropdown() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClick = () => {
    if (isMobile) {
      const link = document.createElement("a");
      link.href = RESUME_DOWNLOAD_URL;
      link.download = "Hod_Mitrany_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className="resume-dropdown" ref={ref}>
      <button
        type="button"
        onClick={handleClick}
        className="profile-link"
        aria-label="Resume"
        aria-haspopup={isMobile ? undefined : "menu"}
        aria-expanded={isMobile ? undefined : open}
      >
        <FaFileAlt aria-hidden="true" />
        <span className="link-text">Resume</span>
      </button>
      {!isMobile && open && (
        <div className="resume-menu" role="menu">
          <a href={RESUME_DOWNLOAD_URL} download role="menuitem" onClick={() => setOpen(false)}>
            Download PDF
          </a>
          <a
            href={RESUME_VIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            View PDF
          </a>
          <a
            href={RESUME_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Google Docs
          </a>
        </div>
      )}
    </div>
  );
}
