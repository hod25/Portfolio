import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Download() {
  const router = useRouter();

  useEffect(() => {
    const link = document.createElement("a");
    link.href = "/api/resume?download=1";
    link.download = "Hod_Mitrany_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    router.replace("/");
  }, [router]);

  return <p className="container">Downloading resume...</p>;
}
