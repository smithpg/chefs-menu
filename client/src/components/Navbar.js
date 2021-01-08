import React, { useContext, useState, useRef } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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

  #menu-btn {
    display: flex;
    align-items: center;
    border-radius: 10%;
    padding: 12px;
    border: 1px solid transparent;
    cursor: pointer;
    &:hover {
      border: 1px solid white;
    }
  }

  img {
    width: 200px;
    height: 20px;
  }

  nav {
    display: flex;
    align-items: center;
  }

  @media (max-width: 500px) {
    div {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      position: absolute;
      top: 100%;
      left: 0px;
      background: white;
      width: 100vw;
      z-index: 99;
    }
    .HamburgerButton {
      color: black;
    }
  }
`;

export default function Navbar({ links, transparent }) {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const navigate = (path) => {
    setDrawerIsOpen(false);

    setTimeout(() => {
      history.push(path);
    }, 200);
  };

  return (
    <Container transparent={transparent}>
      <img src="/logo.png" alt="logo" />
      <span id="menu-btn" onClick={() => setDrawerIsOpen(true)}>
        <AiOutlineMenu />
      </span>
      <Drawer
        anchor="right"
        open={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
      >
        <AiOutlineClose
          onClick={() => setDrawerIsOpen(false)}
          style={{ alignSelf: "end", margin: "12px" }}
        />
        <List style={{ width: "50vw", maxWidth: 300 }}>
          {links &&
            links.map(({ link, text }, index) => (
              <ListItem button key={link} onClick={() => navigate(link)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          {user && (
            <>
              <ListItem
                button
                key={"profile"}
                onClick={() => navigate(`/${user.usertype}/${user.id}`)}
              >
                <ListItemText primary={"Profile"} />
              </ListItem>

              <ListItem
                button
                key={"logout"}
                onClick={() => navigate("/logout")}
              >
                <ListItemText primary={"Logout"} />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </Container>
  );
}
