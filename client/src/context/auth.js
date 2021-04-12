import React, { createContext, useReducer, useContext } from "react";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;
const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtDecode(token);
  const expiredAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expiredAt) {
    localStorage.clear();
  } else {
    user = decodedToken;
  }
} else {
  console.log("not log-in");
}

let initialState = {
  user: user,
  isAuth: user ? true : false,
};

const authReducer = (state, { type, payload }) => {
  switch (type) {
    case "LOGIN":
      localStorage.setItem("token", payload.token);
      //console.log(payload);
      return {
        ...state,
        user: { _id: payload._id, name: payload.name },
        isAuth: true,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        user: null,
        isAuth: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
