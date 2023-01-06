import React from "react";
import Stack from 'react-bootstrap/Stack';
import Card from "react-bootstrap/Card";
function Notification(props) {
  return (
    <Stack gap={3}>
    {props.jobsArray.map((jobData) => {
        if (jobData.failReason) {
          return (<Card bg="danger">
          <Card.Body>Banner change failed at {jobData.failedAt}</Card.Body>
        </Card>)
        } else {
            return (<Card bg="success">
            <Card.Body>Banner changed at {jobData.lastFinishedAt}</Card.Body>
          </Card>)
        }
    })}
  </Stack>
  );
}

export default Notification;