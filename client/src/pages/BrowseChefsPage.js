import React, { useState } from "react";
import styled from "styled-components";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Route, Link, Switch } from "react-router-dom";
import { TiDelete, TiLocation } from "react-icons/ti";

import useResource from "../hooks/useResource";
import { layout, colors } from "../themes/theme";
import Navbar from "../components/Navbar";
import Chip from "../components/Chip";
import Button from "../components/Button";
import LocationSearchInput from "../components/LocationSearchInput";

import ChefCard from "../components/ChefCard";
import SimpleMenu from "../components/MenuButton";

const cuisinesArray = [
  "American",
  "British",
  "Caribbean",
  "Chinese",
  "French",
  "Greek",
  "Indian",
  "Italian",
  "Mediterranean",
  "Mexican",
  "Morrocan",
  "Spanish",
  "Thai",
  "Turkish",
  "Vietnamese"
];

const PageContainer = styled.div`
  margin-top: ${layout.navHeight};
  display: flex;
  overflow: hidden;
  .paneLeft {
    height: calc(100vh - ${layout.navHeight});
    width: 25%;
    padding: ${layout.spacing(3)} ${layout.spacing(5)};
  }

  .paneRight {
    height: calc(100vh - ${layout.navHeight});
    width: 75%;
    overflow-y: scroll;
    padding: 0px ${layout.spacing(5)};
    background-color: ${colors.bgcolor};
  }
  .chef-container {
    display: flex;
    // justify-content: center;
    flex-wrap: wrap;
    padding: 0px;
  }

  h1 {
    font-weight: normal;
    /* margin: 40px 0px; */
  }

  nav span {
    margin-right: ${layout.spacing(4)};
  }

  #cuisine-label {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75rem;
  }
  .chip-list {
    list-style: none;
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
  }
`;

function BrowseChefsPage({ classes, ...rest }) {
  let { resource: retrievedChefs, loading, setEndpoint } = useResource("chef");
  let [location, setLocation] = useState("");
  let [cuisines, setCuisines] = useState(
    cuisinesArray.reduce(
      (accum, cuisineName) => {
        accum[cuisineName] = false;
        return accum;
      },
      { all: true }
    )
  );

  async function onSubmit() {
    let endpoint = "chef";

    // Get coordinates for entered address, if applicable
    if (location) {
      await geocodeByAddress(location)
        .then(results => getLatLng(results[0]))
        .then(
          latLng =>
            (endpoint += `?location=${latLng.lat.toFixed(
              2
            )}+${latLng.lng.toFixed(2)}`)
        )
        .catch(error => console.error("Error", error));
    }

    setEndpoint(endpoint);
  }

  function toggleCuisine(cuisineName) {
    if (cuisineName !== "all" && cuisines.all) {
      // When 'all' filter is selected, treat clicks on
      // other cusine filters as deselecting 'all'
      cuisines.all = false;
    }

    setCuisines({
      ...cuisines,
      [cuisineName]: !cuisines[cuisineName]
    });
  }

  const selectedCuisines = Object.entries(cuisines)
      .filter(entry => entry[1])
      .map(entry => (
        <Chip as="li">
          {entry[0]}
          <TiDelete
            style={{
              marginLeft: " 5px",
              fontSize: "18px",
              cursor: "pointer"
            }}
            onClick={toggleCuisine.bind(null, entry[0])}
          />
        </Chip>
      )),
    unselectedCuisines = Object.entries(cuisines)
      .filter(entry => !entry[1])
      .map(entry => (
        <Chip
          as="li"
          clickable
          outline
          onClick={toggleCuisine.bind(null, entry[0])}
        >
          {entry[0]}
        </Chip>
      ));
  return (
    <PageContainer className="pageContainer">
      <Navbar transparent>
        <SimpleMenu />
      </Navbar>

      <div className="paneLeft">
        <LocationSearchInput
          label="Location"
          IconComponent={TiLocation}
          location={location}
          setLocation={setLocation}
        />
        <span id="cuisine-label">Cuisine</span>
        {selectedCuisines.length > 0 && (
          <ul className="chip-list selected">{selectedCuisines}</ul>
        )}
        {unselectedCuisines && (
          <ul className="chip-list">{unselectedCuisines}</ul>
        )}

        <Button onClick={onSubmit}>Submit</Button>
      </div>

      <div className="paneRight">
        <h2>Available Chefs</h2>
        <ul className="chef-container">
          {loading
            ? "loading..."
            : retrievedChefs.length > 0
            ? cuisines["all"]
              ? retrievedChefs.map(chef => <ChefCard {...chef} />)
              : retrievedChefs
                  .filter(chef =>
                    chef.cuisines.some(cuisine => cuisines[cuisine])
                  )
                  .map(chef => <ChefCard {...chef} />)
            : "No matching chefs found."}
        </ul>
      </div>
    </PageContainer>
  );
}

export default BrowseChefsPage;
