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
    const [userAlbums, setUserAlbums] = useState(null);
    

    let navigate = useNavigate();

    const checkUserLoginStatus = () => {
      console.log("inside useffect");
      axios.get("http://localhost:8000/login/success", {withCredentials: true}).then((response) =>{

      if (response.status === 404) {
        console.log("No user found")
        setUser(null);
        setUserLoginStatus(false);
      } else {
       
        

        setUser({name: response.data.user.name, profileImageUrl: response.data.user.profileImageUrl, id: response.data.user.id});
        setUserLoginStatus(true);
        setUserAlbums(response.data.user.albums);
      
        
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


    const DefaultHomeContent = () => <div className="App" > <h1>Dynamically change your twitter profile's banner </h1><br/>
  <Button onClick={setLoginStatus} size='lg' variant='primary'>Sign in with Twitter</Button></div>



  const LoggedInHomeContent = () => <div className='App'>
    <UserAlbums albums={userAlbums}/>
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
