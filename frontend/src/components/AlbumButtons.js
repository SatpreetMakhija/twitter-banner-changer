import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import DeleteAlbumModal from "./DeleteAlbumModal";
import SetAlbumModal from "./SetAlbumModal";
import SetAlbumToast from "./SetAlbumToast";
import DeleteAlbumToast from "./DeleteAlbumToast";
import { Container, Row, Col } from "react-bootstrap";

function AlbumButtons() {

    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [albumToastData, setAlbumToastData] = useState({showToast: false, toastStatus: null});
    const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
    const [deleteAlbumToastData, setDeleteAlbumToastData] = useState({showToast: false, toastStatus: null});

    const Content = (
      <Container>
        <Row>
          <Col sm={12} md={6}>
          Album Name placeholder
          </Col>
          <Col sm={12} md={3}>
          <Button variant="primary" onClick={()=>setShowAlbumModal(true)}>Set album</Button>{' '}
          </Col >
          <Col sm={12} md={3}>
          <Button variant="danger" onClick={()=>setShowDeleteAlbumModal(true)}>Delete album</Button>{' '}
          </Col>
        </Row>
      </Container>
    )


  return (
    <>
    {Content}
      {/* <Button variant="primary" onClick={()=>setShowAlbumModal(true)}>Set album</Button>{' '}
      <Button variant="danger" onClick={()=>setShowDeleteAlbumModal(true)}>Delete album</Button>{' '} */}
      <SetAlbumModal setShowAlbumModal={setShowAlbumModal} showAlbumModal={showAlbumModal} setAlbumToastData={setAlbumToastData}/>
      <SetAlbumToast toastData={albumToastData} setAlbumToastData={setAlbumToastData}/>
      <DeleteAlbumModal showDeleteAlbumModal={showDeleteAlbumModal} setShowDeleteAlbumModal={setShowDeleteAlbumModal} setToastData={setDeleteAlbumToastData}/>
      <DeleteAlbumToast toastData={deleteAlbumToastData} setToastData={setDeleteAlbumToastData}/>
    </>
  );
}

export default AlbumButtons;