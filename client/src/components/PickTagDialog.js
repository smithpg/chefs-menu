import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "./Button";
import styled from "styled-components";
import TransferList from "./TransferList";
import { callAPI } from "../helpers/api";
import { useState, useContext } from "react";
import AuthContext from "../store/createContext";

export default function PickTagDialog(props) {
  const [open, setOpen] = React.useState(false);
  const PickTagBtn = styled(Button)`
    display: block;
    width: 100%;
  `;
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  const [chefcuisines, setchefCuisines] = useState([]);
  const { user } = useContext(AuthContext);

  async function handleClick(event) {
    event.preventDefault();
    try {
      const cuisinesBody = {
        cuisines: chefcuisines
      };
      const endpoint = `chef/${user.id}`;
      const newchef = await callAPI({
        endpoint: endpoint,
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: cuisinesBody,
        token: user.token
      });
      handleClose();
      props.setValuesCuisines(chefcuisines);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <PickTagBtn outline onClick={handleClickOpen}>
        Edit Cuisine Tags
      </PickTagBtn>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select tags</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To select tags, please check tags and click &lt; or &gt; to move
            tags.
          </DialogContentText>
          <TransferList
            setchefCuisines={setchefCuisines}
            cuisines={props.cuisines}
            restCuisines={props.restCuisines}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClick} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
