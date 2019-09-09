import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { withRouter } from "react-router-dom";

import { fadeIn } from "../../constants/animations";
import { callAPI } from "../../helpers/api";
import Context from "../../store/createContext";
import { colors } from "../../themes/theme";
import Button from "../../components/Button";

const Container = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-evenly;
  border-radius: 5px;
  border: 1px solid ${colors.brand};
  background-color: white;
  box-shadow: 0px 0px 10px -5px rgba(0, 0, 0, 0.5);

  animation: ${fadeIn} 1000ms;
`;

const demoChef = { email: "chef1@gmail.com", password: "password" },
  demoCustomer = { email: "customer1@gmail.com", password: "password" };

const DemoModeSwitch = ({ history, style }) => {
  const { setUser } = useContext(Context);

  async function signInAs(userCredentials) {
    try {
      const user = await callAPI({
        endpoint: "login",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: userCredentials
      });

      setUser(user);
      history.push(`/${user.usertype}/${user.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container style={style}>
      <Button onClick={signInAs.bind(null, demoChef)}>
        Sign In as Demo Chef
      </Button>
      <Button onClick={signInAs.bind(null, demoCustomer)}>
        Sign In as Demo Customer
      </Button>
    </Container>
  );
};

export default withRouter(DemoModeSwitch);
