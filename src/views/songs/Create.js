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

const Genre = props => (
  <Badge variant="light">{props.genre}</Badge>
)

export default class SongCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      album: '',
      albums: [],
      genre: [],
      genreText: '',
      length: ''
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/albums')
      .then(res => {
        console.log("data:", res.data);
        this.setState({
          albums: res.data,
          album: res.data[0]._id
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

  onAddGenre = () => {
    this.setState(state => {
      const genre = [...state.genre, state.genreText];
      return {
        genre,
        genreText: '',
      };
    });
  };

  onSubmit = e => {
    e.preventDefault();


    let genreJSON = this.state.genre.map((name, index) => {
      return{name};
    })

    const song = {
      name: this.state.name,
      album: this.state.album,
      genre: genreJSON,
      length: this.state.length,
    }

    const loggedIn = this.props.loggedIn;
    console.log(song);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.post('http://localhost:4000/songs', song)
      .then(res => {
        console.log(res.data);
        window.location = '/songs';
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

  genreList() {
    return this.state.genre.map((currentGenre, index) => {
      return <Genre genre={currentGenre} key={index} />
    })
  }

  render() {
    console.log(this.state.album)
    return (
      <div>
        <h3>Add New Song</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Group as={Row} controlId="formHorizontalIMDB">
            <Form.Label column sm={2}>
              Song
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Song"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalTitle">
            <Form.Label column sm={2}>
              Album
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="select"
                name="album"
                onChange={this.handleInputChange}>
                {this.state.albums.map((album, index) => {
                  return <option key={index} value={album._id}>{album.name}</option>
                })}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId = "formHorizontalTitle">
            <Form.Label column sm={2}>
              Genres
            </Form.Label>
            <Col sm={4}>
              <InputGroup>
                <Form.Control type ="text" placeholder="Genre"
                  name="genreText"
                  value={this.state.genreText}
                  onChange={this.handleInputChange}
                />
                <InputGroup.Append>
                  <Button onClick={this.onAddGenre} variant="outline-success">Add Genre</Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Group>

          <Row>
            <Col sm={{ span:10, offset: 2}}>
              { this.genreList() }
            </Col>
          </Row>
          <br/>

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

          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Add Song</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    )
  }
}
