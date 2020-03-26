import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import MessageDialog from "./MessageDialog";

library.add(fab);

const theme = createMuiTheme({
  direction: "rtl",
  fontSize: "18px"
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({title: "", content: ""});
  let history = useHistory();

  useEffect(() => {
    if(message.title !== "" && message.content !== ""){
      setOpen(true);
    }
  }, [message]);

  function closeDialog(){
    setOpen(false);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function HandleSubmit(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/Login";
    let myData = {
      email: email,
      password: password
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(myData)
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            history.push("/");
          } else {
            setMessage({title: "שגיאה", content: answer});
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  return (
    <RTL>
      <Container maxWidth="xs">
        <ThemeProvider theme={theme}>
          <form onSubmit={HandleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="כתובת מייל"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמא"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="זכור אותי"
              />
              <Button component={Link} to="">
                    {"שכחת סיסמא?"}
              </Button>
            </div>
            <Button type="submit" fullWidth variant="contained" color="primary" style={{fontSize: "18px"}}>
              התחבר
            </Button>
          </form>
          <Grid container style={{display: "flex", justifyContent: "space-between"}} >
              <Grid item xs>
                <Button component={Link} to="/register" variant="contained" color="default" style={{marginTop: "10px", fontSize: "18px"}}>
                  {"אין לך חשבון? הירשם"}
                </Button>
              </Grid>
              <Grid item xs>
                <Button component={Link} to="/auth/google" variant="contained" style={{marginTop: "10px", width: "100%", backgroundColor: "#de5246", fontSize: "18px"}}>
                  <FontAwesomeIcon icon={['fab', 'google']} pull="right" color="white"/>{"התחבר עם גוגל"}
                </Button>
              </Grid>
          </Grid>  
          <MessageDialog
            dialogTitle={message.title}
            dialogContent={message.content}
            open={open}
            closeDialog={closeDialog}
          /> 
        </ThemeProvider>
      </Container>
    </RTL>
  );
}

export default Login;
