import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    name: String!
    email: String!
  }
  type Query {
    "this is comment"
    getUsers: [User!]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
  }
`;
export default typeDefs;
