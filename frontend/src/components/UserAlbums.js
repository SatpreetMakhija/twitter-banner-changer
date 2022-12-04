import react from "react";
import {useNavigate} from "react-router-dom"
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

function UserAlbums(props) {
  
  const albums = props.albums;
  let navigate = useNavigate();
  const routeChange = (e) => {
    let  path = "/album/" + e.target.getAttribute('albumId');
    navigate(path);
  } 
  
  return (
    <div>
        <h1>Your albums </h1>
      <Stack direction="horizontal" gap={3} style={{margin: "100px"}}>
         {albums.length ? albums.map((album) => <Button variant="secondary" albumId = {album._id} onClick={routeChange}>{album.albumName} </Button>) : "You don't have any albums. Create one"}
      </Stack>
      
    </div>
  );
}

export default UserAlbums;
