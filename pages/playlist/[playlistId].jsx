import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import MusicPlayer from "../../components/musicPlayer"
import SpotifyWebApi from 'spotify-web-api-js';
import { useSession } from "next-auth/react"
import Image from 'next/image'
import { Button, Heading } from '@chakra-ui/react';
import style from "../../styles/fullScreen.module.scss"

const spotifyApi = new SpotifyWebApi();

export default function Playlist() {
    const { data: session } = useSession()
    const router = useRouter()
    const { playlistId } = router.query
    const [playlist, setPlaylist] = useState('')
    const [tracks, setTracks] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [isPlaying, setPlaying] = useState(false)

    if (session) spotifyApi.setAccessToken(session.accessToken)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getPlaylistTracks()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    const getPlaylistTracks = async () => {
        // Get every track from the playlist
        let playlistTracks = []
        try {
            playlistTracks = await getTracks(playlistId, 100, 0)
        }
        catch (e) {
            setLoading(false)
        }
        // Remove tracks with no preview url (spotify api bug?)
        const tracksWithPreview = playlistTracks.filter(track => track.preview_url !== null)
        // Shuffle array
        let shuffled = tracksWithPreview
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        setTracks(shuffled);
        setLoading(false)
    }

    const getTracks = async (id, limit, offset) => {
        const playlist = await spotifyApi.getPlaylist(id, { limit, offset })
        setPlaylist(playlist)
        let playlistTracks = playlist.tracks.items.map(item => item.track);
        if (limit + offset < playlist.tracks.total) {
            const moreTracks = await getTracks(id, limit, offset + 100)
            playlistTracks = [...playlistTracks, ...moreTracks]
        }
        return playlistTracks
    }

    if (isLoading) return "LOADING"
    if (tracks.length === 0) return "This playlist doesn't exist, or you don't have the right to see it"

    return (
        <div className={style.fullScreenPage}>
            <h1 className={style.title}>{playlist.name}</h1>
            {!isPlaying &&
                <>
                    <div className={style.imageContainer}>
                        <Image src={playlist.images[0].url} fill alt="coucou"></Image>
                    </div>
                    <Button onClick={e => setPlaying(true)}>Begin</Button>
                </>
            }
            {isPlaying && <MusicPlayer tracks={tracks} />}
        </div>
    )
}