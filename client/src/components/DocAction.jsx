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
  Grid
} from "@material-ui/core";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import heLocale from "date-fns/locale/he";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import MessageDialog from "./MessageDialog";

const theme = createMuiTheme({
  direction: "rtl"
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  flexContainer: {
    display: "flex",
    flexDirection: "column"
  }
}));

function DocAction() {
  const classes = useStyles();
  const [actionTypes, setActionTypes] = useState([]);
  const [chosenActionType, setChosenActionType] = useState("");
  const [actionDateTime, setActionDateTime] = useState(new Date());
  const [locationTypes, setLocationTypes] = useState([]);
  const [chosenLocationType, setChosenLocationType] = useState("");
  const [actionContext, setActionContext] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", content: "" });

  useEffect(() => {
    let url = process.env.REACT_APP_SERVER_URL + "/typesInfo";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(response =>
        response.json().then(answer => {
          setActionTypes(answer.actionTypes);
          setLocationTypes(answer.locationTypes);
        })
      )
      .catch(error => console.log("error", error));
  }, []);

  useEffect(() => {
    if (message.title !== "" && message.content !== "") {
      setOpen(true);
    }
  }, [message]);

  function closeDialog() {
    setOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/newActionInfo";
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
            setMessage({ title: "הודעה", content: "פעולה תועדה!" });
            setChosenActionType("");
            setActionDateTime(new Date());
            setChosenLocationType("");
            setActionContext("");
          } else {
            setMessage({ title: "שגיאה", content: answer });
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  function handleTypeChange(event) {
    setChosenActionType(event.target.value);
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
          <Grid container className={classes.root}>
            <Grid item xs>
              <form onSubmit={handleSubmit} className={classes.flexContainer}>
                <FormControl className={classes.formControl}>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={heLocale}
                  >
                    <DatePicker
                      value={actionDateTime}
                      onChange={setActionDateTime}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={heLocale}
                  >
                    <TimePicker
                      value={actionDateTime}
                      onChange={setActionDateTime}
                      ampm={false}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
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
                        <MenuItem value={action} key={index}>
                          {action}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
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
                        <MenuItem value={location} key={index}>
                          {location}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
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
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  תעד פעולה חדשה
                </Button>
              </form>
            </Grid>
          </Grid>
        </ThemeProvider>
        <MessageDialog
          dialogTitle={message.title}
          dialogContent={message.content}
          open={open}
          closeDialog={closeDialog}
        />
      </Container>
    </RTL>
  );
}

export default DocAction;
