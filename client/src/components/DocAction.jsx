import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Select,
  TextField,
  Button,
  Container,
  MenuItem,
  InputLabel,
  FormControl,
  Box
} from "@material-ui/core";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const theme = createMuiTheme({
  direction: "rtl"
});

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function DocAction() {
  const classes = useStyles();
  const [actionTypes, setActionTypes] = useState([]);
  const [chosenActionType, setChosenActionType] = useState("");
  const [actionDateTime, setActionDateTime] = useState("");
  const [locationTypes, setLocationTypes] = useState([]);
  const [chosenLocationType, setChosenLocationType] = useState("");
  const [actionContext, setActionContext] = useState("");

  useEffect(() => {
    let url = process.env.REACT_APP_SERVER_URL + "/newActionInfo";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(response =>
        response.json().then(answer => {
          setActionTypes(answer[0]);
          setLocationTypes(answer[1]);
        })
      )
      .catch(error => console.log("error", error));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    let url = process.env.REACT_APP__SERVER_URL + "/newActionInfo";
    let myAction = {
      actionType: chosenActionType,
      actionDateTime: actionDateTime,
      actionLocation: chosenLocationType,
      actionContext: actionContext
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(myAction)
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            alert("פעולה תועדה!");
            setChosenActionType("");
            setActionDateTime("");
            setChosenLocationType("");
            setActionContext("");
          } else {
            alert(answer);
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  function handleTypeChange(event) {
    setChosenActionType(event.target.value);
  }

  function handleDateTimeChange(event) {
    setActionDateTime(event.target.value);
  }

  function handleLocationChange(event) {
    setChosenLocationType(event.target.value);
  }

  function handleContextChange(event) {
    setActionContext(event.target.value);
  }

  return (
    <RTL>
    <Container maxWidth="xs">
      <ThemeProvider theme={theme}>
        <form onSubmit={handleSubmit} className={classes.container}>
          <FormControl className={classes.formControl}>
            <InputLabel id="action-type">פעולה</InputLabel>
            <Select
              required
              id="action-type"
              autoFocus
              value={chosenActionType}
              onChange={handleTypeChange}
            >
              {actionTypes.map((action, index) => {
                return (
                  <MenuItem value={action.actionName} key={index}>
                    {action.actionName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            id="datetime-local"
            label="שעה ותאריך"
            type="datetime-local"
            value={actionDateTime}
            onChange={handleDateTimeChange}
            InputLabelProps={{
              shrink: true
            }}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="action-type">מיקום</InputLabel>
            <Select
              required
              id="location-type"
              autoFocus
              value={chosenLocationType}
              onChange={handleLocationChange}
            >
              {locationTypes.map((location, index) => {
                return (
                  <MenuItem value={location.locationName} key={index}>
                    {location.locationName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="context-input"
            type="text"
            multiline
            rows="6"
            value={actionContext}
            onChange={handleContextChange}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            תעד פעולה חדשה
          </Button>
        </form>
        <Box justifyContent="center">
          <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    style={{marginTop: "10px"}}
                >{"חזרה לתפריט הראשי"}</Button>
        </Box>
      </ThemeProvider>
    </Container>
    </RTL>
  );
}

export default DocAction;
