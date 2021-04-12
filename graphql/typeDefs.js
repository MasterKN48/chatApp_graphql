import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    token: String
  }
  type Message {
    _id: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }
  type Query {
    getUsers: [User!]
    login(email: String!, password: String!): User!
    getMessages(to: String!): [Message!]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    sendMessage(to: String!, content: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;
export default typeDefs;
