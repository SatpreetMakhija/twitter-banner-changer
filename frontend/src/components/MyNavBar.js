import React, { useEffect, useState } from "react";
import {Container, Navbar, Button, Image} from 'react-bootstrap';
import useStore from "../Store";
import axios from "axios";
import './MyNavBar.css'
import NotificationOverlay from "./NotificationOverlay";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Popover } from "react-bootstrap";

function MyNavBar () {


    const user = useStore(state => state.user);
    const userLoginStatus = useStore(state => state.user);
    const resetUserLoginStatus = useStore(state => state.resetUserLoginStatus);
    const resetUser = useStore(state => state.resetUser);
    const [lastFewBannerChangeJobs, setLastFewBannerChangeJobs] = useState(null);

    const  logOutUser = async () => {
      const response = await axios.get(process.env.REACT_APP_HOST+"/api/logout", {withCredentials: true})
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
    
    useEffect(() => {
      
      async function fetchLastJobs() {
        try {
          let response = await axios.get(process.env.REACT_APP_HOST+"/api/user/jobs", {withCredentials: true});
          setLastFewBannerChangeJobs(response.data.userJobs);
        } catch(err) {
          console.log(err);
        }
      }

      fetchLastJobs();

    }, []);


    return (
        <React.Fragment>
        <Navbar className='color-nav' variant='light' expand='lg' style={{height:"10vh", position: "fixed", width: "100vw"}} >
        
        <Container>
          <Navbar.Brand href="/"><h2>Twitter Banner Changer</h2></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
          {lastFewBannerChangeJobs && <OverlayTrigger trigger="click" placement="bottom" overlay={NotificationOverlay({lastFewBannerChangeJobs: lastFewBannerChangeJobs})} rootClose={true}>
    <Button variant="success" >Notifications</Button>
  </OverlayTrigger>}
            <Navbar.Text>
              {/* Signed in as: <a href="#login">Mark Otto</a> */}
              {userLoginStatus && user.name }
            </Navbar.Text>
            {userLoginStatus && <Navbar.Text>
              <Image src={user.profileImageUrl} roundedCircle/>
              <Button onClick={logOutUser}>Logout</Button>
            </Navbar.Text>}
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </React.Fragment>
    )
}

export default MyNavBar;
