import React, {useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RTL from "./RTL";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useLocation, useHistory } from "react-router-dom";
import { useLastLocation } from 'react-router-last-location';
import MessageDialog from "./MessageDialog";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 40,
    marginLeft: 10
  }
}));

function DocMyHabitToolbar(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [mainPage, setMainPage] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({title: "", content: ""});
  const classes = useStyles();
  let history = useHistory();
  let location = useLocation();
  let lastLocation = useLastLocation();

  useEffect(() => {  
    if(lastLocation === null || ( lastLocation !== null && lastLocation.pathname !== location.pathname)) {
      let url = process.env.REACT_APP_SERVER_URL + "/Main";
      fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response =>
          response.text().then(answer => {
            if (answer === "fail") {
              setLoggedIn(false);
              setMainPage(true);
              if(location.pathname !== '/login' && location.pathname !== '/register'){
                history.push("/login");
              }
            } else {
              setLoggedIn(true);
              if(location.pathname !== '/'){
                setMainPage(false);
              } else {
                setMainPage(true);
              }
            }
          })
        )
        .catch(error => console.log("error", error));
    }
  }, [location, history, lastLocation]);

  useEffect(() => {
    if(message.title !== "" && message.content !== ""){
      setOpen(true);
    }
  }, [message]);

  function HandleLogout(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/Logout";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            setLoggedIn(false);
            window.location.reload();
          } else {
            setMessage({title: "שגיאה", content: answer});
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  function HandleGoBack() {
    history.goBack();
    setMainPage(true);
  }

  function closeDialog(){
    setOpen(false);
  }

  return (
    <RTL>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <img src="http://ec2-54-152-212-119.compute-1.amazonaws.com/images/DMH_logo_big.png" alt="logo" className={classes.logo} />
            <Typography variant="h6" className={classes.title}>
              DocMyHabit
            </Typography>
            <IconButton edge="start" color="inherit" onClick={HandleGoBack} disabled={mainPage}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="exit" onClick={HandleLogout} disabled={!loggedIn}>
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <MessageDialog
        dialogTitle={message.title}
        dialogContent={message.content}
        open={open}
        closeDialog={closeDialog}
      />
    </RTL>
  );
}

export default DocMyHabitToolbar;