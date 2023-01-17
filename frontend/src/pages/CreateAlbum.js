import React, {useRef} from "react";
import { Form, Col, Row, Card, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
import './CreateAlbum.css';
import ErrorToast from '../components/ErrorToast';
axios.defaults.withCredentials = true;
function CreateAlbum() {
  const [formValues, setFormValues] = useState({ albumName: "", banners: [] });
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState({
    status: false,
    errorMessage: null
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = new FormData();
    data.append("albumname", formValues.albumName);
    for (var x = 0; x < formValues.banners.length; x++) {
      data.append(`banners`, formValues.banners[x]);
    }
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    

    async function makePost() {
      try {
        const response = await axios.post(process.env.REACT_APP_HOST+"/api/album/create-album", data);
        setShowToast(true);
        setTimeout(() => {
          window.location.href = "/"
        }, 3000);
      } catch (err) {
          if (err.response.data.errorCode == "LIMIT_FILE_SIZE") {
            setShowErrorToast({status: true, errorMessage: "Each file must be less than 1 MB in size."});
          } else if (err.response.data.errorCode == "FILE_TYPE_NOT_SUPPORTED") {
            setShowErrorToast({status: true, errorMessage: "File type not supported."});
          } else if (err.response.data.errorCode == "LIMIT_FILE_COUNT") {
            setShowErrorToast({status: true, errorMessage: "You exceeded the number of banners you can have in an album."});
          } else {
            setShowErrorToast({status: true, errorMessage: "Enexpected error. Please try again."});
          }
      }
    }

    makePost();

    /**
     * Use the for loop below to console.log the key-value pairs stored in FormData.
     * A simple console.log on FormData without the given kind of for loop does not
     * give the result in the console.
     */
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ',' + pair[1]);
    // }

    //do validation check. According to that return a message on the screen.
    setFormValues({ albumName: "", banners: [] });
    fileInput.current.value = '';

    // event.target.reset();
  };

  const fileInput = useRef(null);

  const handleTextChange = (e) => {
    let value = e.target.value;
    setFormValues({ ...formValues, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    let numberOfFiles = e.target.files.length;
    const files = [];
    for (let i = 0; i < numberOfFiles; i++) {
      files.push(e.target.files[i]);
    }
    console.log(files);
    setFormValues({ ...formValues, [e.target.name]: files });
  };

  return (
    <div   className = "content-holder" >
      <Card style={{backgroundColor: "#C4DFDA", padding: "200px", height:"90vh", borderRadius: "50px" }} className="content-holder" >
        <Form style={{ marginTop: "10vh" }} onSubmit={handleSubmit}>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Name your album"
            value={formValues.albumName}
            name="albumName"
            onChange={handleTextChange}
            required
          />
          <br/>
          <br/>
          <Form.Group controlId="formFileMultiple" className="mb-3">
            {/* <Form.Label>Multiple files input example</Form.Label> */}
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              name="banners"
              required
              ref={fileInput}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <ToastContainer position="top-end">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
      >
        <Toast.Header>
          <strong>Album created</strong>
        </Toast.Header>
        <Toast.Body>Your album was created successfully!</Toast.Body>
      </Toast>
      </ToastContainer>
      <ErrorToast showErrorToast={showErrorToast} setShowErrorToast={setShowErrorToast} />
      </Card>
      
    </div>
  );
}

export default CreateAlbum;
