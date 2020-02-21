/**
 * @Date:   2020-02-17T18:20:26+00:00
 * @Last modified time: 2020-02-17T18:20:26+00:00
 */
 import React, { Component } from 'react';
 import axios from 'axios';
 import Form from 'react-bootstrap/Form'
 import Row from 'react-bootstrap/Row'
 import Col from 'react-bootstrap/Col'
 import Button from 'react-bootstrap/Button'
 import InputGroup from 'react-bootstrap/InputGroup'
 import Badge from 'react-bootstrap/Badge'

 export default class ArtistEdit extends Component {
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

   componentDidMount() {
     const { id } = this.props.match.params;

     axios.get(`http://localhost:4000/artists/${id}`)
       .then(response => {
         console.log(response);
         this.setState({
           name: response.data.name,
           loading: true
         });
       })
       .catch((error) => {
         console.log(error);
       })
   }

   onDelete() {
     const { id } = this.props.match.params;
     axios.delete(`http://localhost:4000/artists/${id}`)
       .then((res) => {
         console.log('Artist successfully deleted!')
       }).catch((error) => {
         console.log(error)
       })
   }

   onSubmit = e => {
     const { id } = this.props.match.params;
     e.preventDefault();

     const artist = {
       name: this.state.name,
       biography: this.state.biography
     }

     console.log(artist);
     console.log(localStorage.getItem('jwtToken'));
     axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
     axios.put(`http://localhost:4000/artists/${id}`, artist)
       .then(res => {
         console.log(res.data);
         this.props.history.push("/");
       })
       .catch(err => {
         console.log(err)
         // this.props.history.push("/login");
       });
   };

   render() {
     return (
       <div>
         <h3>Edit Artist</h3>
         <Form onSubmit={this.onSubmit}>
           <Form.Group as={Row} controlId="formHorizontalIMDB">
             <Form.Label column sm={2}>
               Name
             </Form.Label>
             <Col sm={10}>
               <Form.Control type="text" placeholder=""
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
           
           <br />
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
