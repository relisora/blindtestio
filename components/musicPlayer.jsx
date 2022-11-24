import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/fullScreen.module.scss'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function MusicPlayer({ playlist }) {
    const [audio] = useState(new Audio())
    const [isShowingAnswer, setShowingAnswer] = useState(false)
    const [pastSongIdx, setPastSongIdx] = useState(new Set())
    const [songIdx, setSongIdx] = useState()
    const [hasEnded, setEnded] = useState(false)
    const { data: track, mutate, error } = useSWR(typeof songIdx === "number" ? `/api/spotify/playlistTrack?id=${playlist.id}&offset=${songIdx}` : null, fetcher)

    useEffect(() => {
        if (playlist.id) randomSongIdx()
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await mutate()
        }
        fetchData()
    }, [songIdx])

    useEffect(() => {
        if (!track) return
        setPastSongIdx(previous => new Set(previous.add(songIdx)))
        if (!track.preview_url) randomSongIdx()
        blindTestLoad()
    }, [track])

    const randomSongIdx = async () => {
        if (pastSongIdx.size - 1 >= playlist.size) {
            setEnded(true)
            return
        }
        // array of all possible track idx
        const allIdx = [...Array(playlist.size).keys()]
        // array of track idx still not played
        const possibleIdx = allIdx.filter(x => !pastSongIdx.has(x))
        // randomly select one track idx
        const newSongIdx = possibleIdx[Math.floor(Math.random() * possibleIdx.length)]
        setSongIdx(newSongIdx)
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
        randomSongIdx()
        setShowingAnswer(false)
    }

    const blindTestPause = () => {
        audio.pause()
    }

    if (hasEnded) return <div>Your playlist has ended. go back to the playlist list to play more!</div>
    if (error) return <div>Failed to load</div>
    if (!track?.preview_url) return 'Loading...'

    return (
        <div className={styles.fullScreenPage}>
            <div className={styles.imageContainer}>
                <Image src={track.image} fill alt="song image" className={!isShowingAnswer && styles.imageHidden}></Image>
                <Image src="/spotify_song.png" fill alt="song image" className={isShowingAnswer && styles.imageHidden}></Image>
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
                    <ButtonGroup disabled>
                        <Button onClick={blindTestPlay}>Play</Button>
                        <Button onClick={blindTestPause}>Pause</Button>
                        <Button onClick={blindTestNext}>Next</Button>
                    </ButtonGroup>
                </>
            }
        </div>
    )
}
