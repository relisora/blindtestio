import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import SpotifyWebApi from "spotify-web-api-node";
import { Error, Playlist } from 'Spotify';

const playlist = async (req: NextApiRequest, res: NextApiResponse<Playlist | Error>) => {
  const id: string = String(req.query.id)
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.NEXTAUTH_URL,
  });

  spotifyApi.setAccessToken(session.accessToken);

  try {
    const singlePlaylist = (await spotifyApi.getPlaylist(id)).body

    const playlist: Playlist = {
      id,
      image: singlePlaylist.images[0].url,
      name: singlePlaylist.name,
      size: singlePlaylist.tracks.total,
    };

    return res.status(200).send(playlist);
  } catch (err: unknown) {
    return res.status(400).send({ error: JSON.stringify(err) });
  }
};

export default playlist;
