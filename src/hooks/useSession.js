import { useEffect, useState } from "react";

export default function useSession() {
  const [session, setSession] = useState(() => {
    const raw = window.localStorage.getItem("moneyplus-session");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (session) {
      window.localStorage.setItem("moneyplus-session", JSON.stringify(session));
    } else {
      window.localStorage.removeItem("moneyplus-session");
    }
  }, [session]);

  return [session, setSession];
}
