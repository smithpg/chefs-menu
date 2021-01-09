import React, { Component } from "react";
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Circle,
} from "google-maps-react";
import { callAPI } from "../helpers/api";
import { useState, useEffect, useContext } from "react";

function GoogleMap({ location, ...props }) {
  const style = {
    height: "100%",
  };
  const coords = { lat: location.lat, lng: location.lng };
  console.log(window.google);
  return (
    <div style={{ position: "relative" }} {...props}>
      <Map google={window.google} zoom={13} center={coords}>
        <Marker name="User Location" position={coords} />
      </Map>
    </div>
  );
}

export default GoogleMap;
