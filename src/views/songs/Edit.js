/**
 * @Date:   2020-01-22T06:50:52+00:00
 * @Last modified time: 2020-02-13T19:28:24+00:00
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

 export default class SongEdit extends Component {
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
     const { id } = this.props.match.params;

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

       axios.get(`http://localhost:4000/songs/${id}`)
         .then(response => {
           console.log(response);
           var genre = response.data.genre.map(genre => {
             return genre.name;
           });
           this.setState({
             name: response.data.name,
             album: response.data.album,
             genre: genre,
             length: response.data.length
           });
         })
         .catch((error) => {
           console.log(error);
         })
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

   onDelete() {
     const { id } = this.props.match.params;
     axios.delete(`http://localhost:4000/songs/${id}`)
       .then((res) => {
         console.log('Student successfully deleted!')
       }).catch((error) => {
         console.log(error)
       })
   }

   onSubmit = e => {
     const { id } = this.props.match.params;
     e.preventDefault();

     let genreJSON = this.state.genre.map((name, index) => {
       return { name };
     })

     const song = {
       name: this.state.name,
       album: this.state.album,
       genre: genreJSON,
       length: this.state.length
     }

     console.log(song);
     console.log(localStorage.getItem('jwtToken'));
     axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
     axios.put(`http://localhost:4000/songs/${id}`, song)
       .then(res => {
         console.log(res.data);
         this.props.history.push("/songs");
       })
       .catch(err => {
         console.log(err)
         // this.props.history.push("/login");
       });
   };

   genreList() {
     return this.state.genre.map((currentGenre, index) => {
       return <Genre genre={currentGenre} key={index} />
     })
   }

   render() {
     return (
       <div>
         <h3>Edit Song</h3>
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
               <Button type="submit">Save Changes</Button>
             </Col>
           </Form.Group>
         </Form>
       </div>
     )
   }

 }
