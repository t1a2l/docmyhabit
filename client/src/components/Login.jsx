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
    let url = "http://localhost:4000/Login";
    let myData = {
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
      <form onSubmit={HandleSubmit}>
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
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Button component={Link} to="">
              {"Forgot password?"}
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Button component={Link} to="/register">
              {"Don't have an account? Sign Up"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Link to="/auth/google">
        <GoogleLoginButton />
      </Link>
    </Container>
  );
}

export default Login;
