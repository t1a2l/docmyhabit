import React from "react";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

function Login() {
  return (
    <Grid container spacing={3}>
        <Grid item sm={8}>
          <form action="/login" method="POST">
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
            <Button variant="contained" color="primary" type="sumbit">
              Login
            </Button>
          </form>
        </Grid>
        <Grid item sm={4}>
          <a class="btn btn-block btn-social btn-google" href="/auth/google" role="button">
            <i class="fab fa-google"></i>
            Sign In with Google
          </a>
        </Grid>
      </Grid>
   
  );
}

export default Login;
