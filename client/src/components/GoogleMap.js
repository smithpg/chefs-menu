import React, { Component } from "react";
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Circle
} from "google-maps-react";
import { callAPI } from "../helpers/api";
import { useState, useEffect, useContext } from "react";

function GoogleMap(props) {
  const style = {
    height: "100%"
  };
  const coords = { lat: props.location.lat, lng: props.location.lng };
  console.log(window.google);
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Map google={window.google} zoom={13} center={coords}>
        <Marker name="User Location" position={coords} />
      </Map>
    </div>
  );
}

export default GoogleMap;
