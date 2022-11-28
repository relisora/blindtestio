import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import SpotifyWebApi from "spotify-web-api-node";
import { Error, Track } from 'Spotify';

const playlistTracks = async (req: NextApiRequest, res: NextApiResponse<Track | Error>) => {
  const id: string = String(req.query.id)
  const offset: number = Number(req.query.offset)
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
    const playlistTrack = (await spotifyApi.getPlaylistTracks(id, {
      limit: 1,
      offset: offset,
      market: "fr",
    })).body;

    const track = {
      id: playlistTrack.items[0].track.id,
      image: playlistTrack.items[0].track.album.images[0].url,
      name: playlistTrack.items[0].track.name,
      artists: playlistTrack.items[0].track.artists.map((artist) => {
        return { name: artist.name, id: artist.id };
      }),
      preview_url: playlistTrack.items[0].track.preview_url,
    };

    return res.status(200).send(track);
  } catch (err) {
    return res.status(400).send(err);
  }
};

export default playlistTracks;
