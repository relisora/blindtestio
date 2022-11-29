import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/fullScreen.module.scss'
import useSWR from 'swr'
import Link from 'next/link'
import { CloseIcon } from '@chakra-ui/icons'
import { Error, Track } from 'Spotify'

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function MusicPlayer({ playlist }) {
    const [audio] = useState(new Audio())
    const [isShowingAnswer, setShowingAnswer] = useState(false)
    const [pastTrackIdx, setPastTrackIdx] = useState<Set<number>>(new Set())
    const [trackIdx, setTrackIdx] = useState<number>()
    const [hasEnded, setEnded] = useState(false)
    const { data: nextTrack, mutate, error } = useSWR<Track, Error>(typeof trackIdx === "number" ? `/api/spotify/playlistTrack?id=${playlist.id}&offset=${trackIdx}` : null, fetcher)
    const [track, setTrack] = useState<Track>()

    useEffect(() => {
        randomTrackIdx()
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await mutate()
        }
        fetchData()
    }, [trackIdx])

    useEffect(() => {
        const checkPreviewUrl = () => {
            if (!nextTrack) return
            if (!nextTrack.preview_url) return randomTrackIdx()
            if (!track) loadNextTrack() // first loop, track is not defined so load next track immediately
        }
        checkPreviewUrl()
    }, [nextTrack])

    useEffect(() => {
        blindTestLoad()
    }, [track])

    const randomTrackIdx = async () => {
        if (pastTrackIdx.size - 1 >= playlist.size) {
            setEnded(true)
            return
        }
        // array of all possible track idx
        const allIdx = [...Array(playlist.size).keys()]
        // array of track idx still not played
        const possibleIdx = allIdx.filter(x => !pastTrackIdx.has(x))
        // randomly select one track idx
        const newTrackIdx = possibleIdx[Math.floor(Math.random() * possibleIdx.length)]
        setTrackIdx(newTrackIdx)
        setPastTrackIdx(previous => new Set(previous.add(newTrackIdx)))
    }

    const loadNextTrack = () => {
        setTrack(nextTrack)
        randomTrackIdx()
    }

    const blindTestLoad = () => {
        if (!track?.preview_url) return
        audio.src = track.preview_url
        audio.load()
        blindTestPlay()
    }

    const blindTestPlay = () => {
        if (!audio.src) blindTestLoad()
        audio.play().catch(e => console.log(e))
        audio.onended = async () => {
            blindTestNext()
        }
    }

    const blindTestNext = async () => {
        setShowingAnswer(true)
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Sleep
        loadNextTrack()
        setShowingAnswer(false)
    }

    const blindTestPause = () => {
        audio.pause()
    }

    if (hasEnded) return <div>Your playlist has ended. go back to the playlist list to play more!</div>
    if (error) return <div>Failed to load</div>
    if (!track?.preview_url) return <div>Loading...</div>

    return (
        <div className={styles.fullScreenPage}>
            <Link href="/playlists" className={styles.close} onClick={blindTestPause}><CloseIcon boxSize={10} /></Link>
            <div className={styles.imageContainer}>
                <Image src={track.image} fill alt="track image" sizes="(max-width: 800px) 80vw, 50vw" />
                <Image
                    src="/spotify_track.png"
                    fill
                    alt="track image"
                    sizes="(max-width: 800px) 80vw, 50vw"
                    className={isShowingAnswer ? styles.imageHidden : undefined}
                />
            </div>
            {isShowingAnswer &&
                <>
                    <Box mb={4} fontSize='4xl'>
                        {track.name}
                    </Box>
                    {track.artists.map(artist => <Box fontSize='2xl' key={artist.id}>{artist.name}</Box>)}
                </>
            }
            {!isShowingAnswer &&
                <>
                    <ButtonGroup>
                        <Button onClick={blindTestPlay}>Play</Button>
                        <Button onClick={blindTestPause}>Pause</Button>
                        <Button onClick={blindTestNext}>Next</Button>
                    </ButtonGroup>
                </>
            }
        </div>
    )
}
