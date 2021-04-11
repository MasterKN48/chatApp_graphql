import { getUsers, register } from "../controllers/auth";

const resolvers = {
  Query: {
    getUsers,
  },
  Mutation: {
    register,
  },
};

export default resolvers;
