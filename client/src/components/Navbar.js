import React, { useContext, useState } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

import AuthContext from "../store/createContext";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { layout, colors } from "../themes/theme";
const { spacing, navHeight } = layout;

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${navHeight};
  padding: 15px 5vw;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10;

  background-color: ${({ transparent }) =>
    transparent ? "transparent" : "white"};
  box-shadow: ${({ transparent }) =>
    transparent ? "none" : `1px 7px 20px ${colors.bgcolor}`};

  img {
    width: 200px;
    height: 20px;
  }

  nav {
    display: flex;
    align-items: center;
  }

  @media (max-width: 500px) {
    nav.open {
      div {
        display: block;
        position: absolute;
        top: 100%;
        left: 0px;
        background: white;
        width: 100vw;
        z-index: 99;
      }
      /* .HamburgerButton {
        display: none;
      } */
    }
    nav.hidden {
      .HamburgerButton {
        display: block;
      }
      div {
        display: none;
      }
    }
  }
`;

function HamburgerButton(props) {
  const style = {
    transform: "rotate(90deg)",
    color: "#333",
    ...props.style,
  };

  return (
    <span {...props} className="HamburgerButton" style={style}>
      {props.active ? "X" : "|||"}
    </span>
  );
}

export default function Navbar({ children, transparent }) {
  const { user, setUser } = useContext(AuthContext);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const register = useOnClickOutside(() => {
    console.log("clicked outside");
    setNavIsOpen(false);
  });

  return (
    <Container transparent={transparent}>
      <img src="/logo.png" alt="logo" />
      {isMobile ? (
        <nav className={navIsOpen ? "open" : "hidden"}>
          <div ref={register}>{children}</div>
          <HamburgerButton
            onClick={() => setNavIsOpen(true)}
            active={navIsOpen}
          />
        </nav>
      ) : (
        <nav>
          <div>{children}</div>
        </nav>
      )}
    </Container>
  );
}
