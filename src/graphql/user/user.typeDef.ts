import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";
import { toGlobalId } from "graphql-relay";
import { GLOBAL_ID_TYPES } from "../globalIdTypes";
import { GraphQLTodoQueries } from "../todo/todo.queries";

const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: ({ _id }) => {
        return toGlobalId(GLOBAL_ID_TYPES.User, _id);
      }
    },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    todos: GraphQLTodoQueries.todos
  })
});

export default GraphQLUser;
