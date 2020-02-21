/**
 * @Date:   2020-01-27T10:40:37+00:00
 * @Last modified time: 2020-02-14T19:33:41+00:00
 */



import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Song = props => (
  <tr>
  <td><Link to={`/songs/${props.song._id}`}>{props.song.name}</Link></td>
  <td><Link to={`/albums/${props.song.album._id}`}>{props.song.album.name}</Link></td>
  </tr>
)

export default class SongIndex extends Component {

  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      loggedIn: props.loggedIn
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/songs/')
    .then(response => {
      console.log(response);
      this.setState({
        songs: response.data
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  songList() {
    return this.state.songs.map(currentSong => {
      return <Song song={currentSong} key={currentSong._id} />;
    })
  }

  render() {
    const loggedIn = this.props.loggedIn;
    return (
      <div>
        <h3>Song List</h3>
        {loggedIn ?
        <>
         <Col className="px-0">
           <Button as={Link} to="/songs/create" variant="primary" className="my-3 float-right">Create</Button>
         </Col>
        </>
        :
        <></>
        }
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Song</th>
              <th>Album</th>
            </tr>
          </thead>
          <tbody>
            { this.songList() }
          </tbody>
        </Table>
      </div>
    );
  }
}
