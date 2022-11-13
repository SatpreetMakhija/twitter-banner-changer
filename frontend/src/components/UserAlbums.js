import react from "react";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

function UserAlbums() {




  return (
    <div>
        <h1>Your albums</h1>
      <Stack direction="horizontal" gap={3} style={{margin: "100px"}}>
      <Button variant="secondary">Album 1</Button>
      <Button variant="secondary">Album 2</Button>
      <Button variant="secondary">Album 3</Button>
      </Stack>{" "}
    </div>
  );
}

export default UserAlbums;
