import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "./Button";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../store/createContext";
import { callAPI } from "../helpers/api";


export default function AdddishDialog({ setDishes, dishes }) {
    const [open, setOpen] = React.useState(false);
    const AddDishBtn = styled(Button)`
        display:block;
        width:100%;
        margin:10px;
    `;
    function handleClickOpen() {
        setOpen(true);
      }
    
      function handleClose() {
        setOpen(false);
      }
  
  

      const {user,setUser} = useContext(AuthContext);
      console.log("Context user:",user);

      const [values, setValues] = React.useState({
        numPeopleServed: 0,
        name: "",
        price: 0,
        ingredients: "",
        requirements: "",
        cuisine:"Japanese",
        chef: user.id,
      }); 
      const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
      };

      async function onSubmitAttempt(e) {
        e.preventDefault();
        try {
          const newdish = await callAPI({
            endpoint: "dish",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: values,
            token: user.token,
          });
          console.log("New dish from put",newdish);
          setDishes([...dishes,newdish]
          );
          console.log("Here are the new dishes",dishes);
          setOpen(false);
        } catch (error) {
          console.log("THERE IS A ERRRO",error);
        }
        
      }
    return (

    <div>
        <AddDishBtn onClick={handleClickOpen}> Add New Dish</AddDishBtn>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Dish</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a dish, please fill in the form and click submit button.
          </DialogContentText>
          <input
            accept="image/*"
            id="dish-img-file"
            multiple
            type="file"
          />

          <TextField
            autoFocus
            margin="dense"
            id="serve"
            label="How many people will this dish serve?"
            type="number"
            value={values.numPeopleServed}
            onChange={handleChange('numPeopleServed')}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Dish's name"
            type="text"
            value={values.name}
            onChange={handleChange('name')}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Price($)"
            type="number"
            onChange={handleChange('price')}
            value={values.price}
            fullWidth
          />
            <TextField
            autoFocus
            margin="dense"
            multiline
            rowsMax="4"
            id="ingred"
            label="Ingredients"
            type="text"
            onChange={handleChange('ingredients')}
            value={values.ingredients}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            multiline
            rowsMax="4"
            id="required"
            label="Required Stuff"
            type="text"
            onChange={handleChange('requirements')}
            value={values.requirements}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmitAttempt} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
