import React, { useEffect, useState } from "react";
import { Stack, Alert, Container, Row, Col,Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import AlbumButtons from "../components/AlbumButtons";
import banner from "../media/banner.jpeg";
import "./ShowAlbum.css";
function ShowAlbum() {
  const url_parameters = useParams();
  const album_id = url_parameters.albumid;
  const [albumData, setalbumData] = useState(null);
  const [doesAlbumExist, setDoesAlbumExist] = useState(false);
  const [isCurrentAlbumInRotation, setIsCurrentAlbumInRotation] =
    useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(
          process.env.REACT_APP_HOST + "/api/album/" + album_id,
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
    fetchData();
  }, []);

  const Albums = () => {
    return (
      <Container>
        {albumData.bannersURLs.map((url, index) => {
          if (index % 2 === 0) {
            if (index < albumData.bannersURLs.length - 1) {
              return (
                <Row key={index} className="my-4">
                  <Col xs={12} md={6}>
                    <img
                      src={process.env.REACT_APP_HOST + "/" + url}
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <img
                      src={
                        process.env.REACT_APP_HOST +
                        "/" +
                        albumData.bannersURLs[index + 1]
                      }
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </Col>
                </Row>
              );
            } else {
              return (
                <Row key={index} className="my-4">
                  <Col xs={12} md={6}>
                    <img
                      src={process.env.REACT_APP_HOST + "/" + url}
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </Col>
                </Row>
              );
            }
          }
        })}
      </Container>
    );
  };

  return (
    <Card style={{borderRadius:"50px"}}>
    <div className="content-holder">
      <div className="buttons-container">{albumData && <AlbumButtons />}</div>
      <div className="album-status-container">
        {isCurrentAlbumInRotation && (
          <Alert key="info" variant="info">
            This is your current album in rotation with a{" "}
            {albumData.frequencyOfUpdateInHours} hour update frequency.
          </Alert>
        )}
      </div>
      <div className="images-container">
        {albumData ? <Albums /> : "Loading..."}
        {!doesAlbumExist && `This album does not exist`};
      </div>
    </div>
    </Card>
  );
}

export default ShowAlbum;
