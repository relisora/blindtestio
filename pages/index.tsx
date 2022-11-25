import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import Login from "../components/login-btn";
import { Heading, Button } from "@chakra-ui/react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut(); // If token cannot be refreshed, sigh out
    }
  }, [session]);

  return (
    <div>
      <div style={{ float: "right" }}>
        <Login /> <br />
      </div>

      <Heading as="h1">Blindtest IO</Heading>
      <div>The best blind test website blabla</div>
      {session && (
        <Button>
          <Link href="playlists">See your playlists</Link>
        </Button>
      )}
      <Head>
        <title>Blind Test IO</title>
        <meta name="description" content="Try your music knowledge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
