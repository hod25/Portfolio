import { useEffect, useRef } from "react";

interface ReadmeViewerProps {
  html: string;
}

export default function ReadmeViewer({ html }: ReadmeViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleError = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement) {
        target.style.display = "none";
      }
    };

    // Hide any images that already failed before hydration
    container.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) {
        img.style.display = "none";
      }
    });

    container.addEventListener("error", handleError, true);
    return () => {
      container.removeEventListener("error", handleError, true);
    };
  }, [html]);

  if (!html) return null;

  return (
    <div
      ref={contentRef}
      className="readme-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
