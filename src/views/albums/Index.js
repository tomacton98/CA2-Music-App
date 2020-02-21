/**
 * @Date:   2020-02-17T18:20:34+00:00
 * @Last modified time: 2020-02-17T19:20:40+00:00
 */
import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Album = props => (
   <tr>
     <td><Link to={`/albums/${props.album._id}`}>{props.album.name}</Link></td>
     <td><Link to={`/artists/${props.album.artist._id}`}>{props.album.artist.name}</Link></td>
   </tr>
 )

export default class AlbumIndex extends Component {

   constructor(props) {
     super(props);

     this.state = {
       albums: [],
       loggedIn: props.loggedIn
     };
   }

   componentDidMount() {
     axios.get((process.env.REACT_APP_BACKEND || 'http://localhost:4000/')+'albums/')
     .then(response => {
       console.log(response);
       this.setState({
         albums: response.data
       })
       console.log(this.state.albums);
     })
     .catch((error) => {
       console.log(error);
     })
   }

   albumList() {
     return this.state.albums.map(currentAlbum => {
       return <Album album={currentAlbum} key={currentAlbum._id} />;
     })
   }

   render() {
     const loggedIn = this.props.loggedIn;
     return (
       <div>
         <h3>Album List</h3>
         {loggedIn ?
         <>
          <Col className="px-0">
            <Button as={Link} to="/albums/create" variant="primary" className="my-3 float-right">Create</Button>
          </Col>
         </>
         :
         <></>
         }
         <Table striped bordered hover variant="dark">
           <thead>
             <tr>
               <th>Album</th>
               <th>Artist</th>
             </tr>
           </thead>
           <tbody>
             { this.albumList() }
           </tbody>
         </Table>
       </div>
     );
   }
 }
