import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider, makeStyles } from "@material-ui/core/styles";

const theme = createMuiTheme({
  direction: "rtl"
});

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(3),
    },
  },
}));

function Main() {
  const [mainPage, setMainPage] = useState(false);
  let history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    
    let url = process.env.REACT_APP_SERVER_URL + "/Main";
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
      .then(response =>
        response.text().then(answer => {
            if(answer === "fail") {
              goToLogin();
            } else {
              setMainPage(true);
            }
        }))
      .catch(error => console.log("error", error));
  }, []);

  function goToLogin() {
    history.push("/Login");
  }

  function HandleSubmit(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/Logout";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include' //'same-origin'
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            alert("Signed out successfully");
            window.location.reload();
          } else {
            alert(answer);
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  return (
    <RTL>
    <ThemeProvider theme={theme}>
    <div>{mainPage &&  
      <div className={classes.root} align="center">
        <Button component={Link} to="/doc-new-action" variant="contained" color="primary">
          תעד פעולה חדשה
        </Button>
        <Button component={Link} to="/all-actions" variant="contained" color="primary">
          הצג את כל התיעודים
        </Button>
        <Button onClick={HandleSubmit} variant="contained">
          התנתק
        </Button>
        </div>
        } 
    </div>
    </ThemeProvider>
    </RTL>
  );
}

export default Main;
