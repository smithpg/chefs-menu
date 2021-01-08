import React from "react";
import styled from "styled-components";
import Button from "./Button";
import { makeStyles } from "@material-ui/core/styles";
import GoogleMap from "./GoogleMap";
import { colors } from "../themes/theme";
import CuisineList from "./CuisineList";
import { callAPI } from "../helpers/api";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../store/createContext";
import { Link, withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import useToggle from "../hooks/useToggle";
import ImageUploader from "./ImageUploader";

const { brandLight, background } = colors;

const StyledButton = styled(Button)`
  background-color: ${brandLight};
  color: white;
  border-style: solid;
  border-width: 2px;
  border-color: ${brandLight};
  height: auto;

  &:hover,
  &:active {
    background: ${colors.brandTransparent};
  }

  @media (max-width: 400px) {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    z-index: 99;
  }
`;

const Card = styled.div`
  border-radius: 5px;
  transition: all 100ms;

  width: 500px;
  max-width: 100vw;
  padding: 0px 12px;

  .user-info__title {
    display: flex;
    align-items: center;
    border-bottom: 2px solid ${background};
  }

  .user-info__name {
    text-align: left;
    flex-grow: 1;
    padding: 0px 12px;

    font-weight: bold;
    font-size: 20px;
  }

  .user-info__avatar {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info__edit-btn {
    justify-self: flex-end;
  }

  .user-info__sub-heading {
    font-weight: bold;
  }
  .lower {
    height: 250px;
  }

  .form-field {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

function Namecard({ customer, history, userIsOwner }) {
  const [values, setValues] = useState({
    name: customer.name,
    strlocation: customer.strlocation,
    description: customer.description,
    favorite: customer.favorite,
    avatar: customer.avatar,
  });
  const [isEditing, toggleEditMode] = useToggle(false);

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
  });
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    async function getLatlnt() {
      const address = values.strlocation;
      const googleapi = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS}`;
      fetch(googleapi)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            setLocation(data.results[0].geometry.location);
          }
        });
    }

    if (values.strlocation) {
      getLatlnt();
    }
  }, [values.strlocation]);

  function handleSubmit() {
    history.push("/browse/chefs");
  }
  const handleChange = (name) => (event) => {
    if (name === "favorite") {
      setValues({ ...values, [name]: event.target.value.split(",") });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  async function handleImageSubmit(event) {
    const fileObj = event.target.files[0];
    let formData = new FormData();
    formData.append("image", fileObj);
    const id = event.target.id;
    var imgAlt = "avatar";
    try {
      const endpoint = `customer/${customer._id}/${imgAlt}`;
      const imgURL = await callAPI({
        endpoint: endpoint,
        method: "POST",
        body: formData,
        isForm: true,
      });
      setValues({ ...values, avatar: imgURL });
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmitAttempt(e) {
    e.preventDefault();
    try {
      const updatedCustomer = await callAPI({
        endpoint: `customer/${customer._id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: values,
        token: user.token,
      });

      // setUser(updatedCustomer);
      toggleEditMode();
    } catch (error) {
      console.log(error);
    }
  }

  const StaticCard = (
    <>
      <div className="user-info">
        <div className="user-info__title">
          <img className="user-info__avatar" alt="avatar" src={values.avatar} />
          <div className="user-info__name"> {values.name} </div>
          {userIsOwner ? (
            <StyledButton
              onClick={toggleEditMode}
              className="user-info__edit-btn"
            >
              Edit Info
            </StyledButton>
          ) : null}
        </div>
        <div className="user-info__details">
          <p> {values.strlocation} </p>
        </div>
        <div className="rightUpper">
          <span className="user-info__sub-heading">ABOUT ME:</span>
          <p>{customer.description}</p>
          <span className="user-info__sub-heading">FAVORITE CUISINES: </span>
          {values.favorite.length > 0 ? (
            <CuisineList cuisineList={values.favorite} />
          ) : (
            <p>You have not added any favorites.</p>
          )}
        </div>
      </div>
      <div className="lower">
        <span className="user-info__sub-heading">LOCATION: </span>
        <GoogleMap location={location} zoom={13} />
      </div>
    </>
  );

  const EditModeCard = (
    <div className="user-info">
      <div>
        <ImageUploader
          onSubmit={handleImageSubmit}
          promptText="Click to upload a new profile picture"
        >
          <img className="user-info__avatar" alt="avatar" src={values.avatar} />
        </ImageUploader>

        <TextField
          className="form-field"
          value={values.name}
          onChange={handleChange("name")}
          margin="dense"
          variant="outlined"
        />
      </div>
      <div className="">
        <span className="user-info__sub-heading">ABOUT ME:</span>
        <TextField
          className="form-field"
          value={values.description}
          onChange={handleChange("description")}
          margin="dense"
          multiline
          variant="outlined"
        />
      </div>
      <div>
        <span className="user-info__sub-heading">FAVORITE CUISINES: </span>
        <TextField
          className="form-field"
          value={values.favorite}
          onChange={handleChange("favorite")}
          margin="dense"
          multiline
          variant="outlined"
        />
      </div>

      <div>
        <span className="user-info__sub-heading">LOCATION: </span>
        <TextField
          className="form-field"
          value={values.strlocation}
          onChange={handleChange("strlocation")}
          margin="dense"
          variant="outlined"
        />
      </div>
      <StyledButton onClick={onSubmitAttempt}>Save Profile</StyledButton>
    </div>
  );
  return (
    <Card key="3">{userIsOwner && isEditing ? EditModeCard : StaticCard}</Card>
  );
}

export default withRouter(Namecard);
