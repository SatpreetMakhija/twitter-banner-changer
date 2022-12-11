import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import DeleteAlbumModal from "./DeleteAlbumModal";
import SetAlbumModal from "./SetAlbumModal";
import SetAlbumToast from "./SetAlbumToast";
import DeleteAlbumToast from "./DeleteAlbumToast";

function AlbumButtons() {

    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [albumToastData, setAlbumToastData] = useState({showToast: false, toastStatus: null});
    const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
    const [deleteAlbumToastData, setDeleteAlbumToastData] = useState({showToast: false, toastStatus: null});

  return (
    <>
      <Button variant="primary" onClick={()=>setShowAlbumModal(true)}>Set album</Button>{' '}
      <Button variant="danger" onClick={()=>setShowDeleteAlbumModal(true)}>Delete album</Button>{' '}
      <SetAlbumModal setShowAlbumModal={setShowAlbumModal} showAlbumModal={showAlbumModal} setAlbumToastData={setAlbumToastData}/>
      <SetAlbumToast toastData={albumToastData} setAlbumToastData={setAlbumToastData}/>
      <DeleteAlbumModal showDeleteAlbumModal={showDeleteAlbumModal} setShowDeleteAlbumModal={setShowDeleteAlbumModal} setToastData={setDeleteAlbumToastData}/>
      <DeleteAlbumToast toastData={deleteAlbumToastData} setToastData={setDeleteAlbumToastData}/>
    </>
  );
}

export default AlbumButtons;