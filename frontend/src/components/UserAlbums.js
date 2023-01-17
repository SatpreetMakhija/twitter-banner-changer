import react from "react";
import {useNavigate} from "react-router-dom"
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";

function UserAlbums(props) {
  
  const albums = props.albums;
  let navigate = useNavigate();
  const routeChange = (e) => {
    let  path = "/album/" + e.target.getAttribute('albumId');
    navigate(path);
  } 
  

  return (
    <div style={{backgroundColor: "#C4DFDA"}}>
        <h1>Your albums </h1>
        <Container className="justify-content-center" style={{marginTop: "20vh"}}>
      <Row>
      {albums && albums.map((album) => <Col key={album._id}><Button variant="secondary" albumId = {album._id} onClick={routeChange}>{album.albumName} </Button></Col>)}  
      </Row>
    </Container>
      
    </div>
  );
}

export default UserAlbums;
