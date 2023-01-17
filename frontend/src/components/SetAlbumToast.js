import React from "react";
import Toast from "react-bootstrap/Toast";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from "react-bootstrap";

function SetAlbumToast (props) {

    let showToast = props.toastData.showToast;
    let toastStatus = props.toastData.toastStatus;
    let setShowToast = props.setAlbumToastData;
    
    let toastBodyContent = (toastStatus === '200' ? "Album Set" : "Error occured, try again.")
    return (
       <ToastContainer position="top-end">
        <Toast onClose={() => setShowToast({showToast: false})} show={showToast} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">Update</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>{toastBodyContent}</Toast.Body>
        </Toast>
        </ToastContainer>
      )
};

export default SetAlbumToast;