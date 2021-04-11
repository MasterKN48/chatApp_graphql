import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container-md my-5 py-5 text-center">
      <h2 className="text-danger">404</h2>
      <Link className="text-decoration-none p-0 m-0" to="/">
        <div style={{ fontSize: "45px", marginTop: "-30px" }}>&larr;</div>
      </Link>
    </div>
  );
};

export default NotFound;
