import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    token: String
  }
  type Query {
    getUsers: [User!]
    login(email: String!, password: String!): User!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
  }
`;
export default typeDefs;
