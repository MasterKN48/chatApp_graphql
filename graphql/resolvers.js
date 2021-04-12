import { getUsers, register, login } from "../controllers/auth";
import { sendMessage, getMessages, newMessage } from "../controllers/message";

const resolvers = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    getUsers,
    login,
    getMessages,
  },
  Mutation: {
    register,
    sendMessage,
  },
  Subscription: {
    newMessage: newMessage,
  },
};

export default resolvers;
