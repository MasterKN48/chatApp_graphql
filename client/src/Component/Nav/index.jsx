import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../../context/auth";
import { useHistory } from "react-router-dom";
import Logo from "../../logo.svg";

const Nav = () => {
  const { isAuth } = useAuthState();
  const dispatch = useAuthDispatch();
  const history = useHistory();
  const logout = (e) => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light py-1 px-1">
        <NavLink to="/">
          <img
            src={Logo}
            alt="Brand"
            className="navbar-brand"
            loading="lazy"
            style={{ height: "32px" }}
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor03"
          aria-controls="navbarColor03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav mr-auto">
            {!isAuth && (
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  to="/register"
                >
                  Register
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
            )}
            {!isAuth && (
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
            )}

            {isAuth && (
              <li className="nav-item" style={{ cursor: "pointer" }}>
                <div className="nav-link" onClick={logout}>
                  LogOut
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
