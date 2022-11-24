import Link from 'next/link';
import Image from 'next/image'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Playlists() {
    const { data: playlists, error } = useSWR('/api/spotify/playlists', fetcher)

    if (error) return <div>Failed to load</div>
    if (!playlists) return <div>Loading...</div>
    if (!playlists?.items?.length) return <div>No playlist found on your profile</div>

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
                        {playlists.items.map(playlist =>
                            <Tr key={playlist.id}>
                                <Td p={1}><Link href={"/playlist/" + playlist.id}><Image src={playlist.image} width='60' height='60' alt={playlist.name}></Image></Link></Td>
                                <Td><Link href={"/playlist/" + playlist.id}>{playlist.name}</Link></Td>
                                <Td><a href={playlist.spotify_url} target="_blank" rel="noreferrer"><EditIcon /></a></Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    )
}
