import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type RemoveDialogProps = {
  open: boolean;
  close: () => void;
  onRemove: () => void;
  title: string;
  description: string;
};
export const RemoveDialog = ({
  open,
  close,
  onRemove,
  title,
  description,
}: RemoveDialogProps) => {
  const handleRemove = () => {
    onRemove();
    close();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close()} autoFocus color="info">
            Anuluj
          </Button>
          <Button onClick={handleRemove} color="error">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
