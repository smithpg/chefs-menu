import React, { useContext } from "react";
import AuthContext from "../../store/createContext";
import { useHistory } from "react-router-dom";

function LogoutPage(props) {
  /**
        Logs the user out and redirects to auth page
   */

  const history = useHistory();
  const { logout } = useContext(AuthContext);

  logout();
  history.push("/signup/customer");

  return null;
}

export default LogoutPage;
