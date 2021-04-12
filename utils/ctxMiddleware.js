import jwt from "jsonwebtoken";
import { PubSub } from "apollo-server";

const pubsub = new PubSub();
export default (ctx) => {
  let token;

  if (ctx.req && ctx.req.headers.authorization) {
    token = ctx.req.headers.authorization.split("Bearer ")[1];
  } else if (ctx.connection && ctx.connection.context.Authorization) {
    // in case of subscription
    token = ctx.connection.context.Authorization.split("Bearer ")[1];
  }
  let user = null;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    //if (err) throw new AuthenticationError("Unauthorized");
    if (decoded) {
      user = decoded;
    }
    ctx.user = user;
  });
  ctx.pubsub = pubsub;
  return ctx;
};
