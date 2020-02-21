/**
 * @Date:   2020-02-17T18:20:34+00:00
 * @Last modified time: 2020-02-17T19:20:40+00:00
 */
import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Artist = props => (
   <tr>
     <td><Link to={`/artists/${props.artist._id}`}>{props.artist.name}</Link></td>
   </tr>
 )

export default class ArtistIndex extends Component {

   constructor(props) {
     super(props);

     this.state = {
       artists: [],
       loggedIn: props.loggedIn
     };
   }

   componentDidMount() {
     axios.get('http://localhost:4000/artists/')
     .then(response => {
       console.log(response);
       this.setState({
         artists: response.data
       })
     })
     .catch((error) => {
       console.log(error);
     })
   }

   artistList() {
     return this.state.artists.map(currentArtist => {
       return <Artist artist={currentArtist} key={currentArtist._id} />;
     })
   }

   render() {
     const loggedIn = this.props.loggedIn;
     return (
       <div>
         <h3>Artist List</h3>
         {loggedIn ?
         <>
          <Col className="px-0">
            <Button as={Link} to="/artists/create" variant="primary" className="my-3 float-right">Create</Button>
          </Col>
         </>
         :
         <></>
         }
         <Table striped bordered hover variant="dark">
           <thead>
             <tr>
               <th>Name</th>
             </tr>
           </thead>
           <tbody class = "title">
             { this.artistList() }
           </tbody>
         </Table>
       </div>
     );
   }
 }
