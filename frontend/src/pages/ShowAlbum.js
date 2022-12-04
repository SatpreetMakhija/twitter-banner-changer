import React, {useEffect, useState} from "react";
import {Container, Row, Col}  from "react-bootstrap";

import {Stack}  from "react-bootstrap";

import exampleBanner from "../media/banner.jpeg"
import {useParams} from "react-router-dom";
import axios from "axios";


function ShowAlbum() {
    const url_parameters = useParams();
    const album_id = url_parameters.albumid;
    const [albumData, setalbumData] = useState(null);

    useEffect(  () => {
        async function fetchData() {
            try {
                let albumData = await axios.get("http://localhost:8000/album/" + album_id, {withCredentials: true});
            console.log(albumData);
            return albumData;
            }
            catch (err) {
                console.log(err);
            }
        }
        let albumData = fetchData();
        setalbumData(albumData);
    }, [])

    return (
        <div>
            {albumData ? "Here's your album data.." : 'loading....'}
        <Stack gap={3} style = {{margin: "5vw", alignContent:"center"}}>
        <img src={exampleBanner} style={{width: "80vw"}}/>
        <img src={exampleBanner} style={{width: "80vw"}}/>
        <img src={exampleBanner} style={{width: "80vw"}}/>
        </Stack>

        </div>
    )
}

export default ShowAlbum;