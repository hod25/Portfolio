"use client";

import { useEffect, useState, useRef } from "react";
import { marked } from "marked";

type ReadmeViewerProps = {
  repoUrl: string;
};

export default function ReadmeViewer({ repoUrl }: ReadmeViewerProps) {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // פונקציה לטיפול בתמונות שלא נטענות
  const handleImageError = (img: HTMLImageElement) => {
    // פשוט הסתר את התמונה
    img.style.display = 'none';
  };

  // פונקציה לעדכון מקורות התמונות וטיפול בשגיאות
  const processImages = () => {
    if (!contentRef.current) return;
    
    const images = contentRef.current.querySelectorAll('img');
    const cleanedUrl = repoUrl
      .replace("https://github.com/", "")
    
      .replace(/\/(tree|blob)\/[^\/]+/, "");
    
    images.forEach((img) => {
      // בדוק אם התמונה כבר עובדת
      if (img.complete && img.naturalWidth > 0) {
        return; // התמונה כבר נטענה בהצלחה
      }
      
      // בדוק אם התמונה כבר מוסתרת
      if (img.style.display === 'none') {
        return; // התמונה כבר מטופלת
      }
      
      const originalSrc = img.getAttribute('src');
      if (!originalSrc) {
        handleImageError(img);
        return;
      }
      
      // אם זה קישור יחסי, נמיר אותו לקישור מלא של GitHub
      if (!originalSrc.startsWith('http')) {
        // נסה עם main branch
        img.src = `https://raw.githubusercontent.com/${cleanedUrl}/main/${originalSrc}`;
      }
      
      // הסר מאזינים קיימים כדי למנוע כפילויות
      const existingHandler = (img as any)._errorHandler;
      if (existingHandler) {
        img.removeEventListener('error', existingHandler);
      }
      
      // צור מאזין חדש
      const errorHandler = () => {
        // אם נכשל עם main, נסה עם master
        if (img.src.includes('/main/')) {
          img.src = img.src.replace('/main/', '/master/');
        } else {
          // אם גם master נכשל, הסתר את התמונה
          handleImageError(img);
        }
      };
      
      // שמור את המאזין על התמונה כדי שנוכל להסיר אותו מאוחר יותר
      (img as any)._errorHandler = errorHandler;
      img.addEventListener('error', errorHandler, { once: true });
      
      // בדוק אם התמונה כבר נכשלה בטעינה
      if (img.complete && img.naturalWidth === 0) {
        handleImageError(img);
      }
    });
  };

  useEffect(() => {
    async function fetchReadme() {
      setLoading(true);
      setError(false);
      setContent("");

      try {
        const cleanedUrl = repoUrl
          .replace("https://github.com/", "")
          .replace(/\/(tree|blob)\/[^\/]+/, "");

        const branches = ["main", "master"];
        let markdown: string | null = null;

        for (const branch of branches) {
          const res = await fetch(`https://raw.githubusercontent.com/${cleanedUrl}/${branch}/README.md`);
          if (res.ok) {
            markdown = await res.text();
            break;
          }
        }

        if (!markdown) {
          setError(true);
          return;
        }

        // סינון שורות ריקות
        const lines = markdown.split('\n').filter(line => line.trim().length > 0);

        // אם יש שורה אחת או פחות — נחשיב את זה כרידמי לא משמעותי
        if (lines.length <= 1) {
          setError(true);
          return;
        }

        // חיתוך לפי "---" או 7 שורות
        const separatorIndex = lines.findIndex(line => line.trim() === '---');
        const relevantLines = separatorIndex !== -1 ? lines.slice(0, separatorIndex) : lines.slice(0, 7);
        const partialMarkdown = relevantLines.join('\n');

        const html: string = await marked.parse(partialMarkdown);
        setContent(html);
      } catch (e) {
        console.error("Error loading README:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
  }, [repoUrl]);

  // הוסף effect לטיפול בתמונות לאחר עדכון התוכן
  useEffect(() => {
    if (content) {
      // השהיה קטנה כדי לוודא שה-DOM עודכן
      const timer = setTimeout(processImages, 100);
      
      // גם אחרי זמן ארוך יותר למקרה של תמונות שטוענות לאט
      const delayedTimer = setTimeout(processImages, 2000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(delayedTimer);
      };
    }
  }, [content]);

  // הוסף effect נוסף שירוץ כל פעם שהקומפוננטה מתעדכנת
  useEffect(() => {
    if (content) {
      const handleImages = () => {
        processImages();
      };
      
      // הוסף מאזין לאירועי load/error של כל התמונות
      const timer = setTimeout(handleImages, 500);
      
      return () => clearTimeout(timer);
    }
  });

  if (loading || error || !content) return null; 

  return (
    <div
      ref={contentRef}
      className="prose mx-auto p-4 bg-white rounded shadow max-w-2xl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
