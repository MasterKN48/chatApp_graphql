import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import "./styles.scss";
import Messages from "./Messages";

const SEND_MESSAGE = gql`
  mutation postMessage($content: String!, $to: String!) {
    sendMessage(content: $content, to: $to) {
      createdAt
      _id
    }
  }
`;

const Chatbox = ({ currentUser, otherUser }) => {
  const [content, setContent] = useState("");

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
    onError: (err) => {
      console.log(err);
    },
  });

  const submit = (e) => {
    e.preventDefault();
    if (content.trim() === "") {
      return;
    }
    sendMessage({ variables: { to: otherUser._id, content: content } });
    setContent("");
  };

  return (
    <div className="chatbox">
      <header className="row">
        <div className="col-6">
          <div className="lead">
            <span
              style={{
                background: "#e6e6ea",
                borderRadius: "50px",
                padding: "0.5rem",
                marginRight: "0.75rem",
              }}
            >
              {otherUser.name.substr(0, 2).toUpperCase()}
            </span>
            {otherUser.name.substr(0, 20)}
          </div>
        </div>
        <div className="col-6 text-right">
          <div className="lead">
            <span
              style={{
                background: "#e6e6ea",
                borderRadius: "50px",
                padding: "0.5rem",
                marginRight: "0.75rem",
              }}
            >
              {currentUser.name.substr(0, 2).toUpperCase()}
            </span>
            {currentUser.name.substr(0, 20)}
          </div>
        </div>
      </header>
      <hr />
      <div className="messages">
        <Messages to={otherUser._id} />
      </div>
      <section>
        <form onSubmit={submit} className="form-row my-2 my-lg-0">
          <div className="col-md-11 col-sm-10 col-xs-10">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              type="text"
              id="content"
              minLength="1"
              maxLength="256"
              required
              placeholder="Type your message"
            />
          </div>
          <div className="col-md-1 col-sm-2 col-xs-2">
            <button
              disabled={loading}
              className="btn btn-block btn-outline-primary btn-md my-2 my-sm-0"
              type="submit"
            >
              {loading ? "Wait" : "Send"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Chatbox;
