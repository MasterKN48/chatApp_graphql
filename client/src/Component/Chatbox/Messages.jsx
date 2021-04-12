import React from "react";
import { useAuthState } from "../../context/auth";
import { useMessageDispatch, useMessageState } from "../../context/messages";

import { gql, useQuery, useSubscription } from "@apollo/client";

import "./styles.scss";

const GET_MESSAGES = gql`
  query fetchMessages($to: String!) {
    getMessages(to: $to) {
      from
      to
      content
      createdAt
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      _id
      content
      from
      to
      createdAt
    }
  }
`;

const Messages = ({ to }) => {
  const { user } = useAuthState();

  const { messages } = useMessageState();
  const disptach = useMessageDispatch();

  const { loading } = useQuery(GET_MESSAGES, {
    variables: { to: to },
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      console.log(data.getMessages);
      disptach({ type: "GET_MESSAGES", payload: data.getMessages });
    },
  });

  const { error: messageError } = useSubscription(NEW_MESSAGE, {
    onError: (err) => console.log(err),
    onSubscriptionData: (data) => {
      disptach({
        type: "NEW_MESSAGE",
        payload: data.subscriptionData.data.newMessage,
      });
    },
  });

  if (messageError) {
    console.log(messageError);
  }

  if (loading) {
    return (
      <div className="spinner-border text-info" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (messages) {
    return (
      <div>
        {messages.length > 0 &&
          messages.map((message, i) => (
            <Message key={i} user={user} message={message} />
          ))}
      </div>
    );
  }
};

const Message = ({ user, message }) => {
  const myRef = React.useRef();
  React.useEffect(() => {
    (async () => {
      myRef.current &&
        myRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          // inline: "end",
        });
    })();
  }, []);
  return (
    <div
      ref={myRef}
      className={
        user._id === message.from ? "message text-right" : "message text-left"
      }
    >
      <div
        className={
          user._id === message.from
            ? "p-2 my-2 messageLeft"
            : "p-2 my-2 messageRight"
        }
      >
        <div
          className={user._id === message.from ? "text-dark " : "text-primary"}
        >
          {message.content}
        </div>
        <small className="text-muted">
          {new Date(message.createdAt).toLocaleDateString() +
            " : " +
            new Date(message.createdAt).toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
};

export default Messages;
