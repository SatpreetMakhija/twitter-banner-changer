import React from "react";
import { Form, Col, Row, Card, Button } from "react-bootstrap";
import {useState} from "react";

function CreateAlbum() {

   
    const [formValues, setFormValues] = useState({albumName: "", banners: undefined, frequency: 0});


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
        //do validation check. According to that return a message on the screen. 
        setFormValues({albumName: "", banners: null, frequency: 0})
        
        event.target.reset();
    }

    const handleTextChange = (e) => {
        let value = e.target.value
        setFormValues({...formValues, [e.target.name]: value});
        console.log(formValues)
    }

    const handleFileChange = (e) => {
        console.log(e.target.name)
        let files = e.target.files;
        setFormValues({...formValues, [e.target.name]:files});
        console.log(formValues);
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
              <Form.Control size="lg" type="number" placeholder="How many times a day should we change your banner?"  value={formValues.frequency} name="frequency" onChange={handleTextChange} />
                <br/>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Form>
      </Card>
    </div>
  );
}

export default CreateAlbum;
