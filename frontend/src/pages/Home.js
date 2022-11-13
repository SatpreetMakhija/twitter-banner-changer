import {React, useState} from "react";
import { Button } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import UserAlbums from "../components/UserAlbums";


function Home() {

    let [isLoggedIn, setLogin] = useState(false);
    let navigate = useNavigate();
    const routeChange = () => {
        
        let path = '/create-album';
        navigate(path);
        
    }

  const setLoginStatus = () => {
    setLogin(!isLoggedIn);
    console.log(`The user's login status is ${isLoggedIn}`);
  }
    const DefaultHomeContent = () => <div className="App"> Dynamically change your twitter profile's banner <br/>
  <button onClick={setLoginStatus}>Sign in with Twitter</button></div>


  const LoggedInHomeContent = () => <div className='App'>
    <UserAlbums/>
    Let's get started. <br/>
    <Button variant="primary" onClick={routeChange}>Create an album</Button>
   
  </div>

    return (
       
        <div>
            {isLoggedIn ?  <LoggedInHomeContent/> : <DefaultHomeContent/>}
        </div>
    )


}

export default Home;
