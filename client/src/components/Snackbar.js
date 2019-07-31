import React, { useState } from "react";
import {
  Snackbar as MUISnackbar,
  Button,
  SnackbarContent
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

export default function Snackbar({ message }) {
  const [isOpen, setOpen] = useState(true);

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <MUISnackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          />
        ]}
      />
    </div>
  );
}
