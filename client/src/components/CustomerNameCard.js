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
    height: 75px;
    z-index: 99;
  }
`;

const Card = styled.div`
  border-radius: 5px;
  transition: all 100ms;

  width: 500px;
  max-width: 100vw;
  padding: 0px 12px;

  section {
    h3 {
      text-transform: uppercase;
    }
    margin-bottom: 1rem;
  }

  .user-info__title {
    display: flex;
    align-items: center;
    border-bottom: 2px solid ${background};
    height: 150px;

    flex-direction: column;
    justify-content: space-between;
  }

  .user-info__name {
    text-align: left;
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

  .user-info__map {
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
        <section className="user-info__title">
          <img className="user-info__avatar" alt="avatar" src={values.avatar} />
          <div className="user-info__name"> {values.name} </div>
        </section>
        <section>
          {userIsOwner ? (
            <StyledButton
              onClick={toggleEditMode}
              className="user-info__edit-btn"
            >
              Edit Info
            </StyledButton>
          ) : null}
        </section>
        <section className="user-info__details">
          <p> {values.strlocation} </p>
        </section>
        <section>
          <h3>ABOUT ME:</h3>
          <p>{customer.description}</p>
          <h3>FAVORITE CUISINES: </h3>
          {values.favorite.length > 0 ? (
            <CuisineList cuisineList={values.favorite} />
          ) : (
            <p>You have not added any favorites.</p>
          )}
        </section>
        <section>
          <h3>LOCATION: </h3>
          <GoogleMap location={location} zoom={13} className="user-info__map" />
        </section>
      </div>
    </>
  );

  const EditModeCard = (
    <div className="user-info">
      <section className="user-info__title">
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
      </section>
      <section>
        <StyledButton onClick={onSubmitAttempt}>Save Profile</StyledButton>
      </section>
      <section className="">
        <h3>ABOUT ME:</h3>
        <TextField
          className="form-field"
          value={values.description}
          onChange={handleChange("description")}
          margin="dense"
          multiline
          variant="outlined"
        />
      </section>
      <section>
        <h3>FAVORITE CUISINES: </h3>
        <TextField
          className="form-field"
          value={values.favorite}
          onChange={handleChange("favorite")}
          margin="dense"
          multiline
          variant="outlined"
        />
      </section>

      <section>
        <h3>LOCATION: </h3>
        <TextField
          className="form-field"
          value={values.strlocation}
          onChange={handleChange("strlocation")}
          margin="dense"
          variant="outlined"
        />
      </section>
    </div>
  );
  return (
    <Card key="3">{userIsOwner && isEditing ? EditModeCard : StaticCard}</Card>
  );
}

export default withRouter(Namecard);
