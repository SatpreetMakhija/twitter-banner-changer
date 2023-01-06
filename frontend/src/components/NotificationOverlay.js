

import React from "react";
import Popover from "react-bootstrap/Popover";
import Notification from "./Notification";
function NotificationOverlay(props) {
    return (
        <Popover id="popover-basic">
    <Popover.Header as="h3">Last banner changes</Popover.Header>
    <Popover.Body>
      <Notification jobsArray = {props.lastFewBannerChangeJobs}/>
    </Popover.Body>
  </Popover>
    )
}

export default NotificationOverlay;