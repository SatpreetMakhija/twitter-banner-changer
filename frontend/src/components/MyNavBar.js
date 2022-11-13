import React from "react";
import {Container, Navbar, Button} from 'react-bootstrap';




function MyNavBar () {


    let isLoggedIn = true;


    return (
        <React.Fragment>
        <Navbar>
        <Container>
          <Navbar.Brand href="/">Twitter Banner Changer</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {/* Signed in as: <a href="#login">Mark Otto</a> */}
              {isLoggedIn ? <a href="#login">Mark Otto</a> : ""}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </React.Fragment>
    )
}

export default MyNavBar;
