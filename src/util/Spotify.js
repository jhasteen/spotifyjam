import spotifyApiKey from '../secrets/Secrets'

let accessToken;
const redirectURI = 'http://jacquelinejam.surge.sh'
const Spotify = {
    getAccessToken() {
        // if access token exist, return
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        // if access token is in url, save and set time out
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // clear all params and allow for a new auth to get fresh access token when old one expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
            // if token not there, redirect user to login
        } else {
            alert('Logging you in to Spotify');
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${spotifyApiKey}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessURL;
        }
    },
    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        console.log(accessToken);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
            {
                    headers: {Authorization: `Bearer ${accessToken}`}
                }
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`} ;
        let userID;
        const data = {name: playlistName};
        const postInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }
        const getIDUrl = 'https://api.spotify.com/v1/me';

        // GET current user's ID
        return fetch(getIDUrl, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userID = jsonResponse.id;
            // POST a new playlistName
            console.log(jsonResponse.id);
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists?`, postInit).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id
                console.log(jsonResponse);
                // POST trackURIs to playlistName
                return fetch(`/v1/users/${userID}/playlists/${playlistID}/tracks`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({uri: trackURIs})
                    })
                })
        });
    }
}

export default Spotify;
