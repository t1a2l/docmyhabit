import React, { useState } from "react";
import { Container, TextField, Button, Grid } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  direction: "rtl"
});

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordApprove, setPasswordApprove] = useState("");
  let history = useHistory();

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handlePasswordApproveChange(event) {
    setPasswordApprove(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/Register";
    let myData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordApprove: passwordApprove
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
            alert("משתמש נרשם בהצלחה!");
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
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="first-name"
                  type="text"
                  label="שם פרטי"
                  name="firstName"
                  autoFocus
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="last-name"
                  type="text"
                  label="שם משפחה"
                  name="lastName"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </Grid>
            </Grid>
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password-approve"
              label="אשר סיסמא"
              type="password"
              id="password-approve"
              value={passwordApprove}
              onChange={handlePasswordApproveChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              הירשם
            </Button>
            <Grid container>
              <Grid item xs>
                <Button component={Link} to="/">
                  {"יש לך סיסמא? התחבר"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </ThemeProvider>
        <Link to="/auth/google">
          <GoogleLoginButton align="center" text="הירשם עם גוגל"/>
        </Link>
      </Container>
    </RTL>
  );
}

export default Register;
