/**
 * @Date:   2020-02-17T18:20:50+00:00
 * @Last modified time: 2020-02-17T19:02:55+00:00
 */
 import React, {Component} from 'react';
 import axios from 'axios';
 import { Link } from 'react-router-dom';
 import Badge from 'react-bootstrap/Badge';
 import Card from 'react-bootstrap/Card';
 import Button from 'react-bootstrap/Button';

 export default class ArtistShow extends Component {
   constructor(props) {
     super(props);

     this.state = {
       artist: {},
       loading: true
     };
   }

 componentDidMount() {
   const { id } = this.props.match.params;

   axios.get(`http://localhost:4000/artists/${id}`)
     .then(response => {
       console.log(response);
       this.setState({
         artist: response.data,
         loading:false
       })
     })
     .catch((error) => {
       console.log(error);
     })
 }

 onDelete = () => {
   const { id } = this.props.match.params;
   axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
   axios.delete(`http://localhost:4000/artists/${id}`)
     .then((res) => {
       console.log('Artist successfully deleted!')
       window.location = '/';
     }).catch((error) => {
       console.log(error)
     })
 }

 render() {
   const { id } = this.props.match.params;
   const { artist, loading } = this.state;
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
       <Card className="bg-dark">
         <Card.Header as="h5">{artist.name}</Card.Header>
         <Card.Body>
           <Card.Title>Biography</Card.Title>
            <Card.Text>{artist.biography}</Card.Text>
           <Button as={Link} to="/" variant="primary">View all artists</Button>
           {loggedIn ?
             <>
           <Button as={Link} to={`/artists/${id}/edit`} variant="primary">Edit</Button>
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
