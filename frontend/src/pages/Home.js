import {React, useState, useEffect} from "react";
import { Button, Stack, Card } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import UserAlbums from "../components/UserAlbums";
import axios from "axios";
import useStore from "../Store";
import './Home.css';

function Home() {

    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const userLoginStatus = useStore(state => state.userLoginStatus);
    const setUserLoginStatus = useStore(state => state.setUserLoginStatus);
    const [userAlbums, setUserAlbums] = useState(null);
    

    let navigate = useNavigate();

    const checkUserLoginStatus = () => {
      console.log("inside useffect");
      axios.get(process.env.REACT_APP_HOST+"/api/auth/login/success", {withCredentials: true}).then((response) =>{

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

      async function getJobs() {
        try {
          const jobs = await axios.get(process.env.REACT_APP_HOST+"/api/user/jobs", {withCredentials: true});
          //TODO Add UI to show jobs.
        } catch(err) {
          console.log(err);
        }
      };

      getJobs();

    }


    useEffect(checkUserLoginStatus, []);


  

    const routeChange = () => {
        
        let path = '/create-album';
        navigate(path);
        
    }

  const setLoginStatus = () => {
    console.log("onclick called")
    window.open(process.env.REACT_APP_HOST+"/api/auth/twitter", "_self");
    
  
  }


    const DefaultHomeContent = () => <div > <h1>Dynamically change your twitter profile's banner </h1><br/>
  <Button onClick={setLoginStatus} size='lg' variant='primary'>Sign in with Twitter</Button></div>


  const NewDefaultHomeContent = () => (
    <div className="Home" >
      <Stack gap={5} >
      <div >
      <Card className="text-center" style={{backgroundColor: "#C4DFDA", padding: "200px", borderRadius:"50px"} }>
      <Card.Body>
        <Card.Title><h1>Change your twitter profile <br/> banner by the hour <br/> automatically.</h1></Card.Title>
        <Card.Text>
         why settle with one banner when you can have many.
         <Button onClick={setLoginStatus} size='lg' variant='primary'>Sign in with Twitter</Button>
        </Card.Text>
      </Card.Body>
    </Card>
      </div>
      <div >
      <Card className="text-center" style={{backgroundColor: "#C4DFDA", padding: "200px", borderRadius: "50px"}}>
      <Card.Body>
        <Card.Title><h1>How it works</h1></Card.Title>
        <Card.Text>
         why settle with one banner when you can have many.
        </Card.Text>
      </Card.Body>
    </Card>
      </div>
      </Stack>
    </div>
  )

  const LoggedInHomeContent = () => <div className="Home" style={{padding: "100px", backgroundColor: "#C4DFDA", borderRadius: "50px", height:"90vh"}}>
    <UserAlbums albums={userAlbums}/>
    Let's get started. {userLoginStatus && user.name}<br/>
    <Button variant="primary" onClick={routeChange}>Create an album</Button>
   
  </div>

    return (
       
        <div className="Home">
            {/* {userLoginStatus ?  <LoggedInHomeContent/> : <DefaultHomeContent/>}
           */}
            {userLoginStatus ?  <LoggedInHomeContent/> : <NewDefaultHomeContent/>}

        </div>
    )


}

export default Home;
