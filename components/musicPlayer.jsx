import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/fullScreen.module.scss'

export default function MusicPlayer({ tracks }) {
    const [position, setPosition] = useState(0)
    const [audio] = useState(new Audio())
    const [songImage, setSongImage] = useState('/spotify_song.png')
    const [song, setSong] = useState({})
    const [isShowingAnswer, setShowingAnswer] = useState(false)

    useEffect(() => {
        if (tracks.length) {
            blindTestLoad()
            blindTestPlay()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position])

    const blindTestLoad = () => {
        if (tracks.length) {
            audio.src = tracks[position].preview_url
            setSongImage('/spotify_song.png')
            setSong(tracks[position])
            audio.load()
        }
    }

    const blindTestPlay = () => {
        if (!audio.paused || !audio.src) {
            blindTestLoad()
        }
        audio.play().catch(e => console.log(e))
        audio.onended = async () => {
            setShowingAnswer(true)
            setSongImage(tracks[position].album.images[0].url)
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Sleep
            setShowingAnswer(false)
            blindTestNext()
        }
    }

    const blindTestNext = async () => {
        setShowingAnswer(true)
        setSongImage(tracks[position].album.images[0].url)
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Sleep
        if (position + 1 === tracks.length) return
        setShowingAnswer(false)
        setPosition(position + 1)
    }

    const blindTestPause = () => {
        audio.pause()
    }

    if (!song) return 'Loading...'

    return (
        <div className={styles.fullScreenPage}>
            <div className={styles.imageContainer}>
                {isShowingAnswer
                    ? <Image src={songImage} fill alt="song image" priority></Image>
                    : <Image src="/spotify_song.png" fill alt="song image" priority></Image>}
            </div>
            {isShowingAnswer &&
                <>
                    <Box mb={4} fontSize='4xl'>
                        {song.name}
                    </Box>
                    {song?.artists.map(artist => <Box fontSize='2xl' key={artist.id}>{artist.name}</Box>)}
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
