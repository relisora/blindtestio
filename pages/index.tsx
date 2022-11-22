import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react";
import Link from 'next/link';
import Login from "../components/login-btn";

export default function Home() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return (
    <div className={styles.container}>
      <div style={{ float: 'right' }} >
        <Login /> <br />
      </div>
      <h1>Blindtest IO</h1>
      <div>The best blind test website blabla</div>
      {session && <button><Link href="playlists">See your playlists</Link></button>}
      <Head>
        <title>Blind Test IO</title>
        <meta name="description" content="Try your music knowledge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
