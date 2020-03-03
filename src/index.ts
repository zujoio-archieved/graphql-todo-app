import { GraphQLServer } from "graphql-yoga";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { schema } from "./graphql/schema";
import { ContextRepository } from "./serverConfig/context";

mongoose.connect(
  "mongodb://192.168.0.15:40017/todo-app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    console.log("Server is connected to mongodb", err);
  }
);

const context = async ({
  request,
  response
}: {
  request: Request;
  response: Response;
}) => new ContextRepository({ request, response });

const server = new GraphQLServer({
  schema,
  context
});

const options = {
  port: 8080,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log("Module disposed. "));
}
