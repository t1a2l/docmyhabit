import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Menu
} from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import heLocale from "date-fns/locale/he";

ActionTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestFilter: PropTypes.func.isRequired,
  onRequestDelete: PropTypes.func.isRequired,
  actionTypes: PropTypes.array.isRequired,
  locationTypes: PropTypes.array.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between"
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 50%"
  },
  menu: {
    display: "flex",
    direction: "row"
  }
}));

function ActionTableToolbar(props) {
  const classes = useToolbarStyles();
  const {
    numSelected,
    onRequestFilter,
    onRequestDelete,
    actionTypes,
    locationTypes
  } = props;
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [chosenFilterActionType, setChosenFilterActionType] = useState("");
  const [chosenFilterActionLocation, setChosenFilterActionLocation] = useState(
    ""
  );
  const [clearRows, setClearRows] = useState(false);
  const [deleteRows, setDeleteRows] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  let history = useHistory();

  const createFilterHandler = useCallback(() => {
    let filter = {
      dateStart: startDateTime,
      dateEnd: endDateTime,
      actionType: chosenFilterActionType,
      actionLocation: chosenFilterActionLocation,
      clear: clearRows
    };
    onRequestFilter(filter);
  }, [
    startDateTime,
    endDateTime,
    chosenFilterActionType,
    chosenFilterActionLocation,
    clearRows,
    onRequestFilter
  ]);

  const createDeleteHandler = useCallback(() => {
    onRequestDelete();
  }, [onRequestDelete]);

  useEffect(() => {
    if (clearRows) {
      createFilterHandler();
      setClearRows(false);
    }
    if (deleteRows) {
      createDeleteHandler();
      setDeleteRows(false);
    }
  }, [clearRows, deleteRows, createFilterHandler, createDeleteHandler]);

  function handleDelete() {
    setDeleteRows(true);
  }

  function handleClear() {
    setStartDateTime(null);
    setEndDateTime(null);
    setChosenFilterActionType("");
    setChosenFilterActionLocation("");
    setClearRows(true);
  }

  function handleFilterActionTypeChange(event) {
    setChosenFilterActionType(event.target.value);
  }

  function handleFilterActionLocationChange(event) {
    setChosenFilterActionLocation(event.target.value);
  }

  function handleAdd() {
    history.push("/doc-new-action");
  }

  function handleAddAction() {
    history.push({
      pathname: "/add-types",
      state: { type: "פעולה" }
    });
  }

  function handleAddLocation() {
    history.push({
      pathname: "/add-types",
      state: { type: "מיקום" }
    });
  }

  function handleAdvancedSettings() {
    console.log("הגדרות מתקדמות");
  }

  function handleSettings(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleSettingsClose() {
    setAnchorEl(null);
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <div className={classes.menu}>
          <Typography
            className={classes.title}
            variant="h5"
            id="tableTitle"
            color="textPrimary"
            style={{ marginTop: "6px" }}
          >
            הרגלים
          </Typography>
          <IconButton aria-label="add" onClick={handleAdd}>
            <AddIcon />
          </IconButton>
          <IconButton aria-label="settings" onClick={handleSettings}>
            <SettingsIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleSettingsClose}
          >
            <MenuItem onClick={handleAddAction}>נהל פעולות</MenuItem>
            <MenuItem onClick={handleAddLocation}>נהל מיקומים</MenuItem>
            <MenuItem onClick={handleAdvancedSettings}>
              אפשרויות מתקדמות
            </MenuItem>
          </Menu>
        </div>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div>
          <FormControl style={{ marginTop: 10 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
              <DateTimePicker
                label="משעה ותאריך"
                ampm={false}
                value={startDateTime}
                onChange={setStartDateTime}
                style={{ width: "60%" }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl style={{ marginTop: 10 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
              <DateTimePicker
                label="עד שעה ותאריך"
                ampm={false}
                value={endDateTime}
                onChange={setEndDateTime}
                style={{ width: "60%" }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl style={{ marginTop: 10 }}>
            <InputLabel id="action-type">פעולה</InputLabel>
            <Select
              id="action-type"
              style={{ minWidth: 80, marginLeft: 80 }}
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
          <FormControl style={{ marginTop: 10 }}>
            <InputLabel id="location-type">מיקום</InputLabel>
            <Select
              id="location-type"
              style={{ minWidth: 80, marginLeft: 50 }}
              value={chosenFilterActionLocation}
              onChange={handleFilterActionLocationChange}
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
          <Tooltip title="Filter list">
            <IconButton
              aria-label="filter list"
              onClick={createFilterHandler}
              style={{ marginTop: 10 }}
            >
              <FilterListIcon style={{ marginTop: 10 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear filters">
            <IconButton
              aria-label="clear filters"
              onClick={handleClear}
              style={{ marginTop: 10 }}
            >
              <ClearIcon style={{ marginTop: 10 }} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}

export default ActionTableToolbar;
