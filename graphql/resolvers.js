import { getUsers, register, login } from "../controllers/auth";

const resolvers = {
  Query: {
    getUsers,
    login,
  },
  Mutation: {
    register,
  },
};

export default resolvers;
