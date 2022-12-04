import React from "react";
import { Form, Col, Row, Card, Button } from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {Toast} from "react-bootstrap";
axios.defaults.withCredentials = true;
function CreateAlbum() {

   
    const [formValues, setFormValues] = useState({albumName: "", banners: [], frequency: 0});
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (event) => {
      event.preventDefault();
        console.log(formValues);
        let data = new FormData();
        data.append("albumname", formValues.albumName);
        data.append("frequency", formValues.frequency);
        // data.append("banners", formValues.banners);
        for (var x = 0 ; x < formValues.banners.length; x++) {
          data.append(`banners`, formValues.banners[x]);
        }
        const config = {
          headers: {'content-type': 'multipart/form-data'}
        }
        // axios.post("http://localhost:8000/create-album", data).then((res) => console.log(res));

        async function makePost() {
          try {
            const response = await axios.post("http://localhost:8000/create-album", data);
            if (response.status === 200) {
              //sandwitch saying album created and redirect to homepage. 
              setShowToast(true);
            } else {
              //Error while creating request show sandwitch with an error..
            }
          } catch(err) {
            console.log(err);
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
        setFormValues({albumName: "", banners: [], frequency: 0})
        
        // event.target.reset();
    }

    const handleTextChange = (e) => {
        let value = e.target.value
        setFormValues({...formValues, [e.target.name]: value});
    }

    const handleFileChange = (e) => {
        let numberOfFiles = e.target.files.length;
        const files = [];
        for (let i = 0 ; i < numberOfFiles; i++) {
          files.push(e.target.files[i]);
        }
        console.log(files);
        setFormValues({...formValues, [e.target.name]:files});
    }

  return (
    <div>
      <Card style={{margin: "200px"}}>

        <Form style={{margin: "20px"}} onSubmit={handleSubmit}>

            <Form.Control size="lg" type="text" placeholder="Name your album"  value={formValues.albumName} name="albumName" onChange={handleTextChange} />
          
              <Form.Group controlId="formFileMultiple" className="mb-3" >
                <Form.Label>Multiple files input example</Form.Label>
                <Form.Control type="file" multiple onChange={handleFileChange} name="banners" />
              </Form.Group>
              How many times a day do you want to change your Twitter banner?
              <Form.Control size="lg" type="number" placeholder="How many times a day should we change your banner?"  value={formValues.frequency} name="frequency" onChange={handleTextChange} />
                <br/>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Form>
      </Card>
      <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
        <Toast.Header>
          <strong>Album created</strong>
        </Toast.Header>
        <Toast.Body>Your album was created successfully!</Toast.Body>
      </Toast>
    </div>
  );
}

export default CreateAlbum;
