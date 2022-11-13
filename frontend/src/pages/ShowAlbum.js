import React from "react";
import {Container, Row, Col}  from "react-bootstrap";

import {Stack}  from "react-bootstrap";

import exampleBanner from "../media/banner.jpeg"

function ShowAlbum() {

    return (
        <div>
        <Stack gap={3} style = {{margin: "5vw", alignContent:"center"}}>
        <img src={exampleBanner} style={{width: "80vw"}}/>
        <img src={exampleBanner} style={{width: "80vw"}}/>
        <img src={exampleBanner} style={{width: "80vw"}}/>
        </Stack>

        </div>
    )
}

export default ShowAlbum;