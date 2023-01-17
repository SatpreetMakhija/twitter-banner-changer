import React, {useState} from "react";
import Toast from "react-bootstrap/Toast";
import Row, { ToastContainer } from "react-bootstrap"

function ErrorToast(props) {


    return (
        <ToastContainer position="top-end" >
        <Toast show={props.showErrorToast.status} bg="danger" onClose={()=>props.setShowErrorToast({status: false, errorMessage: null})} delay={5000} autohide>
            <Toast.Header>
                <strong>Error</strong>
            </Toast.Header>
            <Toast.Body>
                {props.showErrorToast.errorMessage}
            </Toast.Body>
        </Toast>
        </ToastContainer>
    )
};

export default ErrorToast;
