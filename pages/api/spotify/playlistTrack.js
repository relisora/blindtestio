import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]";
const SpotifyWebApi = require("spotify-web-api-node");

const playlistTracks = async (req, res) => {
  const {
    query: { id, offset },
  } = req;
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

  let rawTrack;
  try {
    ({ body: rawTrack } = await spotifyApi.getPlaylistTracks(id, {
      limit: 1,
      offset: offset,
      market: "fr",
    }));
  } catch (err) {
    return res.status(400).send(err);
  }

  const track = {
    id: rawTrack.items[0].track.id,
    image: rawTrack.items[0].track.album.images[0].url,
    name: rawTrack.items[0].track.name,
    artists: rawTrack.items[0].track.artists.map((artist) => {
      return { name: artist.name, id: artist.id };
    }),
    preview_url: rawTrack.items[0].track.preview_url,
  };

  return res.status(200).send(track);
};

export default playlistTracks;
