/**
 * @Date:   2020-02-17T18:20:15+00:00
 * @Last modified time: 2020-02-17T19:12:53+00:00
 */
 import React, { Component } from 'react';
 import axios from 'axios';
 import Form from 'react-bootstrap/Form'
 import Row from 'react-bootstrap/Row'
 import Col from 'react-bootstrap/Col'
 import Button from 'react-bootstrap/Button'
 import InputGroup from 'react-bootstrap/InputGroup'
 import Badge from 'react-bootstrap/Badge'

 export default class ArtistCreate extends Component {
   constructor(props) {
     super(props);
     this.state = {
       name: '',
       biography: ''
     };
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

   onSubmit = e => {
     e.preventDefault();

     const artist = {
       name: this.state.name,
       biography: this.state.biography
     };

     const loggedIn = this.props.loggedIn;
     console.log(artist);

     axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
     axios.post('http://localhost:4000/artists', artist)
       .then(res => {
         console.log(res.data);
         window.location = '/';
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

   render() {
     return (
       <div>
         <h3>Add New Artist</h3>
         <Form onSubmit={this.onSubmit}>
           <Form.Group as={Row} controlId="formHorizontalIMDB">
             <Form.Label column sm={2}>
               Name
             </Form.Label>
             <Col sm={10}>
               <Form.Control type="text" placeholder="Artist Name"
                 name="name"
                 value={this.state.name}
                 onChange={this.handleInputChange}
               />
             </Col>
           </Form.Group>

           <Form.Group as={Row} controlId="formHorizontalIMDB">
             <Form.Label column sm={2}>
               Biography
             </Form.Label>
             <Col sm={10}>
               <textarea type="text" placeholder="Biography"
                 rows = "10"
                 cols = "105"
                 value={this.state.biography}
                 name="biography"
                 onChange={this.handleInputChange}
               />
             </Col>
           </Form.Group>

           <Form.Group as={Row}>
             <Col sm={{ span: 10, offset: 2 }}>
               <Button type="submit">Add Artist</Button>
             </Col>
           </Form.Group>
         </Form>
       </div>
     )
   }
 }
