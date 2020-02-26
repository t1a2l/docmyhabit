import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Grid
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MyGoogleSignUpButton from "./GoogleSignUp";

function Register() {
  return (
    <Grid container spacing={3}>
      <Grid item sm={8}>
        <form action="/register" method="POST">
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
            <InputLabel htmlFor="password-input">Email address</InputLabel>
            <Input
              id="password-input"
              aria-describedby="my-helper-text"
              type="password"
              name="password"
            />
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </form>
        <Button component={Link} to="/">
          SignIn
        </Button>
        <MyGoogleSignUpButton onClick={() => alert("Hello")} />
      </Grid>
    </Grid>
  );
}

export default Register;
