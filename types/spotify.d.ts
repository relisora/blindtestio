declare module "Spotify" {

  interface Playlist {
    id: string
    image: string
    name: string
    spotify_url?: string
    size: number
  }

  interface Playlists {
    total: number
    items: Playlist[]
  }

  interface Artist {
    id: string
    name: string
  }

  interface Track {
    id: string
    image: string
    name: string
    artists: Artist[]
    preview_url?: string
  }

  interface Error {
    error: string
  }
}