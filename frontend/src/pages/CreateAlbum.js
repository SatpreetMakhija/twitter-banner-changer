import React, {useRef} from "react";
import { Form, Col, Row, Card, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
axios.defaults.withCredentials = true;
function CreateAlbum() {
  const [formValues, setFormValues] = useState({ albumName: "", banners: [] });
  const [showToast, setShowToast] = useState(false);

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
            console.log("Show error toast with file size warning");
          } else if (err.response.data.errorCode == "FILE_TYPE_NOT_SUPPORTED") {
            console.log("Show error toast with file type warning");
          } else if (err.response.data.errorCode == "LIMIT_FILE_COUNT") {
            console.log("Show error toast with #files limit warning");
          } else {
            console.log("An unexpected error occured. Give a generic error toast to try again");
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
    <div   style={{position:"relative", top:"15vh"}}>
      <Card style={{ padding: "300px" }} >
        <Form style={{ margin: "20px" }} onSubmit={handleSubmit}>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Name your album"
            value={formValues.albumName}
            name="albumName"
            onChange={handleTextChange}
            required
          />

          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Multiple files input example</Form.Label>
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
      </Card>
      
    </div>
  );
}

export default CreateAlbum;
