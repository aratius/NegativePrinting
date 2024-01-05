'use client';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "next/navigation";

export default function Home() {

  const db = useRef(null);
  const [cookies, setCookie] = useCookies();
  const [enabled, setEnabled] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    const firebaseConfig = {
      // ...
      // The value of `databaseURL` depends on the location of the database
      databaseURL: "https://kuma-experiment-default-rtdb.firebaseio.com"
    };

    const app = initializeApp(firebaseConfig);

    db.current = getDatabase(app);
    if (
      !("printed" in cookies) ||
      cookies["printed"] == "0"
    ) {
      setCookie("printed", "0");
      setEnabled(true);
    }
    if (params.get("master") != null) setEnabled(true);

  }, []);

  const onClick = (e) => {
    if (e && e.cancelable) e.preventDefault();
    set(ref(db.current, `/${Date.now()}`), {
      printed: false
    });
    setCookie("printed", "1");
    setEnabled(false);
  };

  return (
    <>
      <main className={styles.main}>
        <p>Negative Printing (Arata Matsumoto)</p>
        {
          enabled ?
            <a href="#" onClick={onClick}>Print</a> :
            <p>You&apos;ve already printed, Thank you.</p>
        }
      </main>
    </>
  );

}