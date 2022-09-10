import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";

import classes from "./MainNavigation.module.css";
import AuthContext from "../../store/authContext";

const MainNavigation = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const isLoggedIn = authContext.isLoggedIn;

  const handleLogout = () => {
    authContext.logout();
    history.push("/auth");
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Authentication</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn ? (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
