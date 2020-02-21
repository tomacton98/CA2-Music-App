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

const Genre = props => (
  <Badge variant = "Light">{props.genre}</Badge>
)

export default class SongShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: {},
      loading: true
    };
  }

componentDidMount() {
  const { id } = this.props.match.params;

  axios.get(`http://localhost:4000/songs/${id}`)
    .then(response => {
      console.log(response);
      this.setState({
        song: response.data,
        loading:false
      })
    })
    .catch((error) => {
      console.log(error);
    })
}

genreList() {
  return this.state.song.genre.map((currentGenre, index) => {
    return <Genre genre={currentGenre.name} key={index} />;
  })
}

onDelete = () => {
  const { id } = this.props.match.params;
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
  axios.delete(`http://localhost:4000/songs/${id}`)
    .then((res) => {
      console.log('Student successfully deleted!')
      window.location = '/songs';
    }).catch((error) => {
      console.log(error)
    })
}

render() {
  const { id } = this.props.match.params;
  const { song, loading } = this.state;
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
      <Card>
        <Card.Header as="h5">{song.name}</Card.Header>
        <Card.Body>
          <Card.Title>Album</Card.Title>
            <Card.Text>{song.album.name}</Card.Text>
          <Card.Title>Genre</Card.Title>
            <Card.Text>{this.genreList()}</Card.Text>
          <Card.Title>Length</Card.Title>
            <Card.Text>{song.length}</Card.Text>
          <Button as={Link} to="/songs" variant="primary">View all songs</Button>
          {loggedIn ?
            <>
          <Button as={Link} to={`/songs/${id}/edit`} variant="primary">Edit</Button>
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
