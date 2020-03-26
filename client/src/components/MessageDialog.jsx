import React, { useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";

function MessageDialog(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const { dialogTitle, dialogContent, open, closeDialog } = props;

  const handleClose = useCallback(() => {
    setOpenDialog(false);
    closeDialog();
  }, [closeDialog]);

  useEffect(() => {
    if(open) {
      setOpenDialog(true);
      setTimeout(handleClose, 1000);
    }
  }, [open, handleClose]);

  return (
    <div>
    <Dialog open={openDialog} onClose={handleClose} aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
      <DialogTitle id="simple-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent >{dialogContent}</DialogContent>
    </Dialog>
    </div>
  );
}

MessageDialog.propTypes = {
  open: PropTypes.bool.isRequired
};

export default MessageDialog;
