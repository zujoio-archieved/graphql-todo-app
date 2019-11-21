import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} from "graphql";
import { toGlobalId, connectionDefinitions } from "graphql-relay";
import { GLOBAL_ID_TYPES } from "../globalIdTypes";

export const GraphqlTodo = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: ({ _id }) => {
        return toGlobalId(GLOBAL_ID_TYPES.Todo, _id);
      }
    },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean }
  })
});

const {
  connectionType: GraphqlTodoConnection,
  edgeType: TodoEdgeType
} = connectionDefinitions({ nodeType: GraphqlTodo });

export { GraphqlTodoConnection, TodoEdgeType };
