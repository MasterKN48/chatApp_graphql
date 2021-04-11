import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation registerUser($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      _id
      name
    }
  }
`;

const Register = (props) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    // update: (_, res) => props.history.push("/login"),
    onError: (err) => {
      if (
        err.graphQLErrors[0] &&
        err.graphQLErrors[0].extensions &&
        err.graphQLErrors[0].extensions.errors
      ) {
        let {
          email,
          password,
          name,
          user,
        } = err.graphQLErrors[0].extensions.errors;
        setError(email || password || name || user || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    },
    onCompleted: (data) => setMsg("Register successful, Go to Login Page"),
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
    });
    setError(null);
    setMsg(null);
  };

  const submit = (e) => {
    e.preventDefault();

    if (state.password !== state.cpassword) {
      setError("Password not match with confirm password.");

      return;
    }
    registerUser({
      variables: {
        name: state.name,
        email: state.email,
        password: state.password,
      },
    });
    setError(null);
    setState({ name: "", email: "", password: "", cpassword: "" });
  };

  return (
    <form
      onSubmit={submit}
      style={{ maxWidth: "40rem" }}
      className="container-md shadow-sm my-4 py-5 bg-white rounded"
    >
      <h2 className="text-center">Register</h2>
      {error && <p className="alert alert-warning">{error}</p>}
      {msg && <p className="alert alert-success">{msg}</p>}
      <fieldset>
        <div className="form-group">
          <label htmlFor="name">User Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={state.name}
            onChange={handleChange}
            required
            minLength="4"
            maxLength="60"
            aria-describedby="nameHelp"
            placeholder="Enter username"
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            required
            minLength="6"
            value={state.cpassword}
            onChange={handleChange}
            maxLength="64"
            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,64}"
            title="Must contain at least one number and one uppercase and lowercase letter and at least 6 or more characters"
            placeholder="Confirm Password"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="btn btn-outline-primary"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </fieldset>
      <br />
      <small>
        <Link to="/login">Already had account?</Link>
      </small>
    </form>
  );
};

export default Register;
