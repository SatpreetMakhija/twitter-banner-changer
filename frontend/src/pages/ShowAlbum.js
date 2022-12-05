import React, {useEffect, useState} from "react";
import {Container, Row, Col}  from "react-bootstrap";
import Button from "react-bootstrap/Button"
import {Stack}  from "react-bootstrap";

import exampleBanner from "../media/banner.jpeg"
import {useParams} from "react-router-dom";
import axios from "axios";
import SetBannerUpdateFrequencyModal from "../components/SetBannerUpdateFrequencyModal";
import Toast from "react-bootstrap/Toast";


function ShowAlbum() {
    const url_parameters = useParams();
    const album_id = url_parameters.albumid;
    const [albumData, setalbumData] = useState(null);

    const [showToast, setShowToast] = useState(false);

    const handleSetShowToast = () => {
        console.log("toaster here..");
        setShowToast(true);
    }

    useEffect(  () => {
        async function fetchData() {
            try {
                let response = await axios.get("http://localhost:8000/album/" + album_id, {withCredentials: true});
            console.log("The album data is ")
                console.log(response.data.album);
            return response.data.album;
            }
            catch (err) {
                console.log(err);
            }
        }
       fetchData().then((data) => setalbumData(data));
    }, [])

    const Albums = () => {
        return <Stack gap={3} style = {{margin: "5vw", alignContent:"center"}}>
            {albumData.bannersURLs.map((url) => <img src={'http://localhost:8000/' + url} style={{width: "80vw"}}/>) } 
        </Stack>
    }

    const MyToast = () => {
        return (
        <Row>
      <Col xs={6}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide >
          <Toast.Header>
            <strong className="me-auto">Update</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Your album is set</Toast.Body>
        </Toast>
      </Col>
    </Row>)
    }

    return (
        <div>
            {albumData ? <SetBannerUpdateFrequencyModal setShowToast={handleSetShowToast}/> : ''}
            {albumData ? <Albums/> : 'loading....'}
            <MyToast/>
        </div>
    )
}

export default ShowAlbum;