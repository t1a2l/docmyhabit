import React from "react";
import { Container, Typography } from "@material-ui/core";
import { makeStyles  } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(5, 0, 3)
  }
}));

function Header() {
  const classes = useStyles();
  return (
    <header>
    <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          DocMyHabit
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          תעד את ההרגלים שלך
        </Typography>
      </Container>
    </header>
  );
}

export default Header;
