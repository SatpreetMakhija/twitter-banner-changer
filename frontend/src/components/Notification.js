import React from "react";
import Stack from 'react-bootstrap/Stack';
import Card from "react-bootstrap/Card";
function Notification(props) {
    

    function convertGMTToLocal(gmtDate) {
        const options = {
          hour: 'numeric',
          minute: 'numeric'
        };
        const localDate = new Intl.DateTimeFormat('en-US', options).format(gmtDate);
        return localDate;
      }


  return (
    <Stack gap={3}>
    {props.jobsArray.map((jobData, index) => {
        if (jobData.failReason) {
          return (<Card bg="danger" key={index}>
          <Card.Body>Banner change failed at {convertGMTToLocal(new Date(jobData.failedAt))}</Card.Body>
        </Card>)
        } else {
            return (<Card bg="success" key={index}>
            <Card.Body>Banner changed at {convertGMTToLocal(new Date(jobData.lastFinishedAt))}</Card.Body>
          </Card>)
        }
    })}
  </Stack>
  );
}

export default Notification;