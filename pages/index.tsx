import Head from "next/head";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import { Heading, Button, Stack } from "@chakra-ui/react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut(); // If token cannot be refreshed, sigh out
    }
  }, [session]);

  return (
    <div>
      <div style={{ float: "right" }}></div>

      <Heading as="h1">Blindtest IO</Heading>
      <div>
        Connect your spotify account and try your music knowledge on any
        playlist you want!
      </div>
      {session ? (
        <>
          <Stack spacing={4} direction="row" align="center" my={3}>
            <Button>
              <Link href="playlists">See your playlists</Link>
            </Button>
            <Button onClick={() => signOut()}>Sign out</Button>
          </Stack>
        </>
      ) : (
        <Button onClick={() => signIn("spotify")}>Sign in</Button>
      )}
      <Head>
        <title>Blind Test IO</title>
        <meta name="description" content="Try your music knowledge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
