import {React, useState, useEffect} from "react";
import { Button } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import UserAlbums from "../components/UserAlbums";
import axios from "axios";
import useStore from "../Store";


function Home() {

    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const userLoginStatus = useStore(state => state.userLoginStatus);
    const setUserLoginStatus = useStore(state => state.setUserLoginStatus);
    

    let navigate = useNavigate();

    const checkUserLoginStatus = () => {
      console.log("inside useffect");
      axios.get("http://localhost:8000/login/success", {withCredentials: true}).then((response) =>{

      if (response.status === 404) {
        console.log("No user found")
        setUser(null);
        setUserLoginStatus(false);
      } else {
        console.log("User found");
        console.log(response.data.user);

        setUser({name: response.data.user.name, profileImageUrl: response.data.user.profileImageUrl});
        setUserLoginStatus(true);
        
      }
      })
    }

    useEffect(checkUserLoginStatus, []);


  

    const routeChange = () => {
        
        let path = '/create-album';
        navigate(path);
        
    }

  const setLoginStatus = () => {
    console.log("onclick called")
    window.open("http://localhost:8000/auth/twitter", "_self");
    
  
  }


    const DefaultHomeContent = () => <div className="App"> Dynamically change your twitter profile's banner <br/>
  <button onClick={setLoginStatus}>Sign in with Twitter</button></div>



  const LoggedInHomeContent = () => <div className='App'>
    <UserAlbums/>
    Let's get started. {userLoginStatus? user.name: ''}<br/>
    <Button variant="primary" onClick={routeChange}>Create an album</Button>
   
  </div>

    return (
       
        <div>
            {userLoginStatus ?  <LoggedInHomeContent/> : <DefaultHomeContent/>}
        </div>
    )


}

export default Home;
