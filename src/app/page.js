'use client';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import styles from "./page.module.css";
import { useEffect, useRef } from "react";

export default function Home() {

  const db = useRef(null);

  useEffect(() => {
    const firebaseConfig = {
      // ...
      // The value of `databaseURL` depends on the location of the database
      databaseURL: "https://kuma-experiment-default-rtdb.firebaseio.com"
    };

    const app = initializeApp(firebaseConfig);

    db.current = getDatabase(app);
  }, []);

  const onClick = (e) => {
    if (e && e.cancelable) e.preventDefault();
    console.log("clicked");
    set(ref(db.current, `/${Date.now()}`), {
      printed: false
    });
  };

  return (
    <>
      <main className={styles.main}>
        <p>Negative Printing (Arata Matsumoto)</p>
        <a href="#" onClick={onClick}>Print</a>
      </main>
    </>
  );

}