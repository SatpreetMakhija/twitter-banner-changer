import React, {useEffect, useState} from "react";
import {Stack}  from "react-bootstrap";
import {useParams} from "react-router-dom";
import axios from "axios";
import AlbumButtons from "../components/AlbumButtons";

function ShowAlbum() {
    const url_parameters = useParams();
    const album_id = url_parameters.albumid;
    const [albumData, setalbumData] = useState(null);

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


    return (
        <div>
            {albumData && <AlbumButtons/>}
            {albumData ? <Albums/> : 'loading...'}
        </div>
    )
}

export default ShowAlbum;