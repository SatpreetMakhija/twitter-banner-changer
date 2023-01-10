import React, { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import AlbumButtons from "../components/AlbumButtons";

function ShowAlbum() {
  const url_parameters = useParams();
  const album_id = url_parameters.albumid;
  const [albumData, setalbumData] = useState(null);
  const [doesAlbumExist, setDoesAlbumExist] = useState(false);
  const [isCurrentAlbumInRotation, setIsCurrentAlbumInRotation] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(
          "http://localhost:8000/api/album/" + album_id,
          { withCredentials: true }
        );
        if (response.status == "200") {
          setalbumData(response.data.album);
          setDoesAlbumExist(true);
          if (response.data.isCurrentAlbumInRotation == true) {
            setIsCurrentAlbumInRotation(true);
          } 
        } else {
          setDoesAlbumExist(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData()
  }, []);

  const Albums = () => {
    return (
      <Stack gap={3} style={{ margin: "5vw", alignContent: "center" }}>
        {albumData.bannersURLs.map((url) => (
          <img src={"http://localhost:8000/" +   url} style={{ width: "80vw" }} />
        ))}
      </Stack>
    );
  };

  return (
    <div style={{position:"relative", top:"15vh"}}>
      
      {albumData && <AlbumButtons />}
      {isCurrentAlbumInRotation && <h1>This is your current album in rotation with a {albumData.frequencyOfUpdateInHours} hour update frequency.</h1>}
      {albumData ? <Albums /> : "loading..."}
      {!doesAlbumExist && `This album does not exist`};
    </div>
  );
}

export default ShowAlbum;
