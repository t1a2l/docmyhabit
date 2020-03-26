import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Grid
} from "@material-ui/core";
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
  list: {
    backgroundColor: theme.palette.background.paper,
    display: "inline-block",
    borderRadius: "10px"
  }
}));

function AddTypes(props) {
  const classes = useStyles();
  const type = props.location.state.type;
  const [types, setTypes] = useState([]);
  const [chosenType, setChosenType] = useState("");
  const [typeName, setTypeName] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({title: "", content: ""});

  useEffect(() => {
    setChosenType(type);
    let url = process.env.REACT_APP_SERVER_URL + "/typesInfo";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(response =>
        response.json().then(answer => {
          if (type === "פעולה") {
            setTypes(answer.actionTypes);
          } else {
            setTypes(answer.locationTypes);
          }
        })
      )
      .catch(error => console.log("error", error));
  }, [type, typeName]);

  useEffect(() => {
    if(message.title !== "" && message.content !== ""){
      setOpen(true);
    }
  }, [message]);

  function closeDialog(){
    setOpen(false);
  }

  function handleDelete(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/deleteType";
    let arrayName;
    if (chosenType === "פעולה") {
      arrayName = "actionTypes";
    } else {
      arrayName = "locationTypes";
    }
    let index = types.findIndex(item => item === typeName);
    if (index === -1) {
      setMessage({title: "שגיאה", content: "קיים ברשימה!"});
      return;
    }
    let myType = {
      deleteTypeName: typeName,
      arrayName: arrayName
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(myType)
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            setMessage({title: "הודעה", content: "נמחק בהצלחה"});
            setTypeName("");
          } else {
            setMessage({title: "שגיאה", content: answer});
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  function handleSubmit(event) {
    event.preventDefault();
    let url = process.env.REACT_APP_SERVER_URL + "/newType";
    let arrayName;
    if (chosenType === "פעולה") {
      arrayName = "actionTypes";
    } else {
      arrayName = "locationTypes";
    }
    let index = types.findIndex(item => item === typeName);
    if (index !== -1) {
      setMessage({title: "שגיאה", content: "פריט זה כבר קיים ברשימה"});
      return;
    }
    let myType = {
      newTypeName: typeName,
      arrayName: arrayName
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(myType)
    })
      .then(response =>
        response.text().then(answer => {
          if (answer === "success") {
            setMessage({title: "הודעה", content: "נוסף בהצלחה"});
            setTypeName("");
          } else {
            setMessage({title: "שגיאה", content: answer});
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  function handleTypeChange(event) {
    setTypeName(event.target.value);
  }

  return (
    <RTL>
      <Container maxWidth="xs">
        <ThemeProvider theme={theme}>
          <Grid container className={classes.root}>
            <Grid item xs={6}>
              <div className={classes.list} style={{maxHeight: 200, overflow: 'auto'}}>
                <List>
                  {types.map((type, index) => {
                    return (
                      <ListItem key={index}>
                        <ListItemText
                          primary={"- " + type}
                          secondary=""
                          value={type}
                          variant="h5"
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </Grid>
            <Grid item xs={6}>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="type"
                  value={chosenType}
                  inputProps={{
                    readOnly: true,
                    disabled: true
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="context-input"
                  type="text"
                  autoFocus
                  value={typeName}
                  onChange={handleTypeChange}
                />
                <Button
                  id="add"
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ fontSize: "18px" }}
                >
                  הוסף סוג חדש
                </Button>
                <Button
                  id="delete"
                  fullWidth
                  onClick={handleDelete}
                  variant="contained"
                  color="default"
                  style={{ fontSize: "18px", marginTop: "10px" }}
                >
                  מחק סוג קיים
                </Button>
              </form>
            </Grid>
          </Grid>
          <MessageDialog
            dialogTitle={message.title}
            dialogContent={message.content}
            open={open}
            closeDialog={closeDialog}
          />
        </ThemeProvider>
      </Container>
    </RTL>
  );
}

export default AddTypes;
