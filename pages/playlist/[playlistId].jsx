import { useState } from 'react';
import { useRouter } from 'next/router'
import MusicPlayer from "../../components/musicPlayer"
import Image from 'next/image'
import { Button } from '@chakra-ui/react';
import style from "../../styles/fullScreen.module.scss"
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Playlist() {
    const router = useRouter()
    const { playlistId } = router.query
    const { data: playlist, error } = useSWR(playlistId ? `/api/spotify/playlist?id=${playlistId}` : null, fetcher)
    const [isPlaying, setPlaying] = useState(false)

    if (error) return <div>Failed to load</div>
    if (!playlist) return <div>Loading...</div>
    if (!playlist.size) return <div>This playlist is empty, or you dont have access to it.</div>

    return (
        <div className={style.fullScreenPage}>
            <h1 className={style.title}>{playlist.name}</h1>
            {!isPlaying &&
                <>
                    <div className={style.imageContainer}>
                        <Image src={playlist.image} fill alt="playlist cover"></Image>
                    </div>
                    <Button onClick={e => setPlaying(true)}>Begin</Button>
                </>
            }
            {isPlaying && <MusicPlayer playlist={playlist} />}
        </div>
    )
}