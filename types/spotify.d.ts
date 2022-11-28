declare module "Spotify" {
  interface Playlist {
    id: string
    image: string
    name: string
    size: number
  }
  interface Error {
    error: string
  }
}