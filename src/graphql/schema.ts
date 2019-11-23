import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GraphQLUserQueries } from "./user/user.queries";
import { GraphQLUserMutations } from "./user/user.mutations";
import { GraphQLTodoMutations } from "./todo/todo.mutations";
import { GraphQLTodoSubscription } from "./todo/todo.subscriptions";
import { GraphqlUserSubscription } from "./user/user.subscriptions";

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

const RootSubscription = new GraphQLObjectType({
  name: "RootSubscription",
  fields: {
    ...GraphQLTodoSubscription,
    ...GraphqlUserSubscription
  }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  subscription: RootSubscription
});

export { schema };
