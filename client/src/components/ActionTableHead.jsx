import React from 'react';
import PropTypes from 'prop-types';
import RTL from "./RTL";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Checkbox
} from '@material-ui/core';

const theme = createMuiTheme({
  direction: "rtl"
});

ActionTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function ActionTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const headCells = [
      { id: 'date', numeric: false, disablePadding: true, label: 'תאריך' },
      { id: 'time', numeric: false, disablePadding: false, label: 'שעה' },
      { id: 'actionType', numeric: false, disablePadding: false, label: 'סוג פעולה' },
      { id: 'actionLocation', numeric: false, disablePadding: false, label: 'מיקום' },
      { id: 'actionContext', numeric: false, disablePadding: false, label: 'הקשר' },
    ];

    const createSortHandler = property => event => {
      if(property === "date" || property === "actionType" || property === "actionLocation") {
        onRequestSort(event, property);
      }
    };
    
    return (
      <RTL>
      <ThemeProvider theme={theme}>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      </ThemeProvider>
      </RTL>
    );
  }

  export default ActionTableHead;