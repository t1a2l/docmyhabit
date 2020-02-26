import React from "react";

import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Grid
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";

function Login() {
  return (
    <Grid container justify="center">
      <Grid item sm={12}>
        <form action="" method="POST" align="center">
          <FormControl>
            <InputLabel htmlFor="email-input">Email address</InputLabel>
            <Input
              id="email-input"
              aria-describedby="my-helper-text"
              type="email"
              name="email"
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <Input
              id="password-input"
              aria-describedby="my-helper-text"
              type="password"
              name="password"
            />
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
        </form>
        <Button
          component={Link}
          to="/register"
        >SignUp</Button>
        <GoogleLoginButton onClick={() => alert("Hello")} />
      </Grid>
    </Grid>
  );
}

export default Login;
