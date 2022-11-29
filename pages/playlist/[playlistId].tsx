import { useState } from 'react';
import { useRouter } from 'next/router'
import MusicPlayer from "../../components/musicPlayer"
import Image from 'next/image'
import { Button } from '@chakra-ui/react';
import styles from "../../styles/fullScreen.module.scss"
import useSWR from 'swr'
import Link from 'next/link';
import { CloseIcon } from '@chakra-ui/icons';
import { Error, Playlist } from 'Spotify';

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function PlaylistPage() {
    const router = useRouter()
    const { playlistId } = router.query
    const { data: playlist, error } = useSWR<Playlist, Error>(playlistId ? `/api/spotify/playlist?id=${playlistId}` : null, fetcher)
    const [isPlaying, setPlaying] = useState(false)

    if (error) return <div>Failed to load</div>
    if (!playlist) return <div>Loading...</div>
    if (!playlist.size) return <div>This playlist is empty, or you dont have access to it.</div>

    return (
        <div>
            <div className={styles.fullScreenPage}>
                <h1 className={styles.title}>{playlist.name}</h1>
                {!isPlaying
                    ? <>
                        <Link href="/playlists" className={styles.close}><CloseIcon boxSize={10} /></Link>
                        <div className={styles.imageContainer}>
                            <Image src={playlist.image} fill alt="playlist cover" sizes="(max-width: 800px) 80vw, 50vw"></Image>
                        </div>
                        <Button onClick={e => setPlaying(true)}>Begin</Button>
                    </>
                    : <MusicPlayer playlist={playlist} />
                }
            </div>
        </div>
    )
}