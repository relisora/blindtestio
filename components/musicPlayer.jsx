import { useState, useEffect } from 'react'

export default function MusicPlayer({ tracks }) {
    const [position, setPosition] = useState(0)
    const [audio, setAudio] = useState(new Audio())

    useEffect(() => {
        if (tracks.length && position !== 0) {
            blindTestLoad()
            blindTestPlay()
        }
    }, [position])

    const blindTestLoad = () => {
        if (tracks.length) {
            audio.src = tracks[position].preview_url
            audio.load()
        }
    }

    const blindTestPlay = () => {
        if (!audio.paused || !audio.src || position === 0) {
            blindTestLoad()
        }
        audio.play()
        audio.onended = async () => {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Sleep
            blindTestNext()
        }
        console.log(`Playing ${tracks[position].name} by ${tracks[position].artists[0].name}`)
    }

    const blindTestNext = () => {
        if (position + 1 === tracks.length) return
        setPosition(position + 1)
        console.log('Next song...')
    }

    const blindTestPause = () => {
        audio.pause()
        console.log("Paused")
    }

    return (
        <div>
            <button onClick={blindTestPlay}>Play</button>
            <button onClick={blindTestPause}>Pause</button>
            <button onClick={blindTestNext}>Next</button>
        </div>
    )
}
