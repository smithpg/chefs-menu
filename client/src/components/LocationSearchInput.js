import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import styled from "styled-components";

import { colors } from "../themes/theme";
import TextField from "./TextField";

const InputContainer = styled.div`
  position: relative;
  width: 250px;

  .autocomplete-dropdown-container {
    position: absolute;
    top: 100%;

    box-shadow: -5px 10px 30px -10px rgba(0, 0, 0, 0.5);
  }

  .suggestion-item {
    font-size: 0.8rem;
    font-style: italic;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding: 5px;
  }

  .suggestion-item--active {
    background-color: ${colors.brandLight};
  }
`;

export default class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.setState({ address });
  };

  render() {
    const textFieldProps = this.props;

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <InputContainer>
            <TextField
              style={{ width: "100%" }}
              {...textFieldProps}
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input"
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item suggestion-item--active"
                  : "suggestion-item";
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </InputContainer>
        )}
      </PlacesAutocomplete>
    );
  }
}
