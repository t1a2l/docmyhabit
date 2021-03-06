import React, { useEffect, useState } from "react";
import ActionTableHead from "./ActionTableHead";
import ActionTableToolbar from "./ActionTableToolbar";
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  Switch,
  Box
} from "@material-ui/core";
import MessageDialog from "./MessageDialog";

const theme = createMuiTheme({
  direction: "rtl"
});

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    backgroundImage:
      "linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%)"
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

function ActionTable() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [locationTypes, setLocationTypes] = useState([]);
  const [updateDeleted, setUpdateDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({title: "", content: ""});

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
            setMessage({title: "שגיאה", content: "אין תיעודים!"});
          } else {
            setRows(answer);
            setOriginalList(answer);
            let typesUrl = process.env.REACT_APP_SERVER_URL + "/typesInfo";
            fetch(typesUrl, {
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
          }
        })
      )
      .catch(error => console.log("error", error));
  }, [updateDeleted]);

  useEffect(() => {
    if(message.title !== "" && message.content !== "") {
      setOpen(true);
    }
  }, [message]);

  function closeDialog(){
    setOpen(false);
  }

  function getComparator(order, orderBy) {
    // asc or desc and what proparty to do it by
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    // the actuall function that change the order of the rows to asc or desc
    if (orderBy === "date") {
      let date1 = new Date(a.actionDateTime);
      let date2 = new Date(b.actionDateTime);
      if (date1 < date2) {
        return -1;
      }
      if (date1 > date2) {
        return 1;
      }
      return 0;
    } else {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
  }

  function handleRequestSort(event, property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  function handleRequestFilter(filter) {
    let filteredDateRows = [];
    if (filter.clear) {
      setRows(originalList);
      return;
    }
    if (
      (filter.dateStart !== null && filter.dateEnd === null) ||
      (filter.dateStart === null && filter.dateEnd !== null)
    ) {
      setMessage({title: "שגיאה", content: "אחד התאריכים לא מלא!"});
      return;
    } else if (filter.dateStart !== null && filter.dateEnd !== null) {
      console.log("1");
      let dStart = new Date(filter.dateStart);
      let dEnd = new Date(filter.dateEnd);
      if (dStart <= dEnd) {
        filteredDateRows = originalList.filter(
          item =>
            dStart <= new Date(item.actionDateTime) &&
            new Date(item.actionDateTime) <= dEnd
        );
        if (filter.actionType !== "") {
          filteredDateRows = filteredDateRows.filter(
            item => item.actionType === filter.actionType
          );
        }
        if (filter.actionLocation !== "") {
          filteredDateRows = filteredDateRows.filter(
            item => item.actionLocation === filter.actionLocation
          );
        }
        setRows(filteredDateRows);
      } else {
        setMessage({title: "שגיאה", content: "תאריך הסיום גדול מתאריך ההתחלה"});
        return;
      }
    } else {
      if (filter.actionType !== "") {
        console.log("2");
        filteredDateRows = originalList.filter(
          item => item.actionType === filter.actionType
        );
        console.log(filteredDateRows);
        if (filter.actionLocation !== "") {
          filteredDateRows = filteredDateRows.filter(
            item => item.actionLocation === filter.actionLocation
          );
        }
        setRows(filteredDateRows);
      } else if (filter.actionLocation !== "") {
        filteredDateRows = originalList.filter(
          item => item.actionLocation === filter.actionLocation
        );
        setRows(filteredDateRows);
      }
    }
  }

  function handleRequestDelete() {
    let url = process.env.REACT_APP_SERVER_URL + "/deleteActions";
    let myData = {
      actions: selected
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(myData)
    })
      .then(response =>
        response.text().then(answer => {
          if (answer !== "success") {
            setMessage({title: "שגיאה", content: "הייתה בעיה למחוק"});
          } else {
            setUpdateDeleted(updateDeleted + 1);
            setSelected([]);
          }
        })
      )
      .catch(error => console.log("error", error));
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.key);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <RTL>
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Paper className={classes.paper}>
            <ActionTableToolbar
              numSelected={selected.length}
              onRequestFilter={handleRequestFilter}
              onRequestDelete={handleRequestDelete}
              actionTypes={actionTypes}
              locationTypes={locationTypes}
            />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                aria-label="enhanced table"
              >
                <ActionTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.key);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      let d = new Date(row.actionDateTime);
                      let date =
                        d.getDate() +
                        "." +
                        (d.getMonth() + 1) +
                        "." +
                        d.getFullYear();
                      let time = d.getHours() + ":" + d.getMinutes();

                      return (
                        <TableRow
                          hover
                          onClick={event => handleClick(event, row.key)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.key}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {date}
                          </TableCell>
                          <TableCell>{time}</TableCell>
                          <TableCell>{row.actionType}</TableCell>
                          <TableCell>{row.actionLocation}</TableCell>
                          <TableCell>{row.actionContext}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              nextIconButtonText="עמוד הבא"
              backIconButtonText="עמוד קודם"
              labelRowsPerPage={"שורות בעמוד"}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to} מתוך ${count !== -1 ? count : ` יותר מ ${to}`}`}
            />
          </Paper>
          <div>
            <Box>
              <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="ריפוד צפוף"
                style={{ marginRight: "10px"}}
              />
            </Box>
          </div>
          <MessageDialog
            dialogTitle={message.title}
            dialogContent={message.content}
            open={open}
            closeDialog={closeDialog}
          />
        </ThemeProvider>
      </div>
    </RTL>
  );
}

export default ActionTable;
