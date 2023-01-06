

import React from "react";
import Popover from "react-bootstrap/Popover";

function NotificationOverlay(props) {
    
    console.log(props.lastFewBannerChangeJobs)
    //now create Notification for all these jobs

    return (
        <Popover id="popover-basic">
    <Popover.Header as="h3">Last banner changes</Popover.Header>
    <Popover.Body>
      And here's some <strong>amazing</strong> content. It's very engaging.
      right?
    </Popover.Body>
  </Popover>
    )
}

export default NotificationOverlay;