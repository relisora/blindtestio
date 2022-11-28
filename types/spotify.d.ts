declare module "Spotify" {

  interface PlaylistsItems {
    id: string
    image: string
    name: string
    spotify_url: string
  }

  interface Playlists {
    total: number
    items: [PlaylistItems]
  }

  interface Playlist {
    id: string
    image: string
    name: string
    size: number
  }

  interface Error {
    error: string
  }

  interface Artist {
    id: string
    name: string
  }

  interface Track {
    id: string
    image: string
    name: string
    artists: [Artist]
    preview_url?: string
  }
}