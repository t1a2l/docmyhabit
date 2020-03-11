import React, {useState} from "react";
import {
  Container,
  TextField,
  Button,
  Grid
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  function handleSubmit(event){
    event.preventDefault();
    let url = "http://localhost:4000/Register";
    let myData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    fetch(url, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(myData)
    })
    .then(response => 
      response.text().then(answer => {
        if (answer === "success") {
          alert("User registered succesfully!");
          history.push("/");
        } else {
          alert(answer);
        }
      })
    )
    .catch(error => console.log("error", error));
  }

  return (
    <Container maxWidth="xs">
        <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6} >
              <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="first-name"
                    type="text"
                    label="First Name"
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
                    label="Last Name"
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
              label="Email Address"
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
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
          <Button type="submit" fullWidth
            variant="contained"
            color="primary" >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
            <Button
                  component={Link}
                  to="/"
              >{"Have a passoword? Login"}</Button>
            </Grid>
          </Grid>
        </form>
        <Link to="/auth/google">
          <GoogleLoginButton />
        </Link>
    </Container>
  );
}

export default Register;
