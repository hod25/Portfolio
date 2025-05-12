// pages/download.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Download() {
  const router = useRouter();

  useEffect(() => {
    // יוצר הורדה מיידית של הקובץ
    const link = document.createElement('a');
    link.href = '/Hod_Mitrany_Resume.pdf';
    link.download = 'Hod_Mitrany_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // הפנייה חזרה לדף הבית (או כל עמוד אחר)
    router.replace('/');
  }, []);

  return <p>Downloading resume...</p>;
}