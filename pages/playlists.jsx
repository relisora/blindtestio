import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { useSession } from "next-auth/react"
import MusicPlayer from "../components/musicPlayer"
import Link from 'next/link';

const spotifyApi = new SpotifyWebApi();

export default function Playlists() {
    const { data: session } = useSession()
    const [playlists, setPlaylists] = useState(null)
    const [tracks, setTracks] = useState([])

    if (session) spotifyApi.setAccessToken(session.accessToken)

    const selectPlaylist = async (id, e) => {
        // Get every track from the playlist
        const playlistTracks = await getPlaylistTracks(id, 100, 0)
        // Remove tracks with no preview url (spotify api bug?)
        const tracksWithPreview = playlistTracks.filter(track => track.preview_url !== null)
        // Shuffle array
        let shuffled = tracksWithPreview
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        setTracks(shuffled);
    };

    const getPlaylistTracks = async (id, limit, offset) => {
        const playlist = await spotifyApi.getPlaylist(id, { limit, offset })
        let playlistTracks = playlist.tracks.items.map(item => item.track);
        if (limit + offset < playlist.tracks.total) {
            const moreTracks = await getPlaylistTracks(id, limit, offset + 100)
            playlistTracks = [...playlistTracks, ...moreTracks]
        }
        return playlistTracks
    }

    useEffect(() => {
        if (session) {
            spotifyApi.getUserPlaylists(session.user.id).then((data) => {
                setPlaylists(data)
            },
                function (err) {
                    console.error(err);
                })
        }
    }, [session])

    if (!playlists) return <p>No playlist found on your profile</p>

    return (
        <div>
            <p><Link href="/">Home</Link ></p>
            <h2>Playlist List</h2>
            {playlists.items.map(item => <li key={item.id} onClick={selectPlaylist.bind(this, item.id)}>{item.name}</li>)}
            {!playlists?.items?.length && <p>You dont have any playlist. Create one and refresh this page.</p>}

            {tracks.length > 0 &&
                <div>
                    Song lenght: {tracks.length} <br />
                    <MusicPlayer tracks={tracks} />
                </div>
            }
        </div>
    )
}
