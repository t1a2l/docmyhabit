import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearIcon from '@material-ui/icons/Clear';
import {
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';

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
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 50%',
    },
}));

function ActionTableToolbar(props) {
    const classes = useToolbarStyles();
    const { numSelected, onRequestFilter, onRequestDelete, actionTypes, locationTypes } = props;
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [chosenFilterActionType, setChosenFilterActionType] = useState("");
    const [chosenFilterActionLocation, setChosenFilterActionLocation] = useState("");
    const [clearRows, setClearRows] = useState(false);
    const [deleteRows, setDeleteRows] = useState(false);

    useEffect(() => {
      if(clearRows) {
        createFilterHandler();
        setClearRows(false);
      }
      if(deleteRows) {
        createDeleteHandler();
        setDeleteRows(false);
      }
   }, [clearRows, deleteRows]);

    function handleDelete() {
      setDeleteRows(true);
    }

    function handleClear() {
      setStartDateTime("");
      setEndDateTime("");
      setChosenFilterActionType("");
      setChosenFilterActionLocation("");
      setClearRows(true);     
    }

    function createFilterHandler() {
      let filter = {
        dateStart: startDateTime,
        dateEnd: endDateTime,
        actionType: chosenFilterActionType,
        actionLocation: chosenFilterActionLocation,
        clear: clearRows
      }
      onRequestFilter(filter);
    };

    function createDeleteHandler() {
      onRequestDelete();
    };

    function handleStartDateTimeChange(event) {
      setStartDateTime(event.target.value);
    }

    function handleEndDateTimeChange(event) {
      setEndDateTime(event.target.value);
    }

    function handleFilterActionTypeChange(event) {
      setChosenFilterActionType(event.target.value);
    }

    function handleFilterActionLocationChange(event) {
      setChosenFilterActionLocation(event.target.value);
    }

    
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h5" id="tableTitle" color="textPrimary">
            הרגלים
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div>
          <TextField
            id="datetime-local-start"
            style={{minWidth: 200, marginLeft: 50, marginTop: 10}}
            label="משעה ותאריך"
            type="datetime-local"
            value={startDateTime}
            onChange={handleStartDateTimeChange}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="datetime-local-end"
            style={{minWidth: 200, marginLeft: 50, marginTop: 10}}
            label="עד שעה ותאריך"
            type="datetime-local"
            value={endDateTime}
            onChange={handleEndDateTimeChange}
            InputLabelProps={{
              shrink: true
            }}
          />
          <FormControl  style={{marginTop: 10}}>
          <InputLabel id="action-type">פעולה</InputLabel>
          <Select
              id="action-type"
              style={{minWidth: 80, marginLeft: 80 }}
              value={chosenFilterActionType}
              onChange={handleFilterActionTypeChange}
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
            <FormControl style={{marginTop: 10}}>
            <InputLabel id="location-type">מיקום</InputLabel>
          <Select
              id="location-type"
              style={{minWidth: 80, marginLeft: 50}}
              value={chosenFilterActionLocation}
              onChange={handleFilterActionLocationChange}
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
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list" onClick={createFilterHandler} style={{marginTop: 10}}>
              <FilterListIcon style={{marginTop: 10}} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear filters">
            <IconButton aria-label="clear filters" onClick={handleClear} style={{marginTop: 10}}>
              <ClearIcon style={{marginTop: 10}} />
            </IconButton>
          </Tooltip>
          </div>
        )}
      </Toolbar>
    );
};

export default ActionTableToolbar;