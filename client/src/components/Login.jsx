import React, { useState } from "react";
import {
  Container,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  direction: "rtl"
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

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
            alert(answer);
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="זכור אותי"
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              התחבר
            </Button>
            <Grid container>
              <Grid item xs>
                <Button component={Link} to="">
                  {"שכחת סיסמא?"}
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Button component={Link} to="/register">
                  {"אין לך חשבון? הירשם"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </ThemeProvider>
        <Link to="/auth/google">
          <GoogleLoginButton align="center" text="התחבר עם גוגל" />
        </Link>
      </Container>
    </RTL>
  );
}

export default Login;
