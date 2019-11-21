import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GraphQLUserQueries } from "./user/user.queries";
import { GraphQLUserMutations } from "./user/user.mutations";
import { GraphQLTodoMutations } from "./todo/todo.mutations";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...GraphQLUserQueries
  }
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...GraphQLUserMutations,
    ...GraphQLTodoMutations
  }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
  // subscription: RootSubscription
});

export { schema };
