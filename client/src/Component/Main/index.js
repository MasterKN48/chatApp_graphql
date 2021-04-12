import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuthState } from "../../context/auth";
import Chatbox from "../Chatbox";

import "./styles.scss";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      name
      email
      _id
      createdAt
    }
  }
`;

const Main = () => {
  const { loading, data, error } = useQuery(GET_USERS, {
    fetchPolicy: "no-cache",
  });
  const [selected, setSelected] = React.useState({
    _id: null,
    name: "",
  });
  if (error) {
    console.log(error);
  }

  return (
    <section>
      {loading && (
        <div className="spinner-border text-info text-center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      <section className="container-md shadow-sm my-4 py-4 bg-white rounded">
        <h4 className="text-center text-primary">Chat Box</h4>
        <hr />
        {data && data.getUsers.length === 0 ? (
          <div className="py-4 text-center">No users</div>
        ) : (
          data &&
          data.getUsers && (
            <div className="form-row py-2">
              <div className="col-md-3 mb-2 ">
                <Users
                  data={data.getUsers}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
              <div
                className="col-md-9"
                style={{
                  borderLeft: "1px solid #e5e6ea",
                  borderRight: "1px solid #e5e6ea",
                }}
              >
                <Chats otherUser={selected} />
              </div>
            </div>
          )
        )}
      </section>
    </section>
  );
};

const Users = ({ data, selected, setSelected }) => {
  return (
    <div>
      {data.map((user) => {
        return (
          <div
            key={user._id}
            className={
              selected && selected._id === user._id
                ? "userCard py-3 active px-1"
                : "userCard py-3 px-1"
            }
            onClick={() => setSelected({ _id: user._id, name: user.name })}
          >
            <div className="lead">
              <span
                style={{
                  background: "#e6e6ea",
                  borderRadius: "50px",
                  padding: "0.5rem",
                  marginRight: "0.75rem",
                }}
              >
                {user.name.substr(0, 2).toUpperCase()}
              </span>
              {user.name.substr(0, 20)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Chats = ({ otherUser }) => {
  const { user } = useAuthState();
  if (otherUser && !otherUser._id) {
    return <div className="py-2 px-1">Select a user.</div>;
  }
  return (
    user && (
      <div className="py-2 px-1">
        <h6 className="lead text-primary text-center">Messages</h6>
        <Chatbox currentUser={user} otherUser={otherUser} />
      </div>
    )
  );
};

export default Main;
