import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import RTL from "./RTL";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import MessageDialog from "./MessageDialog";
import isThisWeek from "date-fns/isThisWeek";

const theme = createMuiTheme({
  direction: "rtl",
  backgroundColor: "red"
});

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center"
  }
}));

function HabitChart() {
  const classes = useStyles();
  const [chartData, setChartData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState({ title: "", content: "" });
  const [chosenFilterActionType, setChosenFilterActionType] = useState("");

  useEffect(() => {
    let url = process.env.REACT_APP_SERVER_URL + "/Actions";
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(response =>
        response.json().then(answer => {
          if (answer === []) {
            setMessage({ title: "שגיאה", content: "אין תיעודים!" });
          } else {
            setRawData(answer);
            let typesUrl = process.env.REACT_APP_SERVER_URL + "/typesInfo";
            fetch(typesUrl, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include"
            })
              .then(response =>
                response.json().then(answer => {
                  setActionTypes(answer.actionTypes);
                })
              )
              .catch(error => console.log("error", error));
          }
        })
      )
      .catch(error => console.log("error", error));
  }, []);

  useEffect(() => {
    if (
      rawData.length > 0 &&
      actionTypes.length > 0 &&
      chosenFilterActionType !== ""
    ) {
      let chartArr = [
        ["x", "תיעודים"],
        ["ראשון", 0],
        ["שני", 0],
        ["שלישי", 0],
        ["רביעי", 0],
        ["חמישי", 0],
        ["שישי", 0],
        ["שבת", 0]
      ];
      let filteredRowData = rawData.filter(
        item => item.actionType === chosenFilterActionType
      );
      for (let i = 0; i < filteredRowData.length; i++) {
        let item = filteredRowData[i];
        if (!isThisWeek(new Date(item.actionDateTime))) {
          filteredRowData.splice(filteredRowData.indexOf(item), 1);
        }
      }
      let sorted = filteredRowData.sort(function(a, b) {
        a = new Date(a.actionDateTime);
        b = new Date(b.actionDateTime);
        return a > b ? 1 : a < b ? -1 : 0;
      });
      sorted.forEach(item => {
        let d = new Date(item.actionDateTime);
        let day = d.getDay();
        chartArr[day + 1][1]++;
      });
      setChartData(chartArr);
    }
  }, [rawData, actionTypes, chosenFilterActionType]);

  useEffect(() => {
    if (actionTypes.length > 0) {
      setChosenFilterActionType(actionTypes[0]);
    }
    if (chosenFilterActionType !== "") {
      setReady(true);
    }
  }, [actionTypes, chosenFilterActionType]);

  // useEffect(() => {
  //   console.log(typeof(chosenFilterActionType));
  //   if (chartData.length > 0) {
  //     setReady(true);
  //   }
  // }, [chartData, chosenFilterActionType]);

  useEffect(() => {
    if (message.title !== "" && message.content !== "") {
      setOpen(true);
    }
  }, [message]);

  function closeDialog() {
    setOpen(false);
  }

  function handleFilterActionTypeChange(event) {
    setChosenFilterActionType(event.target.value);
  }

  return (
    <RTL>
      <ThemeProvider theme={theme}>
        {ready && (
          <div className={classes.root}>
            <FormControl style={{ marginTop: 10 }}>
              <InputLabel id="location-type">מיקום</InputLabel>
              <Select
                id="location-type"
                style={{ minWidth: 80, marginLeft: 50 }}
                value={chosenFilterActionType}
                onChange={handleFilterActionTypeChange}
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
            <Chart
              width={"auto"}
              height={"400px"}
              reversed={true}
              loader={
                <div className={classes.root}>
                  <CircularProgress />
                </div>
              }
              chartType="LineChart"
              data={chartData}
              options={{
                hAxis: {
                  title: "ימים"
                },
                vAxis: {
                  title: "תיעודים"
                },
                backgroundColor: "transparent"
              }}
              rootProps={{ "data-testid": "1" }}
            />
          </div>
        )}
        <MessageDialog
          dialogTitle={message.title}
          dialogContent={message.content}
          open={open}
          closeDialog={closeDialog}
        />
      </ThemeProvider>
    </RTL>
  );
}

export default HabitChart;

// data={[
//   ['x', 'תיעודים'],
//   ["ראשון", 7],
//   ["שני", 10],
//   ["שלישי", 12],
//   ["רביעי", 3],
//   ["חמישי", 0],
//   ["שישי", 9],
//   ["שבת", 5]
// ]}
