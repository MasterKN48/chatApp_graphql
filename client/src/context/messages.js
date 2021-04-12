import React, { createContext, useReducer, useContext } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

let initialState = {
  messages: [],
};

const messageReducer = (state, { type, payload }) => {
  switch (type) {
    case "GET_MESSAGES":
      return {
        ...state,
        messages: [...payload],
      };
    case "NEW_MESSAGE":
      //? tmp patch as two to pubsub fired
      if (payload._id === state.messages[state.messages.length - 1]._id) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          messages: [...state.messages, payload],
        };
      }

    default:
      return state;
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
