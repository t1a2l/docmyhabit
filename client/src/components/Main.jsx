import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

function Main() {

  return (
    <div>
      <Button component={Link}
          to="/doc-new-action">Document a new action</Button>
      <Button component={Link}
          to="/all-actions">Show all actions Actions</Button>
    </div>
  );
}

export default Main;
