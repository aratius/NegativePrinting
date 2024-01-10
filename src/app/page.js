'use client';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

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
      <Head>
        <title>ネガティブ・プリンティング（松本　新）</title>
        <link rel="icon" href="/favicon.ico" />

        {/* OG */}
        <meta property="og:url" content="/face.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ネガティブ・プリンティング（松本　新）" />
        <meta property="og:description" content="" />
        <meta property="og:site_name" content="FloatingMyFace" />
        <meta property="og:image" key="ogImage" content="/face.jpg" />
        <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
        <meta name="twitter:site" content={`@$aualrxse`} />
      </Head>
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