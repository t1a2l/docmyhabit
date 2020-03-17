import React from "react";

function Footer() {
  const d = new Date();
  const year = d.getFullYear();

  return (
    <footer align="center">
      <p>Copyright ⓒ {year} DocMyHabit. All Rights Reserved</p>
    </footer>
  );
}

export default Footer;
