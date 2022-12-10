import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import axios from "axios";
function SetBannerUpdateFrequencyModal(props) {
  const url_parameters = useParams();
  const album_id = url_parameters.albumid;

  const [show, setShow] = useState(false);
  const [bannerUpdateFrequency, setBannerUpdateFrequency] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleValueChange = (e) => {
    setBannerUpdateFrequency(e.target.value);
  };

  const setAlbumFrequency = async () => {
    //make axios call here to set the album.
    //to do so get album id from url.
    //call api set-album
    try {
      let response = await axios.post(
        "http://localhost:8000/set-album",
        {
          albumId: album_id,
          bannerUpdateFrequency: bannerUpdateFrequency,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response)
    } catch (error) {
      //Handle error...
    }

    let response = { status: "200" };
    //use a sandwich to give this update to the user.
    if (response.status === "200") {
      //show sandwich with success notification
      handleClose();
      props.setShowToast();
    } else {
      //show sandwich with error notification.
      console.log("An error occured");
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose the update frequency for the album</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            aria-label="Default select example"
            onChange={handleValueChange}
          >
            <option>Open this select menu</option>
            <option value="1">1 hour</option>
            <option value="3">3 hour</option>
            <option value="6">6 hour</option>
            <option value="12">12 hour</option>
            <option value="24">24 hour</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={setAlbumFrequency}>
            Set Album
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SetBannerUpdateFrequencyModal;
