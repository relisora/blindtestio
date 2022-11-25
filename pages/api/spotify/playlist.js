import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./../auth/[...nextauth]"
const SpotifyWebApi = require('spotify-web-api-node')

export default async (req, res) => {
    const { query: { id } } = req
    const session = await unstable_getServerSession(req, res, authOptions)

    if (!session) {
        return res.status(403).send({
            error: "You must be signed in to view the protected content on this page.",
        })
    }

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.NEXTAUTH_URL,
    });

    spotifyApi.setAccessToken(session.accessToken);

    let rawPlaylist
    try {
        ({ body: rawPlaylist } = await spotifyApi.getPlaylist(id))
    } catch (err) {
        return res.status(400).send(err)
    }

    const playlist = {
        id,
        image: rawPlaylist.images[0].url,
        name: rawPlaylist.name,
        size: rawPlaylist.tracks.total
    }

    return res.status(200).send(playlist);
}