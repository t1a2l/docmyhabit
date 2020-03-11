import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";

function Main() {
  const [mainPage, setMainPage] = useState(false);
  let history = useHistory();

  useEffect(() => {
    let url = "http://localhost:4000/Main";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
      .then(response =>
        response.text().then(answer => {
            if(answer === "fail") {
              history.push("/Login");
            } else {
              setMainPage(true);
            }
        }))
      .catch(error => console.log("error", error));
  }, []);

  function HandleSubmit(event) {
    event.preventDefault();
    let url = "http://localhost:4000/Logout";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include' //'same-origin'
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            alert("Signed out successfully");
            history.push("/");
          } else {
            alert(answer);
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  return (
    <div>{mainPage &&  <Grid container sapcing={3}>
      <Grid item sm>
        <Button component={Link} to="/doc-new-action">
          Document a new action
        </Button>
      </Grid>
      <Grid item sm>
        <Button component={Link} to="/all-actions">
          Show all actions Actions
        </Button>
      </Grid>
      <Grid item sm>
        <Button onClick={HandleSubmit}>
          Sign Out
        </Button>
      </Grid>
    </Grid>} 
    
    </div>
  );
}

export default Main;
