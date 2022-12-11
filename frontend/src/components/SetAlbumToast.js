import React from "react";
import Toast from "react-bootstrap/Toast";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


function SetAlbumToast (props) {

    let showToast = props.showToast;
    let setShowToast = props.setShowToast;

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
};

export default SetAlbumToast;