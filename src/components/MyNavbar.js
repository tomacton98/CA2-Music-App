/**
 * @Date:   2020-01-27T10:40:37+00:00
 * @Last modified time: 2020-02-17T18:33:01+00:00
 */



import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'

export default class MyNavbar extends Component {
  logout = () => {
    localStorage.removeItem('jwtToken');
    this.props.onLogout();
    window.location = '/';
  }

  render() {
    const loggedIn = this.props.loggedIn;
    return (
      <Navbar expand="lg">
        <Navbar.Brand to="/" className="title">MusicApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to ="/">Artists</Nav.Link>
            <Nav.Link as={Link} to ="/albums">Albums</Nav.Link>
        {/*    <Nav.Link as={Link} to ="/songs">Songs</Nav.Link> */}
          </Nav>
          <Nav>
          {(loggedIn) ? (
              <Nav.Link onClick={this.logout}>Logout</Nav.Link>
          ) : (
            <>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
          )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
