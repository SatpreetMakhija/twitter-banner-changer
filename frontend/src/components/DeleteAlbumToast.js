import React from "react";
import Toast from "react-bootstrap/Toast";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from "react-bootstrap";

function DeleteAlbumToast (props) {

    let showToast = props.toastData.showToast;
    let toastStatus = props.toastData.toastStatus;
    let setShowToast = props.setToastData;
    
    let toastBodyContent = (toastStatus === '200' ? "Album deleted" : "Error occured, try again.")
    return (
        <Row>
      <Col xs={6}>
        <ToastContainer position="top-end">
        <Toast onClose={() => setShowToast({showToast: false})} show={showToast} delay={5000} autohide >
          <Toast.Header>
            <strong className="me-auto">Update</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>{toastBodyContent}</Toast.Body>
        </Toast>
        </ToastContainer>
      </Col>
    </Row>)
};

export default DeleteAlbumToast;