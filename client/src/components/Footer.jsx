import React from "react";
import { Typography } from "@material-ui/core";

function Footer() {
  const d = new Date();
  const year = d.getFullYear();

  return (
    <footer align="center">
      <Typography component="h6" variant="h6" align="center" color="textPrimary" gutterBottom>
        Copyright ⓒ {year} DocMyHabit. All Rights Reserved
      </Typography>
    </footer>
  );
}

export default Footer;
