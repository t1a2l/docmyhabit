import React, { useState, useEffect } from "react";
import { Select, TextField, Button, Container, MenuItem } from "@material-ui/core";

function DocAction() {
  const [actionTypes, setActionTypes] = useState([]);
  const [chosenActionType, setChosenActionType] = useState("");
  //const [actionLocation, setActionLocation] = useState("");
  const [actionContext, setActionContext] = useState("");

  useEffect(() => {
    let url = "http://localhost:4000/newActionInfo";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(response =>
        response.json().then(answer => {
          setActionTypes(answer);
        })
      )
      .catch(error => console.log("error", error));
  }, []);

  // function getTime() {
  //   let d = new Date();
  //   let hours = d.getHours();
  //   let minutes = d.getMinutes();
  //   return hours + ":" + minutes;
  // }

  function handleTypeChange(event) {
    setChosenActionType(event.target.value);
  }

  function handleContextChange(event) {
    setActionContext(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Select
          required
          id="action-type"
          autoFocus
          value={chosenActionType}
          onChange={handleTypeChange}
        >
          {actionTypes.map((action, index) => {
            return <MenuItem value={action.actionName} key={index}/>
          })}
        </Select>
        <TextField
          variant="outlined"
          margin="normal"
          required
          id="context-input"
          type="text"
          value={actionContext}
          onChange={handleContextChange}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Submit new action
        </Button>
      </form>
    </Container>
  );
}

export default DocAction;
