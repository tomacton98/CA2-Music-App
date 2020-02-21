/**
 * @Date:   2020-01-22T06:50:52+00:00
 * @Last modified time: 2020-02-14T17:38:21+00:00
 */
import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Badge from 'react-bootstrap/Badge'

const Song = props => (
  <Badge variant="light">{props.song}</Badge>
)


export default class AlbumCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      artist: '',
      artists: [],
      length: '',
      year: '',
      songs: [],
      songsText: ''
    };
  }

  componentDidMount() {
    axios.get((process.env.REACT_PP_BACKEND || 'http://localhost:4000/')+'artists')
      .then(res => {
        console.log("data:", res.data);
        this.setState({
          artists: res.data,
          artist: res.data[0]._id
        })
      })
      .catch(err => {
        console.log(err)
        if (!this.props.loggedIn){
          window.location = '/login';
        }
      });
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(`Input name ${name}. Input value ${value}.`);

    this.setState({
      [name]: value
    });
  };

  onAddSong = () => {
    this.setState(state => {
      const songs = [...state.songs, state.songsText];
      return {
        songs,
        songsText: '',
      };
    });
  };

  onSubmit = e => {
    e.preventDefault();

    let songJSON = this.state.songs.map((name, index) => {
      return{name};
    })

    const album = {
      name: this.state.name,
      artist: this.state.artist,
      length: this.state.length,
      year: this.state.year,
      songs: songJSON
    }

    const loggedIn = this.props.loggedIn;
    console.log(album);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.post((process.env.REACT_APP_BACKEND || 'http://localhost:4000/')+'albums', album)
      .then(res => {
        console.log(res.data);
        window.location = '/albums';
      })
      .catch(err => {
        console.log(err)
        if (!loggedIn){
          window.location = '/login';
        } else {
          // window.location.reload();
        }

      });
    };

    songList() {
      return this.state.songs.map((currentSong, index) => {
        return <Song song={currentSong} key={index} />
      })
    }

  render() {
    console.log(this.state.artist)
    return (
      <div>
        <h3>Add New Album</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Group as={Row} controlId="formHorizontalIMDB">
            <Form.Label column sm={2}>
              Album
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Album Name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalTitle">
            <Form.Label column sm={2}>
              Artist
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="select"
                name="artist"
                onChange={this.handleInputChange}>
                {this.state.artists.map((artist, index) => {
                  return <option key={index} value={artist._id}>{artist.name}</option>
                })}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId = "formHorizontalTitle">
            <Form.Label column sm={2}>
              Length
            </Form.Label>
            <Col sm={10}>
                <Form.Control type ="length" placeholder="00:00"
                  name="length"
                  value={this.state.length}
                  onChange={this.handleInputChange}
                />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId = "formHorizontalTitle">
            <Form.Label column sm={2}>
              Year
            </Form.Label>
            <Col sm={10}>
                <Form.Control type ="year" placeholder="0000"
                  name="year"
                  value={this.state.year}
                  onChange={this.handleInputChange}
                />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId = "formHorizontalTitle">
            <Form.Label column sm={2}>
              Songs
            </Form.Label>
            <Col sm={4}>
              <InputGroup>
                <Form.Control type ="text" placeholder="Song"
                  name="songsText"
                  value={this.state.songsText}
                  onChange={this.handleInputChange}
                />
                <InputGroup.Append>
                  <Button onClick={this.onAddSong} variant="outline-success">Add Song</Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Row>
              <Col sm={{ span:10, offset: 2}}>
                { this.songList() }
              </Col>
            </Row>
          </Form.Group>


          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Add Album</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    )
  }
}
