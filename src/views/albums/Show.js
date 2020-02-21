/**
 * @Date:   2020-01-22T06:50:52+00:00
 * @Last modified time: 2020-02-14T18:44:42+00:00
 */
import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Song = props => (
  <Badge variant = "Light">{props.song}</Badge>
)

export default class AlbumShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      album: {},
      loading: true
    };
  }

componentDidMount() {
  const { id } = this.props.match.params;

  axios.get((process.env.REACT_APP_BACKEND || 'http://localhost:4000/')+`albums/${id}`)
    .then(response => {
      console.log(response);
      this.setState({
        album: response.data,
        loading:false
      })
    })
    .catch((error) => {
      console.log(error);
    })
}

songList() {
  return this.state.album.songs.map((currentSong, index) => {
    return <Song song={currentSong.name} key={index} />;
  })
}

onDelete = () => {
  const { id } = this.props.match.params;
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
  axios.delete((process.env.REACT_APP_BACKEND || 'http://localhost:4000/')+`albums/${id}`)
    .then((res) => {
      console.log('Album successfully deleted!')
      window.location = '/albums';
    }).catch((error) => {
      console.log(error)
    })
}

render() {
  const { id } = this.props.match.params;
  const { album, loading } = this.state;
  const loggedIn = this.props.loggedIn;

  if (loading) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }

  return(
    <div>
    <br/>
      <Card className = "bg-dark">
        <Card.Header as="h5">{album.name}</Card.Header>
        <Card.Body>
        <Card.Title>Artist</Card.Title>
          <Card.Text>{album.artist.name}</Card.Text>
        <Card.Title>Length</Card.Title>
          <Card.Text>{album.length}</Card.Text>
          <Card.Title>Year</Card.Title>
            <Card.Text>{album.year}</Card.Text>
          <Card.Title>Song</Card.Title>
            <Card.Text>{this.songList()}</Card.Text>
          <Button as={Link} to="/albums" variant="primary">View all albums</Button>
          {loggedIn ?
          <>
          <Button as={Link} to={`/albums/${id}/edit`} variant="primary">Edit</Button>
          <Button onClick={this.onDelete} variant="outline-danger">Delete</Button>
          </>
          :
          <></>
          }
        </Card.Body>
      </Card>
    </div>
  )
}
}
