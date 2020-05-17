import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from "../SearchResults/SearchResults";
import {Playlist} from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import {Login} from "../Login/Login";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            searchResults: [],
            playlistName: 'My playlist',
            playlistTracks: []
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }
    addTrack(track) {
        const isDuplicate = this.state.playlistTracks.find(savedTrack =>
            savedTrack.id === track.id)

        if (isDuplicate) {
            return;
        } else {
            const newPlaylistTracks = this.state.playlistTracks
            newPlaylistTracks.push(track);
            this.setState({playlistTracks: newPlaylistTracks})
        }
    }
    removeTrack(track) {
        const newPlaylistTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
        this.setState({playlistTracks: newPlaylistTracks})
    }
    updatePlaylistName(name) {
        this.setState({playlistName: name})
    }
    savePlaylist() {
        const trackURIs = this.state.playlistTracks.map(track => track.uri);
        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
            this.setState({
                playlistName: 'New playlist',
                playlistTracks: [],
            })
        })
    }
    search(searchTerm) {
        // pass the promise returned from search to update searchResults
        Spotify.search(searchTerm).then(searchResults => {
            console.log('resolved');
            this.setState({searchResults: searchResults});
        }).catch(error => {console.log(error);});
    }
    render() {
        return (
      <div>
        <h1><span className="highlight">Spotify</span>Jam</h1>
        <div className="App">
            <Login />
            <SearchBar onSearch={(searchTerm) => this.search(searchTerm)}/>
          <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={(track) => this.addTrack(track)}/>
              <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
                        onRemove={(track) => this.removeTrack(track)}
                        onNameChange={(name) => this.updatePlaylistName(name)}
                        onSave={() => this.savePlaylist()}/>
          </div>
        </div>
      </div>
  )};
}
export default App;
