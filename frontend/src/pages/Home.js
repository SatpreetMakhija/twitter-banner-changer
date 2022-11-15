import {React, useState, useEffect} from "react";
import { Button } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import UserAlbums from "../components/UserAlbums";
import axios from "axios";


function Home() {
    let [user, setUser] = useState({});
    let [isLoggedIn, setLogin] = useState(false);
    let navigate = useNavigate();
    let [tryAuthentication, setTryAuth] = useState(false);

    const checkUserLoginStatus = () => {
      console.log("inside useffect");
      axios.get("http://localhost:8000/login/success", {withCredentials: true}).then((response) =>{

      if (response.status === 404) {
        console.log("No user found")
        setUser(null);
        setLogin(false);
      } else {
        console.log("User found");
        console.log(response.data.user);
        setUser(response.data.user);
        setLogin(true);
        
      }
      
      
      // if (response.data !== "No user found") {
      //     console.log(response.data);
      //     setUser(response.user);
      //     setLogin(true);
      //   } else {
      //     console.log("user not found from backend")
      //     setUser(null);
      //     setLogin(false);
      //   }
      })
    }

    useEffect(checkUserLoginStatus, []);


    // axios.get("http://localhost:8000/auth/login/success").then(response => {
    // console.log(response)  
    // if (response.status === 200) {
      //   console.log("hello")
      //   setUser(response.json().user)
      //   setLogin(true);
      // } 




    const routeChange = () => {
        
        let path = '/create-album';
        navigate(path);
        
    }

  const setLoginStatus = () => {
    // // fetch("http://localhost:8000/auth", {
    // //   method: "GET",
    // //   credentials: "include",
    // //   headers: {
    // //     Accept: "application/json",
    // //     "Content-Type": "application/json",
    // //     "Acess-Control-Allow-Origin": "*",
    // //     "Access-Control-Allow-Credentials": true
    // //   }
    // // }).then(response => console.log(response));
    console.log("onclick called")
    window.open("http://localhost:8000/auth/twitter", "_self");
    
    // setLogin(!isLoggedIn);
    // console.log(`The user's login status is ${isLoggedIn}`);
  }


    const DefaultHomeContent = () => <div className="App"> Dynamically change your twitter profile's banner <br/>
  <button onClick={setLoginStatus}>Sign in with Twitter</button></div>



// const DefaultHomeContent = () => <div className="App"> Dynamically change your twitter profile's banner <br/>
// <a href="http://localhost:8000/auth">Sign in with Twitter</a></div>




  const LoggedInHomeContent = () => <div className='App'>
    <UserAlbums/>
    Let's get started. {isLoggedIn? user.name: ''}<br/>
    <Button variant="primary" onClick={routeChange}>Create an album</Button>
   
  </div>

    return (
       
        <div>
            {isLoggedIn ?  <LoggedInHomeContent/> : <DefaultHomeContent/>}
        </div>
    )


}

export default Home;
