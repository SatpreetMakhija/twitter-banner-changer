import React from "react";
import {Container, Navbar, Button, Image} from 'react-bootstrap';
import useStore from "../Store";
import axios from "axios";


function MyNavBar () {

    const user = useStore(state => state.user);
    const userLoginStatus = useStore(state => state.user);

    

    return (
        <React.Fragment>
        <Navbar>
        <Container>
          <Navbar.Brand href="/">Twitter Banner Changer</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {/* Signed in as: <a href="#login">Mark Otto</a> */}
              {userLoginStatus ? user.name : ""}
            </Navbar.Text>
            {userLoginStatus ? <Navbar.Text>
              <Image src={user.profileImageUrl} roundedCircle/>
              {/* <Button onClick={logOutUser}>Logout</Button> */}
            </Navbar.Text> : ""}
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </React.Fragment>
    )
}

export default MyNavBar;
