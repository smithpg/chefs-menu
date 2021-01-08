import React from "react";
import styled from "styled-components";

import { isMobile } from "react-device-detect";
import { Route, Link, Switch } from "react-router-dom";

import { layout } from "../../themes/theme";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import DemoModeSwitch from "./DemoModeSwitch";

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .formContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 24px;

    h1 {
      margin: 0;
    }

    @media (min-width: 400px) {
      background: white;
      box-shadow: 0px 0px 10px -5px rgba(0, 0, 0, 0.3);
      border-radius: 6px;
      width: 400px;
    }
  }

  h1 {
    font-weight: normal;
    @media (max-width: 400px) {
      font-size: 24px;
    }
  }

  .image {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: -1;
  }

  nav span {
    margin-right: ${layout.spacing(4)};
    color: white;
  }
`;

function AuthPage({ classes, ...rest }) {
  /**
   *  Conditionally renders one of :
   *
   *      Customer signup form
   *      Chef signup form
   *      Generic Login form
   *
   *  ... depending on the URL
   */

  //todo: remove this
  console.log(window.innerWidth);
  Array.from(document.querySelectorAll("*")).map((DOMNode) => {
    console.log(DOMNode.getBoundingClientRect());
  });

  return (
    <PageContainer className="pageContainer">
      {!isMobile && (
        <DemoModeSwitch
          style={{
            position: "absolute",
            bottom: 10,
            width: 500,
            left: "calc(50vw - 250px)",
          }}
        />
      )}

      <Switch>
        <Route path="/login">
          <Navbar
            transparent
            links={[{ link: "/signup/customer", text: "Sign Up" }]}
          />
        </Route>
        <Route path="/signup/:userType">
          <Navbar transparent links={[{ link: "/login", text: "Log In" }]} />
        </Route>
      </Switch>

      {isMobile ? null : (
        <img className="image" alt="bg img" src="/bg-img-sushi.png" />
      )}

      <div className="formContainer">
        <Switch>
          <Route path="/login">
            <h1>Login</h1>
            <LogInForm />
          </Route>
          <Route
            path="/signup/:userType"
            render={({
              match: {
                params: { userType },
              },
            }) => (
              <>
                <h1>Create an account</h1>
                <SignUpForm userType={userType} />
              </>
            )}
          />
        </Switch>
      </div>
      {/* <div className="paneRight">
        <img className="image" alt="bg img" src="/bg-img-sushi.png" />
      </div> */}
    </PageContainer>
  );
}

export default AuthPage;
