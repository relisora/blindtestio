import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { useSession } from "next-auth/react"
import Link from 'next/link';
import Image from 'next/image'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';

const spotifyApi = new SpotifyWebApi();

export default function Playlists() {
    const { data: session } = useSession()
    const [playlists, setPlaylists] = useState(null)
    const [loading, setLoading] = useState(true)

    if (session) spotifyApi.setAccessToken(session.accessToken)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists(session.user.id).then((data) => {
                setPlaylists(data)
                setLoading(false)
            },
                function (err) {
                    console.error(err);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    if (loading) return "LOADING"
    if (!playlists) return <p>No playlist found on your profile</p>

    return (
        <div>
            <p><Link href="/">Back</Link ></p>
            <Heading as="h1">Your playlists</Heading>
            <TableContainer>
                <Table >
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Playlist</Th>
                            <Th>Edit</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {playlists.items.map(item =>
                            <Tr key={item.id}>
                                <Td p={1}><Link href={"/playlist/" + item.id}><Image src={item.images[0].url} width='60' height='60' alt={item.name}></Image></Link></Td>
                                <Td><Link href={"/playlist/" + item.id}>{item.name}</Link></Td>
                                <Td><a href={item.external_urls.spotify} target="_blank" rel="noreferrer"><EditIcon /></a></Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    )
}
