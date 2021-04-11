import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";

const LOGIN_USER = gql`
  query loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      name
      token
      password
    }
  }
`;

const Login = (props) => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      if (
        err.graphQLErrors[0] &&
        err.graphQLErrors[0].extensions &&
        err.graphQLErrors[0].extensions.errors
      ) {
        let { email, password, user } = err.graphQLErrors[0].extensions.errors;
        setError(email || password || user || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    },
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      props.history.push("/");
    },
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
    });
    setError(null);
  };

  const submit = (e) => {
    e.preventDefault();
    loginUser({ variables: { email: state.email, password: state.password } });
    setError(null);
    setState({ email: "", password: "" });
  };

  return (
    <form
      onSubmit={submit}
      style={{ maxWidth: "40rem" }}
      className="container-md shadow-sm my-4 py-5 bg-white rounded"
    >
      <h2 className="text-center">Login</h2>
      {error && <p className="alert alert-warning">{error}</p>}
      <fieldset>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={state.email}
            onChange={handleChange}
            required
            minLength="4"
            maxLength="60"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            value={state.password}
            onChange={handleChange}
            minLength="6"
            maxLength="64"
            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,64}"
            title="Must contain at least one number and one uppercase and lowercase letter and at least 6 or more letters."
            placeholder="Password"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="btn btn-outline-success"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </fieldset>
      <br />
      <small>
        <Link to="/register">Don't have account?</Link>
      </small>
    </form>
  );
};

export default Login;
