import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import SpotifyWebApi from "spotify-web-api-node";
import { Error, Playlists } from 'Spotify';

const playlists = async (req: NextApiRequest, res: NextApiResponse<Playlists | Error>) => {
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

  let rawPlaylists;
  try {
    ({ body: rawPlaylists } = await spotifyApi.getUserPlaylists());
  } catch (err) {
    return res.status(400).send(err);
  }

  let playlists: Playlists = {
    total: rawPlaylists.total,
    items: rawPlaylists.items.map((playlist) => {
      return {
        id: playlist.id,
        image: playlist.images[0].url,
        name: playlist.name,
        spotify_url: playlist.external_urls.spotify,
      };
    }),
  };

  return res.status(200).send(playlists);
};

export default playlists;
