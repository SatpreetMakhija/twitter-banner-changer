import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function DeleteAlbumModal(props) {
  let showModal = props.showDeleteAlbumModal;
  let setShowModal = props.setShowDeleteAlbumModal;
  let setToastData = props.setToastData;

  let handleCloseModal = () => setShowModal(false);
  let handleShowModal = () => setShowModal(true);

  const url_parameters = useParams();
  const album_id = url_parameters.albumid;

  const handleDeleteAlbum = async () => {
    try {
      let response = await axios.delete(
        "http://localhost:8000/api/album/delete-album",
        {data : {
          albumId: album_id,
        }},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status == "200") {
        //show deleteAlbumToast and redirect to home page.
        console.log(`The response status isss ${response.status}`)
        handleCloseModal();
        setToastData({ showToast: true, toastStatus: "200" });
        setTimeout(() => {
            window.location.href = "/"
        }, 3000)
      } else {
        //show deleteAlbumToast with failure message.
        console.log(`The response status is ${response.status}`);
        handleCloseModal();
        setToastData({ showToast: true, toastStatus: response.status });
      }
    } catch (error) {
      //show deleteAlbumToast with generic error to try again.
      setToastData({ showToast: true, toastStatus: "404" });
    }
    console.log(`Delete album with id ${album_id}`);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this album?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Go Back
          </Button>
          <Button variant="primary" onClick={handleDeleteAlbum}>
            Yes, delete this album.
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteAlbumModal;
