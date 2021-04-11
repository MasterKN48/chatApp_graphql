import { config } from "dotenv";
import { connect } from "mongoose";
import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

config();
//! DB Connection
connect(process.env.DB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  poolSize: 5,
  useCreateIndex: true,
})
  .then(() => {
    console.log("💻 MongoDB Connected");
  })
  .catch((err) => console.error(err));

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx) => ctx,
  cors: corsOptions,
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

//server.applyMiddleware({ app })
