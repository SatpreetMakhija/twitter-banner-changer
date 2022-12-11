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

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(
          "http://localhost:8000/album/" + album_id,
          { withCredentials: true }
        );
        if (response.status == "200") {
          setalbumData(response.data.album);
          setDoesAlbumExist(true);
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
          <img src={"http://localhost:8000/" + url} style={{ width: "80vw" }} />
        ))}
      </Stack>
    );
  };

  return (
    <div>
      {albumData && <AlbumButtons />}
      {albumData ? <Albums /> : "loading..."}
      {!doesAlbumExist && `This album does not exist`};
    </div>
  );
}

export default ShowAlbum;
