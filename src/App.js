/**
 * @Date:   2020-01-27T10:40:37+00:00
 * @Last modified time: 2020-02-17T18:46:24+00:00
 */



import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import ArtistIndex from './views/artists/Index'
import ArtistCreate from './views/artists/Create'
import ArtistShow from './views/artists/Show'
import ArtistEdit from './views/artists/Edit'
import AlbumIndex from './views/albums/Index'
import AlbumCreate from './views/albums/Create'
import AlbumShow from './views/albums/Show'
import AlbumEdit from './views/albums/Edit'
import MyNavbar from './components/MyNavbar'
import Register from './views/auth/Register'
import Login from './views/auth/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
{/*import SongIndex from './views/songs/Index'
import SongCreate from './views/songs/Create'
import SongShow from './views/songs/Show'
import SongEdit from './views/songs/Edit' */}


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem('jwtToken') !== null
    }
  }

  authHandler = () => {
    this.setState((state, props) => ({
      loggedIn: state.loggedIn ? false : true
    }));
  }

  render() {

    const loggedIn = this.state.loggedIn;
    return (
      <BrowserRouter>
        <MyNavbar loggedIn = {loggedIn} onLogout={this.authHandler} />
        <Container>
          <Row>
          <Col>
            <Switch>

              <Route exact path="/">{(props)=> <ArtistIndex {...props} loggedIn = {loggedIn}/>}</Route>
              <Route exact path="/artists/create">{loggedIn ? (props)=> <ArtistCreate {...props} loggedIn = {loggedIn}/> : <Redirect to="/artists"/>}</Route>
              <Route path="/artists/:id" exact component={(props) => <ArtistShow {...props} loggedIn = {loggedIn}/> } />
              <Route path="/artists/:id/edit" exact component={ArtistEdit} />

              <Route exact path="/albums">{(props)=> <AlbumIndex {...props} loggedIn = {loggedIn}/>}</Route>
              <Route exact path="/albums/create">{loggedIn ? (props)=> <AlbumCreate {...props} loggedIn = {loggedIn}/> : <Redirect to="/albums"/>}</Route>
              <Route path="/albums/:id" exact component={(props) => <AlbumShow {...props} loggedIn = {loggedIn}/> } />
              <Route path="/albums/:id/edit" exact component={AlbumEdit} />

            {/*  <Route exact path="/songs">{(props)=> <SongIndex {...props} loggedIn = {loggedIn}/>}</Route>
              <Route exact path="/songs/create">{loggedIn ? (props)=> <SongCreate {...props} loggedIn = {loggedIn}/> : <Redirect to="/songs"/>}</Route>
              <Route path="/songs/:id" exact component={(props) => <SongShow {...props} loggedIn = {loggedIn}/> } />
              <Route path="/songs/:id/edit" exact component={SongEdit} /> */}

              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={(props) => <Login {...props} onLogin={this.authHandler} />} />
            </Switch>
          </Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
  }
}
