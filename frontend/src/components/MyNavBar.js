import React from "react";
import {Container, Navbar, Button, Image} from 'react-bootstrap';
import useStore from "../Store";
import axios from "axios";
import './MyNavBar.css'
function MyNavBar () {


    const user = useStore(state => state.user);
    const userLoginStatus = useStore(state => state.user);
    const resetUserLoginStatus = useStore(state => state.resetUserLoginStatus);
    const resetUser = useStore(state => state.resetUser);

    const  logOutUser = async () => {
      const response = await axios.get("http://localhost:8000/logout", {withCredentials: true})
      if (response.data.message === "userLoggedOut") {
        console.log("user is logged out..")
        resetUserLoginStatus();
        resetUser();
        window.location.href = "/";
      } else {
        //Show a sandwitch in frontend saying the logout did not work. Try again. 
        console.log("Some error occured while logging out..")
      }
  
    
    }
    

    return (
        <React.Fragment>
        <Navbar className='color-nav' variant='light' expand='lg' style={{height:"10vh", position: "fixed", width: "100vw"}} >
        
        <Container>
          <Navbar.Brand href="/"><h2>Twitter Banner Changer</h2></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {/* Signed in as: <a href="#login">Mark Otto</a> */}
              {userLoginStatus ? user.name : ""}
            </Navbar.Text>
            {userLoginStatus ? <Navbar.Text>
              <Image src={user.profileImageUrl} roundedCircle/>
              <Button onClick={logOutUser}>Logout</Button>
            </Navbar.Text> : ""}
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </React.Fragment>
    )
}

export default MyNavBar;
