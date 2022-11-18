import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('BQDN3ZJ08FQ5h7DC5h8jC3pG6y9gpESBoD4FqHoqyQ8zQQPV-cnszurHClq1bDXPxUaVpfZA8r1-oVkP_QlbvgNT0zkX3tC6-WQ7egMFP-LgmyMEwoICoTM7jtW9vj7TWtif_6Aga9UzF6LBrGFirEpOyp8b1H2X6gb5kDZplQB5peC1xI-FJpYZ88rElqM');

export default function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    spotifyApi.searchTracks('Love').then(
      function (data) {
        console.log('Search by "Love"', data);
        setData(data)
        setLoading(false)
      },
      function (err) {
        console.error(err);
      }
    );
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      {data.tracks.items.map(item => item.name)}
    </div>
  )
}
