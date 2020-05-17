import React from "react";
import './SearchBar.css';
import '../../util/Spotify';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        // Default to empty string
        this.state = {term: ''};
    }
    search() {
        this.props.onSearch(this.state.term);
    }
    handleTermChange(e) {
        this.setState({term: e.target.value})
    }
    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )};
}