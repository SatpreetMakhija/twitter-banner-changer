import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import SetAlbumModal from "./SetAlbumModal";
import SetAlbumToast from "./SetAlbumToast";


function AlbumButtons() {

    const [showSetAlbumModal, setShowSetAlbumModal] = useState(false);
    const [showSetAlbumToast, setShowSetAlbumToast] = useState(false);
    const handleSetAlbumModal = () => setShowSetAlbumModal(true);



  return (
    <>
      <Button variant="primary" onClick={handleSetAlbumModal}>Set album</Button>{' '}
      <Button variant="danger">Delete album</Button>{' '}
      <SetAlbumModal setShowSetAlbumModal={setShowSetAlbumModal} showAlbumModal={showSetAlbumModal} setShowSetAlbumToast={setShowSetAlbumToast}/>
      <SetAlbumToast showToast={showSetAlbumToast} setShowToast={setShowSetAlbumToast}/>
    </>
  );
}

export default AlbumButtons;